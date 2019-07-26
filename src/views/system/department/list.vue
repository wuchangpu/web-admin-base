<template>
  <div class="layout__page">
    <h2 class="layout__title">机构列表</h2>

    <div class="layout__filter-form">
      <el-form>
        <el-row>
          <el-col :span="12">
            <el-button v-permission="'system:department:add'" type="primary" @click="onClickAddBtn">新建</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="layout__table">
      <h4 class="table__title">标题</h4>

      <el-table :data="tableData" stripe border style="width: 100%">
        <el-table-column label="名称" prop="orgName">
          <template slot-scope="scope">
            <div :style="{ 'padding-left': ((scope.row.level - 1) * 30) + 'px' }">
              <i v-if="scope.row.hasChild" :class="(!scope.row.isExtend) ? 'el-icon-arrow-right': 'el-icon-arrow-down'" @click="onClickExtendBtn(scope)" />
              {{ scope.row.orgName }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="所属机构" prop="parentName" />

        <el-table-column label="状态" prop="status">
          <template slot-scope="scope">
            {{ scope.row.status | filterStatusStr }}
          </template>
        </el-table-column>

        <el-table-column label="创建时间" prop="createdTime">
          <template slot-scope="scope">
            {{ scope.row.createdTime | parseTime }}
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button v-permission="'system:department:edit'" type="text" @click="onClickEditBtn(scope)">编辑</el-button>
            <el-button v-permission="'system:department:delete'" type="text" @click="onClickDeleteBtn(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  filters: {
    filterStatusStr(value) {
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
      }

      return str
    }
  },

  data() {
    return {
      tableData: []
    }
  },

  computed: {
    userInfo() {
      return this.$store.state.user.userInfo
    }
  },

  created() {
    this.getTableData()
  },

  methods: {
    async getTableData() {
      const res = await this.$api.getDepartmentList()

      this.tableData = res.map(current => {
        Object.assign(current, {
          isExtend: false,
          hasChild: !!(current.list && (current.list.length > 0)),
          isSelected: false,
          level: 1,
          isShow: true
        })

        return current
      })
    },

    onClickExtendBtn({ row, $index }) {
      if (!row.isExtend) {
        this.$set(row, 'isExtend', true)

        const child = row.list.map(current => {
          Object.assign(current, {
            level: row.level + 1,
            isExtend: false,
            hasChild: !!(current.list && (current.list.length > 0)),
            isSelected: false
          })

          return current
        })

        this.tableData.splice(($index + 1), 0, ...(child.filter(current => !current.isHidden)))
      } else {
        this.$set(row, 'isExtend', false)
        const spliceLength = this.getExpandedChildrenLength(row)
        this.tableData.splice($index + 1, spliceLength)
      }
    },

    getExpandedChildrenLength(clickedData) {
      let childrenLength = 0
      function loop(clickedData) {
        clickedData.forEach(current => {
          if (current.isExtend) {
            // childrenLength += current.children.length;
            childrenLength++
            if (current.list) {
              loop(current.list)
            }
          } else {
            childrenLength++
          }
        })
      }

      loop(clickedData.list)
      return childrenLength
    },

    onClickDeleteBtn({ row, $index }) {
      this.$confirm('是否删除数据', '注意！', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.handleDeleteSendData(row, $index)
        })
        .catch(() => {})
    },

    async handleDeleteSendData(row, $index) {
      await this.$api.departmentDelete({ id: row.id })

      this.$message.success('操作成功')
      this.tableData.splice($index, 1)

      this.$set(row, 'isHidden', true)
    },

    onClickEditBtn({ row: { id }}) {
      this.$router.push({ name: 'DepartmentEdit', query: { id }})
    },

    onClickAddBtn() {
      this.$router.push({ name: 'DepartmentAdd' })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
