<template>
  <div class="login_container">

    <login-nav></login-nav>

    <el-row class="content">
      <el-col :span="16" class="image_container">
        <img src="@/assets/login.png" alt="login">
      </el-col>
      <el-col :span="8">
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          auto-complete="on"
          label-position="left"
        >
          <h3 class="title">管理员账号登录</h3>
          <el-form-item prop="jobNumber">
            <span class="svg-container">
              <svg-icon icon-class="user"/>
            </span>
            <el-input
              v-model.trim="loginForm.jobNumber"
              name="jobNumber"
              type="text"
              auto-complete="on"
              placeholder="人员编号（10位）/学号（ID）"
            />
          </el-form-item>

          <el-form-item prop="password" class="password">
            <span class="svg-container">
              <svg-icon icon-class="password"/>
            </span>
            <el-input
              :type="pwdType"
              v-model.trim="loginForm.password"
              name="password"
              auto-complete="on"
              placeholder="请输入密码（Password)"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="pwdType === 'password' ? 'eye' : 'eye-open'"/>
            </span>
          </el-form-item>

          <div class="reset_password" @click="toInitPsd">初始化密码/重置密码</div>

          <el-form-item class="btn_container">
            <el-button
              :loading="loading"
              type="primary"
              style="width:100%;"
              @click.native.prevent="handleLogin"
            >登录</el-button>
          </el-form-item>
          <!-- <div class="tips">
            <span style="margin-right:20px;">jobNumber: admin</span>
            <span> password: admin</span>
          </div>-->
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { isvalidUsername } from "@/utils/validate";
import { mapState } from "vuex";
import LoginNav from './components'

export default {
  name: "Login",
  components: { LoginNav },
  data() {
    const validatePsd = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入密码"));
      } else if (!this.$reg.psd.test(value)) {
        callback(new Error("请输入8-20位字母、数字或符号的密码"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        jobNumber: "",
        password: ""
      },
      loginRules: {
        jobNumber: [
          { required: true, message: "请输入用户名", trigger: "change" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "change" },
          { validator: validatePsd, trigger: "blur" }
        ]
      },
      loading: false,
      pwdType: "password",
      redirect: undefined
    };
  },
  computed: {
    ...mapState(["permission"])
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.login();
          // this.$store.dispatch('setUserInfo', this.loginForm).then(() => {
          //   this.loading = false
          //   this.$router.push({ path: this.redirect || '/' })
          // }).catch(() => {
          //   this.loading = false
          // })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async autoLogin(){
      const res = await this.$post('AUTO_LOGIN', { encrypt: decodeURIComponent(this.$route.query.encrypt) });
      if(res.returnCode === '1000') {
        console.log('res', res);
      } else {
        return this.$message.error(res.message);
      }
    },
    async login() {
      // console.log('123');
      const res = await this.$post("sysLogin", {
        jobNumber: this.loginForm.jobNumber,
        password: '25d55ad283aa400af464c76d713c07ad'
      });
      
      if (res.returnCode === "1000") {
        this.$store.dispatch("setUserInfo", res.dataInfo);
        this.getMenu();
      } else {
        this.$message.error(res.message);
      }
      // console.log('123124');
      this.loading = false;
    },
    async getMenu() {
      const res = await this.$post("sysMenuNav", {});
      // this.loading = false;
      if (res.returnCode === "1000") {
        console.log(res.dataInfo);
        this.$store.dispatch("setResMenu", res.dataInfo);
        this.$store
          .dispatch("GenerateRoutes", res.dataInfo)
          .then(() => {
            this.$router.addRoutes(this.permission.addRouters);
            this.$router.push('/menu');
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.$message.error(res.message);
      }
    },
    toInitPsd(){
      this.$router.push('/initPassword');
    },
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
// $bg:#2d3a4b;
$bg: #185d91;
$dark_gray: #889aa4;
$light_gray: #2e2e2e;
$radius: 5px;
.login_container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .content{
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    width: 75%;
    height: 390px;
    margin: 0 auto;
    display: flex;
    transform: translateY(-50%);
    .image_container {
      img{
        width: 100%;
        height: 390px;
        border-top-left-radius: $radius;
        border-bottom-left-radius: $radius;
      }
    }
    .login-form {
      height: 390px;
      padding: 35px 35px 15px 35px;
      background-color: #fff;
      border-top-right-radius: $radius;
      border-bottom-right-radius: $radius;
      .password {
        margin-bottom: 10px;
      }
      .reset_password{
        padding-right: 5px;
        margin-bottom: 40px;
        text-align: right;
        font-size: 14px;
        line-height: 20px;
        color: #196EAE;
        cursor: pointer;
      }
    }
    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;
      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 30px auto;
      text-align: center;
      font-weight: normal;
    }
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
  }
  @media screen and (max-width: 1300px) {
    .content{
      height: 360px;
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss">
// $bg:#2d3a4b;
$bg: #185d91;
$light_gray: #2e2e2e;
$radius: 5px;

/* reset element-ui css */
.login_container {
  .content{
    .el-form-item__content{
      display: flex;
      align-items: center;
    }
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
      input {
        // background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        &:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px #fff inset !important;
          // -webkit-text-fill-color: #fff !important;
        }
      }
    }
    .el-form-item {
      border: 1px solid #999;
      border-radius: $radius;
      color: #2E2E2E;
    }
    .btn_container{
      border: none;
      .el-form-item__content{
        button{
          outline-color: #196EAE;
          background-color: #196EAE;
          border-color: #196EAE;
          outline: none;
        }
      }
    }
  }
}
</style>
