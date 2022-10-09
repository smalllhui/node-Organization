//1、导入express
const express = require('express')
// 文件路径
const path = require('path')
// 文件上传
const multer = require("multer")
// 跨域
const cors = require("cors")
// 表单解析
const bodyParser = require('body-parser')
// 全局配置文件
const { serverPort } = require("./src/config")
// 引入路由配置文件
const RouteSetting = require("./src/routes/index")
// jwt认证
const { jwtAuth } = require("./src/util/TokenUtil")
//2、创建express实例
const app = express()

// 解决跨域
app.use(cors())

// 设置静态目录
app.use(express.static("./src/public"));

// 配置表单解析
// 1、解析 post 表单数据的中间件
app.use(bodyParser.urlencoded({ extended: false }))
// 2、解析 application/json
app.use(bodyParser.json())

// 配置文件上传目录
//实例化multer，传递的参数对象，dest表示上传文件的存储路径，any表示任意类型的文件
app.use(multer({ dest: path.join(__dirname, './src/public/upload') }).any());

// token验证
// app.use(jwtAuth)

// 3、挂载路由到app上
RouteSetting.registerRoute(app)

// token校验异常处理
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.json({ code: 403, message: "未验证身份" })
  } else {
    next()
  }
})


// 4、启动 Web 服务
app.listen(serverPort, () => {
  console.log(`server runing:    http://localhost:${serverPort}`)
})
