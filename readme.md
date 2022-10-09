# 组织动态树后端接口
## 项目运行

### 导入数据库sql文件到mysql数据库中

```sql
/*
 Navicat Premium Data Transfer

 Source Server         : 127.0.0.1
 Source Server Type    : MySQL
 Source Server Version : 80011
 Source Host           : localhost:3306
 Source Schema         : react_demo

 Target Server Type    : MySQL
 Target Server Version : 80011
 File Encoding         : 65001

 Date: 09/10/2022 20:14:15
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for tb_organization
-- ----------------------------
DROP TABLE IF EXISTS `tb_organization`;
CREATE TABLE `tb_organization`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '组织机构id',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '组织机构名称',
  `parentId` bigint(20) NOT NULL COMMENT '组织机构上级 id',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 26 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '组织机构表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of tb_organization
-- ----------------------------
INSERT INTO `tb_organization` VALUES (1, '中国移动', 0);
INSERT INTO `tb_organization` VALUES (2, '贵州分公司', 1);
INSERT INTO `tb_organization` VALUES (3, '广东分公司', 1);
INSERT INTO `tb_organization` VALUES (4, '四川分公司', 1);
INSERT INTO `tb_organization` VALUES (5, '湖南分公司1', 1);
INSERT INTO `tb_organization` VALUES (6, '广州分公司', 3);
INSERT INTO `tb_organization` VALUES (7, '深圳分公司', 3);
INSERT INTO `tb_organization` VALUES (14, '南山营业厅', 7);
INSERT INTO `tb_organization` VALUES (15, '福田营业厅', 7);
INSERT INTO `tb_organization` VALUES (16, '长沙分公司', 5);
INSERT INTO `tb_organization` VALUES (17, '怀化分公司', 5);
INSERT INTO `tb_organization` VALUES (18, '安顺分公司', 2);
INSERT INTO `tb_organization` VALUES (19, '白云分公司', 6);
INSERT INTO `tb_organization` VALUES (20, '贵阳分公司', 2);
INSERT INTO `tb_organization` VALUES (21, '成都分公司', 4);
INSERT INTO `tb_organization` VALUES (22, '泸州分公司', 4);
INSERT INTO `tb_organization` VALUES (25, '海南分公司修改', 1);

SET FOREIGN_KEY_CHECKS = 1;
```

### 修改项目数据库连接配置

`src\db\DBConnect.js`

```js
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
```

### 安装依赖

```
npm install
```

### 运行项目

```
npm start
```

## api接口文档

### 查询组织机构树列表
```text
暂无描述
```
#### 接口状态
> 已完成

#### 接口URL
> http://localhost:8080/api/organization/queryList

#### 请求方式
> GET

#### Content-Type
> none

#### 预执行脚本
```javascript
暂无预执行脚本
```
#### 后执行脚本
```javascript
暂无后执行脚本
```
#### 成功响应示例
```javascript
{
	"code": 200,
	"message": "success",
	"data": [
		{
			"id": 1,
			"name": "中国移动",
			"children": [
				{
					"id": 2,
					"name": "贵州分公司",
					"children": [
						{
							"id": 18,
							"name": "安顺分公司"
						},
						{
							"id": 20,
							"name": "贵阳分公司"
						}
					]
				},
				{
					"id": 3,
					"name": "广东分公司",
					"children": [
						{
							"id": 6,
							"name": "广州分公司",
							"children": [
								{
									"id": 19,
									"name": "白云分公司"
								}
							]
						},
						{
							"id": 7,
							"name": "深圳分公司",
							"children": [
								{
									"id": 14,
									"name": "南山营业厅"
								},
								{
									"id": 15,
									"name": "福田营业厅"
								}
							]
						}
					]
				},
				{
					"id": 4,
					"name": "四川分公司",
					"children": [
						{
							"id": 21,
							"name": "成都分公司"
						},
						{
							"id": 22,
							"name": "泸州分公司"
						}
					]
				},
				{
					"id": 5,
					"name": "湖南分公司1",
					"children": [
						{
							"id": 16,
							"name": "长沙分公司"
						},
						{
							"id": 17,
							"name": "怀化分公司"
						}
					]
				}
			]
		}
	]
}
```
参数名 | 示例值 | 参数类型 | 参数描述
--- | --- | --- | ---
code | 200 | Number | 状态码
message | success | String | 消息
data | - | Object | 返回数据
data.id | - | Number | 节点id
data.name | - | String | 节点名称
data.children | - | Object | 子节点信息
### 添加一个组织机构节点
```text
暂无描述
```
#### 接口状态
> 已完成

#### 接口URL
> http://localhost:8080/api/organization/add

#### 请求方式
> POST

#### Content-Type
> json

#### 请求Body参数
```javascript
{ parentId:"1", name:"海南分公司" }
```
参数名 | 示例值 | 参数类型 | 是否必填 | 参数描述
--- | --- | --- | --- | ---
parentId | 1 | String | 是 | 父节点id
name | 海南分公司 | String | 是 | 新增节点名称
#### 预执行脚本
```javascript
暂无预执行脚本
```
#### 后执行脚本
```javascript
暂无后执行脚本
```
#### 成功响应示例
```javascript
{
	"code": 200,
	"message": "success",
	"data": 25
}
```
参数名 | 示例值 | 参数类型 | 参数描述
--- | --- | --- | ---
code | 200 | Number | 状态码
message | success | String | 消息
data | 25 | Number | 新增节点id
### 根据节点id修改一个组织机构节点名称
```text
暂无描述
```
#### 接口状态
> 已完成

#### 接口URL
> http://localhost:8080/api/organization/updateById

#### 请求方式
> PUT

#### Content-Type
> json

#### 请求Body参数
```javascript
{ id:"25", name:"海南分公司修改" }
```
#### 预执行脚本
```javascript
暂无预执行脚本
```
#### 后执行脚本
```javascript
暂无后执行脚本
```
#### 成功响应示例
```javascript
{
	"code": 200,
	"message": "success",
	"data": null
}
```
参数名 | 示例值 | 参数类型 | 参数描述
--- | --- | --- | ---
code | 200 | Number | 状态码
message | success | String | 消息
data | - | Object | 返回数据
### 根据id删除组织机构节点
```text
暂无描述
```
#### 接口状态
> 已完成

#### 接口URL
> http://localhost:8080/api/organization/deleteById?id=24

#### 请求方式
> DELETE

#### Content-Type
> none

#### 请求Query参数
参数名 | 示例值 | 参数类型 | 是否必填 | 参数描述
--- | --- | --- | --- | ---
id | 24 | String | 是 | 删除节点id
#### 预执行脚本
```javascript
暂无预执行脚本
```
#### 后执行脚本
```javascript
暂无后执行脚本
```
#### 成功响应示例
```javascript
{
	"code": 200,
	"message": "success"
}
```
参数名 | 示例值 | 参数类型 | 参数描述
--- | --- | --- | ---
code | 200 | Number | 状态码
message | success | String | 消息
