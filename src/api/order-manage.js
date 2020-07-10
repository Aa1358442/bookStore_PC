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
  // 订单列表查询
  getOrderTable: {
    url: '/pc/order/queryOrderList',
    method: 'post'
  },
  // 订单状态修改
  updateOrderState: {
    url: '/pc/order/updateOrderState',
    method: 'post'
  },
  // 订单详情查询
  getOrder: {
    url: '/pc/order/queryOrderDetail',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
