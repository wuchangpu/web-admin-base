<template>
<div class="menu__wrap">
  <el-row>
    <el-col :span="8">
      <div class="wrap">
        <div class="img">
          <img src="@/assets/avatar.png" />
        </div>
        <span>审核加工预约申请详情</span>
      </div>
    </el-col>
    <el-col :span="8">
      <div class="wrap">
        <div class="img">
          <img src="@/assets/avatar.png" />
        </div>
        <span>审核加工预约申请详情</span>
      </div>
    </el-col>
    <el-col :span="8">
      <div class="wrap">
        <div class="img">
          <img src="@/assets/avatar.png" />
        </div>
        <span>审核加工预约申请详情</span>
      </div>
    </el-col>
    
  </el-row>
  
</div>
</template>

<script>
export default {
  data () {
    return {

    }
  },

  methods: {
    onClickToRoute (name) {
      this.$router.push({ name });
    }
  }
}
</script>

<style lang="scss" scoped>
.menu__wrap {
  padding: 40px 51px;
  background: #FCFDFF;
  font-size: 14px;

  .el-row {
    padding: 0;
    margin: 0;
    &::after {
      content: '';
      display: block;
      visibility: hidden;
      clear: both;
    }
    .el-col {

      .wrap {
        .img {
          width: 48px;
          height: 48px;
          margin-right: 32px;
          flex-basis: 48px;
          
          img {
            width: 100%;
            height: 100%;
            display: block;
          }
        }

        box-shadow: 0 9px 13px 0 rgba(31,92,157,0.08);
        border-radius: 6px;
        list-style: none;
        // width: 100%;
        max-width: 280px;
        background: #fff;
        padding: 10px 28px;
        height: 80px;
        display: flex;
        align-items: center;
        // margin: 20px 80px 20px 0;
        margin: 20px 0;

        span {
          color: #1a1a1a;
          flex-basis: 123px;
        }
      }

      cursor: pointer;

      
      
      
    }
  }

  
}

.page__layout {
  .header {
    background: #fff;
    padding: 10px 20px;
    font-size: 14px;
    border-radius: 4px;

    .bold {
      font-weight: bolder;
    }
  }

  .content {
    padding: 40px 20px;
    background: #fff;
    margin-top: 20px;
    border-radius: 4px;

    .pagination {
      text-align: right;
    }
  }

  
}
</style>