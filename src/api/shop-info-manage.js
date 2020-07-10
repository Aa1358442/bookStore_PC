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
  // 门店信息列表查询
  getStore: {
    url: '/pc/store/queryStoreList',
    method: 'post'
  },
  // 门店新增之省列表查询
  storeProvince: {
    url: '/pc/store/queryProvince',
    method: 'post'
  },
  // 门店新增之市/区列表查询
  storeCity: {
    url: '/pc/store/queryCityOrDistrict',
    method: 'post'
  },
  // 门店信息列表查询
  getStoreTable: {
    url: '/pc/store/queryStoreList',
    method: 'post'
  },
  // 门店删除
  delStore: {
    url: '/pc/store/deleteStore',
    method: 'post'
  },
  // 门店信息详情
  roughStore: {
    url: '/pc/store/queryStoreDetail',
    method: 'post'
  },
  // 门店新增
  addStore: {
    url: '/pc/store/addStore',
    method: 'post'
  },
  // 新增门店之 商家列表查询
  searchUserCode: {
    url: '/pc/store/queryUserStore',
    method: 'post'
  },
  // 门店信息修改
  updateStore: {
    url: '/pc/store/updateStore',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
