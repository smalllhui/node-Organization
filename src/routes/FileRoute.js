// 文件路由
//导入express
const express = require('express');
//创建路由对象
const router = express.Router();

// 引入文件Controller
const FileController = require("../controller/FileController")

// 上传文件
router.post('/upload', FileController.uploadFile);

// 向外导出路由对象
module.exports = router;