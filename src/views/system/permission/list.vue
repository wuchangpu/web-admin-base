<template>
  <div class="layout__page">
    <h2 class="layout__title">权限管理</h2>

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
        <el-table-column label="权限名称" prop="permsName" />

        <el-table-column label="权限值" prop="permsKey" />
      </el-table>
    </div>

    <div class="layout__pagination">
      <el-pagination
        background
        layout="prev, pager, next, total, jumper, slot"
        @current-change="onPageChange"
        :page-size="pageData.pageSize"
        :current-page.sync="pageData.pageNumber"
        :total="total"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],

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
      const res = await this.$api.getPermissionList(this.pageData, '', true)

      this.tableData = res.records
      this.total = +res.total
    },
    
    onClickAddBtn() {
      this.$router.push({ name: 'PermissionAdd', query: { permission: '1' } });
    },

    onPageChange(value) {
      this.pageData.pageNumber = value
      this.getTableData()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
