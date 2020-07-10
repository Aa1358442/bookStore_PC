<template>
    <div>
     <!-- <el-button @click="test">删除</el-button> -->
<!-- 表头按钮 表头 数据 -->
      <table border="0px" cellspacing="0">
        <tr>
          <td width = "350px"><i-table :containerShow='false'
      :toolbar="toolbar">
      </i-table></td>
      <td width="700px"><div style="font-size: 20px;margin-left:40px">菜单详情</div></td>
      </tr>
      <tr>
        <td width = "350px">
          <div class="menuclass" style="width: 100%;height: 100%">
         <el-menu @select="handlerSelect">
             <el-menu-item v-for="(item,index) in menuList" :index="item.id" :key="index" >
               <span slot="title">{{item.label}}</span>
                    </el-menu-item>
                </el-menu>
          </div>
        </td>
        <td style="width: 500px;height:600px;position: relative;">
          <el-form style="position: absolute;top: 5%"  :model="menuList1">
          <div class="test1">
          <el-form-item label="菜单名称">
          <el-input v-model="menuList1.menuName" ></el-input>
        </el-form-item>

         <el-form-item label="菜单路由">
          <el-input v-model="menuList1.menuUrl" ></el-input>
        </el-form-item>
          </div>
               <div class="test1">
         <el-form-item label="备注">
          <el-input v-model="menuList1.remark" ></el-input>
        </el-form-item>
               </div>
        </el-form>
        </td>
      </tr>
      </table>
       <i-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    @dialog-before-close="dialogBeforeClose"
    @dialog-cancel="dialogCancel"
    @dialog-confirm="dialogconfirm">
    <el-form :model="dialogFormData" ref="form" :rules="formRules" label-width="100px">
      <el-row>
        <el-col :span='24'>
          <el-form-item label="名称" prop="menuName">
            <el-input v-model="dialogFormData.menuName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span='24'>
          <el-form-item label="路径" prop="menuUrl">
            <el-input v-model="dialogFormData.menuUrl"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span='24'>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="dialogFormData.remark"></el-input>
          </el-form-item>
        </el-col>

      <el-col :span='24'>
          <el-form-item label="查看等级" prop="userRole">
         <el-select v-model="dialogFormData.userRole" >
              <el-option
              v-for="(item,index) in userLevel"
               :key="index"
               :label="item.label"
               :value="item.value"
              >
              </el-option>
         </el-select>
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
import req from '@/api/menu-manage.js'

export default {
  name: 'menu-manage',
  components: {
    ISearch,
    ITable,
    IDialog
  },
  data () {
    return {
      menuList: [
      ],
      userLevel: [
        {label: '管理员', value: 0},
        {label: '店长', value: 1}
      ],
      roleCode: sessionStorage.getItem('key'),
      menuList1: {
        menuName: '',
        menuUrl: '',
        remark: ''
      },
      dialogTitle: '新增菜单',
      formData: {},
      type: '0',
      menuCode: [],
      dialogFormData: {
        menuName: '',
        menuUrl: '',
        remark: '',
        userRole: ''
      },
      updateState: false,
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
            if (this.menuCode.length === 0) {
              this.dialogVisible = true
              this.dialogTitle = '新增菜单'
            } else {
              this.$message({
                type: 'warning',
                message: '请刷新后重新尝试添加菜单'
              })
            }
          }
        },
        {
          btnName: '修改',
          state: '0',
          type: 'primary',
          func: () => {
            if (this.menuCode.length === 0) {
              this.$message({
                type: 'info',
                message: '请你选择你想要修改的数据'
              })
            } else {
              this.dialogVisible = true
              this.dialogTitle = '修改菜单'
              this.updateState = true
              req('getMenu', {
                menuCode: this.menuCode[0]
              }).then(data => {
                this.dialogFormData.menuName = data.data.menuName
                this.dialogFormData.menuUrl = data.data.menuRoute
                this.dialogFormData.remark = data.data.menuRemark
                this.dialogFormData.userRole = data.data.userRole
              })
            }
          }
        },
        {
          btnName: '删除',
          state: '0',
          type: 'primary',
          func: () => {
            if (this.menuCode.length === 0) {
              this.$message({
                type: 'warning',
                message: '请你选择参数之后再进行删除操作'
              })
            } else {
              this.$confirm('此操作将永久删除该文件，是否继续?').then(() => {
                req('deleteMenu', {
                  menuCode: this.menuCode[0]
                }).then(data => {
                  this.menuCode[0] = ''
                  this.getMenus()
                  this.$message({
                    type: 'success',
                    message: '删除成功'
                  })
                })
              })
            }
          }
        },
        {
          btnName: '刷新',
          state: '0',
          type: 'primary',
          func: () => {
            this.getMenus()
            this.menuCode = []
            this.$message({
              type: 'success',
              message: '刷新成功'
            })
          }
        }
      ],
      formRules: {
        menuName: [
          {required: true, message: '请输入菜单名称', trugger: 'change'}
        ],
        menuUrl: [
          {required: true, message: '请输入菜单路径', trugger: 'change'}
        ],
        remark: [
          {required: true, message: '请输入备注', trugger: 'change'}
        ],
        userRole: [
          {required: true, message: '请输入查看的角色等级', trugger: 'change', type: 'number'}
        ]
      }
    }
  },
  mounted () {
    this.getMenus()
  },
  methods: {
    // 获取菜单目录
    getMenus () {
      req('getTableMenu', {
        roleCode: this.roleCode
      }).then(data => {
        this.menuList = data.data
      })
    },
    // 清空dialog表单
    dialogBeforeClose () { // 关闭清空表单
      this.$refs.form.resetFields()
    },
    // dialog取消事件
    dialogCancel () {
      this.dialogVisible = false
      this.$refs.form.resetFields()
    },
    // 一半新增 一半跟新
    dialogconfirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.updateState === false) {
            req('addMenu', {
              menuName: this.dialogFormData.menuName,
              type: this.type,
              menuUrl: this.dialogFormData.menuUrl,
              remark: this.dialogFormData.remark,
              userRole: this.dialogFormData.userRole
            }).then(data => {
              if (data.code === 0) {
                this.$message({
                  type: 'success',
                  message: '新增菜单成功!'
                })
                this.getMenus()
                this.menuCode[0] = ''
              } else {
                this.$message({
                  type: 'warning',
                  message: '菜单重名或路径重合，请重新输入!'
                })
              }
            })
          } else {
            req('updateMenu', {
              menuName: this.dialogFormData.menuName,
              menuUrl: this.dialogFormData.menuUrl,
              remark: this.dialogFormData.remark,
              menuCode: this.menuCode[0],
              userRole: this.dialogFormData.userRole
            }).then(data => {
              if (data.code === 0) {
                this.$message({
                  type: 'success',
                  message: '修改菜单成功'
                })
                this.getMenus()
              } else {
                this.$message({
                  type: 'warning',
                  message: '修改的菜单名或路径重合，请重新输入'
                })
              }
              this.getMenus()
            })
          }

          this.dialogVisible = false
          this.$refs.form.resetFields()
        } else {
          return false
        }
      })
    },
    // 选中菜单后返回信息
    handlerSelect (index) {
      this.menuCode[0] = index
      req('getMenu', {
        menuCode: this.menuCode[0]
      }).then(data => {
        this.menuList1.menuName = data.data.menuName
        this.menuList1.menuUrl = data.data.menuRoute
        this.menuList1.remark = data.data.menuRemark
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-main {
  padding: 0;
  table {
    margin-left: 20px;
    margin-top: 10px;
    border: 1px solid rgba(228, 228, 228, 1);;
  }
}
 /deep/.i-table .btn-list[data-v-abd0af54] {
   margin-top: 15px;
 }
.el-menu li {
  height: 40px;
  line-height: 40px;
}
.el-menu li span {
  margin-left: 20px;
  height: 20px;
}
/deep/ .el-menu-item {
  height: 40px;
}
/deep/ .el-input__inner {
  width: 200px;
}
.el-form-item {
  display: flex;
  margin-left: 20px;
}
.test1 {
  display: flex;
}
/deep/ .el-form-item__label {
  width: 70px;
}
.el-menu {
  height: 730px;
}
</style>
