<template>
  <div class="layout__page">
    <h2 class="layout__title">图片管理</h2>

    <el-tabs v-model="appId" @tab-click="onTabClick">
      <el-tab-pane label="PC" name="1" />
      <el-tab-pane label="移动端" name="2" />
    </el-tabs>

    <div class="layout__filter-form">
      <el-form :model="listFilter" label-width="100px" @submit.native.prevent="onSubmitForm">
        <el-row>
          <el-col :span="8">
            <el-form-item label="标题：" prop="title">
              <el-input v-model="listFilter.title" />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="位置：" prop="position">
              <el-select v-model="listFilter.position">
                <el-option
                  v-for="option in positionList"
                  :key="option.id"
                  :label="option.dataValue"
                  :value="option.dataKey"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-button v-permission="'system:image:add'" type="primary" @click="onClickAddBtn">新建</el-button>
          </el-col>
          <el-col :span="12" style="text-align: right;">
            <el-button type="primary" @click.prevent="onSubmitForm">搜索</el-button>
            <el-button @click="onClickClearBtn">清除</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="layout__table">
      <h4 class="table__title">列表</h4>

      <el-table :data="tableData" stripe border style="width: 100%">
        <el-table-column label="图片">
          <template slot-scope="scope">
            <div class="image__box">
            <img :src="imageBaseUrl + '/' + scope.row.bannerPath" />
            </div>
          </template>
        </el-table-column>

        <el-table-column label="标题" prop="title" />

        <el-table-column label="位置" prop="position">
          <template slot-scope="scope">
            {{ getPositionStr(scope.row.position) }}
          </template>
        </el-table-column>

        <el-table-column label="排序值" prop="sort" />

        <el-table-column label="更新时间" prop="updatedTime">
          <template slot-scope="scope">
            {{ scope.row.updatedTime | parseTime }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">
            <el-button v-permission="'system:image:edit'" type="text" @click="onClickEditBtn(scope)">编辑</el-button>
            <el-button v-permission="'system:image:delete'" type="text" @click="onClickDeleteBtn(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="layout__pagination">
      <el-pagination
        background
        layout="prev, pager, next, total, jumper, slot"
        :total="total"
        :page-size="pageData.pageSize"
        :current-page.sync="pageData.pageNumber"
        @current-change="onPageChange"
      />
    </div>
  </div>
</template>

<script>
import { imageBaseUrl } from '@/config'
export default {
  data() {
    return {
      imageBaseUrl,
      listFilter: {
        appId: '1',
        position: '',
        title: ''
      },

      pageData: {
        pageSize: 10,
        pageNumber: 1
      },
      total: 0,

      copyData: {},

      tableData: [],

      positionList: [],

      appId: '1'
    }
  },

  created() {
    this.getTableData()
    this.getDictionaryList()
  },

  methods: {
    onTabClick(tab) {
      this.listFilter = this.copyData
      this.listFilter.appId = tab.name
      this.pageData.pageNumber = 1
      this.getTableData()
    },

    onClickAddBtn() {
      this.$router.push({ name: 'ImageAdd', query: { appid: this.appId }})
    },

    async getDictionaryList() {
      const res = await this.$api.getDictionaryByDicCodeList({
        dicCodeList: ['1001']
      })

      this.positionList = res['1001']
    },

    async getTableData() {
      const res = await this.$api.getImageList(Object.assign({}, this.listFilter, this.pageData), '', true)

      this.copyData = this.$deepcopy(this.listFilter)
      this.tableData = res.records
      this.total = +res.total
    },

    onSubmitForm(e) {
      e.preventDefault()
      this.pageData.pageNumber = 1
      this.getTableData()
    },

    onClickClearBtn() {
      this.listFilter = {
        position: '',
        title: '',
        appId: '1'
      }

      this.pageData.pageNumber = 1
      this.getTableData()
    },

    onPageChange(value) {
      this.pageData.pageNumber = value
      this.listFilter = this.copyData
      this.getTableData()
    },

    onClickEditBtn({ row: { id }}) {
      this.$router.push({ name: 'ImageEdit', query: { id, appid: this.appId }})
    },

    getPositionStr(value) {
      const found = this.positionList.find(current => current.dataKey === value)

      if (found) {
        return found.dataValue
      }

      return ''
    },

    onClickDeleteBtn({ row: { id }}) {
      this.$confirm('是否删除数据', '注意！', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.handleDeleteAction(id)
        })
        .catch(() => {})
    },

    async handleDeleteAction(...idList) {
      await this.$api.imageDelete({ idList })

      this.$message.success('操作成功')
      this.listFilter = this.copyData

      if ((this.tableData.length === 0) && (this.pageData.pageNumber < 2)) {
        this.pageData.pageNumber -= 1
      }
      this.getTableData()
    }
  }
}
</script>

<style lang="scss" scoped>
.image__box {
  width: 100px;
  height: 100px;

  img {
    width: 100%;
    height: 100%;
  }
}
</style>
