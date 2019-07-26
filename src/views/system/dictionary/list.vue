<template>
  <div class="layout__page">
    <h2>字典列表</h2>

    <div class="layout__filter-form">
      <el-form :model="listFilter" label-width="100px" @submit.native.prevent="onSubmitForm">
        <el-row>
          <el-col :span="8">
            <el-form-item label="字典名称：">
              <el-input v-model="listFilter.dicName" />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="状态：">
              <el-select v-model="listFilter.deleted">
                <el-option label="启用" value="1" />
                <el-option label="禁用" value="2" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-button v-permission="'system:dictionary:add'" type="primary" @click="onClickAddBtn">新建</el-button>
          </el-col>

          <el-col :span="12" style="text-align: right;">
            <el-button type="primary" native-type="submit" @click="onSubmitForm">搜索</el-button>
            <el-button @click="onClickResetBtn">清除</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="layout__table">
      <h4 class="table__title">列表</h4>

      <el-table :data="tableData" stripe border style="width: 100%">
        <el-table-column label="字典名称" prop="dicName" />

        <el-table-column label="字典码" prop="dicCode" />

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
            <el-button v-permission="'system:dictionary:data'" type="text" @click="onClickCheckBtn(scope)">字典数据</el-button>
            <el-button v-permission="'system:dictionary:edit'" type="text" @click="onClickEditBtn(scope)">编辑</el-button>
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
      listFilter: {
        dicName: '',
        dicCode: '',
        deleted: ''
      },

      pageData: {
        pageNumber: 1,
        pageSize: 10
      },
      total: 0,

      tableData: [],
      copyData: {}
    }
  },

  created() {
    this.getTableData()
  },

  methods: {
    async getTableData() {
      const res = await this.$api.getDictionaryList(Object.assign({}, this.listFilter, this.pageData), '', true)

      this.tableData = res.records
      // 保证点击翻页按钮时搜索条件的正确
      this.copyData = this.$deepcopy(this.formData)
      this.total = +res.total
    },

    onSubmitForm(e) {
      e.preventDefault()
      this.pageData.pageNumber = 1
      this.getTableData()
    },

    onPageChange(value) {
      this.pageData.pageNumber = 1
      this.formData = this.copyData
      this.getTableData()
    },

    onClickResetBtn() {
      this.listFilter = {
        dicName: '',
        dicCode: '',
        deleted: ''
      }
      this.pageData.pageNumber = 1
      this.getTableData()
    },

    onClickAddBtn() {
      this.$router.push({ name: 'DictionaryAdd' })
    },

    async onChangeStatus(value, { row }) {
      await this.$api.dictionaryStatusControl({
        idList: [row.id],
        deleted: value
      })

      this.$message.success('操作成功')
      this.$set(row, 'deleted', value)
    },

    onClickEditBtn({ row: { id }}) {
      this.$router.push({ name: 'DictionaryEdit', query: { id }})
    },

    onClickCheckBtn({ row: { id }}) {
      this.$router.push({ name: 'DictionaryDataList', query: { id }})
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
