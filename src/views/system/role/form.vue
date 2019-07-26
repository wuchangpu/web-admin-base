<template>
  <div class="layout__page" id="role-add">
    <h2 class="layout__title">新建角色</h2>

    <h3 class="layout__sub-title">基本信息</h3>
    <div class="layout__form">
      <el-form ref="formData" :disabled="isDetail" :model="formData" label-width="100px" :rules="ruler">
        <el-form-item label="角色名称：" prop="roleName">
          <el-input v-model="formData.roleName" />
        </el-form-item>

        <el-form-item label="备注：" prop="remark">
          <el-input v-model="formData.remark" />
        </el-form-item>

        <el-form-item label="状态：" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio label="1">启用</el-radio>
            <el-radio label="2">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>

    <div class="layout__table">
      <h3 class="layout__sub-title">权限</h3>
      <el-form :disabled="isDetail">
        <el-table
          ref="tableData"
          :data="tableData"
          stripe
          border
          style="width: 100%"
          @select="onSelectTable"
        >
          <el-table-column type="selection" min-width="55px" />

          <el-table-column label="菜单" prop="menuName" align="left">
            <template slot-scope="scope">
              <div :style="{ 'padding-left': ((scope.row.level - 1) * 30) + 'px' }">
                <i v-if="scope.row.hasChild" :class="(!scope.row.isExtend) ? 'el-icon-arrow-right': 'el-icon-arrow-down'" @click="onClickExtendBtn(scope)"></i>
                {{ scope.row.menuName }}
              </div>
            </template>
          </el-table-column>

          <el-table-column label="操作" align="left">
            <template slot-scope="scope">
              <div v-if="(scope.row.menuType === '1') && (scope.row.permList.length)">
                <el-checkbox 
                  v-for="item in scope.row.permList"
                  :key="item.id"
                  :value="arrBtnPermission.includes(item.id)"
                  @change="onChangeCheckbox(item, $event, scope)"
                >
                  {{ item.permsName }}
                </el-checkbox>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </div>
    
    <el-row style="text-align: right; margin-top: 20px;">
      <el-button @click="onClickBackBtn">返回</el-button>
      <el-button v-if="!isDetail" type="primary" @click="onClickSaveBtn">确定</el-button>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        status: '',
        roleName: '',
        remark: '',
        menuIdList: [],
        permIdList: []
      },

      ruler: {
        status: { required: true, message: '请选择', trigger: 'change' },
        roleName: { required: true, message: '请输入', trigger: 'blur' }
      },

      tableData: [],
      
      selections: new Set([]),
      btnPermission: new Set([]),
      arrBtnPermission: [],

      isEdit: false
    }
  },

  computed: {
    id() {
      return this.$route.query.id
    },

    isDetail() {
      return this.$route.query.detail === '1'
    }
  },

  created() {
    this.getTreeData()

    if (this.id) {
      this.isEdit = true
      this.getDetail()
    }
  },

  methods: {
    async getDetail() {
      const res = await this.$api.roleDetail({
        roleId: this.id
      })

      const permissionList = res.sysMenuPermList.map(current => current.id)

      this.formData = {
        roleName: res.roleName,
        remark: res.remark,
        menuIdList: res.menuIdList,
        permIdList: permissionList,
        status: res.status,
        roleMark: res.roleMark,
        roleId: res.roleId
      }

      this.selections = new Set(res.menuIdList)
      this.btnPermission = new Set(permissionList)
      this.arrBtnPermission = [...this.btnPermission]

      this.refreshTableSelections()
    },

    async getTreeData () {
      const res = await this.$api.getAllMenuSelect()

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

      this.$nextTick(() => {
        this.refreshTableSelections()
      })
    },

    onClickBackBtn() {
      this.$router.back()
    },

    onClickSaveBtn() {
      this.$refs.formData.validate(isValid => {
        if (isValid) {
          if (this.selections.size) {
            this.handleSaveAction()
          } else {
            return this.$message.error('请选择权限')
          }
        }
      })
    },

    async handleSaveAction() {
      const url = this.isEdit ? 'updateRole' : 'saveRole'

      await this.$api[url](Object.assign({}, this.formData, {
        menuIdList: [...this.selections],
        permIdList: [...this.btnPermission]
      }))

      this.$message.success('上传成功')
      this.onClickBackBtn()
    },

    refreshTableSelections () {
      const selections = [...this.selections]

      this.$refs.tableData.clearSelection()

      selections.forEach(current => {
        const menu = this.tableData.find(innerCurrent => innerCurrent.menuId === current)

        if(menu) {
          this.$refs.tableData.toggleRowSelection(menu, true)
        }
      })
    },

    onSelectTable (selection, row, isSkip) {
      let selected = !this.selections.has(row.menuId)

      this.handleParentCheck(row, selected)
      if(!isSkip) {
        this.handleChildrenCheck(row, selected)
      }

      this.refreshTableSelections()
    },

    handleChildrenCheck (row, selected) {
      if(selected) {
        this.selections.add(row.menuId)

        if(row.menuType === '1' && row.permList && row.permList.length) {
          row.permList.forEach(current => {
            this.btnPermission.add(current.id)
          })

          this.arrBtnPermission = [...this.btnPermission]
        }
      } else {
        this.selections.delete(row.menuId)

        if(row.menuType === '1' && row.permList && row.permList.length) {
          row.permList.forEach(current => {
            this.btnPermission.delete(current.id)
          });

          this.arrBtnPermission = [...this.btnPermission]
        }
      }

      if(row.list && row.list.length) {
        row.list.forEach(current => {
          this.handleChildrenCheck(current, selected)
        })
      }
    },

    handleParentCheck (row, selected) {
      if(row.menuId !== '0') {
        if(selected) {
          this.selections.add(row.menuId)
        } else {
          this.selections.delete(row.menuId)
        }

        const nowParentId = row.parentId

        if(!selected) {
          const selections = [...this.selections]

          const otherSiblings = selections.filter(current => {
            const menu = this.tableData.find(innerCurrent => innerCurrent.menuId === current)
            if(menu) {
              if(menu.parentId === nowParentId) return true
            }
          })
          
          if(otherSiblings.length) {
            return
          }
        }
        

        if(nowParentId) {
          const menu = this.tableData.find(current => current.menuId === nowParentId)

          if(menu) {
            this.handleParentCheck(menu, selected)
          }
        }
      }
    },

    onClickExtendBtn ({ row, $index }) {
      if(!row.isExtend) {
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

        this.tableData.splice(($index + 1), 0, ...child)
        
      } else {
        this.$set(row, 'isExtend', false)
        const spliceLength = this.getExpandedChildrenLength(row)
        this.tableData.splice($index + 1, spliceLength)
      }

      this.refreshTableSelections()
    },

    getExpandedChildrenLength (clickedData) {
      let childrenLength = 0
      function loop (clickedData) {
        clickedData.forEach(current => {
          if(current.isExtend) {
            childrenLength++
            if(current.list) {
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

    onChangeCheckbox (item, selected, { row }) {
      if(selected) {
        this.btnPermission.add(item.id)

        const nowArrBtnPermission = [...this.btnPermission]

        const selected = row.permList.filter(current => {
          const found = nowArrBtnPermission.find(innerCurrent => {
            if(current.id === innerCurrent) {
              return true
            }
          })

          if(found) {
            return true
          }
        })

        if(selected.length === 1) {
          if(!this.selections.has(row.menuId)) {
            this.onSelectTable('', row, true)
          }
        }
      } else {
        this.btnPermission.delete(item.id)
      }
      
      this.arrBtnPermission = [...this.btnPermission]
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

<style lang="scss">
#role-add {
  .el-table__header {
    background: #000;
    .el-table-column--selection {
      .el-checkbox {
        display: none!important;
      }
    }
  }
}
</style>