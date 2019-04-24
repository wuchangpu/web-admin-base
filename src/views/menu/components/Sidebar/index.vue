<template>
  <el-scrollbar wrap-class="scrollbar-wrapper" class="sidebar_container">
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="#fff"
      text-color="#b3b3b3"
      active-text-color="#0077FF"
      mode="vertical"
      :router="true"
    >
      <el-menu-item text-color="#b3b3b3" index="/menu/creator">
        创客空间管理系统
      </el-menu-item>

      <el-menu-item text-color="#b3b3b3" index="/menu/project">
        工程训练管理信息系统
      </el-menu-item>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import variables from '@/styles/variables.scss'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([ 'sidebar' ]),
    ...mapState([ 'permission' ]),
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>

<style lang="scss">
.sidebar_container{
  .el-submenu__title, .el-menu-item{
    display: flex;
    align-items: center;
    &:hover {
      background: #fff!important;
    }
    svg{
      flex-shrink: 0;
    }
  }
}
</style>
