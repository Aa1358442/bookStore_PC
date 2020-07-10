<template>
    <div>
      <i-search ref="iSearch" :model="formData" @search="fetch" @reset="reset">
        <el-form-item label=客户名称 prop="customerName">
          <el-input v-model="formData.customerName" ></el-input>
        </el-form-item>
         <el-form-item label="客户账号" prop="customerAcc">
          <el-input v-model="formData.customerAcc" ></el-input>
        </el-form-item>
      </i-search>

     <!-- <el-button @click="test">删除</el-button> -->
<!-- 表头按钮 表头 数据 -->
      <i-table
      :toolbar="toolbar"
      :tableData="tableData"
      :pageInfo="pageInfo"
      :selectionShow="false"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      @handleSelection="handleSelection">
        <el-table-column
        v-for="(item,index) in columnList"
        :formatter="columnFormatter"
        :key="index"
        :label="item.label"
        :prop="item.prop"
        align="center">
        </el-table-column>
      </i-table>
    </div>
</template>

<script>
import ISearch from '@/components/common/i-search.vue'
import ITable from '@/components/common/i-table.vue'
import IDialog from '@/components/common/i-dialog.vue'
import req from '@/api/client-manage.js'

export default {
  name: 'client-manage',
  components: {
    ISearch,
    ITable,
    IDialog
  },
  data () {
    return {
      formData: {},
      dialogVisible: false,
      pageInfo: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      toolbar: [],
      columnList: [
        {label: '客户账号', prop: 'customerAcc'},
        {label: '姓名', prop: 'customerName'},
        {label: '性别', prop: 'customerSex', distName: 'sexList'},
        {label: '手机', prop: 'customerPhone'},
        {label: '客户邮箱', prop: 'customerEmail'},
        {label: '身份证', prop: 'customerIdCard'}
      ],
      sexList: [
        {label: '男', value: '1'},
        {label: '女', value: '0'}
      ],
      tableData: []
    }
  },
  mounted () {
    this.fetch()
  },
  methods: {
    // 数据初始化
    fetch () {
      this.pageInfo.pageIndex = 1
      this.pageInfo.pageSize = 5
      this.search()
    },
    // 搜索按钮
    search () {
      req('getClient', {
        ...this.formData,
        pageNum: this.pageInfo.pageIndex,
        pageSize: this.pageInfo.pageSize
      }).then(data => {
        if (data.code === 0) {
          this.tableData = data.data.list
          this.pageInfo.pageIndex = data.data.pageNum
          this.pageInfo.pageSize = data.data.pageSize
          this.pageInfo.total = data.data.total
        } else {
          this.$message({
            type: 'warning',
            message: '搜索范围内数据为空，请重新搜索'
          })
          this.tableData = []
        }
      })
    },
    // 重置按钮
    reset () {
      this.formData.customerName = ''
      this.formData.customerAcc = ''
      this.fetch()
    },
    // 当前一共有多少条数据
    handleSizeChange (value) {
      this.pageInfo.pageSize = value
      this.search()
    },
    // 当前多少页
    handleCurrentChange (value) {
      this.pageInfo.pageIndex = value
      this.search()
    },
    // 客户管理页面的多选功能是屏蔽的不需要
    handleSelection (rows) {
    },
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
    }
  }
}
</script>

<style lang="scss">
.el-main {
  padding: 0;
}
</style>
