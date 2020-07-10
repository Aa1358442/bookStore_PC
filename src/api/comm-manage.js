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
  // 商品列表查询
  getTableComm: {
    url: '/pc/goods/listGoods',
    method: 'post'
  },
  // 更新上下架的状态
  updateShelf: {
    url: '/pc/goods/upperOrLowerShelf',
    method: 'post'
  },
  // 删除商品
  delComm: {
    url: '/pc/goods/deleteGood',
    method: 'post'
  },
  // 商品一级分类查询
  firstClass: {
    url: '/pc/goods/queryFirstClass',
    method: 'post'
  },
  // 商品二级分类查询
  secondClass: {
    url: '/pc/goods/querySecondClass',
    method: 'post'
  },
  // 新增商品
  addComm: {
    url: '/pc/goods/addGood',
    method: 'post'
  },
  // 修改商品
  updateComm: {
    url: '/pc/goods/updateGood',
    method: 'post'
  },
  // 商品详情查询
  getComm: {
    url: '/pc/goods/queryDetail',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
