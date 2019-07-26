<template>
  <div class="layout__page">
    <h2 class="layout__title">权限</h2>

    <div class="layout__form">
      <el-form ref="formData" :model="formData" :rules="ruler" label-width="100px">
        <el-form-item label="名称：" prop="permsName">
          <el-input v-model="formData.permsName" />
        </el-form-item>

        <el-form-item label="值：" prop="permsKey">
          <el-input v-model="formData.permsKey" />
        </el-form-item>

        <el-form-item label="上级菜单：" prop="menuId">
          <tree-input v-model="formData.menuId" :data="treeData" node-key="menuId" :default-props="defaultProps" />
        </el-form-item>

        <el-form-item>
          <el-button @click="onClickBackBtn">返回</el-button>
          <el-button type="primary" @click="onClickSaveBtn">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        menuId: '',
        permsKey: '',
        permsName: ''
      },

      ruler: {
        menuId: { required: true, message: '请选择', trigger: 'change' },
        permsKey: { required: true, message: '请输入', trigger: 'blur' },
        permsName: { required: true, message: '请输入', trigger: 'blur' }
      },

      treeData: [],

      defaultProps: {
        children: 'list',
        label: 'menuName'
      }
    }
  },

  created() {
    this.getTreeData()
  },

  methods: {
    async getTreeData() {
      const res = await this.$api.getMenuList()

      this.treeData = res
    },

    onClickBackBtn() {
      this.$router.back()
    },

    onClickSaveBtn() {
      this.$refs.formData.validate(isValid => {
        if (isValid) {
          this.handleSaveAction()
        }
      })
    },

    async handleSaveAction() {
      await this.$api.permissionAdd(this.formData)

      this.$message.success('操作成功')

      this.onClickBackBtn()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>