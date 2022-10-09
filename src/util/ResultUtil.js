// 返回结果成功
const ok = (res, data) => {
  res.json({ code: 200, message: 'success', data })
}
// 返回结果失败
const error = (res, message) => {
  res.json({ code: -1, message })
}

module.exports = {
  ok,
  error
}