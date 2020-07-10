<template>
    <div>
      <i-search ref="iSearch" :model="formData" @search="fetch" @reset="reset">
        <el-form-item label="商品名称" prop="goodName">
          <el-input v-model="formData.goodName" ></el-input>
        </el-form-item>
         <el-form-item label="商品编号" prop="goodCode">
          <el-input v-model="formData.goodCode" ></el-input>
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
        :prop="item.prop"
        :show-overflow-tooltip="true"
        align="center">
        </el-table-column>
      </i-table>

     <i-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    @dialog-before-close="dialogBeforeClose"
    @dialog-cancel="dialogCancel"
    @dialog-confirm="dialogconfirm">
    <el-form :model="dialogFormData" ref="form" :rules="formRules" label-width="100px">
      <el-row :gutter="20">
        <el-col :span='14'>
          <el-form-item label="商品编号" prop="goodCode">
          <comm-select v-model="dialogFormData.goodCode"></comm-select>
          </el-form-item>
        </el-col>
        <el-col :span='14'>
          <el-form-item label="热门位排序" prop="hotGoodSort">
            <el-input v-model="dialogFormData.hotGoodSort"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    </i-dialog>

    <!-- 展示数量设计 -->
    <i-dialog
    v-model="dialogVisibleShow"
    @dialog-confirm="numConfirm"
    @dialog-cancel="numCancel"
    :title="showTitle">
    <el-form :model="showNumber" label-width="100px">
      <el-row :gutter="20">
        <el-col :span='14'>
          <el-form-item label="商品数量" prop="showNumber">
          <el-input v-model="showNumber.showNumber"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span='14'>
          <el-form-item label="数量设置修改" prop="showNumber">
          <el-input v-model="showNumber.updateNum"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    </i-dialog>
    </div>
</template>

<script>
import ISearch from '@/components/common/i-search.vue'
import ITable from '@/components/common/i-table.vue'
import IDialog from '@/components/common/i-dialog.vue'
import req from '@/api/hot-comm-manage.js'
import CommSelect from '@/pages/hot-comm-manage/comm.select.vue'
import {validateNumber} from '@/api/validate.js'

export default {
  name: 'hot-comm-manage',
  components: {
    ISearch,
    ITable,
    IDialog,
    CommSelect
  },
  data () {
    return {
      dialogTitle: '新增热门位商品',
      formData: {},
      updateDialog: false,
      tableDataShow: [],
      dialogFormData: {
        goodCode: '',
        hotGoodSort: ''
      },
      showNumber: {
        showNumber: '',
        updateNum: ''
      },
      showTitle: '展示数量',
      dialogVisible: false,
      dialogVisibleShow: false,
      pageInfo: {
        pageIndex: 1,
        pageSize: 5,
        total: 0
      },
      toolbar: [
        {
          btnName: '新增',
          state: '0',
          type: 'primary',
          func: () => {
            this.dialogTitle = '新增热门位商品'
            if (this.hotCommCode.length === 0) {
              this.dialogVisible = true
              this.updateDialog = false
            } else {
              this.$message({
                type: 'warning',
                message: '新增的时候请不要勾选选项'
              })
            }
          }
        },
        {
          btnName: '修改',
          state: '0',
          type: 'primary',
          func: () => {
            this.dialogTitle = '修改热门位商品'
            if (this.hotCommCode.length === 0) {
              this.$message({
                type: 'info',
                message: '请先勾选您想要修改的数据'
              })
            } else if (this.hotCommCode.length === 1) {
              req('roughHotGoods', {
                hotGoodCode: this.hotCommCode[0]
              }).then(data => {
                this.dialogVisible = true
                this.tableDataShow[0] = data.data
                this.updateDialog = true
                this.dialogFormData.goodCode = data.data.goodCode
                this.dialogFormData.hotGoodSort = data.data.hotGoodSort
              })
            } else {
              this.$message({
                type: 'info',
                message: '一次只能查看一个详细数据'
              })
            }
          }
        },
        {
          btnName: '删除',
          type: 'primary',
          state: '0',
          func: () => {
            if (this.hotCommCode.length === 0) {
              this.$message({
                type: 'warning',
                message: '请先勾选再点击删除按钮'
              })
            } else {
              this.$confirm('此操作将永久删除文件，是否继续？')
                .then(() => {
                  req('delHotGoods', {
                    hotGoodCode: this.hotCommCode.join(',')
                  }).then(data => {
                    this.search()
                    this.$message({
                      type: 'success',
                      message: '删除数据成功'
                    })
                  })
                })
                .catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消删除'
                  })
                })
            }
          }
        },
        {
          btnName: '展示数量设置',
          state: '0',
          type: 'primary',
          func: () => {
            this.dialogVisibleShow = true
            this.dialogVisible = false
            req('HotGoodNum').then(data => {
              this.showNumber.showNumber = data.data.hotGoodNum
            })
          }
        }
      ],
      columnList: [
        {label: '排序', prop: 'hotGoodSort'},
        {label: '商品编号', prop: 'goodCode'},
        {label: '商品名称', prop: 'goodName'},
        {label: '商品价格', prop: 'goodPrice'},
        {label: '商品介绍', prop: 'goodPre'}
      ],
      tableData: [],
      formRules: {
        hotGoodSort: [
          {required: true, message: '请输入热门位序', trugger: 'change'},
          {validator: validateNumber, trigger: 'blur'}
        ],
        goodCode: [
          {required: true, message: '请输入商品编号', trugger: 'change'}
        ]
      },
      hotCommCode: []
    }
  },
  mounted () {
    this.fetch()
  },
  methods: {
    // 初始数据化
    fetch () {
      this.pageInfo.pageIndex = 1
      this.pageInfo.pageSize = 5
      this.search()
    },
    // 搜索
    search () {
      req('hotGoodsList', {
        ...this.formData,
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageIndex
      }).then(data => {
        if (data.code === 3) {
          this.tableData = []
        } else {
          this.tableData = data.data.list
          this.pageInfo.pageIndex = data.data.pageNum
          this.pageInfo.pageSize = data.data.pageSize
          this.pageInfo.total = data.data.total
        }
      })
    },
    // 重置
    reset () {
      this.formData.goodName = ''
      this.formData.goodCode = ''
      this.fetch()
    },
    // 当前多少条
    handleSizeChange (value) {
      this.pageInfo.pageSize = value
      this.search()
    },
    // 当前第几页
    handleCurrentChange (value) {
      this.pageInfo.pageIndex = value
      this.search()
    },
    // // 多选事件
    handleSelection (val) {
      this.hotCommCode = []
      val.forEach(item => {
        this.hotCommCode.push(item.hotGoodCode)
      })
    },
    // dialog文字展示
    handlerShow () {
      this.dialogTitle = '热门位商品选择'
    },
    changeFun (val) {
      this.multipleSelection = val
    },
    secondCancel () {
      this.dialogTitle = '新增热门位商品'
    },
    secondconfirm () {
      this.dialogTitle = '新增热门位商品'
    },
    dialogBeforeClose () { // 关闭清空表单
      this.$refs.form.resetFields()
    },
    dialogCancel () {
      this.dialogVisible = false
      this.$refs.form.resetFields()
    },
    numConfirm () {
      if (this.showNumber.updateNum === 0) {

      } else {
        req('showHotGoodsNum', {
          hotGoodNum: this.showNumber.updateNum
        }).then(data => {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
        })
      }
      this.dialogVisibleShow = false
      this.dialogVisible = false
      this.showNumber.updateNum = ''
    },
    numCancel () {
      this.dialogVisibleShow = false
      this.dialogVisible = false
      this.showNumber.updateNum = ''
    },
    dialogconfirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.updateDialog === false) {
            req('addHotGoods', {
              goodCode: this.dialogFormData.goodCode,
              hotGoodSort: this.dialogFormData.hotGoodSort
            }).then(data => {
              if (data.code === 3) {
                this.$message({
                  type: 'warning',
                  message: '添加的热门位顺序已经存在，请重新输入或者该商品已经存在'
                })
              } else {
                this.fetch()
                this.$message({
                  type: 'success',
                  message: '添加热门位商品成功'
                })
              }
            })
          } else {
            req('updateHotGoods', {
              hotGoodCode: this.hotCommCode[0],
              goodCode: this.dialogFormData.goodCode,
              hotGoodSort: this.dialogFormData.hotGoodSort,
              version: this.tableDataShow[0].version
            }).then(data => {
              if (data.code === 3) {
                this.$message({
                  type: 'warning',
                  message: '修改的热门位顺序已经存在，请重新输入或者该商品已经存在'
                })
              } else {
                this.fetch()
                this.$message({
                  type: 'success',
                  message: '修改热门位商品成功'
                })
              }
              this.fetch()
            })
          }
          this.dialogconfirm.goodCode = ''
          this.dialogconfirm.hotGoodSort = ''
          this.dialogVisible = false
          this.$refs.form.resetFields()
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-main {
  padding: 0;
}
/deep/.el-tooltip__popper {
  background: yellow!important;
}
</style>
