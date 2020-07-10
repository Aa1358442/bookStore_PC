import req from '../fetch/index.js'

const config = {
  // portExport: {
  //   url: '/api/media/stimulate/exportExcel',
  //   method: 'post',
  //   fileConfig: {
  //     type: 'file',
  //     fileName: '销售激励报表'
  //   }
  // },
  // 得到列表中用户的全部信息
  getTableData: {
    url: '/pc/user/queryUserList',
    method: 'post'
  },
  // 添加用户dialog
  addUser: {
    url: '/pc/user/addUser',
    method: 'post'
  },
  // 判断是否有账号和模糊查询信息
  getUser: {
    url: '/pc/user/queryUser',
    method: 'post'
  },
  // 图片上传
  addPhoto: {
    url: '/pc/imageUpLoad/upLoadImage',
    method: 'post'
  },
  // 删除用户
  delUser: {
    url: '/pc/user/deleteUser',
    method: 'post'
  },
  // 更新用户
  updateUser: {
    url: '/pc/user/updateUser',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
