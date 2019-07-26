<template>
  <div class="layout__page">
    <h2 class="layout__title">菜单</h2>

    <div class="layout__form">
      <el-form ref="formData" :model="formData" label-width="100px" :rules="ruler">
        <el-form-item label="名称：" prop="menuName">
          <el-input v-model="formData.menuName" />
        </el-form-item>

        <el-form-item label="类型：" prop="menuType">
          <el-radio-group v-model="formData.menuType">
            <el-radio label="0" v-if="!isPermission">目录</el-radio>
            <el-radio label="1" v-if="!isPermission">菜单</el-radio>
            <!-- <el-radio label="2" v-if="isPermission">按钮</el-radio> -->
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="formData.menuType !== '0'" label="上级机构：" prop="parentId">
          <tree-input v-model="formData.parentId" :data="treeData" node-key="menuId" :default-props="defaultProps" />
        </el-form-item>

        <el-form-item v-if="formData.menuType === '2'" label="权限：" prop="perms">
          <el-input v-model="formData.perms" />
        </el-form-item>

        <el-form-item v-if="formData.menuType === '1'" label="路由：" prop="url">
          <el-input v-model="formData.url" />
        </el-form-item>

        <el-form-item label="排序：" prop="orderNum">
          <el-input v-model="formData.orderNum" />
        </el-form-item>

        <el-form-item label="备注：" prop="remarks">
          <el-input type="textarea" v-model="formData.remarks" />
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
import { validateInt } from '@/utils/validate'

export default {
  data() {
    return {
      formData: {
        orderNum: '',
        menuId: '',
        menuName: '',
        parentId: '',
        perms: '',
        url: '',
        menuType: '1',
        icon: '',
        parentName: '',
        remarks: ''
      },

      ruler: {
        orderNum: [{ required: true, message: '请输入', trigger: 'blur' }, { validator: validateInt, trigger: 'blur' }],
        menuName: { required: true, message: '请输入', trigger: 'blur' },
        menuType: { required: true, message: '请选择', trigger: 'change' },
        perms: { required: true, message: '请输入', trigger: 'blur' },
        url: { required: true, message: '请输入', trigger: 'blur' },
        parentId: { required: true, message: '请选择', trigger: 'change' }
      },

      defaultProps: {
        children: 'list',
        label: 'menuName'
      },

      treeData: [],

      isEdit: false
    }
  },

  computed: {
    id() {
      return this.$route.query.id
    },

    isPermission() {
      return this.$route.query.permission === '1'
    }
  },

  created() {
    this.getTreeData()

    if (this.id) {
      this.getDetail()
    }
  },

  methods: {
    async getDetail() {
      const res = await this.$api.menuDetail({ menuId: this.id })

      this.formData = {
        orderNum: res.orderNum,
        menuName: res.menuName,
        parentId: res.parentId,
        perms: res.perms,
        url: res.url,
        menuType: res.menuType,
        icon: res.icon,
        menuId: res.menuId
      }

      this.isEdit = true
    },

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
          if (!this.isPermission) {
            this.handleSaveAction()
          } else {
            this.handleSavePermissionAction()
          }
        }
      })
    },

    async handleSaveAction() {

      const url = this.isEdit ? 'updateMenu' : 'saveMenu'

      await this.$api[url](Object.assign({}, this.formData, {
        parentId: this.formData.menuType === '0' ? '0' : this.formData.parentId
      }))

      this.$message.success('操作成功')

      this.onClickBackBtn()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
