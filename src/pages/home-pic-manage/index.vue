<template>
    <div>
      <i-search ref="iSearch" :model="formData" @search="fetch" @reset="reset">
         <el-form-item label="状态" prop="rotaChartState" >
         <el-select v-model="formData.rotaChartState">
            <el-option
               v-for="(item,index) in rotaChartState1"
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
        :prop="item.prop"
        :width="item.width"
        align="center">
        <template slot-scope="scope">
          <el-link :href = "scope.row.rotaChartImageUrl" target= "_blank" type="primary"
          v-if="item.prop === 'view'">
          图片
          </el-link>
          <span v-if="item.prop === 'rotaChartImageUrl'"> {{scope.row.rotaChartImageUrl | ellipsis}}</span>
           <span v-else> {{scope.row[item.prop]}}</span>
        </template>
        </el-table-column>
      </i-table>
      <!-- dialog框 -->
       <i-dialog
    :buttonShow="buttonShow"
    v-model="dialogVisible"
    :title="dialogTitle"
    @dialog-before-close="dialogBeforeClose"
    @dialog-cancel="dialogCancel"
    @dialog-confirm="dialogconfirm">
    <el-form :model="dialogFormData" ref="form" :rules="formRules" label-width="100px" v-if="firstShow">
      <el-row>
          <el-col :span="14">
          <el-form-item label="有效时间"  prop="time">
      <el-date-picker
      v-model="time"
      @change="timeChange"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>
              </el-form-item>
                </el-col>
         <el-col :span='14'>
          <el-form-item label="排序" prop="rotaChartSort">
            <el-input v-model="dialogFormData.rotaChartSort"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span='12'>
          <el-form-item label="商品编号" prop="goodCode">
          <comm-select v-model="dialogFormData.goodCode"></comm-select>
          </el-form-item>
        </el-col>
            <el-col :span='12'>
          <el-form-item label="图片" prop="defaultImageUrl">
         <el-upload name="imageFile"
         action="http://springboottest.51vip.biz/pc/imageUpLoad/upLoadImage"
         v-model="dialogFormData.defaultImageUrl"
         :limit="1"
        :data="imgToken"
        ref="upload"
        :on-success="handleAvatarSuccess"
        :before-remove="beforeRemove">
         <el-button size="small" type="primary">点击上传</el-button>
         </el-upload>
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
import req from '@/api/home-pic-manage.js'
import CommSelect from '@/pages/home-pic-manage/comm-select.vue'
import moment from 'moment'
import {validateNumber} from '@/api/validate.js'

export default {
  name: 'home-pic-manage',
  components: {
    ISearch,
    ITable,
    IDialog,
    CommSelect
  },
  data () {
    return {
      buttonShow: true,
      picCode: [],
      time: [],
      rotaChartState1: [
        {label: '禁用', value: '2'},
        {label: '启用', value: '1'}
      ],
      dialogTitle: '新增轮播图',
      imgToken: {access_token: JSON.parse(sessionStorage.getItem('userInfo')).access_token},
      firstShow: true,
      formData: {},
      dialogFormData: {
        defaultImageUrl: '',
        rotaChartSort: '',
        rotaChartStartTime: '',
        rotaChartEndTime: '',
        goodCode: '',
        time: ''
      },
      dialogVisible: false,
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
            this.dialogVisible = true
          }
        },
        {
          btnName: '删除',
          state: '0',
          type: 'primary',
          func: () => {
            if (this.picCode.length === 0) {
              this.$message({
                type: 'warning',
                message: '请先勾选再点击删除按钮'
              })
            } else {
              this.$confirm('此操作将永久删除文件，是否继续？')
                .then(() => {
                  req('deleteRotaChart', {
                    rotaChartCode: this.picCode.join(',')
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
          btnName: '启用',
          state: '0',
          type: 'primary',
          func: () => {
            if (this.picCode.length === 0) {
              this.$message({
                type: 'warning',
                message: '请先勾选你想要启用的选项'
              })
            } else {
              req('updateRotaChartState', {
                rotaChartStateCode: this.picCode.join(','),
                rotaChartState: '1'
              }).then(data => {
                this.$message({
                  type: 'success',
                  message: '启用成功'
                })
                this.fetch()
              })
            }
          }
        },
        {
          btnName: '禁用',
          state: '0',
          type: 'primary',
          func: () => {
            if (this.picCode.length === 0) {
              this.$message({
                type: 'warning',
                message: '请先勾选你想要禁用的选项'
              })
            } else {
              req('updateRotaChartState', {
                rotaChartStateCode: this.picCode.join(','),
                rotaChartState: '2'
              }).then(data => {
                this.$message({
                  type: 'success',
                  message: '禁用成功'
                })
                this.fetch()
              })
            }
          }
        }
      ],
      columnList: [
        {label: '排序', prop: 'rotaChartSort'},
        {label: '图片路径', prop: 'rotaChartImageUrl'},
        {label: '预览', prop: 'view'},
        {label: '状态', prop: 'rotaChartState'},
        {label: '有效期起', prop: 'rotaChartStartTime'},
        {label: '有效期止', prop: 'rotaChartEndTime'}
      ],
      tableData: [],
      formRules: {
        time: [
          {required: true, message: '请输入对应的时间', trugger: 'change'}
        ],
        rotaChartSort: [
          {required: true, message: '请输入对应的排序', trugger: 'change'},
          {validator: validateNumber, trigger: 'blur'}
        ],
        goodCode: [
          {required: true, message: '请输入选择对应的商品编号', trugger: 'change'}
        ],
        defaultImageUrl: [
          {required: true, message: '请上传对应的照片', trugger: 'change'}
        ]
      }
    }
  },
  mounted () {
    this.fetch()
  },
  // 过滤
  filters: {
    ellipsis (value) {
      if (!value) return ''
      if (value.length > 40) {
        return value.slice(0, 40) + '...'
      }
      return value
    }
  },
  methods: {
    // 重新定义
    fetch () {
      this.pageInfo.pageIndex = 1
      this.search()
    },
    // 时间变化的时候
    timeChange () {
      this.dialogFormData.time = '1'
    },
    // 搜索
    search () {
      req('rotaChartList', {
        ...this.formData,
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageIndex
      }).then(data => {
        if (data.msg === '查询为空!') {
          this.$message({
            type: 'warning',
            message: '查询的范围内数据空，请重新尝试'
          })
          this.tableData = []
        } else {
          this.tableData = data.data.list
          this.tableData.forEach((item, index) => {
            if (this.tableData[index].rotaChartState === 1) {
              this.tableData[index].rotaChartState = '启用'
            } else {
              this.tableData[index].rotaChartState = '禁用'
            }
          })

          this.pageInfo.pageIndex = data.data.pageNum
          this.pageInfo.pageSize = data.data.pageSize
          this.pageInfo.total = data.data.total
        }
      })
    },
    // 重置
    reset () {
      this.formData.rotaChartState = '0'
      this.fetch()
    },
    // 每页多少页
    handleSizeChange (value) {
      this.pageInfo.pageSize = value
      this.search()
    },
    // 当前多少页
    handleCurrentChange (value) {
      this.pageInfo.pageIndex = value
      this.search()
    },
    // 多选框事件
    handleSelection (val) {
      this.picCode = []
      val.forEach(item => {
        this.picCode.push(item.rotaChartCode)
      })
    },
    // 关闭清空
    dialogBeforeClose () { // 关闭清空表单
      this.$refs.form.resetFields()
    },
    // dialog取消事件
    dialogCancel () {
      this.dialogVisible = false
      this.dialogFormData.defaultImageUrl = ''
      this.time = []
      this.$refs.form.resetFields()
      this.$refs.upload.clearFiles()
    },
    // 一半新增 一半提交
    dialogconfirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          req('addRotaChart', {
            rotaChartImageUrl: this.dialogFormData.defaultImageUrl,
            rotaChartSort: this.dialogFormData.rotaChartSort,
            rotaChartStartTime: moment(this.time[0]).format('YYYY-MM-DD'),
            rotaChartEndTime: moment(this.time[1]).format('YYYY-MM-DD'),
            goodCode: this.dialogFormData.goodCode
          }).then(data => {
            if (data.code === 3) {
              this.$message({
                type: 'warning',
                message: '该位序已存在或者图片已存在'
              })
            } else {
              this.$message({
                type: 'success',
                message: '添加成功'
              })
            }
            this.search()
            this.dialogFormData.defaultImageUrl = ''
            this.time = []
          })
          this.dialogVisible = false
          this.$refs.form.resetFields()
          this.$refs.upload.clearFiles()
        } else {
          return false
        }
      })
    },
    // 图片上传成功事件
    handleAvatarSuccess (res) {
      this.dialogFormData.defaultImageUrl = res.data.imageUrl
    },
    // 图片移除
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-main {
  padding: 0;
  .upload-demo {
      .el-button {
   padding-left: 0;
   background: #fff;
   color: black;
   border: none;
   outline-color: none;
   .test {
  border: 1px solid #cccccc;
  padding: 5px 8px 5px 8px;
  background: #eee;
}
    }
  }
}
</style>
