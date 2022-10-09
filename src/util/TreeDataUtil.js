/**
 * 树节点生成工具类
 */

// 数据格式
const temp = [
  {
    'id': 1,
    'name': '1级1',
    'parentId': 0
  },
  {
    'id': 2,
    'name': '2级1',
    'parentId': 0
  },
  {
    'id': 4,
    'name': '1级1-1',
    'parentId': 1
  }
]


const getChilds = (parentId, array) => {
  const childs = []
  for (const param of array) {  // 循环获取子节点
    if (param.parentId === parentId) {
      childs.push({
        'id': param.id,
        'name': param.name
      })
    }
  }
  for (const child of childs) { // 获取子节点的子节点
    const childscopy = getChilds(child.id, array)// 递归获取子节点
    if (childscopy.length > 0) {
      child.children = childscopy
    }
  }
  return childs
}

// 开始递归方法
const generateTreeDataList = (params) => {
  const result = []
  for (const param of params) {
    if (param.parentId === 0) {  // 判断是否为顶层节点
      const parent = {
        'id': param.id,
        'name': param.name
      }
      parent.children = getChilds(param.id, params)  // 获取子节点
      result.push(parent)
    }
  }
  return result
}

module.exports = {
  generateTreeDataList
}