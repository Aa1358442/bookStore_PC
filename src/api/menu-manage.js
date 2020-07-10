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
  // 新增菜单
  addMenu: {
    url: '/pc/menu/insertMenu',
    method: 'post'
  },
  // 修改菜单
  updateMenu: {
    url: '/pc/menu/updateMenu',
    method: 'post'
  },
  // 删除菜单
  deleteMenu: {
    url: '/pc/menu/deleteMenu',
    method: 'post'
  },
  // 菜单详情查询
  getMenu: {
    url: '/pc/menu/queryMenuDetail',
    method: 'post'
  },
  // 菜单列表查询
  getTableMenu: {
    url: '/pc/menu/listUserMenus',
    method: 'post'
  },
  // 根据角色查询首页菜单列表
  RoleMenu: {
    url: '/pc/menu/listMenus',
    method: 'post'
  },
  // 顶部信息获取
  getuserdata: {
    url: '/pc/user/getuserdata',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
