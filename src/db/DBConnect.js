//mysql连接池配置文件
const mysql = require('mysql');
const pool = mysql.createPool({
  // connectionLimit : 10, // 线程池大小 默认10
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'react_demo'
});

module.exports = pool;

