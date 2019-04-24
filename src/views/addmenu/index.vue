<template>
  <div class="menu_management">
    <el-form :model="formData" label-width="120px">
      <el-form-item label="菜单名称：">
        <el-input v-model="formData.menuName" />
      </el-form-item>

      <el-form-item label="排序：">
        <el-input v-model="formData.orderNum" />
      </el-form-item>

      <el-form-item label="父级ID：">
        <el-input v-model="formData.parentId" />
      </el-form-item>

      <el-form-item label="菜单类型：">
        <el-radio-group v-model="formData.menuType">
          <el-radio label="0">目录</el-radio>
          <el-radio label="1">菜单</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="菜单 URL：">
        <el-input v-model="formData.url" />
      </el-form-item>

      <el-form-item label="菜单图标">
        <el-input v-model="formData.icon" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onClickSaveButton">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      formData: {
        menuName: '',
        orderNum: '',
        parentId: '',
        menuType: '',
        url: '',
        icon: ''
      }
    }
    
  },

  created () {
    this.getAllMenu();
  },

  methods: {
    async getAllMenu () {
      const res = await this.$post('getAllMenu');
      if(res.returnCode === '1000') {
        console.log(res);
      } else {
        return this.$message.error(res.message);
      }
    },

    async onClickSaveButton () {
      const res = await this.$post('addMenu', this.formData);
      
      if(res.returnCode === '1000') {
        this.$message.success('success');
      } else {
        return this.$message.error(res.message);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.menu_management{
  padding: 10px 20px;
  background-color: #fff;
  box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.1);
  min-height: calc(100vh - 84px - 58px);
  .form{
    padding-top: 30px;
  }
  .tree-contianer{
    padding: 20px;
    margin-bottom: 100px;
    .tree{
      padding-left: 20px;
    }
  }
  .btn-container{
    text-align: center;
    margin-bottom: 30px;
  }
}
</style>

