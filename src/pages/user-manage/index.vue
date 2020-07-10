<template>
    <div>
      <!-- 模糊搜索板块 -->
      <i-search ref="iSearch" :model="formData" @search="fetch" @reset="reset">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="formData.userName" ></el-input>
        </el-form-item>
         <el-form-item label="用户账号" prop="userAccount">
          <el-input v-model="formData.userAccount" ></el-input>
        </el-form-item>
         <el-form-item label="角色" prop="userRole">
         <el-select v-model="formData.userRole" placeholder="请选择">
           <el-option
               v-for="(item,index) in roleOptions"
               :key="index"
               :label="item.label"
               :value="item.value">
            </el-option>
         </el-select>
        </el-form-item>
      </i-search>

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
        :formatter="columnFormatter"
        :width="item.width"
        align="center">
        </el-table-column>
      </i-table>
      <!-- dialog选择框 -->
       <i-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    @dialog-before-close="dialogBeforeClose"
    @dialog-cancel="dialogCancel"
    @dialog-confirm="dialogconfirm">
    <el-form :model="dialogFormData" ref="form" :rules="formRules" label-width="100px">
      <el-row>
        <el-col :span='12'>
          <el-form-item label="用户账号" prop="userAccount">
            <el-input v-model="dialogFormData.userAccount"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span='12'>
          <el-form-item label="用户姓名" prop="userName">
            <el-input v-model="dialogFormData.userName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span='12'>
          <el-form-item label="用户性别" prop="userSex">
              <el-select v-model="dialogFormData.userSex" placeholder="请选择">
           <el-option
               v-for="(item,index) in sexList"
               :key="index"
               :label="item.label"
               :value="item.value">
            </el-option>
         </el-select>
          </el-form-item>
        </el-col>
        <el-col :span='12'>
          <el-form-item label="手机号" prop="userPhone">
            <el-input v-model="dialogFormData.userPhone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span='12'>
          <el-form-item label="用户邮箱" prop="userEmail">
            <el-input v-model="dialogFormData.userEmail"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span='12'>
          <el-form-item label="身份证" prop="userIdCard">
            <el-input v-model="dialogFormData.userIdCard"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span='12'>
          <el-form-item label="用户密码" prop="userPass">
            <el-input v-model="dialogFormData.userPass" type="password"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span='12'>
          <el-form-item label="用户角色" prop="userRole">
            <el-select v-model="dialogFormData.userRole" placeholder="请选择">
             <el-option label="管理员" value="0"></el-option>
              <el-option label="店长" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- 图片上传 -->
        <div class="photo">
          <el-col :span='12'>
          <el-form-item label="图片" prop="defaultImageUrl">
         <el-upload name="imageFile"
         action="http://springboottest.51vip.biz/pc/imageUpLoad/upLoadImage"
         v-model="dialogFormData.defaultImageUrl"
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
          <img :src="this.dialogFormData.defaultImageUrl" v-show="this.dialogFormData.defaultImageUrl">
          </div>
        </el-col>
        </div>
      </el-row>
    </el-form>
    </i-dialog>
    </div>
</template>

<script>
import ISearch from '@/components/common/i-search.vue'
import ITable from '@/components/common/i-table.vue'
import IDialog from '@/components/common/i-dialog.vue'
import req from '@/api/user-manage.js'
import {validateIdNo, validatePhone, validateEMail, validateRealName} from '@/api/validate.js'

export default {
  name: 'user-manage',
  components: {
    ISearch,
    ITable,
    IDialog
  },
  data () {
    return {
      userSession: {},
      updateDialog: false,
      dialogTitle: '增加用户',
      formData: {},
      fileList: [],
      dialogFormData: {
        userAccount: '',
        userName: '',
        userSex: '',
        userPhone: '',
        defaultImageUrl: '',
        userEmail: '',
        userIdCard: '',
        userPass: '',
        userRole: ''
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
            if (this.userCode.length === 0) {
              this.dialogVisible = true
              this.dialogTitle = '新增用户'
            } else {
              this.$message({
                type: 'warning',
                message: '新增用户信息,请不要勾选选项'
              })
              this.$refs.form.resetFields()
            }
          }
        },
        {
          btnName: '修改',
          state: '0',
          type: 'primary',
          func: () => {
            if (this.userCode.length === 0) {
              this.$message({
                type: 'info',
                message: '请先勾选您想要修改的数据'
              })
            } else if (this.userCode.length === 1) {
              req('getUser', {
                userCode: this.userCode.join(',')
              }).then(data => {
                if (data.data.userRole === '2') {
                  this.$message({
                    type: 'warning',
                    message: '修改司机信息，请在司机信息管理修改'
                  })
                } else {
                  this.dialogVisible = true
                  this.dialogTitle = '修改用户'
                  this.updateDialog = true
                }
                this.dialogFormData.userAccount = data.data.userAccount
                this.dialogFormData.userName = data.data.userName
                this.dialogFormData.userPhone = data.data.userPhone
                this.dialogFormData.userEmail = data.data.userEmail
                this.dialogFormData.userIdCard = data.data.userIdCard
                this.dialogFormData.userRole = data.data.userRole
                this.dialogFormData.userPass = data.data.userPass
                this.dialogFormData.defaultImageUrl = data.data.defaultImageUrl
                // this.fileList[0] = this.dialogFormData.defaultImageUrl
              })
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
          state: '0',
          type: 'primary',
          func: () => {
            if (this.userCode.length === 0) {
              this.$message({
                type: 'info',
                message: '请先勾选再点击删除按钮'
              })
            } else {
              this.$confirm('此操作将永久删除用户，是否继续？')
                .then(() => {
                  req('delUser', {
                    userCode: this.userCode.join(',')
                  }).then(data => {
                    this.search()
                    if (data.code === 0) {
                      this.$message({
                        type: 'success',
                        message: '删除成功!'
                      })
                    } else {
                      this.$message({
                        type: 'warning',
                        message: '删除失败!'
                      })
                    }
                  })
                })
                .catch(() => {
                  this.$message({
                    type: 'success',
                    message: '取消删除  '
                  })
                })
            }
          }
        }
      ],
      roleOptions: [
        {label: '管理员', value: '0'},
        {label: '店长', value: '1'}
      ],
      sexList: [
        {label: '男', value: 1},
        {label: '女', value: 0}
      ],
      columnList: [
        {label: '账号', prop: 'userAccount', width: '130'},
        {label: '姓名', prop: 'userName', width: '110'},
        {label: '角色', prop: 'userRole', width: '130', distName: 'roleOptions'},
        {label: '性别', prop: 'userSex', width: '70', distName: 'sexList'},
        {label: '手机', prop: 'userPhone', width: '150'},
        {label: '邮箱', prop: 'userEmail'},
        {label: '身份证', prop: 'userIdCard'}
      ],
      tableData: [
      ],
      selection: [],
      formRules: {
        userAccount: [
          {required: true, message: '请输入用户账号', trugger: 'change'}
        ],
        userName: [
          {required: true, message: '请输入姓名', trugger: 'change'},
          {validator: validateRealName, trigger: 'blur'}
        ],
        userSex: [
          {required: true, message: '请输入用户性别', trugger: 'change', type: 'number'}
        ],
        userPhone: [
          {required: true, message: '请输入手机号码', trugger: 'change'},
          {validator: validatePhone, trigger: 'blur'}
        ],
        userEmail: [
          {required: true, message: '请输入用户邮箱', trugger: 'change'},
          {validator: validateEMail, trigger: 'blur'}
        ],
        userIdCard: [
          {required: true, message: '请输入用户身份证', trugger: 'change'},
          {validator: validateIdNo, trigger: 'blur'}
        ],
        userPass: [
          {required: true, message: '请输入用户密码', trugger: 'change'}
        ],
        userRole: [
          {required: true, message: '请输入用户角色', trugger: 'change'}
        ],
        defaultImageUrl: [
          {required: false, message: '请上传图片', trugger: 'change'}
        ]
      },
      userCode: [],
      imgToken: {access_token: JSON.parse(sessionStorage.getItem('userInfo')).access_token}
    }
  },
  mounted () {
    this.fetch()
  },
  methods: {
    // 重置条件
    fetch () {
      this.pageInfo.pageIndex = 1
      this.search()
    },
    // 多选框点击事件
    handleSelection (val) {
      this.userCode = []
      val.forEach(item => {
        this.userCode.push(item.userCode)
      })
      if (val.length === 1) {
        this.dialogFormData.userAccount = val[0].userAccount
        this.dialogFormData.userName = val[0].userName
        this.dialogFormData.userSex = val[0].userSex
        this.dialogFormData.userPhone = val[0].userPhone
        this.dialogFormData.userEmail = val[0].userEmail
        this.dialogFormData.userIdCard = val[0].userIdCard
        this.dialogFormData.userRole = val[0].userRole
      } else {
        this.dialogFormData.userAccount = ''
        this.dialogFormData.userName = ''
        this.dialogFormData.userSex = ''
        this.dialogFormData.userPhone = ''
        this.dialogFormData.userEmail = ''
        this.dialogFormData.userIdCard = ''
        this.dialogFormData.userRole = ''
        this.dialogFormData.imageUrl = ''
      }
    },
    // 搜索
    search () {
      req('getTableData', {
        ...this.formData,
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageIndex
      }).then(data => {
        if (data.code === 10000) {
          this.tableData = []
          this.$message({
            type: 'warning',
            message: '没有符合你搜索范围的用户，请重新搜索'
          })
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
      this.formData.userName = ''
      this.formData.userAccount = ''
      this.formData.userRole = ''
      this.fetch()
    },
    // 显示每页信息跳数
    handleSizeChange (value) {
      this.pageInfo.pageSize = value
      this.search()
    },
    // 翻页
    handleCurrentChange (value) {
      this.pageInfo.pageIndex = value
      this.search()
    },
    // 关闭并且清空表单
    dialogBeforeClose () { // 关闭清空表单
      this.$refs.form.resetFields()
    },
    // 清楚照片前做一个警告
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    // 上传照片成功返回url
    handleAvatarSuccess (res) {
      this.dialogFormData.defaultImageUrl = res.data.imageUrl
    },
    // dialog框取消前数据清空
    dialogCancel () {
      this.dialogVisible = false
      this.$refs.form.resetFields()
      this.$refs.upload.clearFiles()
    },
    // 一半注册 一半更新
    dialogconfirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // updateDialog=false 则执行增加操作 否则则执行修改操作
          if (this.updateDialog === false) {
            this.dialogFormData.userSex = this.dialogFormData.userSex === '男' ? '1' : '0'
            req('addUser', {
              ...this.dialogFormData
            }).then(data => {
              this.$refs.upload.clearFiles()
              if (data.code === 0) {
                this.$message({
                  type: 'success',
                  message: '添加用户成功!!'
                })
                this.search()
                this.dialogFormData.defaultImageUrl = ''
              } else {
                this.$message({
                  type: 'info',
                  message: '该账号或手机号码已重复,请重新输入信息!'
                })
              }
            })
          } else {
            this.$refs.upload.clearFiles()
            req('updateUser', {
              userCode: this.userCode.join(','),
              userAccount: this.dialogFormData.userAccount,
              userName: this.dialogFormData.userName,
              defaultImageUrl: this.dialogFormData.defaultImageUrl,
              userSex: this.dialogFormData.userSex,
              userPhone: this.dialogFormData.userPhone,
              userEmail: this.dialogFormData.userEmail,
              userIdCard: this.dialogFormData.userIdCard,
              userPass: this.dialogFormData.userPass,
              userRole: this.dialogFormData.userRole
            }).then(data => {
              if (data.code === 3) {
                this.$message({
                  type: 'info',
                  message: '你修改的用户名或者手机号码已存在，请重新输入!'
                })
              } else {
                this.$message({
                  type: 'success',
                  message: '修改信息成功!'
                })
                this.search()
                this.updateDialog = false
              }
            })
          }
          this.$refs.form.resetFields()
          this.dialogVisible = false
        } else {
          return false
        }
      })
    },
    // 数据库返回数字跟文字对应
    columnFormatter (row, column, cellValue, index) {
      let distName = this.columnList.filter(item => {
        return item.prop === column.property
      })[0].distName
      if (distName) {
        return this[distName].filter(item => {
          return String(item.value) === String(row[column.property])
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
   .el-form-item {
    .upload-demo{
    .el-button {
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
.el-dialog__body {
  position: relative;
}
</style>
