<template>
    <div>
     <!-- <el-button @click="test">删除</el-button> -->
<!-- 表头按钮 表头 数据 -->
      <table  cellspacing="0">
        <tr>
          <td width = "350px"><i-table
          :containerShow='false'
          :toolbar="toolbar">
      </i-table></td>
      <td width="700px"><div style="font-size: 20px;margin-left:40px">分类详情</div></td>
      </tr>
      <tr>
        <td width = "350px" height = "500px" border="1px">
           <div class="menuclass" style="width: 100%;height: 100%">
            <el-tree
            :data="treeData"
            :props="defaultProps"
            node-key="classId"
            ref="treeData"
            slot="content"
            @node-click="handleNodeClick">
            </el-tree>
           </div>
        </td>
        <td style="position: relative;" >
          <el-form style="position: absolute;top:5%" :model="rightForm" ref="rightForm" :inline="true">
             <div class="test1">
          <el-form-item label="分类名称" prop="className">
          <el-input  v-model="rightForm.className" ></el-input>
        </el-form-item>
         <el-form-item label="备注" prop="classRemark">
          <el-input  v-model="rightForm.classRemark"></el-input>
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
          <el-form-item label="分类名称" prop="className">
            <el-input v-model="dialogFormData.className"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span='24'>
          <el-form-item label="备注" prop="classRemark">
            <el-input v-model="dialogFormData.classRemark"></el-input>
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
import req from '@/api/comm-classify-manage'

export default {
  name: 'comm-classify-manage',
  components: {
    ISearch,
    ITable,
    IDialog
  },
  data () {
    return {
      rightForm: {
        className: '',
        classRemark: ''
      },
      dialogTitle: '新增分类',
      formData: {},
      updateDia: false,
      dialogFormData: {
        className: '',
        classRemark: ''
      },
      dialogVisible: false,
      toolbar: [
        {
          btnName: '新增',
          state: '0',
          type: 'primary',
          func: () => {
            if (this.currentData.$treeNodeId !== undefined) {
              this.dialogTitle = '新增二级分类'
              if (this.node.length === 0) {
                if (this.currentData.listGoodClassificationSon === undefined) {
                  this.$message({
                    type: 'warning',
                    message: '无法在二级分类下继续新增分类！请重新操作'
                  })
                } else {
                  this.updateDia = false
                  this.dialogVisible = true
                }
              } else {
                this.updateDia = false
                this.dialogVisible = true
              }
            } else {
              this.dialogTitle = '新增一级分类'
              this.updateDia = false
              this.dialogVisible = true
            }
          }
        },
        {
          btnName: '修改',
          state: '0',
          type: 'primary',
          func: () => {
            this.updateDia = true
            if (this.currentData.$treeNodeId !== undefined) {
              this.dialogTitle = '修改分类'
              this.dialogVisible = true
              req('checkClass', {
                classCode: this.currentData.classCode
              }).then((res) => {
                this.dialogFormData.className = res.data.className
                this.dialogFormData.classRemark = res.data.classRemark
              })
            } else {
              this.$message({
                type: 'warning',
                message: '请选择要删除的菜单项'
              })
            }
          }
        },
        {
          btnName: '删除',
          state: '0',
          type: 'primary',
          func: () => {
            if (this.currentData.$treeNodeId !== undefined) {
              this.$confirm('此操作将永久删除分类，是否继续？').then(() => {
                req('deleteClass', {
                  classCode: this.currentData.classCode,
                  classRank: this.classRank
                })
                  .then((res) => {
                    if (res.code === 3) {
                      this.$message({
                        type: 'warning',
                        message: res.msg
                      })
                    } else {
                      this.$message({
                        type: 'success',
                        message: res.msg
                      })
                    }
                    this.getClass()
                  })
              })
                .catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消删除'
                  })
                })
            } else {
              this.$message({
                type: 'warning',
                message: '请选择要删除的菜单项'
              })
            }
          }
        },
        {
          btnName: '刷新',
          state: '0',
          type: 'primary',
          func: () => {
            this.$refs.treeData.setCurrentKey()
            this.$refs.rightForm.resetFields()
            this.getClass()
            this.currentData = {}
            this.classRank = ''
          }
        }
      ],
      formRules: {
        className: [
          {required: true, message: '请输入分类名称', trugger: 'change'}
        ],
        classRemark: [
          {required: true, message: '请输入备注', trugger: 'change'}
        ]
      },
      currentData: {},
      classRank: '',
      node: {},
      treeData: [],
      firstClass: {},
      SecondClass: {},
      defaultProps: {
        children: 'listGoodClassificationSon',
        label: 'className'
      }
    }
  },
  mounted () {
    this.getClass()
    this.currentData = []
  },
  methods: {
    // 获取一级分类的列表
    getClass () {
      req('getClassTable').then((res) => {
        this.treeData = res.data
        this.currentData = {}
      })
    },
    // 关闭清空表单
    dialogBeforeClose () { // 关闭清空表单
      this.$refs.form.resetFields()
    },
    // 取消dialog表单
    dialogCancel () {
      this.dialogVisible = false
      this.$refs.form.resetFields()
    },
    // 一半新增 一半提交
    dialogconfirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.updateDia === false) {
            if (this.currentData.$treeNodeId !== undefined) {
              req('addSecondClass', {
                className: this.dialogFormData.className,
                classRemark: this.dialogFormData.classRemark,
                firstClassCode: this.currentData.classCode
              }).then(data => {
                if (data.code === 3) {
                  this.$message({
                    type: 'warning',
                    message: '分类名已存在'
                  })
                } else {
                  this.getClass()
                }
              })
            } else {
              req('addFirstClass', {
                className: this.dialogFormData.className,
                classRemark: this.dialogFormData.classRemark
              }).then(data => {
                if (data.code === 3) {
                  this.$message({
                    type: 'warning',
                    message: '分类名已存在'
                  })
                } else {
                  this.$message({
                    type: 'success',
                    message: '新增成功'
                  })
                  this.getClass()
                }
              })
            }
          } else {
            if (this.node.length === 0) {
              req('updateClass', {
                classCode: this.SecondClass.classCode,
                className: this.dialogFormData.className,
                classRemark: this.dialogFormData.classRemark,
                classRank: this.classRank,
                firstClassCode: this.firstClass.ClassCode,
                version: this.SecondClass.version
              }).then(data => {
                if (data.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '修改成功'
                  })
                } else {
                  this.$message({
                    type: 'error',
                    message: '修改失败'
                  })
                }
                this.getClass()
              })
            } else {
              req('updateClass', {
                classCode: this.currentData.classCode,
                className: this.dialogFormData.className,
                classRemark: this.dialogFormData.classRemark,
                classRank: this.classRank,
                firstClassCode: '',
                version: this.firstClass.version
              }).then(data => {
                this.getClass()
              })
            }
          }

          this.dialogVisible = false
          this.$refs.form.resetFields()
          this.updateDia = false
        } else {

        }
      })
    },
    // 触碰节点返回信息
    handleNodeClick (data, node) {
      this.currentData = data
      this.treeData.forEach((item, index) => {
        if (this.treeData[index].classCode === this.currentData.classCode) {
          this.firstClass.version = this.treeData[index].version
          this.firstClass.ClassCode = this.treeData[index].classCode
          this.firstClass.index = index
        } else {
        }
      })
      if (node.childNodes.length === 0) {
        for (let i = 0; i < this.treeData[this.firstClass.index].listGoodClassificationSon.length; i++) {
          if (this.treeData[this.firstClass.index].listGoodClassificationSon[i].classCode === this.currentData.classCode) {
            this.SecondClass.index = i
            this.SecondClass = this.treeData[this.firstClass.index].listGoodClassificationSon[i]
          }
        }
      } else {

      }
      this.node = node.childNodes
      req('getClass', {
        classCode: this.currentData.classCode
      }).then(data => {
        this.rightForm.className = data.data.className
        this.rightForm.classRemark = data.data.classRemark
      })
      if (data.listGoodClassificationSon != null) {
        this.classRank = '1'
      } else {
        this.classRank = '2'
      }
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
.el-tree {
  margin-top: 15px;
  margin-left: 30px;
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

</style>
