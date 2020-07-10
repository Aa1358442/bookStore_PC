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
  // 商品分类列表查询
  getClassTable: {
    url: '/pc/goodTypeManger/queryGoodClassList',
    method: 'post'
  },
  // 商品分类详情查询
  checkClass: {
    url: '/pc/goodTypeManger/queryGoodClass',
    method: 'post'
  },
  // 商品分类删除
  deleteClass: {
    url: '/pc/goodTypeManger/deleteGoodClass',
    method: 'post'
  },
  // 新增商品一级分类
  addFirstClass: {
    url: '/pc/goodTypeManger/addFirstClass',
    method: 'post'
  },
  // 新增商品二级分类
  addSecondClass: {
    url: '/pc/goodTypeManger/addSecondClass',
    method: 'post'
  },
  // 商品分类详情查询
  getClass: {
    url: '/pc/goodTypeManger/queryGoodClass',
    method: 'post'
  },
  // 更新商品分类状况
  updateClass: {
    url: '/pc/goodTypeManger/updateGoodClass',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
