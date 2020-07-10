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
  // 省市区的获取
  storeProvince: {
    url: '/pc/store/queryProvince',
    method: 'post'
  },
  // 门店新增之市/区列表查询
  storeCity: {
    url: '/pc/store/queryCityOrDistrict',
    method: 'post'
  },
  // 司机信息列表查询
  getDriverTable: {
    url: '/pc/driver/queryDriversList',
    method: 'post'
  },
  // 司机信息删除
  delDriver: {
    url: '/pc/driver/deleteDriver',
    method: 'post'
  },
  // 司机信息详情查询
  getDriver: {
    url: '/pc/driver/queryDriverDetail',
    method: 'post'
  },
  // 司机信息新增
  addDriver: {
    url: '/pc/driver/addDriver',
    method: 'post'
  },
  // 司机信息修改
  updateDriver: {
    url: '/pc/driver/updateDriver',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
