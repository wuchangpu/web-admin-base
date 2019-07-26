<template>
  <div class="layout__page">
    <h2>新建字典</h2>

    <div class="layout__form">
      <el-form ref="formData" :model="formData" label-width="100px" :rules="ruler">
        <el-form-item label="字典名称：" prop="dicName">
          <el-input v-model="formData.dicName" />
        </el-form-item>

        <!-- <el-form-item label="字典码：" prop="dicCode">
          <el-input v-model="formData.dicCode" />
        </el-form-item> -->

        <el-form-item label="排序：" prop="dicSort">
          <el-input v-model="formData.dicSort" />
        </el-form-item>

        <el-form-item label="状态：" prop="deleted">
          <el-radio-group v-model="formData.deleted">
            <el-radio label="1">启用</el-radio>
            <el-radio label="2">停用</el-radio>
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
import { validateInt } from '@/utils/validate'
export default {
  data() {
    return {
      formData: {
        id: '',
        dicName: '',
        dicSort: '',
        dicCode: '',
        deleted: '1'
      },

      ruler: {
        dicName: { required: true, message: '请输入', trigger: 'blur' },
        dicSort: [{ required: true, message: '请输入', trigger: 'blur' }, { validator: validateInt, trigger: 'blur' }],
        dicCode: { required: true, message: '请输入', trigger: 'blur' },
        deleted: { required: true, message: '请选择', trigger: 'change' }
      },

      isEdit: false
    }
  },

  computed: {
    id() {
      return this.$route.query.id
    }
  },

  created() {
    if (this.id) {
      this.isEdit = true
      this.getDetail()
    }
  },

  methods: {
    async getDetail() {
      const res = await this.$api.dictionaryDetail({
        id: this.id
      })

      this.formData = {
        id: res.id,
        dicName: res.dicName,
        dicSort: res.dicSort,
        dicCode: res.dicCode,
        deleted: res.deleted
      }
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
      await this.$api.dictionaryAdd(this.formData)

      this.$message.success('操作成功')
      this.onClickBackBtn()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
