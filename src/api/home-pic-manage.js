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
  // 轮播图列表查询
  rotaChartList: {
    url: '/pc/rotaChart/queryRotaChartList',
    method: 'post'
  },
  // 轮播图删除
  deleteRotaChart: {
    url: '/pc/rotaChart/deleteRotaChart',
    method: 'post'
  },
  // 轮播图启用禁用修改
  updateRotaChartState: {
    url: '/pc/rotaChart/updateRotaChartState',
    method: 'post'
  },
  // 轮播图新增
  addRotaChart: {
    url: '/pc/rotaChart/addRotaChart',
    method: 'post'
  },
  // 轮播图新增之 商品编号列表查询
  listGoodsSecond: {
    url: '/pc/rotaChart/listGoodsSecond',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
