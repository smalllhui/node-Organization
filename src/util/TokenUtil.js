const jwt = require('jsonwebtoken')
const {expressjwt} = require('express-jwt')
const { tokenSecret, tokenExpiresIn, tokenAuthWhiteList } = require("../config")

//生成token
const generateToken = function (data) {
  const token =jwt.sign(data, tokenSecret, { expiresIn: tokenExpiresIn })
  return `Bearer ${token}`
  
}
// 验证 token
// express-jwt 这个中间件，就可以把解析出来的用户信息，挂载到 `req.user` 属性上
const jwtAuth = expressjwt({
  secret: tokenSecret,
  algorithms: ["HS256"],
  credentialsRequired: true//  false：不校验
}).unless({
  path: tokenAuthWhiteList //不需要校验的路径
});

//解密token
const getDecryptToken = function (token) {
  let data = jwt.verify(token, secret);
  return data;
}

module.exports = { generateToken, getDecryptToken ,jwtAuth}

