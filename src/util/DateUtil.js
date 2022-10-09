
/**
 * @description: 获取当前日期
 * @return {string} 当前日期
 */
function getCurrentDate() {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  return [year, '-', month, '-', day].join('');
}

/**
 * @description: 获取当前时间
 * @return {string} 当前时间
 */
function getCurrentDateTime() {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  return [year, '-', month, '-', day, ' ', hour, ':', minute, ':', second].join('');
}

/**
 * @description: 将日期转换为 年-月-日
 * @return {string} 转换后的日期
 */
function getFormatDate(date) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  return [year, '-', month, '-', day].join('');
}

/**
 * @description: 将日期转换为 年-月-日 时:分：秒
 * @return {string} 转换后的日期
 */
function getFormatDateTime(date) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  return [year, '-', month, '-', day, ' ', hour, ':', minute, ':', second].join('');
}

module.exports = {
  getCurrentDate,
  getCurrentDateTime,
  getFormatDate,
  getFormatDateTime
}