const fs = require('fs');
const path = require('path')
// 全局配置文件端口号
const { serverPort } = require("../config")
// 结果工具类
const ResultUtil = require("../util/ResultUtil")

// 单文件上传
const uploadFile = function (req, res) {
  const file = req.files[0]
  let oldName = file.path;
  let newName = file.path + path.parse(file.originalname).ext;
  fs.renameSync(oldName, newName);
  ResultUtil.ok(res, {
    url:
      `http://localhost:${serverPort}/upload/${file.filename}${path.parse(file.originalname).ext}`
  })
}

module.exports = {
  uploadFile
}