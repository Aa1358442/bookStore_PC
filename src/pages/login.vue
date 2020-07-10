<template>
    <div class="login">
        <el-form :model="ruleForm2" :rules="rules2"
         status-icon
         ref="ruleForm2"
         label-position="left"
         label-width="0px"
         class="demo-ruleForm login-page">
            <h3 class="title">请登录</h3>
            <el-form-item prop="username">
                <el-input type="text"
                   class="input1"
                    v-model="ruleForm2.username"
                    placeholder="请输入用户名"
                ></el-input>
            </el-form-item>
             <el-form-item prop="password">
                    <el-input type="password"
                        class="input2"
                        v-model="ruleForm2.password"
                        placeholder="请输入密码"
                    ></el-input>
                </el-form-item>
            <el-form-item style="width:100%;">
                <el-button type="primary"  @click="login">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import axios from 'axios'
import req from '@/api/login.js'
const qs = require('qs')

export default {
  name: 'login',
  data () {
    return {
      logining: false,
      currentState: '',
      ruleForm2: {
        username: '',
        password: ''
      },
      rules2: {
        username: [{required: true, message: '请输入你的账号', trigger: 'blur'}],
        password: [{required: true, message: '请输入你的密码', trigger: 'blur'}]
      }
    }
  },
  methods: {
    login () {
      axios({
        method: 'post',
        url: 'http://springboottest.51vip.biz/uaa/auth/form',
        data: qs.stringify(this.ruleForm2),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(data => {
        if (data.data.code === 0) {
          sessionStorage.setItem('userInfo', JSON.stringify(data.data.data))
          req('getuserdata')
            .then(data => {
              if (data.code === 10000) {
                this.$message({
                  type: 'error',
                  message: '该用户无法访问管理页面'
                })
              }
              sessionStorage.setItem('key', data.data.userRole)
              if (data.data.userRole === 1) {
                this.$message({
                  type: 'success',
                  message: '登录成功'
                })
                this.$router.push({path: '/client-manage'})
              } else if (data.data.userRole === 0) {
                this.$message({
                  type: 'success',
                  message: '登录成功'
                })
                this.$router.push({path: '/home'})
              } else {
                this.$message({
                  type: 'error',
                  message: '该用户无法访问管理页面'
                })
              }
            })
        } else {
          this.$message({
            type: 'error',
            message: data.data.msg
          })
        }
      })
    }
  }
}
</script>

<style lang = "scss" scoped>
.login {
    background: url('../assets/u0.jpg');
    width: 100%;
    height: 100%;
    position: fixed;
    background-size: 100% 100%;
    .el-button {
        width: 40%;
        height: 25%;
        box-sizing: border-box;
        margin: 0 30%;
        border-radius: 8px;
    }
    .title {
        padding-left: 45%;
        margin-top: 5%;
        margin-bottom: 5%;
        opacity:0.35;
        text-shadow: 5px 5px 5px #ffffff;
    }
    .box {
        width: 400px;
        height: 350px;
        background: #aaaaaa;
    }
    .login-page {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    opacity:0.9;
}
label.el-checkbox.rememberme {
    margin: 0px 0px 15px;
    text-align: left;
}
 /deep/ .el-form-item .el-form-item__content .el-input .el-input__inner {
    height: 45px;
    border-radius: 10px;
}
}
</style>
