<template>
    <div>
     <i-search ref="iSearch" :model="formData" @search="search" @reset="reset">
        <el-form-item label="门店编号" prop="storeCode">
          <el-input v-model="formData.storeCode" ></el-input>
        </el-form-item>
         <el-form-item label="门店名称" prop="storeName">
          <el-input v-model="formData.storeName" ></el-input>
        </el-form-item>
          <el-form-item label="店长名称" prop="storeUserName">
          <el-input v-model="formData.storeUserName" ></el-input>
        </el-form-item>
         <el-form-item label="所在省份" prop="storeProvince">
         <el-select v-model="formData.storeProvince" @change="proviceChange">
           <el-option
            v-for="(item,index) in proviceOption"
               :key="index"
               :label="item.areaName"
               :value="item.areaCode"
           ></el-option>
         </el-select>
        </el-form-item>
        <el-form-item label="所在城市" prop="storeCity" >
         <el-select v-model="formData.storeCity" @change="cityChange">
           <el-option
            v-for="(item,index) in cityOption"
               :key="index"
               :label="item.areaName"
               :value="item.areaCode">
               </el-option>
         </el-select>
        </el-form-item>
        <el-form-item label="所在区" prop="storeDistinct">
         <el-select v-model="formData.storeDistinct">
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
        :width="item.width"
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
          <el-form-item label="门店名称" prop="storeName">
            <el-input v-model="dialogFormData.storeName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span='12'>
          <el-form-item label="联系电话" prop="storePhone">
            <el-input v-model="dialogFormData.storePhone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span='12'>
          <el-form-item label="店长编号" prop="userCode">
            <comm-select v-model="dialogFormData.userCode"></comm-select>
            <!-- <el-input v-model="dialogFormData.userCode"></el-input> -->
          </el-form-item>
        </el-col>
        <el-col :span='12'>
          <el-form-item label="营业执照码" prop="storeBusinessLicense">
            <el-input v-model="dialogFormData.storeBusinessLicense"></el-input>
          </el-form-item>
        </el-col>
          <el-col :span='12'>
          <el-form-item label="所在省份" prop="storeProvinceCode">
         <el-select v-model="dialogFormData.storeProvinceCode" @change="proviceChange">
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
          <el-form-item label="所在城市" prop="storeCityCode">
         <el-select v-model="dialogFormData.storeCityCode" @change="cityChange">
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
          <el-form-item label="所在区" prop="storeDistinctCode">
         <el-select v-model="dialogFormData.storeDistinctCode">
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
         <el-col :span='24'>
        <el-form-item label="详细地址" prop="storeDetailAddress">
            <el-input type="textarea"
              :rows="4"
              v-model="dialogFormData.storeDetailAddress"></el-input>
          </el-form-item>
           </el-col>
      </el-row>
    </el-form>
    </i-dialog>

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
import req from '@/api/shop-info-manage.js'
import CommSelect from '@/pages/shop-info-manage/comm.select.vue'

export default {
  name: 'shop-info-manage',
  components: {
    ISearch,
    ITable,
    IDialog,
    CommSelect
  },
  data () {
    return {
      tableDataShow: [],
      columnListShow: [
        {label: '门店名称', prop: 'storeName'},
        {label: '联系电话', prop: 'storePhone'},
        {label: '店长编号', prop: 'userCode', width: '210'},
        {label: '营业执照', prop: 'storeBusinessLicense'},
        {label: '详细地址', prop: 'storeDetailAddress', width: '240'},
        {label: '门店邀请码', prop: 'investCode'}
      ],
      dialogTitle: '增加用户',
      updateDialog: false,
      dialogVisibleShow: false,
      title: '详情查询',
      address: {},
      formData: {
        storeCode: '',
        storeName: '',
        storeUserName: '',
        storeProvince: '',
        storeCity: '',
        storeDistinct: ''
      },
      dialogFormData: {
        storeName: '',
        storePhone: '',
        userCode: '',
        storeBusinessLicense: '',
        storeProvinceCode: '',
        storeCityCode: '',
        storeDistinctCode: '',
        storeDetailAddress: ''
      },
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
            if (this.storeCode.length === 0) {
              this.$message({
                type: 'info',
                message: '请先勾选您想要修改的数据'
              })
            } else if (this.storeCode.length === 1) {
              req('roughStore', {
                storeCode: this.storeCode[0]
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
            if (this.storeCode.length === 0) {
              this.dialogVisible = true
              this.dialogTitle = '新增门店信息'
              this.updateDialog = false
            } else {
              this.$message({
                type: 'warning',
                message: '新增门店时不要勾选'
              })
            }
          }
        },
        {
          btnName: '修改',
          state: '0',
          type: 'primary',
          func: () => {
            if (this.storeCode.length === 0) {
              this.$message({
                type: 'info',
                message: '请先勾选您想要修改的数据'
              })
            } else if (this.storeCode.length === 1) {
              req('roughStore', {
                storeCode: this.storeMessage.storeCode
              }).then(data => {
                this.storeMessage.storeName = data.data.storeName
                this.storeMessage.storePhone = data.data.storePhone
                this.storeMessage.userCode = data.data.userCode
                this.storeMessage.storeBusinessLicense = data.data.storeBusinessLicense
                this.storeMessage.storeinvitation = data.data.investCode
                this.storeMessage.storeProvinceCode = data.data.storeProvinceCode
                this.storeMessage.storeCityCode = data.data.storeCityCode
                this.storeMessage.storeDistinctCode = data.data.storeDistinctCode
                this.storeMessage.storeDetailAddress = data.data.storeDetailAddress
                req('storeCity', {
                  areaCode: this.storeMessage.storeProvinceCode
                }).then(data => {
                  this.cityOption = data.data
                })
                req('storeCity', {
                  areaCode: this.storeMessage.storeCityCode
                }).then(data => {
                  this.ordOption = data.data
                })
                this.dialogFormData.storeName = this.storeMessage.storeName
                this.dialogFormData.storePhone = this.storeMessage.storePhone
                this.dialogFormData.userCode = this.storeMessage.userCode
                this.dialogFormData.storeBusinessLicense = this.storeMessage.storeBusinessLicense
                this.dialogFormData.storeProvinceCode = this.storeMessage.storeProvinceCode
                this.dialogFormData.storeCityCode = this.storeMessage.storeCityCode
                this.dialogFormData.storeDistinctCode = this.storeMessage.storeDistinctCode
                this.dialogFormData.storeDetailAddress = this.storeMessage.storeDetailAddress
              })
              this.dialogVisible = true
              this.dialogTitle = '修改门店信息'
              this.updateDialog = true
            } else {
              this.$message({
                type: 'info',
                message: '一次只能勾选一个数据进行修改'
              })
            }
          }
        },
        {
          btnName: '删除',
          state: sessionStorage.getItem('key'),
          type: 'primary',
          func: () => {
            if (this.storeCode.length === 0) {
              this.$message({
                type: 'warning',
                message: '请先勾选再点击删除按钮'
              })
            } else {
              this.$confirm('此操作将永久删除文件，是否继续？')
                .then(() => {
                  req('delStore', {
                    storeCode: this.storeCode.join(',')
                  }).then(data => {
                    if (data.code === 0) {
                      this.$message({
                        type: 'success',
                        message: '删除成功'
                      })
                    } else {
                      this.$message({
                        type: 'error',
                        message: '删除失败，请重新尝试'
                      })
                    }
                    this.search()
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
        {label: '门店编号', prop: 'storeCode', width: '250'},
        {label: '门店名称', prop: 'storeName', width: '200'},
        {label: '电话', prop: 'storePhone', width: '200'},
        {label: '详细地址', prop: 'storeAddress', width: '350'},
        {label: '店长名称', prop: 'storeUserName', width: '180'},
        {label: '邀请码', prop: 'storeinvitation'},
        {label: '门店账号', prop: 'storeAcc'}
      ],
      tableData: [],
      proviceOption: [],
      cityOption: [],
      ordOption: [],
      formRules: {
        storeName: [
          {required: true, message: '请输入门店名称', trugger: 'change'}
        ],
        storePhone: [
          {required: true, message: '请输入联系电话', trugger: 'change'}
        ],
        userCode: [
          {required: true, message: '请输入店长编号', trugger: 'change'}
        ],
        storeBusinessLicense: [
          {required: true, message: '请输入营业执照码', trugger: 'change'}
        ],
        storeProvinceCode: [
          {required: true, message: '请输入省份', trugger: 'change'}
        ],
        storeCityCode: [
          {required: true, message: '请输入所在城市', trugger: 'change'}
        ],
        storeDistinctCode: [
          {required: true, message: '请输入所在区', trugger: 'change'}
        ]

      },
      storeCode: [],
      storeOption: [],
      storeMessage: {
        storeCode: '',
        storeName: '',
        storePhone: '',
        userCode: '',
        storeBusinessLicense: '',
        storeinvitation: '',
        storeProvinceCode: '',
        storeCityCode: '',
        storeDistinctCode: '',
        storeDetailAddress: '',
        version: ''
      }
    }
  },
  mounted () {
    this.fetch()
    this.getProvice()
  },
  methods: {
    // 初始数据化
    fetch () {
      this.pageInfo.pageNum = 1
      this.pageInfo.pageSize = 5
      this.search()
    },
    // 省份变化
    proviceChange (value) {
      req('storeCity', {
        areaCode: value
      }).then(data => {
        this.cityOption = data.data
        this.storeOption = this.cityOption
      })
      if (this.cityOption !== undefined) {
        this.formData.storeCity = ''
        this.dialogFormData.storeCityCode = ''
        this.cityOption = this.storeOption
        this.storeOption = this.ordOption
        this.formData.storeDistinct = ''
        this.dialogFormData.storeDistinctCode = ''
        this.ordOption = this.storeOption
      } else {

      }
    },
    // 市区变化
    cityChange (value, label) {
      req('storeCity', {
        areaCode: value
      }).then(data => {
        this.ordOption = data.data
        if (this.ordOption !== undefined) {
          this.storeOption = this.ordOption
          this.formData.storeDistinct = ''
          this.dialogFormData.storeDistinctCode = ''
          this.ordOption = this.storeOption
        }
      })
    },
    // 获取省份数据
    getProvice () {
      req('storeProvince').then(data => {
        this.proviceOption = data.data
      })
    },
    // 搜索
    search () {
      req('getStoreTable', {
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
    comeBack () {
      this.dialogVisibleShow = false
    },
    // 重置
    reset () {
      this.formData.storeCode = ''
      this.formData.storeName = ''
      this.formData.storeUserName = ''
      this.formData.storeProvince = ''
      this.formData.storeCity = ''
      this.formData.storeDistinct = ''
      this.search()
    },
    // 每页多少条
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
      this.storeCode = []
      val.forEach(item => {
        this.storeCode.push(item.storeCode)
      })
      if (val.length === 1) {
        this.storeMessage.storeCode = val[0].storeCode
        this.storeMessage.version = val[0].version
      } else {
      }
    },
    // 清空表单
    dialogBeforeClose () { // 关闭清空表单
      this.$refs.form.resetFields()
    },
    // 取消表单
    dialogCancel () {
      this.dialogVisible = false
      this.$refs.form.resetFields()
    },
    // 一半新增 一半提交
    dialogconfirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.updateDialog === false) {
            req('addStore', {
              ...this.dialogFormData
            }).then(data => {
              if (data.code === 0) {
                this.$message({
                  type: 'success',
                  message: '新增门店成功'
                })
              } else {
                this.$message({
                  type: 'error',
                  message: data.msg
                })
              }
              this.fetch()
            })
          } else {
            req('updateStore', {
              storeCode: this.storeMessage.storeCode,
              storeName: this.dialogFormData.storeName,
              storePhone: this.dialogFormData.storePhone,
              userCode: this.dialogFormData.userCode,
              storeBusinessLicense: this.dialogFormData.storeBusinessLicense,
              storeinvitation: this.dialogFormData.storeinvitation,
              storeProvinceCode: this.dialogFormData.storeProvinceCode,
              storeCityCode: this.dialogFormData.storeCityCode,
              storeDistinctCode: this.dialogFormData.storeDistinctCode,
              storeDetailAddress: this.dialogFormData.storeDetailAddress,
              version: this.storeMessage.version
            }).then(data => {
              console.log(data)
              if (data.code === 0) {
                this.$message({
                  type: 'success',
                  message: '修改门店成功'
                })
              } else {
                this.$message({
                  type: 'error',
                  message: data.msg
                })
              }
              this.fetch()
            })
          }
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
</style>
