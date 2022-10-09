const { contentPath } = require("../config")
// 引入文件路由
const FileRoute = require("./FileRoute")
// 组织机构路由
const OrganizationRoute = require("./OrganizationRoute")

// 注册路由
const registerRoute = function (app) {
  // 注册文件路由
  app.use(`${contentPath}/file`, FileRoute)
  // 注册组织机构路由
  app.use(`${contentPath}/organization`, OrganizationRoute)
}

// 暴露注册路由方法
module.exports = {
  registerRoute
}