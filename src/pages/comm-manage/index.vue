<template>
    <div>
      <i-search ref="iSearch" :model="formData" @search="fetch" @reset="reset">
        <el-form-item label=商品名称 prop="goodName">
          <el-input v-model="formData.goodName" ></el-input>
        </el-form-item>
         <el-form-item label="商品状态" prop="goodState">
         <el-select v-model="formData.goodState">
            <el-option
               v-for="(item,index) in roleOptions"
               :key="index"
               :label="item.label"
               :value="item.value"
               >
           </el-option>
         </el-select>
        </el-form-item>
        <el-form-item label="广告词" prop="goodAd">
          <el-input v-model="formData.goodAd" ></el-input>
        </el-form-item>
        <el-form-item label="出版社" prop="goodCommodityPress">
          <el-input v-model="formData.goodCommodityPress" ></el-input>
        </el-form-item>
        <el-form-item label="作者" prop="goodAuthor">
          <el-input v-model="formData.goodAuthor" ></el-input>
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
        :show-overflow-tooltip="true"
        :formatter="columnFormatter"
        :prop="item.prop"
        align="center">
        </el-table-column>
      </i-table>
      <!-- 增加修改表格 -->
       <i-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    @dialog-before-close="dialogBeforeClose"
    @dialog-cancel="dialogCancel"
    @dialog-confirm="dialogconfirm">
    <el-form :model="dialogFormData" ref="form" :rules="formRules" label-width="100px">
      <el-row>
        <el-col :span='12'>
          <el-form-item label="商品名称" prop="goodName">
            <el-input v-model="dialogFormData.goodName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span='12'>
          <el-form-item label="书号" prop="goodIsbnBookSize">
            <el-input v-model="dialogFormData.goodIsbnBookSize"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span='12'>
          <el-form-item label="一级分类" prop="firstoption">
            <el-select v-model="dialogFormData.firstoption" placeholder="请选择" @change="getSecondClass">
              <el-option
              v-for="(item,index) in firstList"
               :key="index"
               :label="item.className"
               :value="item.classCode"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
         <el-col :span='12'>
          <el-form-item label="二级分类" prop="goodSecondClas">
            <el-select v-model="dialogFormData.goodSecondClas">
               <el-option
              v-for="(item,index) in secondList"
               :key="index"
               :label="item.className"
               :value="item.classCode"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span='12'>
          <el-form-item label="广告词" prop="goodAd">
            <el-input type="textarea"
              :rows="4"
              v-model="dialogFormData.goodAd"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span='12'>
          <el-form-item label="商品介绍" prop="goodPrec">
            <el-input
              type="textarea"
              :rows="4" v-model="dialogFormData.goodPrec"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span='12'>
          <el-form-item label="出版社" prop="goodCommodityPress">
              <el-input v-model="dialogFormData.goodCommodityPress"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span='12'>
          <el-form-item label="库存" prop="goodLibSave">
            <el-input v-model="dialogFormData.goodLibSave"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span='12'>
          <el-form-item label="原价" prop="goodPrice">
            <el-input v-model="dialogFormData.goodPrice"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span='12'>
          <el-form-item label="在售价" prop="goodSellingPrice">
            <el-input v-model="dialogFormData.goodSellingPrice"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span='12'>
          <el-form-item label="书籍作者" prop="goodAuthor">
            <el-input v-model="dialogFormData.goodAuthor"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span='12'>
          <el-form-item label="商家名称" prop="storeName">
            <el-input v-model="dialogFormData.storeName"></el-input>
          </el-form-item>
        </el-col>
         <!-- 图片上传 -->
         <el-col :span='12'>
          <el-form-item label="图片" prop="goodImageUrl">
         <el-upload name="imageFile"
         action="http://springboottest.51vip.biz/pc/imageUpLoad/upLoadImage"
        :limit="1"
        :data="imgToken"
         v-model="dialogFormData.goodImageUrl"
         ref="upload"
        :on-success="handleAvatarSuccess"
        :before-remove="beforeRemove">
         <el-button size="small" type="primary">点击上传</el-button>
         </el-upload>
         <div class="imgAddress">
          <img :src="this.dialogFormData.goodImageUrl" v-show="this.dialogFormData.goodImageUrl">
          </div>
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
import req from '@/api/comm-manage.js'
import {validateNumber} from '@/api/validate.js'

export default {
  name: 'comm-manage',
  components: {
    ISearch,
    ITable,
    IDialog
  },
  data () {
    return {
      file: '',
      dialogTitle: '新增商品',
      fileList: [{name: '未选择任何文件'}],
      formData: {},
      roleOptions: [
        {label: '未发布', value: '1'},
        {label: '在售', value: '2'},
        {label: '下架', value: '3'},
        {label: '售空', value: '4'}
      ],
      dialogFormData: {
        goodName: '',
        goodIsbnBookSize: '',
        firstoption: '',
        goodSecondClas: '',
        goodAd: '',
        goodPrec: '',
        goodLibSave: '',
        goodPrice: '',
        goodSellingPrice: '',
        goodCommodityPress: '',
        goodAuthor: '',
        goodImageUrl: '',
        storeName: ''
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
            if (this.goodCode.length === 0) {
              this.dialogVisible = true
              this.dialogTitle = '新增商品'
              this.updateDialog = false
            } else {
              this.$message({
                type: 'warning',
                message: '新增商品信息,请不要勾选选项!'
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
            this.updateDialog = true
            if (this.goodCode.length === 0) {
              this.$message({
                type: 'info',
                message: '请先勾选您想要修改的数据'
              })
            } else if (this.goodCode.length > 1) {
              this.$message({
                type: 'info',
                message: '一次修改只能勾选一个选项进行修改'
              })
            } else {
              req('getComm', {
                goodCode: this.goodCode.join(',')
              }).then(data => {
                this.dialogFormData.goodImageUrl = data.data.goodImageUrl
                this.dialogFormData.firstoption = data.data.goodFirstClas
                this.dialogFormData.goodName = data.data.goodName
                this.dialogFormData.goodIsbnBookSize = data.data.goodIsbnBookSize
                this.dialogFormData.goodAd = data.data.goodAd
                this.dialogFormData.goodPrec = data.data.goodPrec
                this.dialogFormData.goodLibSave = String(data.data.goodLibSave)
                this.dialogFormData.goodPrice = String(data.data.goodPrice)
                this.dialogFormData.goodSellingPrice = String(data.data.goodSellingPrice)
                this.dialogFormData.goodCommodityPress = data.data.goodCommodityPress
                this.dialogFormData.goodAuthor = data.data.goodAuthor
                this.dialogFormData.storeName = data.data.storeName
                req('secondClass', {
                  classCode: this.dialogFormData.firstoption
                }).then(data => {
                  this.secondList = data.data
                })
                this.dialogFormData.goodSecondClas = data.data.goodSecondClas
              })
              this.dialogVisible = true
              this.dialogTitle = '修改商品'
              this.updateDialog = true
            }
          }
        },
        {
          btnName: '删除',
          state: '0',
          type: 'primary',
          func: () => {
            if (this.goodCode.length === 0) {
              this.$message({
                type: 'info',
                message: '请选择你想要删除的商品'
              })
            } else {
              this.$confirm('此操作将永久删除该商品，是否继续?').then(() => {
                req('delComm', {
                  goodCode: this.goodCode.join(',')
                }).then(data => {
                  if (data.code === 0) {
                    this.$message({
                      type: 'success',
                      message: '删除成功!'
                    })
                  } else {
                    this.$message({
                      type: 'error',
                      message: '删除成功!'
                    })
                  }
                  this.search()
                })
              })
            }
          }
        },
        {
          btnName: '上架',
          state: '0',
          type: 'primary',
          func: () => {
            if (this.goodCode.length === 0) {
              this.$message({
                type: 'info',
                message: '请选择你想要上架的商品'
              })
            } else {
              this.goodState = 2
              req('updateShelf', {
                goodCode: this.goodCode.join(','),
                goodState: this.goodState
              }).then(data => {
                if (data.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '上架成功!!'
                  })
                } else {
                  this.$message({
                    tyep: 'warning',
                    message: '上架失败，请重新尝试'
                  })
                }
                this.search()
              })
            }
          }
        },
        {
          btnName: '下架',
          state: '0',
          type: 'primary',
          func: () => {
            if (this.goodCode.length === 0) {
              this.$message({
                type: 'info',
                message: '请选择你想要下架的商品'
              })
            } else {
              this.goodState = 3
              req('updateShelf', {
                goodCode: this.goodCode.join(','),
                goodState: this.goodState
              }).then(data => {
                if (data.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '下架成功'
                  })
                } else {
                  this.$message({
                    tyep: 'warning',
                    message: '下架失败，请重新尝试'
                  })
                }
                this.search()
              })
            }
          }
        }
      ],
      columnList: [
        {label: '商品名称', prop: 'goodName', width: '140'},
        {label: '定价', prop: 'goodPrice', width: '70'},
        {label: '售价', prop: 'goodSellingPrice', width: '70'},
        {label: '销售量', prop: 'goodSaleNum', width: '70'},
        {label: '一级分类', prop: 'goodFirstClasName', width: '100'},
        {label: '二级分类', prop: 'goodSecondClasName', width: '100'},
        {label: '广告词', prop: 'goodAd', width: '250'},
        {label: '商品介绍', prop: 'goodPrec', width: '250'},
        {label: '商品状态', prop: 'goodState', width: '100', distName: 'roleOptions'},
        {label: '上架时间', prop: 'goodSaleTime', width: '170'},
        {label: '浏览量', prop: 'goodThroughNum', width: '70'},
        {label: '商家名称', prop: 'storeName', width: '140'},
        {label: '作者', prop: 'goodAuthor', width: '140'},
        {label: '库存', prop: 'goodLibSave', width: '70'},
        {label: 'isbn书号', prop: 'goodIsbnBookSize', width: '140'}
      ],
      tableData: [],
      formRules: {
        goodName: [
          {required: true, message: '请输入商品名称', trugger: 'change'}
        ],
        goodIsbnBookSize: [
          {required: true, message: '请输入书籍号', trugger: 'change'},
          {validator: validateNumber, trigger: 'blur'}
        ],
        goodSecondClas: [
          {required: true, message: '请输入分类', trugger: 'change'}
        ],
        goodAd: [
          {required: false, message: '请输入广告词', trugger: 'change'}
        ],
        goodPrec: [
          {required: false, message: '请输入商品介绍', trugger: 'change'}
        ],
        goodLibSave: [
          {required: true, message: '请输入库存', trugger: 'change'},
          {validator: validateNumber, trigger: 'blur'}
        ],
        goodPrice: [
          {required: true, message: '请输入定价', trugger: 'change'},
          {validator: validateNumber, trigger: 'blur'}
        ],
        goodSellingPrice: [
          {required: true, message: '请输入售价', trugger: 'change'},
          {validator: validateNumber, trigger: 'blur'}
        ],
        goodCommodityPress: [
          {required: true, message: '请输入商家名称', trugger: 'change'}
        ],
        goodAuthor: [
          {required: true, message: '请输入', trugger: 'change'}
        ],
        goodImageUrl: [
          {required: false, message: '请输入', trugger: 'change'}
        ],
        firstoption: [
          {required: false, message: '请输入', trugger: 'change'}
        ],
        storeName: [
          {required: true, message: '请输入', trugger: 'change'}
        ]
      },
      goodCode: [],
      goodState: '',
      firstList: '',
      secondList: '',
      updateDialog: false,
      imgToken: {access_token: JSON.parse(sessionStorage.getItem('userInfo')).access_token}

    }
  },
  mounted () {
    this.fetch()
    this.getFirstClass()
  },
  methods: {
    // 每次定义fetch函数中的页数和size
    fetch () {
      this.pageInfo.pageIndex = 1
      this.pageInfo.pageSize = 5
      this.search()
    },
    // 搜索
    search () {
      req('getTableComm', {
        ...this.formData,
        pageNum: this.pageInfo.pageIndex,
        pageSize: this.pageInfo.pageSize
      }).then(data => {
        console.log(data)
        if (data.code === 0) {
          this.tableData = data.data.list
          this.pageInfo.pageIndex = data.data.pageNum
          this.pageInfo.pageSize = data.data.pageSize
          this.pageInfo.total = data.data.total
        } else {
          this.tableData = []
          this.$message({
            type: 'info',
            message: '查询的范围内没有对应的值，请重新查询!'
          })
        }
      })
    },
    // 重置
    reset () {
      this.formData.goodName = ''
      this.formData.goodState = '0'
      this.formData.goodAd = ''
      this.formData.goodCommodityPress = ''
      this.formData.goodAuthor = ''
      this.fetch()
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
    // 多选框事件
    handleSelection (val) {
      this.goodCode = []
      val.forEach(item => {
        this.goodCode.push(item.goodCode)
      })
      if (val.length === 1) {
      } else {
        this.dialogFormData.goodName = ''
        this.dialogFormData.goodIsbnBookSize = ''
        this.dialogFormData.goodSecondClas = ''
        this.dialogFormData.goodAd = ''
        this.dialogFormData.goodPrec = ''
        this.dialogFormData.goodLibSave = ''
        this.dialogFormData.goodPrice = ''
        this.dialogFormData.goodSellingPrice = ''
        this.dialogFormData.goodCommodityPress = ''
        this.dialogFormData.goodAuthor = ''
        this.dialogFormData.storeName = ''
      }
    },
    // 关闭清空表单
    dialogBeforeClose () { // 关闭清空表单
      this.$refs.form.resetFields()
    },
    // dialog取消事件
    dialogCancel () {
      this.dialogVisible = false
      this.$refs.form.resetFields()
      this.$refs.upload.clearFiles()
      this.dialogFormData.goodImageUrl = ''
    },
    // 一半新增 一半更新
    dialogconfirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.updateDialog === false) {
            req('addComm', {
              goodName: this.dialogFormData.goodName,
              goodIsbnBookSize: this.dialogFormData.goodIsbnBookSize,
              goodSecondClas: this.dialogFormData.goodSecondClas,
              goodAd: this.dialogFormData.goodAd,
              goodPrec: this.dialogFormData.goodPrec,
              goodLibSave: this.dialogFormData.goodLibSave,
              goodPrice: this.dialogFormData.goodPrice,
              goodSellingPrice: this.dialogFormData.goodSellingPrice,
              goodCommodityPress: this.dialogFormData.goodCommodityPress,
              goodAuthor: this.dialogFormData.goodAuthor,
              goodImageUrl: this.dialogFormData.goodImageUrl,
              storeName: this.dialogFormData.storeName
            }).then(data => {
              if (data.code === 0) {
                this.$message({
                  type: 'success',
                  message: '新增商品成功!!'
                })
                this.search()
              } else {
                this.$message({
                  type: 'info',
                  message: '该书号或商品名称已重复,请重新输入信息!'
                })
              }
              this.$refs.upload.clearFiles()
              this.dialogFormData.goodImageUrl = ''
            })
          } else {
            req('updateComm', {
              goodName: this.dialogFormData.goodName,
              goodIsbnBookSize: this.dialogFormData.goodIsbnBookSize,
              goodSecondClas: this.dialogFormData.goodSecondClas,
              goodAd: this.dialogFormData.goodAd,
              goodPrec: this.dialogFormData.goodPrec,
              storeName: this.dialogFormData.storeName,
              goodLibSave: this.dialogFormData.goodLibSave,
              goodCommodityPress: this.dialogFormData.goodCommodityPress,
              goodAuthor: this.dialogFormData.goodAuthor,
              goodPrice: this.dialogFormData.goodPrice,
              goodSellingPrice: this.dialogFormData.goodSellingPrice,
              goodImageUrl: this.dialogFormData.goodImageUrl,
              goodCode: this.goodCode.join(',')
            }).then(data => {
              if (data.code === 0) {
                this.$message({
                  type: 'success',
                  message: '修改成功!'
                })
              } else {
                this.$message({
                  type: 'warning',
                  message: '书号或商品名称重复，请重新输入!'
                })
              }
              this.$refs.upload.clearFiles()
              this.search()
            })
          }
          this.dialogVisible = false
          this.dialogFormData.goodImageUrl = ''
          this.$refs.form.resetFields()
        } else {
        }
      })
    },
    // 数据库num与汉字对应
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
    // 获取第一分类
    getFirstClass () {
      req('firstClass', {
      }).then(data => {
        this.firstList = data.data
      })
    },
    // 获取第二分类
    getSecondClass () {
      req('secondClass', {
        classCode: this.dialogFormData.firstoption
      }).then(data => {
        if (this.secondList.length === 0) {
          this.secondList = data.data
        } else {
          this.dialogFormData.goodSecondClas = ''
          this.secondList = data.data
        }
      })
    },
    // 图片上传成功事件
    handleAvatarSuccess (res) {
      this.dialogFormData.goodImageUrl = res.data.imageUrl
    },
    // 图片被移除事件
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    }
  }
}
</script>

<style lang="scss" scoped>
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
  position: absolute;
  left: 30%;
  top: -8%;
  img {
    width: 50px;
    height: 50px;
  }
}
</style>
