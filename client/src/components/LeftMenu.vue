<template>
  <el-row class="menu_page">
    <el-col>
      <el-menu
        class="el-menu-vertical-demo"
        background-color="#324057"
        text-color="#fff"
        active-text-color="#409eff">
        <router-link to="/home">
          <el-menu-item index="0">
            <i class="fa fa-margin fa-server"></i>
            <span slot="title">首页</span>
          </el-menu-item>
        </router-link>

        <template v-for="item in items">
          <el-submenu v-if="item.children" :index="item.path" :key="item.path">
            <template slot="title">
              <i :class="'fa fa-margin '+item.icon"></i>
              <span slot="title">{{item.name}}</span>
            </template>
            <router-link v-for="(citem,cindex) in item.children" :to="citem.path" :key="cindex">
              <el-menu-item :index="citem.path">
                <i :class="'fa fa-margin '+citem.icon"></i>
                <span slot="title">{{ citem.name }}</span>
              </el-menu-item>
            </router-link>
          </el-submenu>
        </template>

      </el-menu>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    name: "left-menu",
    data(){
      return {
        items: [
          {
            icon: 'fa-money',
            name: '资金管理',
            path: 'fund',
            children: [
              {path:'fundlist',icon: 'fa-credit-card-alt',name:'资金流水'},
              {path:'changelist',icon: 'fa-credit-card',name:'修改记录'}
            ]
          },
          {
            icon: 'fa-asterisk',
            name: '信息管理',
            path: 'info',
            children: [
              {path:'infoshow',icon: 'fa-user',name:'个人信息'},
              {path:'userlist',icon: 'fa-user-plus',name:'全员信息'}
            ]
          }
        ]
      };
    }
  };
</script>

<style scoped>
.menu_page{
  position: fixed;
  top: 71px;
  left: 0;
  min-height: 100%;
  background-color: #324057;
  z-index: 99;
}
.el-menu{
  border: none;
}
.fa-margin{
  margin-right: 5px;
}
.el-menu-vertical-demo:not(.el-menu-collapse){
  width: 180px;
  min-height: 400px;
}
.el-menu-vertical-demo{
  width: 35px;
}
.el-submenu .el-menu-item{
  min-width: 180px;
}
.hiddenDropdown,
.hiddenDropname{
  display: none;
}
a{
  text-decoration: none;
}
</style>