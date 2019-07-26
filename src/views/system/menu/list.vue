<template>
  <div class="layout__page">
    <h2 class="layout__title">菜单</h2>

    <div class="layout__filter-form">
      <el-form>
        <el-row>
          <el-col :span="12">
            <el-button v-permission="'system:menu:add'" type="primary" @click="onClickAddBtn">新建</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="layout__table">
      <h4 class="table__title">列表</h4>
      <el-table :data="tableData" stripe border style="width: 100%">
        <el-table-column label="名称" prop="menuName">
          <template slot-scope="scope">
            <div :style="{ 'padding-left': ((scope.row.level - 1) * 30) + 'px' }">
              <i v-if="scope.row.hasChild" :class="(!scope.row.isExtend) ? 'el-icon-arrow-right': 'el-icon-arrow-down'" @click="onClickExtendBtn(scope)" />
              {{ scope.row.menuName }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="类型" prop="menuType">
          <template slot-scope="scope">
            {{ scope.row.menuType | menuTypeFilter }}
          </template>
        </el-table-column>

        <el-table-column label="排序" prop="orderNum" />

        <el-table-column label="路由" prop="url" />

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button v-permission="'system:menu:edit'" type="text" @click="onClickEditBtn(scope)">编辑</el-button>
            <el-button v-permission="'system:menu:delete'" type="text" @click="onClickDeleteBtn(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  filters: {
    menuTypeFilter(value) {
      let str = ''
      switch (value) {
        case '0':
          str = '目录'
          break

        case '1':
          str = '菜单'
          break

        case '2':
          str = '权限'
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

  created() {
    this.getTableData()
  },

  methods: {
    async getTableData() {
      const res = await this.$api.getMenuList({})

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
            isSelected: false,
            isPermission: current.menuType === '2'
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
      await this.$api.menuDelete({ menuId: row.menuId })

      this.$message.success('操作成功')
      this.tableData.splice($index, 1)

      this.$set(row, 'isHidden', true)
    },

    onClickAddBtn() {
      this.$router.push({ name: 'MenuAdd' })
    },

    onClickEditBtn({ row: { menuId }}) {
      this.$router.push({ name: 'MenuEdit', query: { id: menuId }})
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
