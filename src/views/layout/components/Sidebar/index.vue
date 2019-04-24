<template>
  <el-scrollbar wrap-class="scrollbar-wrapper" class="sidebar_container">
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      :background-color="variables.menuBg"
      :text-color="variables.menuText"
      :active-text-color="variables.menuActiveText"
      mode="vertical"
      @close="onCloseMenu"
      ref="menu"
    >
      <el-submenu index="1" v-if="blockPathName === 'creator'">
        <template slot="title">创客空间管理系统</template>

        <sidebar-item v-for="route in permissions" :key="route.path" :item="route" :base-path="route.path"/>
      </el-submenu>

      <sidebar-item v-else v-for="route in permissions" :key="route.path" :item="route" :base-path="route.path"/>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import variables from '@/styles/variables.scss'
import SidebarItem from './SidebarItem'

export default {
  data () {
    return {
      blockPathName: ''
    }
  },
  components: { SidebarItem },
  computed: {
    ...mapGetters([ 'sidebar' ]),
    ...mapState([ 'permission' ]),
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    },

    permissions () {

      const filtedPermission = this.permission.routers.filter(current => {
        if(current.hidden) return true;
        if(current.path === '/' + this.blockPathName) {
          return true;
        }
      });

      return filtedPermission;
    }
  },

  created () {
    this.handleRouteChange();
  },

  watch: {
    '$route' () {
      this.handleRouteChange();
    }
  },

  methods: {
    onCloseMenu (index) {
      if(index === '1') {
        this.$refs.menu.open(index);
      }
      
    },

    handleRouteChange () {
      console.log(this.$route.path.split('/')[1],  this.blockPathName);
      if(this.$route.path.split('/')[1] === this.blockPathName) return;
      this.blockPathName = this.$route.path.split('/')[1];
      
    },
  }
}
</script>

<style lang="scss">
.sidebar_container{
  .el-submenu__title, .el-menu-item{
    display: flex;
    align-items: center;
    svg{
      flex-shrink: 0;
    }
  }
}
</style>
