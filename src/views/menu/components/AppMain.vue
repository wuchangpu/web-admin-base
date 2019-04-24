<template>
  <section class="app-main">
    <!-- <div class="main-top">
      <span>当前位置：</span>
      <breadcrumb />
    </div> -->
    <transition name="fade-transform" mode="out-in">
      <!-- or name="fade" -->
      <!-- <router-view :key="key"></router-view> -->
      <router-view class="content-container"/>
    </transition>
  </section>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
export default {
  components: {
    Breadcrumb,
  },
  name: 'AppMain',
  computed: {
    // key() {
    //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    // }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /*50 = navbar  */
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background-color: #F9F9F9;
  padding: 94px 30px 0 30px;
  .main-top{
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    padding: 0 20px;
    span{
      font-size: 14px;
      line-height: 38px;
    }
  }
  .content-container{
  }
}
</style>
