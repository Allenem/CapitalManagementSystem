<template>
  <div class="index">
    <HeadNav></HeadNav>
    <LeftMenu></LeftMenu>
    <div class="rightContainer"><router-view/></div>
  </div>
</template>

<script>
  import HeadNav from '../components/HeadNav';
  import LeftMenu from '../components/LeftMenu';
  export default {
    name: "index",
    components: {
      HeadNav,
      LeftMenu
    }
  }
</script>

<style scoped>
.index{
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.rightContainer{
  position: relative;
  top: 0;
  left: 180px;
  right: 0;
  width: calc(100% - 180px); /* 用calc加减乘除符号前后必须留空格！！！ */
  height: calc(100% - 71px); /* 用calc加减乘除符号前后必须留空格！！！ */
  overflow: auto;
}
</style>