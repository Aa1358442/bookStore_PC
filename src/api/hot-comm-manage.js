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
  // 热门商品位列表查询
  hotGoodsList: {
    url: '/pc/hotGoodManage/queryHotGoodsList',
    method: 'post'
  },
  // 热门商品位删除
  delHotGoods: {
    url: '/pc/hotGoodManage/deleteHotGood',
    method: 'post'
  },
  // 热门商品位新增之商品列表查询
  queryGoodsList: {
    url: '/pc/hotGoodManage/queryGoodsList',
    method: 'post'
  },
  // 热门商品位新增
  addHotGoods: {
    url: '/pc/hotGoodManage/addHotGood',
    method: 'post'
  },
  // 热门商品位详情
  roughHotGoods: {
    url: '/pc/hotGoodManage/queryHotGoodDetail',
    method: 'post'
  },
  // 热门商品位修改
  updateHotGoods: {
    url: '/pc/hotGoodManage/updateHotGood',
    method: 'post'
  },
  // 查询热门商品展示数量
  HotGoodNum: {
    url: '/pc/hotGoodManage/queryHotGoodNum',
    method: 'post'
  },
  // 热门商品位展示数量修改
  showHotGoodsNum: {
    url: '/pc/hotGoodManage/showHotGoodsNum',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
