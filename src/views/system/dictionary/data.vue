<template>
  <div class="layout__page">
    <h2 class="layout__title">字典数据</h2>

    <div class="layout__filter-form">
      <el-form>
        <el-row>
          <el-col :span="12">
            <el-button type="primary" @click="onClickAddBtn">新建</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="layout__table">
      <h4 class="table__title">列表</h4>

      <el-table :data="tableData" stripe border style="width: 100%">
        <el-table-column label="数据字典码" prop="dataKey" />

        <el-table-column label="数据字典值" prop="dataValue" />

        <el-table-column label="备注" prop="remark" :show-overflow-tooltip="true" />

        <el-table-column label="状态" prop="deleted">
          <template slot-scope="scope">
            <el-switch
              :value="scope.row.deleted"
              active-value="1"
              inactive-value="2"
              @change="onChangeStatus($event, scope)"
            />
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="onClickEditBtn(scope)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="layout__pagination">
      <el-pagination
        background
        layout="prev, pager, next, total, jumper, slot"
        :page-size="pageData.pageSize"
        :current-page.sync="pageData.pageNumber"
        :total="total"
        @current-change="onPageChange"
      />
    </div>

    <el-dialog :visible="isShowDialog" title="新建数据" @close="onClickBackBtn">
      <el-form ref="formData" :model="formData" label-width="120px" :rules="ruler">
        <el-form-item label="数据字典码：" prop="dataKey">
          <el-input v-model="formData.dataKey" />
        </el-form-item>

        <el-form-item label="数据字典值：" prop="dataValue">
          <el-input v-model="formData.dataValue" />
        </el-form-item>

        <el-form-item label="序号：" prop="dataSort">
          <el-input v-model="formData.dataSort" />
        </el-form-item>

        <el-form-item label="状态：" prop="deleted">
          <el-radio-group v-model="formData.deleted">
            <el-radio label="1">启用</el-radio>
            <el-radio label="2">禁用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="备注：" prop="remark">
          <el-input v-model="formData.remark" />
        </el-form-item>

        <el-form-item>
          <el-button @click="onClickBackBtn">返回</el-button>
          <el-button type="primary" @click="onClickSaveBtn">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { validateInt } from '@/utils/validate'
export default {
  data() {
    return {
      listFilter: {
        dicId: ''
      },

      pageData: {
        pageSize: 10,
        pageNumber: 1
      },
      total: 0,

      tableData: [],

      isShowDialog: false,

      formData: {
        id: '',
        dicId: '',
        dataKey: '',
        dataValue: '',
        dataSort: '',
        remark: '',
        deleted: '1'
      },

      ruler: {
        dataKey: { required: true, message: '请输入', trigger: 'blur' },
        dataValue: { required: true, message: '请输入', trigger: 'blur' },
        dataSort: [{ required: true, message: '请输入', trigger: 'blur' }, { validator: validateInt, trigger: 'blur' }],
        deleted: { required: true, message: '请选择', trigger: 'change' }
      }
    }
  },

  computed: {
    id() {
      return this.$route.query.id
    }
  },

  created() {
    this.listFilter.dicId = this.id
    this.getTableData()
  },

  methods: {
    async getTableData() {
      const res = await this.$api.getDictionaryDataList(Object.assign({}, this.listFilter, this.pageData), '', true)

      this.tableData = res.records
      this.total = +res.total
    },

    onPageChange(value) {
      this.pageData.pageNumber = value
      this.getTableData()
    },

    onClickBackBtn() {
      this.isShowDialog = false

      this.formData = {
        id: '',
        dicId: '',
        dataKey: '',
        dataValue: '',
        dataSort: '',
        remark: '',
        deleted: '1'
      }

      this.$refs.formData.resetFields()
    },

    onClickSaveBtn() {
      this.$refs.formData.validate(isValid => {
        if (isValid) {
          this.handleSaveAction()
        }
      })
    },

    async handleSaveAction() {
      await this.$api.dictionaryDataAdd(Object.assign({}, this.formData, {
        dicId: this.id
      }))

      this.$message.success('操作成功')
      this.onClickBackBtn()

      this.getTableData()
    },

    onClickAddBtn() {
      this.isShowDialog = true
    },

    async onChangeStatus(value, { row }) {
      await this.$api.dictionaryDataStatusControl({
        idList: [row.id],
        deleted: value
      })

      this.$message.success('操作成功')
      this.$set(row, 'deleted', value)
    },

    onClickEditBtn({ row }) {
      this.formData = {
        id: row.id,
        dicId: row.dicId,
        dataKey: row.dataKey,
        dataValue: row.dataValue,
        dataSort: row.dataSort,
        remark: row.remark,
        deleted: row.deleted
      }
      this.isShowDialog = true
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
