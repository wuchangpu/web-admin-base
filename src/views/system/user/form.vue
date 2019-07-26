<template>
  <div class="layout__page">
    <h2 class="layout__title">{{ isEdit ? '编辑' : '新建' }}用户</h2>

    <div class="layout__form">
      <el-form ref="formData" :model="formData" label-width="120px" :rules="ruler">
        <el-form-item label="用户名：" prop="loginName">
          <el-input v-model="formData.loginName" />
        </el-form-item>

        <el-form-item label="昵称：" prop="username">
          <el-input v-model="formData.username" />
        </el-form-item>

        <el-form-item label="手机号：" prop="mobile">
          <el-input v-model="formData.mobile" />
        </el-form-item>

        <el-form-item label="邮箱：" prop="email">
          <el-input v-model="formData.email" />
        </el-form-item>

        <el-form-item label="密码：" prop="password">
          <el-input v-model="formData.password" type="password" @change="onChangePassword('password')" />
        </el-form-item>

        <el-form-item label="再次输入密码：" prop="repeatPassword">
          <el-input v-model="formData.repeatPassword" type="password" @change="onChangePassword('repeatPassword')" />
        </el-form-item>

        <el-form-item label="机构：" prop="orgIdList">
          <tree-input v-model="formData.orgIdList" :data="treeData" node-key="id" :default-props="defaultProps" />
        </el-form-item>

        <el-form-item label="角色：" prop="roleIdList">
          <el-select v-model="formData.roleIdList" multiple>
            <el-option
              v-for="option in roleList"
              :key="option.roleId"
              :label="option.roleName"
              :value="option.roleId"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="状态：" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio label="1">启用</el-radio>
            <el-radio label="2">禁用</el-radio>
          </el-radio-group>
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
import { validateMobile, validateEmail, validateArray } from '@/utils/validate'
export default {
  data() {
    const _this = this
    const validatePassword = (ruler, value, callback) => {
      if (_this.formData.password !== _this.formData.repeatPassword) {
        callback(new Error('两次密码输入不一致'))
      }

      callback()
    }
    return {
      formData: {
        loginName: '',
        username: '',
        mobile: '',
        email: '',
        password: '',
        repeatPassword: '',
        status: '1',
        roleIdList: [],
        orgIdList: ''
      },

      ruler: {
        loginName: { required: true, message: '请输入', trigger: 'blur' },
        username: { required: true, message: '请输入', trigger: 'blur' },
        mobile: [{ required: true, message: '请输入', trigger: 'blur' }, { validator: validateMobile, trigger: 'blur' }],
        email: [{ required: true, message: '请输入', trigger: 'blur' }, { validator: validateEmail, trigger: 'blur' }],
        password: [{ required: true, message: '请输入', trigger: 'blur' }, { validator: validatePassword, trigger: 'blur' }],
        repeatPassword: [{ required: true, message: '请输入', trigger: 'blur' }, { validator: validatePassword, trigger: 'blur' }],
        status: [{ required: true, message: '请选择', trigger: 'change' }],
        roleIdList: [{ required: true, message: '请选择', trigger: 'change' }, { validator: validateArray, trigger: 'change' }],
        orgIdList: { required: true, message: '请选择', trigger: 'change' }
      },

      treeData: [],
      defaultProps: {
        children: 'list',
        label: 'orgName'
      },

      roleList: [],

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
    this.getRoleList()

    if (this.id) {
      this.isEdit = true
      this.getDetail()
    }
  },

  methods: {
    async getDetail() {
      const res = await this.$api.userDetail({
        userId: this.id
      })

      this.formData = {
        loginName: res.loginName,
        username: res.username,
        mobile: res.mobile,
        email: res.email,
        password: '',
        repeatPassword: '',
        status: res.status,
        roleIdList: res.roleIdList,
        orgIdList: res.orgIdList.join(','),
        userId: res.userId
      }
    },

    async getTreeData() {
      const res = await this.$api.getDepartmentList()

      this.treeData = res
    },

    async getRoleList() {
      const res = await this.$api.getRoleSelect()

      this.roleList = res
    },

    onChangePassword(prop) {
      const name = prop === 'repeatPassword' ? 'password' : 'repeatPassword'
      this.$refs.formData.validateField(name)
    },

    onClickBackBtn() {
      this.$router.back()
    },

    onClickSaveBtn() {
      this.$refs.formData.validate(isValid => {
        if (isValid) {
          if (this.isEdit) {
            this.handleUpdateAction()
          } else {
            this.handleSaveAction()
          }
        }
      })
    },

    async handleSaveAction() {
      const toSendData = this.$deepcopy(this.formData)

      this.$delete(toSendData, 'repeatPassword')

      await this.$api.userAdd(Object.assign(toSendData, {
        orgIdList: toSendData.orgIdList.split(','),
        password: this.$md5(toSendData.password)
      }))

      this.$message.success('操作成功')

      this.onClickBackBtn()
    },

    async handleUpdateAction() {
      const toSendData = {
        userId: this.formData.userId,
        loginName: this.formData.loginName,
        username: this.formData.username,
        status: this.formData.status,
        roleIdList: this.formData.roleIdList,
        orgIdList: this.formData.orgIdList,
        password: this.$md5(this.formData.password),
        mobile: this.formData.mobile,
        email: this.formData.email
      }

      await this.$api.userUpdate(toSendData)

      this.$message.success('操作成功')

      this.onClickBackBtn()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
