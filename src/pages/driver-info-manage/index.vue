<template>
    <div>
      <i-search ref="iSearch" :model="formData" @search="search" @reset="reset">
        <el-form-item label=司机编号 prop="driverCode">
          <el-input v-model="formData.driverCode" ></el-input>
        </el-form-item>
         <el-form-item label="司机姓名" prop="driverName">
          <el-input v-model="formData.driverName" ></el-input>
        </el-form-item>
         <el-form-item label="所在省份" prop="driverProvincCode">
         <el-select v-model="formData.driverProvincCode" @change="proviceChange">
          <el-option
            v-for="(item,index) in proviceOption"
               :key="index"
               :label="item.areaName"
               :value="item.areaCode"
           ></el-option>
         </el-select>
        </el-form-item>
        <el-form-item label="所在城市" prop="driverCityCode">
         <el-select v-model="formData.driverCityCode" @change="cityChange">
          <el-option
            v-for="(item,index) in cityOption"
               :key="index"
               :label="item.areaName"
               :value="item.areaCode">
               </el-option>
         </el-select>
        </el-form-item>
        <el-form-item label="所在区" prop="driverDistinctCode">
         <el-select v-model="formData.driverDistinctCode">
           <el-option
            v-for="(item,index) in ordOption"
               :key="index"
               :label="item.areaName"
               :value="item.areaCode">
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
      <el-row>
        <el-col :span='12'>
          <el-form-item label="司机姓名" prop="driverName">
            <el-input v-model="dialogFormData.driverName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span='12'>
          <el-form-item label="司机账号" prop="driverAcct">
            <el-input v-model="dialogFormData.driverAcct"></el-input>
          </el-form-item>
        </el-col>
               <el-col :span='12'>
          <el-form-item label="联系电话" prop="driverPhone">
            <el-input v-model="dialogFormData.driverPhone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span='12'>
          <el-form-item label="密码" prop="driverPass">
            <el-input v-model="dialogFormData.driverPass" type="password"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span='12'>
          <el-form-item label="身份证号" prop="driverIdCard">
            <el-input v-model="dialogFormData.driverIdCard"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span='12'>
          <el-form-item label="所在省份" prop="driverProvincCode">
         <el-select v-model="dialogFormData.driverProvincCode" @change="proviceChange">
             <el-option
               v-for="(item,index) in proviceOption"
               :key="index"
               :label="item.areaName"
               :value="item.areaCode"
               >
             </el-option>
         </el-select>
        </el-form-item>
        </el-col>
        <el-col :span='12'>
          <el-form-item label="所在城市" prop="driverCityCode">
         <el-select v-model="dialogFormData.driverCityCode" @change="cityChange">
             <el-option
               v-for="(item,index) in cityOption"
               :key="index"
               :label="item.areaName"
               :value="item.areaCode"
               >
          </el-option>
         </el-select>
        </el-form-item>
        </el-col>
        <el-col :span='12'>
          <el-form-item label="所在区" prop="driverDistinctCode">
         <el-select v-model="dialogFormData.driverDistinctCode">
              <el-option
               v-for="(item,index) in ordOption"
               :key="index"
               :label="item.areaName"
               :value="item.areaCode"
               >
            </el-option>
         </el-select>
        </el-form-item>
        </el-col>
        <el-col :span='12'>
          <el-form-item label="图片" prop="driverImage">
         <el-upload name="imageFile"
         action="http://springboottest.51vip.biz/pc/imageUpLoad/upLoadImage"
         v-model="dialogFormData.driverImage"
         :limit="1"
          ref="upload"
           :file-list="fileList"
        :data="imgToken"
        :on-success="handleAvatarSuccess"
        :before-remove="beforeRemove">
         <el-button size="small" type="primary">点击上传</el-button>
         </el-upload>
          </el-form-item>
          <div class="imgAddress">
          <img :src="this.dialogFormData.driverImage" v-show="this.dialogFormData.driverImage">
          </div>
        </el-col>
      </el-row>
    </el-form>
    </i-dialog>

    <!-- 隐藏dialog -->
      <i-dialog
      v-model="dialogVisibleShow"
      :title="title"
      :buttonShow ="false"
       >
      <i-table
        :tableData="tableDataShow"
        :selectionShow="false"
        :paginShow ="false"
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
import req from '@/api/driver-info-manage.js'

export default {
  name: 'driver-info-manage',
  components: {
    ISearch,
    ITable,
    IDialog
  },
  data () {
    return {
      fileList: [],
      dialogTitle: '增加司机',
      proviceOption: [],
      cityOption: [],
      ordOption: [],
      driverMessage: [],
      driverOption: [],
      driverCode: [],
      updateDialog: false,
      formData: {
        driverName: '',
        driverCode: '',
        driverProvincCode: '',
        driverCityCode: '',
        driverDistinctCode: ''
      },
      dialogFormData: {
        driverName: '',
        driverAcct: '',
        driverPhone: '',
        driverPass: '',
        driverIdCard: '',
        driverImage: '',
        driverProvincCode: '',
        driverCityCode: '',
        driverDistinctCode: ''
      },
      imgToken: {access_token: JSON.parse(sessionStorage.getItem('userInfo')).access_token},
      dialogVisible: false,
      pageInfo: {
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
            if (this.driverCode.length === 0) {
              this.$message({
                type: 'info',
                message: '请先勾选您想要查看详情的数据'
              })
            } else if (this.driverCode.length === 1) {
              req('getDriver', {
                driverCode: this.driverCode[0]
              }).then(data => {
                this.dialogVisibleShow = true
                this.tableDataShow[0] = data.data
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
          btnName: '新增',
          state: sessionStorage.getItem('key'),
          type: 'primary',
          func: () => {
            if (this.driverCode.length === 0) {
              this.dialogVisible = true
              this.updateDialog = false
              this.dialogTitle = '新增司机'
            } else {
              this.$message({
                type: 'warning',
                message: '新增司机信息的同时请不要勾选选项'
              })
            }
          }
        },
        {
          btnName: '修改',
          state: sessionStorage.getItem('key'),
          type: 'primary',
          func: () => {
            if (this.driverCode.length === 0) {
              this.$message({
                type: 'info',
                message: '请先勾选您想要修改的的数据'
              })
            } else if (this.driverCode.length === 1) {
              this.dialogTitle = '修改司机信息'
              this.updateDialog = true
              this.dialogVisible = true
              req('getDriver', {
                driverCode: this.driverCode[0]
              }).then(data => {
                this.driverMessage = data.data
                this.getProvice()
                req('storeCity', {
                  areaCode: this.driverMessage.driverProvinceCode
                }).then(data => {
                  this.cityOption = data.data
                })
                req('storeCity', {
                  areaCode: this.driverMessage.driverCityCode
                }).then(data => {
                  this.ordOption = data.data
                })
                this.dialogFormData.driverName = this.driverMessage.driverName
                this.dialogFormData.driverAcct = this.driverMessage.driverAcct
                this.dialogFormData.driverPhone = this.driverMessage.driverPhone
                this.dialogFormData.driverPass = this.driverMessage.driverPass
                this.dialogFormData.driverIdCard = this.driverMessage.driverIdCard
                this.dialogFormData.driverImage = this.driverMessage.driverImage
                this.dialogFormData.driverProvincCode = this.driverMessage.driverProvinceCode
                this.dialogFormData.driverCityCode = this.driverMessage.driverCityCode
                this.dialogFormData.driverDistinctCode = this.driverMessage.driverDistinctCode
              })
            } else {
              this.$message({
                type: 'info',
                message: '一次只能修改一组数据，请重新勾选'
              })
            }
          }
        },
        {
          btnName: '删除',
          state: sessionStorage.getItem('key'),
          type: 'primary',
          func: () => {
            if (this.driverCode.length === 0) {
              this.$message({
                type: 'warning',
                message: '请先勾选再点击删除按钮'
              })
            } else {
              this.$confirm('此操作将永久删除文件，是否继续？')
                .then(() => {
                  req('delDriver', {
                    driverCode: this.driverCode.join(',')
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
        }
      ],
      columnList: [
        {label: '司机编号', prop: 'driverCode'},
        {label: '姓名', prop: 'driverName'},
        {label: '手机', prop: 'driverPhone'},
        {label: '身份证', prop: 'driverIdCard'},
        {label: '账号', prop: 'driverAcct'}
      ],
      tableData: [],
      formRules: {
        driverName: [
          {required: true, message: '请输入司机姓名', trugger: 'change'}
        ],
        driverAcct: [
          {required: true, message: '请输入司机账号', trugger: 'change'}
        ],
        driverPhone: [
          {required: true, message: '请输入联系电话', trugger: 'change'}
        ],
        driverPass: [
          {required: true, message: '请输入密码', trugger: 'change'}
        ],
        driverIdCard: [
          {required: true, message: '请输入身份证号', trugger: 'change'}
        ],
        driverProvincCode: [
          {required: true, message: '请输入所在省份', trugger: 'change'}
        ],
        driverCityCode: [
          {required: true, message: '请输入所在市区', trugger: 'change'}
        ],
        driverDistinctCode: [
          {required: true, message: '请输入所在区', trugger: 'change'}
        ],
        driverImage: [
          {required: false, message: '请输入所在区', trugger: 'change'}
        ]
      },
      dialogVisibleShow: false,
      title: '详细查询',
      tableDataShow: [],
      userRole: sessionStorage.getItem('key'),
      columnListShow: [
        {label: '司机名字', prop: 'driverName'},
        {label: '联系电话', prop: 'driverPhone'},
        {label: '司机账号', prop: 'driverAcct', width: '180'},
        {label: '密码', prop: 'driverIdCard'},
        {label: '司机所在省名称', prop: 'driverProvinceName'},
        {label: '司机所在市名称', prop: 'driverCityName'},
        {label: '司机所在区名称', prop: 'driverDistinctName'}
      ]
    }
  },
  mounted () {
    this.fetch()
    this.getProvice()
  },
  methods: {
    // 初始数据
    fetch () {
      this.pageInfo.pageNum = 1
      this.pageInfo.pageSize = 5
      this.search()
    },
    // 城市变化
    cityChange (value, label) {
      req('storeCity', {
        areaCode: value
      }).then(data => {
        this.ordOption = data.data
        if (this.ordOption !== undefined) {
          this.storeOption = this.ordOption
          this.formData.driverDistinctCode = ''
          this.dialogFormData.driverDistinctCode = ''
          this.ordOption = this.storeOption
        }
      })
    },
    // 省变化
    proviceChange (value) {
      req('storeCity', {
        areaCode: value
      }).then(data => {
        this.cityOption = data.data
        this.storeOption = this.cityOption
        // this.getProvice ()
      })
      if (this.cityOption !== undefined) {
        this.formData.driverCityCode = ''
        this.dialogFormData.driverCityCode = ''
        this.cityOption = this.storeOption
        this.storeOption = []
        this.storeOption = this.ordOption
        this.formData.driverDistinctCode = ''
        this.dialogFormData.driverDistinctCode = ''
        this.ordOption = this.storeOption
      } else {

      }
    },
    // 获取省数据
    getProvice () {
      req('storeProvince').then(data => {
        this.proviceOption = data.data
      })
    },
    // 搜索
    search () {
      req('getDriverTable', {
        ...this.formData,
        pageNum: this.pageInfo.pageIndex,
        pageSize: this.pageInfo.pageSize
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
      this.formData.driverCode = ''
      this.formData.driverName = ''
      this.formData.driverProvincCode = ''
      this.formData.driverCityCode = ''
      this.formData.driverDistinctCode = ''
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
    // 多选事件
    handleSelection (val) {
      this.driverCode = []
      val.forEach(item => {
        this.driverCode.push(item.driverCode)
      })
    },
    // 关闭清空表单
    dialogBeforeClose () { // 关闭清空表单
      this.$refs.form.resetFields()
    },
    // dialog取消
    dialogCancel () {
      this.dialogVisible = false
      this.$refs.form.resetFields()
      this.$refs.upload.clearFiles()
    },
    // 一半新增 一半更新
    dialogconfirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.updateDialog === false) {
            req('addDriver', {
              driverCode: this.driverCode[0],
              driverName: this.dialogFormData.driverName,
              driverPhone: this.dialogFormData.driverPhone,
              driverAcct: this.dialogFormData.driverAcct,
              driverPass: this.dialogFormData.driverPass,
              driverIdCard: this.dialogFormData.driverIdCard,
              driverImage: this.dialogFormData.driverImage,
              driverProvincCode: this.dialogFormData.driverProvincCode,
              driverCityCode: this.dialogFormData.driverCityCode,
              driverDistinctCode: this.dialogFormData.driverDistinctCode
            }).then(data => {
              this.$refs.upload.clearFiles()
              if (data.code === 3) {
                this.$message({
                  type: 'info',
                  message: '你添加的用户已存在请重新注册'
                })
              } else {
                this.$message({
                  type: 'success',
                  message: '添加数据成功'
                })
              }
              this.fetch()
            })
          } else {
            this.$refs.upload.clearFiles()
            req('updateDriver', {
              driverCode: this.driverCode[0],
              driverName: this.dialogFormData.driverName,
              driverPhone: this.dialogFormData.driverPhone,
              driverAcct: this.dialogFormData.driverAcct,
              driverPass: this.dialogFormData.driverPass,
              driverImage: this.dialogFormData.driverImage,
              driverIdCard: this.dialogFormData.driverIdCard,
              driverProvincCode: this.dialogFormData.driverProvincCode,
              driverCityCode: this.dialogFormData.driverCityCode,
              driverDistinctCode: this.dialogFormData.driverDistinctCode,
              version: this.driverMessage.version
            }).then(data => {
              this.fetch()
              this.$message({
                type: 'success',
                message: '修改数据成功'
              })
            })
          }
          this.dialogVisible = false
          this.$refs.form.resetFields()
        } else {
          return false
        }
      })
    },
    // 图片上传成功
    handleAvatarSuccess (res) {
      this.dialogFormData.driverImage = res.data.imageUrl
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
}
.imgAddress {
  img {
    width: 50px;
    height: 50px;
  position: absolute;
  top: 73%;
  left: 28%;
  }
}
</style>
