<template>
  <el-menu mode="horizontal" class="navbar" :class="{'navbar_hamburger_close':!sidebar.opened}">
    <el-row>
      <el-col :span="15">
        <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger_container"/>
        <div class="logo_contianer">
          <img src="@/assets/logo.png" class="logo" alt="logo">
          <!-- <span class="text_left">智慧华中大</span>
          <span class="text_center"></span>
          <span class="text_right">招生宣传干部管理系统（测试）</span> -->
        </div>
      </el-col>
    </el-row>
    
    <div :span="9" class="avatar_container">
      <div class="avatar_wrapper">
        欢迎！
        <div class="avatar__wrap">
          <img v-if="userInfo.user.headImg" :src="imageBaseUrl + userInfo.user.headImg" />
          <img v-else src="@/assets/avatar.png" class="user_avatar" alt="avatar">
        </div>
        {{ userInfo.user.username }} 老师
        <!-- <el-popover
          placement="bottom"
          trigger="click"
          content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
          <p>姓名：{{ userInfo.user.username }}</p>
          <p>工号：{{ userInfo.user.jobNumber }}</p>
          <p>身份证号：{{ userInfo.user.idCard }}</p>
          <p>联系方式：{{ userInfo.user.mobile }}</p>
          <p>角色：{{ userInfo.user.roleName }}</p>
          <p style="display:flex;justify-content:space-around">
            <el-button type="primary" size="mini" @click="editInfo">修改信息</el-button>
            <el-button size="mini" @click="changePsd">修改密码</el-button>
          </p>
          <i class="el-icon-caret-bottom" slot="reference"/>
        </el-popover> -->
        <span class="line-center"></span>
        <span class="quit" @click="logoutBtnClick">
          <svg-icon icon-class="hk_quit" /> &nbsp;退出
        </span>
      </div>
    </div>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Hamburger from '@/components/Hamburger'
import { imageBaseUrl } from '@/config';

export default {
  data () {
    return {
      imageBaseUrl
    }
  },
  components: {
    Hamburger
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'userInfo']),
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logoutBtnClick() {
      this.$confirm('确定退出登录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.logout();
      }).catch(() => {});
    },
    async logout(){
      const res = await this.$post('sysLogout', { userId: this.userInfo.user.userId });
      if(res.returnCode === '1000'){
        window.sessionStorage.clear();
        window.location.reload();
        this.$router.replace('/login');
      } else {
        this.$message.error(res.message);
      }
    },
    editInfo(){
      document.body.click();
      this.$router.push('/userInfo/edit');
    },
    changePsd(){
      document.body.click();
      this.$router.push('/userInfo/password');
    },
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '@/styles/variables.scss';
.navbar {
  position: fixed;
  top: 0;
  // width: calc(100vw - #{$sideBarWidth});
  width: 100vw;
  z-index: 999;
  height: 70px;
  line-height: 70px;
  border-radius: 0px !important;
  background: #0077FF;
  color: #666666;
  &.navbar_hamburger_close{
    width: 100vw;
  }
  .logo_contianer{
    display: flex;
    align-items: center;
    padding-left: 50px;
    .logo{
      height: 70px;
    }
    .text_left{
      color: #185D91;
      font-size: 20px;
      font-weight: bolder;
    }
    .text_center{
      display: inline-block;
      height: 20px;
      margin: 0 15px;
      border-right: 1px solid #185D91;
    }
    .text_right{
      font-size: 18px;
    }
  }
  .hamburger_container {
    line-height: 80px;
    height: 70px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar_container {
    position: fixed;
    right: 0;
    top: 0;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .avatar_wrapper {
      display: flex;
      align-items: center;
      font-size: 14px;
      line-height: 20px;
      padding-right: 50px;
      color: #fff;

      .avatar__wrap {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: inline-block;
        overflow: hidden;
        margin: 0 .2rem;
        img {
          width: 100%;
          height: 100%;
          display: block;
        }
      }
      .user_avatar {
        width: 46px;
        height: 46px;
        // margin: 0 15px 0 10px;
        border-radius: 50%;
      }
      .el-icon-caret-bottom {
        cursor: pointer;
      }
      .line-center{
        display: inline-block;
        height: 14px;
        margin: 0 15px;
        border-right: 1px solid #D6D6D6;
      }
      .quit{
        cursor: pointer;
      }
    }
    .user-dropdown{
      top: 54px!important;
    }
  }
}
</style>

