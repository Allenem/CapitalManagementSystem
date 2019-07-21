<template>
  <header class="head-nav">
    <el-row>
      <el-col :span="6" class="logo-container">
        <img src="../assets/coin.png" alt="" class="logo">
        <span class="title">Allenem资金管理系统</span>
      </el-col>

      <el-col :span="6" class="user">
        <div class="userinfo">
          <img :src="user.avatar" class="avatar" alt="">
          <div class="welcome">
            <p class="name comename">欢迎</p>
            <p class="name username">{{ user.name }}</p>
          </div>
          <span class="arrow">
            <el-dropdown trigger="click" @command="setDialogInfo">
              <span class="el-dropdown-link">
                <i class="el-icon-caret-bottom el-icon-right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="info">个人信息</el-dropdown-item>
                <el-dropdown-item command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </div>
      </el-col>
    </el-row>
  </header>
</template>

<script>
  export default {
    name: "head-nav",
    computed: {
      user(){
        return this.$store.getters.user;
      }
    },
    methods: {
      setDialogInfo(cmdItem){
        // console.log(cmdItem);
        switch(cmdItem){
          case "info":
            this.showInfoList();
            break;
          case "logout":
            this.logout();
            break;
        }
      },
      showInfoList(){
        // console.log('个人信息');
        // 跳转
        this.$router.push('/infoshow');
      },
      logout(){
        // console.log('退出');
        // 清楚token
        localStorage.removeItem('eleToken');
        // 设置vuex store
        this.$store.dispatch('clearCurrentState');
        // 跳转
        this.$router.push('/login');
      }
    },
  }
</script>

<style scoped>

.head-nav{
  width: 100%;
  height: 60px;
  min-width: 600px;
  padding: 5px;
  background: #324057;
  color: #fff;
  border-bottom: 1px solid #1f2d3d;
}
.logo-container{
  line-height: 60px;
  min-width: 400px;
}
.logo{
  height: 50px;
  width: 50px;
  margin-right: 5px;
  vertical-align: middle;
  display: inline-block;
}
.title{
  vertical-align: middle;
  font-size: 22px;
  font-family: 'Microsoft YaHei';
  letter-spacing: 3px;
}
.user{
  line-height: 60px;
  float: right;
  text-align: right;
  padding-right: 10px;
}
.avatar{
  width: 40px;
  height: 40px;
  border-radius: 50%;
  vertical-align: middle;
  display: inline-block;
}
.welcome{
  display: inline-block;
  width: auto;
  vertical-align: middle;
  /* padding: 0 5px; */
  margin-left: 10px;
}
.name{
  line-height: 20px;
  text-align: center;
  font-size: 14px;
}
.comename{
  font-size: 12px;
}
.username{
  color: #409eff;
  font-weight: bolder;
}
.arrow{
  cursor: pointer;
  margin: 0 10px;
}
.el-dropdown{
  color: #fff;
}
</style>