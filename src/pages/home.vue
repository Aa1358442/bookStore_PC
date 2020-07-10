<template>
    <div>
        <el-container>
            <el-header>
                <router-link to="/">行走书店管理系统</router-link>

            <div class="header-right">
              <el-popover
                  placement="top"
                  v-model="visible">
                  <el-button size="mini" type="text" @click="signOut">退出登录</el-button>
                  <div slot="reference" class="finally">
              <div class="user-img">
                <img v-show="this.userImageUrl" :src="this.userImageUrl" alt="">
                 <img v-show="!this.userImageUrl" src="../assets/u18.jpg" alt="">
            </div>
            <span>{{this.userName}}</span>
                  </div>
             </el-popover>
            </div>
            </el-header>

        <el-container>
            <el-aside width="200px">
                <el-menu @select="handlerSelect">
                    <el-menu-item v-for="(item,index) in menuList" :index="item.menuUrl" :key="index">
                        <span slot="title">{{item.menuName}}</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
        </el-container>
    </div>
</template>

<script>
import req from '@/api/menu-manage.js'

export default {
  name: 'home',
  data () {
    return {
      userName: '',
      visible: false,
      userImageUrl: '',
      role: sessionStorage.getItem('key'),
      menuList: [
      ]
    }
  },
  mounted () {
    this.getRoleMenu()
    this.getMessage()
  },
  methods: {
    signOut () {
      this.$router.push({path: '/login'})
      sessionStorage.clear('userInfo')
      sessionStorage.clear('key')
      sessionStorage.clear('state')
    },
    handlerSelect (key, path) {
      if (key !== this.$route.path) {
        this.$router.replace({path: key})
      }
    },
    getRoleMenu () {
      req('RoleMenu', {
        role: this.role
      }).then(data => {
        this.menuList = data.data.menuCodeList
      })
    },
    getMessage () {
      req('getuserdata', {
        role: this.role
      }).then(data => {
        if (data.code === 0) {
          this.userName = data.data.userName
          this.userImageUrl = data.data.userImageUrl
        } else {
          this.$message({
            type: 'error',
            message: '获取头像信息失败!请重新尝试'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgb(242,242,242);

.router-link-active {
    font-size: 25px;
    color: #409EFF;
    text-decoration: none;
}
}
.header-right {
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    color: rgb(86,163,254);
    font-weight: bold;
    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
}
/deep/.finally {
  display: flex!important;
  justify-content: center;
  align-items: center;
}
</style>
