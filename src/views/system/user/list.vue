<template>
  <div class="layout__page">
    <h2 class="layout__title">用户列表</h2>

    <div class="layout__filter-form">
      <el-form :model="listFilter" label-width="100px" @submit.native.prevent="onSubmitForm">
        <el-row>
          <el-col :span="8">
            <el-form-item label="用户名：" prop="username">
              <el-input v-model="listFilter.username" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-button v-permission="'system:user:add'" type="primary" @click="onClickAddBtn">新建</el-button>
          </el-col>
          <el-col :span="12" style="text-align: right">
            <el-button type="primary" @click.prevent="onSubmitForm">搜索</el-button>
            <el-button @click="onClickClearBtn">清除</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="layout__table">
      <h4 class="table__title">列表</h4>

      <el-table :data="tableData" stripe border style="width: 100%">
        <el-table-column label="用户名" prop="username" />

        <el-table-column label="邮箱" prop="email" />

        <el-table-column label="手机号" prop="mobile" />

        <el-table-column label="角色" prop="roleName" />

        <el-table-column label="状态" prop="status">
          <template slot-scope="scope">
            <el-switch
              :value="scope.row.status"
              active-value="1"
              inactive-value="2"
              @change="onChangeStatus(scope, $event)"
            />
          </template>
        </el-table-column>

        <el-table-column label="创建时间" prop="createdTime" min-width="150px">
          <template slot-scope="scope">
            {{ scope.row.createdTime | parseTime }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button v-permission="'system:user:edit'" type="text" @click="onClickEditBtn(scope)">编辑</el-button>
            <el-button v-permission="'system:user:delete'" type="text" @click="onClickDeleteBtn(scope)">删除</el-button>
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
  data() {
    return {
      tableData: [],

      listFilter: {
        username: ''
      },

      copyData: {
        username: ''
      },

      pageData: {
        pageSize: 10,
        pageNumber: 1
      },
      total: 0
    }
  },

  created() {
    this.getTableData()
  },

  methods: {
    async getTableData() {
      const res = await this.$api.getUserList(Object.assign({}, this.listFilter, this.pageData), '', true)

      this.tableData = res.records
      // 保证点击翻页按钮时搜索条件的正确
      this.copyData = this.$deepcopy(this.listFilter)
      this.total = +res.total
    },

    onSubmitForm(e) {
      e.preventDefault()
      this.pageData.pageNumber = 1
      this.getTableData()
    },

    onClickClearBtn() {
      this.pageData.pageNumber = 1
      this.getTableData()
    },

    onPageChange(value) {
      this.pageData.pageNumber = value
      this.listFilter = this.copyData
      this.getTableData()
    },

    onClickAddBtn() {
      this.$router.push({ name: 'UserAdd' })
    },

    async onChangeStatus({ row }, value) {
      await this.$api.userStatusChange({
        userId: row.userId,
        status: value
      })

      this.$message.success('操作成功')
      this.$set(row, 'status', value)
    },

    onClickDeleteBtn({ row: { userId }}) {
      this.$confirm('是否删除数据', '注意！', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.handleDeleteAction(userId)
        })
        .catch(() => {})
    },

    async handleDeleteAction(...idList) {
      await this.$api.userDelete({ idList })

      this.$message.success('操作成功')
      this.listFilter = this.copyData

      if ((this.tableData.length === 0) && (this.pageData.pageNumber > 2)) {
        this.pageData.pageNumber -= 1
      }

      this.getTableData()
    },

    onClickEditBtn({ row: { userId }}) {
      this.$router.push({ name: 'UserEdit', query: { id: userId }})
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
