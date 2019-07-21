<template>
  <div class="infoshow">
    <el-row type="flex" class="row-bg" justify="center">
      <el-col :span='8'>
        <div class="user">
          <img :src="user.avatar" class="avatar" alt="">
        </div>
      </el-col>
      <el-col :span='16'>
        <div class="userinfo">
          <div class="user-item">
            <i class="el-icon-user">用户：</i>
            <span>{{ user.name }}</span>
          </div>
          <div class="user-item">
            <i class="el-icon-setting">身份：</i>
            <span v-if="this.user.identity == 'manager'">管理员</span>
            <span v-else-if="this.user.identity == 'employee'">普通员工</span>
            <span v-else>无身份</span>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "infoshow",
    computed: {
      user(){
        return this.$store.getters.user;
      }
    },
  }
</script>

<style scoped>
.infoshow{
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
.row-bg{
  width: 100%;
  height: 100%;
}
.user{
  text-align: center;
  position: relative;
  top: 30%;
}
.user img{
  width: 150px;
  border-radius: 50%;
}
.user span{
  display: block;
  text-align: center;
  margin-top: 20px;
  margin-left: 10px;
  font-size: 20px;
  font-weight: bold;
}
.userinfo{
  height: 100%;
  background-color: #eee;
}
.user-item{
  position: relative;
  top: 30%;
  padding: 26px;
  font-size: 28px;
  color: #333;
}
.user-item>i{
  margin-right: 10px;
}
</style>