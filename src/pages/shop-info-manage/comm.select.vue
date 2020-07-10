<template>
  <div class="container">
    <div class="comm-box">
      <el-button class="add-btn" @click="openDialog" type="primary" icon="el-icon-plus"></el-button>
      <span>{{userCode}}</span>
    </div>

    <i-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      @dialog-before-close="dialogBeforeClose"
      @dialog-cancel="dialogCancel"
      @dialog-confirm="dialogConfirm"
      @dialog-open="dialogOpen"
      :appendToBody="true">

      <i-search ref="iSearch" :model="formData" @search="fetch" @reset="reset">
        <el-form-item label="商家编号" prop="userCode">
          <el-input v-model="formData.userCode"></el-input>
        </el-form-item>
        <el-form-item label="商家账号" prop="userAccount">
          <el-input v-model="formData.userAccount"></el-input>
        </el-form-item>
        <el-form-item label="商家名称" prop="userName">
          <el-input v-model="formData.userName"></el-input>
        </el-form-item>
         <el-form-item label="商家手机号" prop="userPhone">
          <el-input v-model="formData.userPhone"></el-input>
        </el-form-item>
      </i-search>

      <i-table
        :tableData="tableData"
        :pageInfo="pageInfo"
        :selectionShow="true"
        v-loading="tableLoading"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
        @handleSelection="handleSelection">
        <el-table-column
          v-for="(item, index) in columnList"
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
import IDialog from '@/components/common/i-dialog.vue'
import ITable from '@/components/common/i-table.vue'
import ISearch from '@/components/common/i-search.vue'
import req from '@/api/shop-info-manage.js'

export default {
  name: 'comm-select',
  components: {
    IDialog,
    ITable,
    ISearch
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      userCode: '',
      dialogVisible: false,
      dialogTitle: '商家选择',
      formData: {
        userCode: '',
        userAccount: '',
        userName: '',
        userPhone: ''
      },
      tableData: [],
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0
      },
      tableLoading: false,
      tableSelectRows: [],
      columnList: [
        {label: '商家编号', prop: 'userCode'},
        {label: '商家账号', prop: 'userAccount'},
        {label: '商家名称', prop: 'userName'},
        {label: '商家手机号', prop: 'userPhone'}
      ]
    }
  },
  watch: {
    value: {
      handler (value) {
        this.userCode = value
      },
      deep: true
    }
  },
  mounted () {
    this.fetch()
  },
  methods: {
    openDialog () {
      this.dialogVisible = true
    },
    dialogBeforeClose () {
      this.formData.userCode = ''
      this.formData.userAccount = ''
      this.formData.userPhone = ''
      this.formData.userName = ''
      this.dialogVisible = false
    },
    dialogOpen () {
      this.fetch()
    },
    dialogCancel () {
      this.formData.userCode = ''
      this.formData.userAccount = ''
      this.formData.userPhone = ''
      this.formData.userPhone = ''
      this.dialogVisible = false
    },
    dialogConfirm () {
      if (this.tableSelectRows.length === 0) {
        this.$message.info('请至少选择一条数据')
        return
      }
      if (this.tableSelectRows.length > 1) {
        this.$message.info('只能选择一条数据')
        return
      }
      this.$emit('input', this.tableSelectRows[0].userCode)
      this.formData.userCode = ''
      this.formData.userAccount = ''
      this.formData.userCode = ''
      this.formData.userName = ''
      this.dialogVisible = false
    },
    fetch () {
      this.pageInfo.pageSize = 5
      this.pageInfo.pageNum = 1
      this.search()
    },
    search () {
      this.tableLoading = true
      req('searchUserCode', {
        ...this.formData,
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum
      }).then(data => {
        if (data.code === 3) {
          this.$message.info('你搜索的数据为空再重新输入')
          this.tableData = []
          this.tableLoading = false
        } else {
          this.tableLoading = false
          this.tableData = data.data.list
          this.pageInfo.pageNum = data.data.pageNum
          this.pageInfo.pageSize = data.data.pageSize
          this.pageInfo.total = data.data.total
        }
      }).catch(() => {
        this.tableLoading = false
      })
    },
    reset () {
      this.fetch()
    },
    handleSizeChange (value) {
      this.pageInfo.pageSize = value
      this.search()
    },
    handleCurrentChange (value) {
      this.pageInfo.pageNum = value
      this.search()
    },
    handleSelection (val) {
      this.tableSelectRows = val
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  .comm-box {
    display: flex;
    justify-content: space-between;

    .add-btn {
      padding: 0 10px;
    }

    span:nth-child(2) {
      flex: 1;
      height: 30px;
      line-height: 30px;
      overflow: hidden;
      padding: 0 5px;
      box-sizing: border-box;
      cursor: pointer;

      &:hover {
        color: #409EFF;
      }
    }

    .delete-btn {
      padding: 0 10px;
    }
  }
}
</style>
