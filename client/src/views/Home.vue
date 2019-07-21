<template>
  <div class="home">
    <div class="container">
      <h1 class="title">Allenem资金管理系统</h1>
      <p class="lead">专注学习，了解Vue,React,Nodejs！</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "home",
    components: {}
  }
</script>

<style scoped>
.home{
  width: 100%;
  height: 100%;
  background: url(../assets/showcase.jpg) no-repeat;
  background-size: 100% 100%;

}
.container{
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-top: 30vh;
  background-color: rgba(0,0,0,.3);
  text-align: center;
  color: #fff;
}
.title{
  font-size: 30px;
}
.lead{
  margin-top: 50px;
  font-size: 22px;
}
</style>