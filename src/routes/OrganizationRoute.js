/**
 * 组织机构路由
 */

//导入express
const express = require('express');
//创建路由对象
const router = express.Router();
// 引入组织机构Controller
const OrganizationController = require("../controller/OrganizationController")

// 1、查询组织机构树列表
router.get('/queryList', OrganizationController.queryList);
// 2、添加一个组织机构
router.post('/add', OrganizationController.add);
// 3、修改一个组织机构
router.put('/updateById', OrganizationController.updateById);
// 4、根据id删除组织机构
router.delete('/deleteById', OrganizationController.deleteById);



// 向外导出路由对象
module.exports = router;