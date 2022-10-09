const pool = require("./DBConnect");
const ResultUtil = require("../util/ResultUtil");

// 增删改查方法
const CRUDMethod = function (sql, params) {
  return new Promise(function (resolve, reject) {
    pool.getConnection((err, connection) => {
      if (err) {
        reject({ code: -1, msg: "Database connection fail!" });
      } else {
        console.log("sql:", sql, "params:", params);
        connection.query(sql, params, function (err, rows) {
          connection.release(); //释放链接
          if (err) {
            reject({ code: 500, msg: "sql exception!" });
          } else {
            resolve(rows);
          }
        });
      }
    });
  });
};

// 成功处理的回调
const successHandle = function (res, data) {
  ResultUtil.ok(res, data);
};


// 新增一条数据
const insert = async function (res, tabName, data = {}, callBack) {
  const params = Object.values(data);
  const cloumSql = Object.keys(data).join();
  const insertSql = new Array(params.length).fill("?").join();
  const sql = `INSERT INTO ${tabName} (${cloumSql}) VALUES (${insertSql})`;
  try {
    const result = await CRUDMethod(sql, params);
    const resultData = result.insertId;
    callBack ? callBack(resultData) : successHandle(res, resultData);
  } catch (error) {
    ResultUtil.error(res, error.msg);
  }
};

// 更新一条数据
const update = async function (
  res,
  tabName,
  setObj = {},
  whereObj = {},
  callBack
) {
  const params = [...Object.values(setObj), ...Object.values(whereObj)];
  const setSql = Object.keys(setObj)
    .map((key) => `${key}=?`)
    .join();
  const whereSql = Object.keys(whereObj)
    .map((key) => `${key}=?`)
    .join(" AND ");
  const sql = `UPDATE ${tabName} SET ${setSql} WHERE ${whereSql}`;
  try {
    await CRUDMethod(sql, params);
    callBack ? callBack(null) : successHandle(res, null);
  } catch (error) {
    ResultUtil.error(res, error.msg);
  }
};

// 删除一条数据
const removeByIds = async function (res, tabName, idKeyName, deleteIds, callBack) {
  const params = [...deleteIds];
  const sql = `DELETE FROM ${tabName} WHERE ${idKeyName} IN (${new Array(deleteIds.length).fill('?').join()})`;
  try {
    await CRUDMethod(sql, params);
    callBack ? callBack() : successHandle(res);
  } catch (error) {
    ResultUtil.error(res, error.msg);
  }
};

// 查询所有数据
const queryAll = async function (res, tabName, whereObj = {}, callBack) {
  let sql = `SELECT * FROM ${tabName}`;
  let params = null;
  if (Object.keys(whereObj).length) {
    const whereSql = Object.keys(whereObj)
      .map((key) => `${key}=?`)
      .join(" AND ");

    params = [...Object.values(whereObj)];
    sql += ` WHERE ${whereSql}`
  }

  try {
    const result = await CRUDMethod(sql, params);
    console.log("result", result);
    callBack ? callBack(result) : successHandle(res, result);
  } catch (error) {
    ResultUtil.error(res, error.msg);
  }
};

// 查一条数据
const queryOne = async function (res, tabName, whereObj = {}, callBack) {
  const whereSql = Object.keys(whereObj)
    .map((key) => `${key}=?`)
    .join(" AND ");
  const sql = `SELECT * FROM ${tabName} WHERE ${whereSql}`;
  const params = [...Object.values(whereObj)];
  try {
    const result = await CRUDMethod(sql, params);
    console.log("result", result);
    if (result.length > 1) {
      ResultUtil.error(res, '期待结果为一条数据,查询结果为多条数据');
    } else {
      callBack ? callBack(result[0]) : successHandle(res, result[0]);
    }
  } catch (error) {
    ResultUtil.error(res, error.msg);
  }
};

module.exports = {
  insert,
  update,
  removeByIds,
  queryOne,
  queryAll,
  CRUDMethod
};
