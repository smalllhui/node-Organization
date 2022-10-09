/**
 * 组织机构控制器
 */

const BaseDButil = require("../db/BaseDButil")
const ResultUtil = require("../util/ResultUtil")
const TreeDataUtil = require("../util/TreeDataUtil")



/**
 * 查询组织机构树列表
 */
const queryList = async (req, res) => {
  const sql = `SELECT * from tb_organization`
  try {
    const result = await BaseDButil.CRUDMethod(sql)
    const organizationList = TreeDataUtil.generateTreeDataList(result)
    ResultUtil.ok(res, organizationList)
  } catch (error) {
    ResultUtil.error(res, "查询组织机构树列表失败")
  }
}

/**
 * 添加一个组织机构
 */
const add = async (req, res) => {
  const { parentId, name } = req.body
  BaseDButil.insert(res, "tb_organization", { parentId, name })
}

/**
 * 根据id修改组织机构
 */
const updateById = async (req, res) => {
  const { id, name } = req.body
  BaseDButil.update(res, "tb_organization", { name }, { id })
}

/**
 * 根据id删除组织机构
 */
const deleteById = async (req, res) => {
  const { id } = req.query
  BaseDButil.removeByIds(res, "tb_organization", "id", [id])
}

module.exports = {
  queryList,
  add,
  updateById,
  deleteById
}
