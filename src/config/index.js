const serverPort = 8080 //服务器端口号
const contentPath = '/api' // 服务器访问路径
const tokenSecret = 'abcdefg';  //token自定义秘钥
const tokenExpiresIn = (60 * 60 * 24) * 7 //token有效期:7天
const tokenAuthWhiteList = ['/api/file/upload', '/api/teacher/login', '/api/student/login'] //token认证白名单列表

module.exports = { tokenSecret, tokenExpiresIn, serverPort, contentPath, tokenAuthWhiteList }
