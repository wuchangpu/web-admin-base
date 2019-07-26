<template>
  <div class="layout__page">
    <div class="layout__form">
      <el-form ref="formData" :model="formData" label-width="100px" :rules="ruler">
        <el-form-item label="状态：" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio label="1">启用</el-radio>
            <el-radio label="2">禁用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="机构名称：" prop="orgName">
          <el-input v-model="formData.orgName" />
        </el-form-item>

        <el-form-item label="所属机构：" prop="parentId">
          <tree-input ref="treeData" :disabled="isEdit" v-model="formData.parentId" :data="treeData" node-key="id" :default-props="defaultProps" @node-click="onTreeNodeClick" />
        </el-form-item>

        <el-form-item label="备注：" prop="description">
          <el-input type="textarea" v-model="formData.description" />
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
        code: '',
        orgName: '',
        orgLevel: '',
        parentId: '',
        status: '1',
        createdBy: '',
        description: ''
      },

      ruler: {
        orgName: { required: true, message: '请输入', trigger: 'blur' },
        parentId: { required: true, message: '请选择', trigger: 'change' },
        status: { required: true, message: '请选择', trigger: 'blur' }
      },

      treeData: [],

      defaultProps: {
        children: 'list',
        label: 'orgName'
      },

      isEdit: false
    }
  },

  computed: {
    userInfo() {
      return this.$store.state.user.userInfo
    },

    id() {
      return this.$route.query.id
    }
  },

  created() {
    this.getTreeData()

    if (this.id) {
      this.isEdit = true
      this.getDetail()
    }
  },

  methods: {
    async getDetail() {
      const res = await this.$api.departmentDetail({
        id: this.id
      })

      this.formData = {
        code: res.code,
        orgName: res.orgName,
        orgLevel: res.orgLevel,
        parentId: res.parentId,
        status: res.status,
        createdBy: res.createdBy,
        description: res.description
      }
    },

    async getTreeData() {
      const res = await this.$api.getDepartmentList()

      this.treeData = res
    },

    onClickBackBtn() {
      this.$router.back()
    },

    onClickSaveBtn() {
      this.$refs.formData.validate(isValid => {
        if (isValid) {
          if (this.isEdit) {
            this.handleEditAction()
          } else {
            this.handleSaveAction()
          }
        }
      })
    },

    async handleSaveAction() {
      const toSendData = this.$deepcopy(this.formData)

      Object.assign(toSendData, {
        createdBy: this.userInfo.userId,
        parentName: this.$refs.treeData.getOrgName()
      })
      await this.$api.departmentAdd(toSendData)

      this.$message.success('操作成功')
      this.onClickBackBtn()
    },

    async handleEditAction() {
      const toSendData = {
        id: this.id,
        code: this.formData.code,
        orgName: this.formData.orgName,
        description: this.formData.description,
        status: this.formData.status,
        updatedBy: this.userInfo.userId
      }

      await this.$api.departmentUpdate(toSendData)

      this.$message.success('操作成功')
      this.onClickBackBtn()
    },

    onTreeNodeClick(data) {
      this.formData.orgLevel = (+data.orgLevel) + 1
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
