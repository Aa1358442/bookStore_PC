<template>
    <div>
      <i-search ref="iSearch" :model="formData" @search="fetch" @reset="reset">
        <el-form-item label="下单人" prop="orderUserName">
          <el-input v-model="formData.orderUserName" ></el-input>
        </el-form-item>
         <el-form-item label="订单编号" prop="orderCode">
          <el-input v-model="formData.orderCode" ></el-input>
        </el-form-item>
         <el-form-item label="付款日期"  prop="time">
      <el-date-picker
      v-model="time "
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>
                    </el-form-item>
                     <el-form-item label="手机号" prop="orderUserPhone">
          <el-input v-model="formData.orderUserPhone" ></el-input>
        </el-form-item>
         <el-form-item label="订单状态" prop="orderState">
         <el-select v-model="formData.orderState">
           <el-option
               v-for="(item,index) in orderState"
               :key="index"
               :label="item.label"
               :value="item.value">
            </el-option>
         </el-select>
        </el-form-item>
      </i-search>

     <!-- <el-button @click="test">删除</el-button> -->
<!-- 表头按钮 表头 数据 -->
      <i-table
      :toolbar="toolbar"
      :tableData="tableData"
      :pageInfo="pageInfo"
      :selectionShow="true"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      @handleSelection="handleSelection">
        <el-table-column
        v-for="(item,index) in columnList"
        :key="index"
        :label="item.label"
        :formatter="columnFormatter"
        :prop="item.prop"
        align="center">
        </el-table-column>
      </i-table>

      <i-dialog
      v-model="dialogVisibleShow"
      :title="dialogTitle"
      :buttonShow ="false"
       >
      <i-table
        :tableData="tableDataShow"
        :selectionShow="false"
        :pageInfo="pageInfo1"
        :paginShow ="true"
        @handleSizeChange="handleSizeChange1"
        @handleCurrentChange="handleCurrentChange1"
       >
        <el-table-column
          v-for="(item, index) in columnListShow"
          :key="index"
          :label="item.label"
          :prop="item.prop"
          align="center"
          :width="item.width"
          :show-overflow-tooltip="true"
          >
        </el-table-column>
      </i-table>
    </i-dialog>
    </div>
</template>

<script>
import ISearch from '@/components/common/i-search.vue'
import ITable from '@/components/common/i-table.vue'
import IDialog from '@/components/common/i-dialog.vue'
import moment from 'moment'
import req from '@/api/order-manage.js'
import CommSelect from '@/pages/order-manage/comm.select.vue'

export default {
  name: 'user-manage',
  components: {
    ISearch,
    ITable,
    IDialog,
    CommSelect
  },
  data () {
    return {
      time: [],
      buttonShow: false,
      dialogTitle: '订单详情',
      excelData: [],
      tableDataShow: [],
      orderCode: [],
      tableData1: [],
      columnListShow: [
        {label: '用户编号', prop: 'userCode'},
        {label: '订单编号', prop: 'orderCode'},
        {label: '商品编号', prop: 'goodCode', width: '120'},
        {label: '商品名称', prop: 'goodName'},
        {label: '商品购买数量', prop: 'goodNum'},
        {label: '商品总金额', prop: 'goodCount'},
        {label: '商品售价', prop: 'goodPrice'},
        {label: '商品定价', prop: 'goodSalePri'}
      ],
      orderState: [
        {label: '订单已取消', value: '0'},
        {label: '已下单', value: '1'},
        {label: '已发货', value: '2 '},
        {label: '已到货', value: '3'},
        {label: '已取货 ', value: '4'},
        {label: '已完成未评价', value: '5'},
        {label: '已完成已评价', value: '6'}
      ],
      orderStateTwo: [
        {label: '订单取消', value: '0'},
        {label: '已下单', value: '1'},
        {label: '已发货', value: '2'},
        {label: '已到货', value: '3'},
        {label: '已取货 ', value: '4'},
        {label: '已完成未评价', value: '5'},
        {label: '已完成已评价', value: '6'}
      ],
      orderPayState: [
        {label: '已支付', value: '1'},
        {label: '未支付', value: '0'}
      ],
      formData: {},
      dialogVisibleShow: false,
      dialogFormData: {},
      dialogVisible: false,
      currentState: true,
      pageInfo: {
        pageIndex: 1,
        pageSize: 5,
        total: 0
      },
      pageInfo1: {
        pageIndex: 1,
        pageSize: 5,
        total: 0
      },
      toolbar: [
        {
          btnName: '详情',
          state: '0',
          type: 'primary',
          func: () => {
            if (this.orderCode.length === 0) {
              this.$message({
                type: 'info',
                message: '请先勾选您想要查看详情的数据'
              })
            } else if (this.orderCode.length === 1) {
              this.search1()
            } else {
              this.$message({
                type: 'info',
                message: '一次只能查看一个详细数据'
              })
            }
          }
        },
        {
          btnName: '订单取消',
          state: sessionStorage.getItem('key'),
          type: 'primary',
          func: () => {
            if (this.orderCode.length > 0) {
              req('updateOrderState', {
                orderCode: this.orderCode.join(','),
                orderState: '0'
              }).then(data => {
                if (data.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '修改状态成功'
                  })
                } else {
                  this.$message({
                    type: 'error',
                    message: '修改状态失败'
                  })
                }
                this.fetch()
              })
            } else {
              this.$message({
                type: 'info',
                message: '请你勾选选项'
              })
            }
          }
        },
        {
          btnName: '已发货',
          state: sessionStorage.getItem('key'),
          type: 'primary',
          func: () => {
            if (this.orderCode.length > 0) {
              req('updateOrderState', {
                orderCode: this.orderCode.join(','),
                orderState: '2'
              }).then(data => {
                if (data.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '修改状态成功'
                  })
                } else {
                  this.$message({
                    type: 'error',
                    message: '修改状态失败'
                  })
                }
                this.fetch()
              })
            } else {
              this.$message({
                type: 'info',
                message: '请你勾选选项'
              })
            }
          }
        },
        {
          btnName: '取消已到货',
          state: '0',
          type: 'primary',
          func: () => {
            if (this.orderCode.length > 0) {
              req('updateOrderState', {
                orderCode: this.orderCode.join(','),
                orderState: '2'
              }).then(data => {
                if (data.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '修改状态成功'
                  })
                } else {
                  this.$message({
                    type: 'error',
                    message: '修改状态失败'
                  })
                }
                this.fetch()
              })
            } else {
              this.$message({
                type: 'info',
                message: '请你勾选选项'
              })
            }
          }
        },
        {
          btnName: '已到货',
          state: '0',
          type: 'primary',
          func: () => {
            if (this.orderCode.length > 0) {
              req('updateOrderState', {
                orderCode: this.orderCode.join(','),
                orderState: '3'
              }).then(data => {
                if (data.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '修改状态成功'
                  })
                } else {
                  this.$message({
                    type: 'error',
                    message: '修改状态失败'
                  })
                }
                this.fetch()
              })
            } else {
              this.$message({
                type: 'info',
                message: '请你勾选选项'
              })
            }
          }
        },
        {
          btnName: '取消已取货',
          state: '0',
          type: 'primary',
          func: () => {
            if (this.orderCode.length > 0) {
              req('updateOrderState', {
                orderCode: this.orderCode.join(','),
                orderState: '3'
              }).then(data => {
                if (data.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '修改状态成功'
                  })
                } else {
                  this.$message({
                    type: 'error',
                    message: '修改状态失败'
                  })
                }
                this.fetch()
              })
            } else {
              this.$message({
                type: 'info',
                message: '请你勾选选项'
              })
            }
          }
        },
        {
          btnName: '已取货',
          state: '0',
          type: 'primary',
          func: () => {
            if (this.orderCode.length > 0) {
              req('updateOrderState', {
                orderCode: this.orderCode.join(','),
                orderState: '4'
              }).then(data => {
                if (data.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '修改状态成功'
                  })
                } else {
                  this.$message({
                    type: 'error',
                    message: '修改状态失败'
                  })
                }
                this.fetch()
              })
            } else {
              this.$message({
                type: 'info',
                message: '请你勾选选项'
              })
            }
          }
        },
        {
          btnName: '导出',
          state: '0',
          type: 'primary',
          func: () => {
            this.downloadExcel()
          }
        }
      ],
      columnList: [
        {label: '订单编码', prop: 'orderCode'},
        {label: '订单总价', prop: 'orderCountPrice'},
        {label: '订单状态', prop: 'orderState', distName: 'orderStateTwo'},
        {label: '支付状态', prop: 'orderPayState', distName: 'orderPayState'},
        {label: '门店编码', prop: 'storeCode'},
        {label: '下单人姓名', prop: 'orderUserName'},
        {label: '下单人手机号', prop: 'orderUserPhone'},
        {label: '确认付款时间', prop: 'orderPayTime'}
      ],
      tableData: [],
      formRules: {}
    }
  },
  mounted () {
    this.fetch()
  },
  methods: {
    fetch () {
      this.pageInfo.pageIndex = 1
      this.pageInfo.pageSize = 5
      this.search()
    },
    // 搜索
    search1 () {
      req('getOrder', {
        orderCode: this.orderCode[0],
        pageNum: this.pageInfo1.pageIndex,
        pageSize: this.pageInfo1.pageSize
      }).then(data => {
        this.dialogVisibleShow = true
        this.tableDataShow = data.data.list
        this.tableDataShow.forEach((item, index) => {
          item.goodCount = item.goodPrice * item.goodNum
        })
        this.pageInfo1.pageIndex = data.data.pageNum
        this.pageInfo1.pageSize = data.data.pageSize
        this.pageInfo1.total = data.data.total
      })
    },
    // 搜索
    search () {
      if (this.time.length > 1) {
        this.time[0] = moment(this.time[0]).format('YYYY-MM-DD')
        this.time[1] = moment(this.time[1]).format('YYYY-MM-DD')
      }
      req('getOrderTable', {
        orderUserName: this.formData.orderUserName,
        orderCode: this.formData.orderCode,
        orderPayTimeStart: this.time[0],
        orderPayTimeEnd: this.time[1],
        orderUserPhone: this.formData.orderUserPhone,
        orderState: this.formData.orderState,
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageIndex
      }).then(data => {
        if (data.code === 0) {
          this.tableData = data.data.list
          this.pageInfo.pageIndex = data.data.pageNum
          this.pageInfo.pageSize = data.data.pageSize
          this.pageInfo.total = data.data.total
          this.excelData = data.data.li
        } else {
          this.tableData = []
          this.$message({
            type: 'info',
            message: '查询为空请重新查询'
          })
        }
      })
    },
    // 重置
    reset () {
      this.formData.orderUserName = ''
      this.formData.orderCode = ''
      this.orderPayTimeStart = ''
      this.time[1] = ''
      this.time = []
      this.formData.orderUserPhone = ''
      this.formData.orderState = ''
      this.fetch()
    },
    // 当前多少条
    handleSizeChange (value) {
      this.pageInfo.pageSize = value
      this.search()
    },
    handleSizeChange1 (value) {
      this.pageInfo1.pageSize = value
      this.search1()
    },
    // 当前多少页
    handleCurrentChange (value) {
      this.pageInfo.pageIndex = value
      this.search()
    },
    handleCurrentChange1 (value) {
      this.pageInfo1.pageIndex = value
      this.search1()
    },
    // 多选事件
    handleSelection (val) {
      this.orderCode = []
      val.forEach(item => {
        this.orderCode.push(item.orderCode)
      })
    },
    // 数据库状态匹对
    columnFormatter (row, column, cellValue, index) {
      let distName = this.columnList.filter(item => {
        return item.prop === column.property
      })[0].distName
      if (distName) {
        return this[distName].filter(item => {
          return item.value === String(row[column.property])
        })[0].label
      } else {
        return row[column.property]
      }
    },
    // 列表下载
    downloadExcel () {
      this.$confirm('确定下载列表文件?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.excelData = this.selectData // 你要导出的数据list。
        this.export2Excel()
      }).catch(() => {

      })
    },
    // 数据写入excel
    export2Excel () {
      var that = this
      require.ensure([], () => {
        const { exportJsonToExcel } = require('@/excel/export2Excel') // 这里必须使用绝对路径，使用@/+存放export2Excel的路径
        const tHeader = ['订单编码', '订单总价', '订单状态', '支付状态', '门店编码', '下单人姓名', '下单人手机号', '确认付款时间'] // 导出的表头名信息
        const filterVal = ['orderCode', 'orderCountPrice', 'orderState', 'orderPayState', 'storeCode', 'orderUserName', 'orderUserPhone', 'orderPayTime'] // 导出的表头字段名，需要导出表格字段名
        const list = that.tableData
        const data = that.formatJson(filterVal, list)
        console.log(data)
        data.forEach((item, index) => {
          if (item[2] === '1') {
            item[2] = '已取消'
          } else if (item[2] === '2') {
            item[2] = '已付款'
          } else if (item[2] === '3') {
            item[2] = '已发货'
          } else if (item[2] === '4') {
            item[2] = '已收货'
          } else if (item[2] === '5') {
            item[2] = '已完成未评价'
          } else {
            item[2] = '已完成已评价'
          }
          if (item[3] === '1') {
            item[3] = '已支付'
          } else {
            item[3] = '未支付'
          }
        })
        exportJsonToExcel(tHeader, data, '订单明细')// 导出的表格名称，根据需要自己命名
      })
    },
    // 格式转换，直接复制即可
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>

<style lang="scss">
.el-main {
  padding: 0;
}
</style>
