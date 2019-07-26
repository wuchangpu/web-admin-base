<template>
  <div class="layout__page">
    <h2 class="layout__title">系统日志</h2>

    <div class="layout__filter-form">
      <el-form :model="listFilter" label-width="100px" @submit.native.prevent="onSubmitForm">
        <el-row>
          <el-col :span="8">
            <el-form-item label="操作人：">
              <el-input v-model="listFilter.username" />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="角色：">
              <el-select v-model="listFilter.roleName">
                <el-option
                  v-for="option in roleList"
                  :key="option.roleId"
                  :label="option.roleName"
                  :value="option.roleName"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="日志详情：">
              <el-input v-model="listFilter.method" />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="更新时间：">
              <el-date-picker
                v-model="timeRange"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['00:00:00', '23:59:59']"
                clearable
                value-format="timestamp"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24" style="text-align: right;">
            <el-button type="primary" @click.prevent="onSubmitForm">搜索</el-button>
            <el-button @click="onClickClearBtn">清除</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="layout__table">
      <h4 class="table__title">列表</h4>

      <el-table :data="tableData" stripe border style="width: 100%">
        <el-table-column label="操作时间" prop="createDate">
          <template slot-scope="scope">
            {{ scope.row.createDate | parseTime }}
          </template>
        </el-table-column>

        <el-table-column label="操作人" prop="username" />

        <el-table-column label="角色" prop="roleName" />

        <el-table-column label="日志详情" prop="logOperation" :show-overflow-tooltip="true" />
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
      listFilter: {
        username: '',
        beginTime: '',
        endTime: '',
        roleName: '',
        method: ''
      },

      pageData: {
        pageSize: 10,
        pageNumber: 1
      },
      total: 0,

      timeRange: [],

      tableData: [],

      roleList: [],

      copyData: {}
    }
  },

  created() {
    this.getRoleList()
    this.getTableData()
  },

  methods: {
    async getRoleList() {
      const res = await this.$api.getRoleSelect()

      this.roleList = res
    },

    async getTableData() {
      if (this.timeRange && this.timeRange.length) {
        Object.assign(this.listFilter, {
          beginTime: this.timeRange[0],
          endTime: this.timeRange[1]
        })
      } else {
        Object.assign(this.listFilter, {
          beginTime: '',
          endTime: ''
        })
      }
      const res = await this.$api.getLogList(Object.assign({}, this.listFilter, this.pageData), '', true)

      this.tableData = res.records
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

    onClickClearBtn() {
      this.listFilter = {
        username: '',
        beginTime: '',
        endTime: '',
        roleName: '',
        method: ''
      }
      this.timeRange = []
      this.pageData.pageNumber = 1
      this.getTableData()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
