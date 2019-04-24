<template>
  <div class="login_nav">
    <el-row class="top">
      <el-col :span="15">
        <div class="logo_contianer">
          <img src="@/assets/logo.png" class="logo" alt="logo">
          <!-- <span class="text_left">智慧华中大</span> -->
          <!-- <span class="text_center"></span> -->
          <!-- <span class="text_right">招生宣传干部管理系统（测试）</span> -->
        </div>
      </el-col>

      <el-col :span="9" class="avatar_container">
        <div class="avatar_wrapper">
          <!-- <div class="img">
            <img />
          </div>

          <dl class="info">
            <dt>姓名：</dt>
            <dd></dd>
          </dl>

          <dl class="info">
            <dt>单位：</dt>
            <dd></dd>
          </dl>

          <dl>
            <dd>注销</dd>
          </dl> -->
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  
}
</script>

<style lang="scss" scoped>
.login_nav{
  .top{
    width: 100%;
    background-color: #0077FF;
    box-shadow: 0 0 1px 1px rgba(0,0,0,0.1);
    .logo_contianer{
      display: flex;
      align-items: center;
      padding-left: 50px;
      // height: 84px;
      .logo{
        // height: 36px;
        width: 242px;
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
    .avatar_container {
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

        .img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          margin-right: 14px;

          img {
            width: 100%;
            height: 100%;
            display: block;
          }
        }

        .info {
          margin-right: 27px;
        }
        .today{
          display: inline-block;
          margin-right: 25px;
        }
      }
    }
  }
  @media screen and (max-width: 1300px) {
    .top {
      .logo_contianer{
        height: 70px;
      }
      .avatar_container {
        height: 70px;
      }
    }
  }
}
</style>
