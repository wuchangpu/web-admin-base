<template>
  <div class="layout__page">
    <h2 class="layout__title">角色列表</h2>

    <div class="layout__filter-form">
      <el-form label-width="100px" @sumbit.native.prevent="onSubmitForm">
        <el-row>
          <el-col :span="8">
            <el-form-item label="名称：">
              <el-input v-model="formData.roleName" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-button v-permission="'system:role:add'" type="primary" @click="onClickAddBtn">新建</el-button>
          </el-col>
          <el-col :span="12" style="text-align: right;">
            <el-button type="primary" native-type="submit" @click.native.prevent="onSubmitForm">搜索</el-button>
            <el-button @click="onClickClearBtn">清除</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="layout__table">
      <h4 class="table__title">列表</h4>

      <el-table :data="tableData" stripe border style="width: 100%">
        <el-table-column label="角色名称" prop="roleName" />

        <el-table-column label="状态" prop="status">
          <template slot-scope="scope">
            {{ scope.row.status | statusFilter }}
          </template>
        </el-table-column>

        <el-table-column label="备注" prop="remark" />

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button v-permission="'system:role:detail'" type="text" @click="onClickDetailBtn(scope)">详情</el-button>
            <el-button v-permission="'system:role:edit'" type="text" @click="onClickEditBtn(scope)">编辑</el-button>
            <el-button v-permission="'system:role:delete'" type="text" @click="onClickDeleteBtn(scope)">删除</el-button>
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
  </div>
</template>

<script>
export default {
  filters: {
    statusFilter(value) {
      let str = ''
      switch (value) {
        case '1':
          str = '启用'
          break

        case '2':
          str = '禁用'
          break

        default:
          str = ''
          break
      }

      return str
    }
  },

  data() {
    return {
      tableData: [],

      formData: {
        roleName: ''
      },
      pageData: {
        pageSize: 10,
        pageNumber: 1
      },
      total: 0,

      copyData: {}
    }
  },

  created() {
    this.getTableData()
  },

  methods: {
    async getTableData() {
      const res = await this.$api.getRoleList(Object.assign({}, this.formData, this.pageData), '', true)

      this.tableData = res.records
      // 保证点击翻页按钮时搜索条件的正确
      this.copyData = this.$deepcopy(this.formData)
      this.total = +res.total
    },

    onPageChange(val) {
      this.pageData.pageNumber = val
      this.formData = this.copyData
      this.getTableData()
    },

    onSubmitForm(e) {
      e.preventDefault()
      this.pageData.pageNumber = 1
      this.getTableData()
    },

    onClickAddBtn() {
      this.$router.push({ name: 'RoleAdd' })
    },

    onClickClearBtn() {
      this.formData.roleName = ''
      this.pageData.pageNumber = 1
      this.getTableData()
    },

    onClickEditBtn({ row: { roleId }}) {
      this.$router.push({ name: 'RoleEdit', query: { id: roleId }})
    },

    onClickDetailBtn({ row: { roleId }}) {
      this.$router.push({ name: 'RoleDetail', query: { id: roleId, detail: '1' }})
    },

    onClickDeleteBtn({ row: { roleId }}) {
      this.$confirm('是否删除数据', '注意！', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.handleDeleteAction(roleId)
        })
        .catch(() => {})
    },

    async handleDeleteAction(...roleId) {
      await this.$api.roleDelete({ roleIds: roleId })

      this.$message.success('操作成功')

      if ((this.tableData.length === 0) && (this.pageData.pageNumber > 2)) {
        this.pageData.pageNumber -= 1
      }

      this.getTableData()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
