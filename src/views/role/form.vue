<template>
<div class="page__layout">
  <div class="header">
    <p class="bold">本界面您可以查看管理员情况，点击每行记录后的“查看/修改”可查看管理员详细信息</p>

    <p>更多注意事项与使用帮助请查看【打开本页帮助】</p>
  </div>

  <div class="content">
    <h2>角色</h2>
    <el-form 
      :model="formData" 
      label-position="right" 
      label-width="120px"
      ref="formData"
      :rules="ruler"
      :disabled="isDetail"
    >
      <div>
        <h4>基本信息</h4>

        <el-row>
          <el-col :span="12">
            <el-form-item label="角色名称：" prop="roleName">
              <el-input :disabled="isDetail" v-model="formData.roleName" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="角色标示：" prop="roleMark">
              <el-input :disabled="isDetail" v-model="formData.roleMark" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="备注：" prop="remark">
              <el-input :disabled="isDetail" type="textarea" v-model="formData.remark" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="状态：" prop="status">
              <el-radio-group :disabled="isDetail" v-model="formData.status">
                <el-radio label="1">启用</el-radio>
                <el-radio label="2">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <div>
        <h4>权限</h4>

        <div>
          <el-table 
            :data="tableData"
            border
            style="width: 100%;"
            @select="onSelectTable"
            ref="tableData"
            :disabled="isDetail"
          >
            <el-table-column type="selection" min-width="55px" />

            <el-table-column label="菜单" prop="menuName" align="left">
              <template slot-scope="scope">
                <div :style="{ 'padding-left': ((scope.row.level - 1) * 30) + 'px' }">
                  <i @click="onClickExtendBtn(scope)" v-if="scope.row.hasChild" :class="(!scope.row.isExtend) ? 'el-icon-arrow-right': 'el-icon-arrow-down'"></i>
                  <!-- <el-checkbox :key="scope.row.id" @change="onChangeCheckbox(scope, $event)" :checked="scope.row.isSelected" /> -->
                  {{ scope.row.menuName }}
                </div>
              </template>
            </el-table-column>

            <el-table-column label="操作">
              <template slot-scope="scope">
                <div v-if="scope.row.parentId === '3'">
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
        </div>
      </div>

    </el-form>

    <div style="margin-top: 20px;">
      <el-button @click="onClickCancelBtn">取消</el-button>
      <el-button v-if="!isDetail" type="primary" @click="onClickSaveBtn">确定</el-button>
    </div>
  </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      formData: {
        roleName: '',
        remark: '',
        // roleType: '',
        menuIdList: '',
        permIdList: '',
        status: '1',
        roleMark: '',
        roleId: ''
      },

      ruler: {
        roleName: { required: true, message: '请输入', trigger: 'blur' },
        roleMark: { required: true, message: '请输入', trigger: 'blur' },
        status: { required: true, message: '请选择', trigger: 'change' }
      },

      tableData: [],

      selections: new Set([]),
      btnPermission: new Set([]),
      arrBtnPermission: [],

      isEdit: false,

      isDetail: false
    }
  },

  created () {

    if(this.$route.query.id) {
      this.isEdit = true;

      this.formData.roleId = this.$route.query.id;

      this.getDetail();
    }

    if(this.$route.query.detail === '1') {
      this.isDetail = true;
    }

    this.getTreeData();
  },

  methods: {
    async getDetail () {
      const res = await this.$post('getRoleDetail', {
        roleId: this.formData.roleId
      });

      if(res.returnCode === '1000') {

        const permissionList = res.dataInfo.sysMenuPermList.map(current => current.id);

        this.formData = {
          roleName: res.dataInfo.roleName,
          remark: res.dataInfo.remark,
          menuIdList: res.dataInfo.menuIdList,
          permIdList: permissionList,
          status: res.dataInfo.status,
          roleMark: res.dataInfo.roleMark,
          roleId: res.dataInfo.roleId
        };

        this.selections = new Set(res.dataInfo.menuIdList);
        this.btnPermission = new Set(permissionList);
        this.arrBtnPermission = [...this.btnPermission];

        this.refreshTableSelections();
      } else {
        return this.$message.error(res.message);
      }
    },

    async getTreeData () {
      const res = await this.$post('getAllMenuSelect');

      if(res.returnCode === '1000') {
        this.tableData = res.dataInfo.map(current => {
          Object.assign(current, {
            isExtend: false,
            hasChild: !!(current.list && (current.list.length > 0)),
            isSelected: false,
            level: 1,
            isShow: true
          });
          
          return current;
        });

        this.$nextTick(() => {
          this.refreshTableSelections();
        });
        

      } else {
        return this.$message.error(res.message);
      }
    },

    onSelectTable (selection, row) {
      let selected = !this.selections.has(row.menuId);

      this.handleParentCheck(row, selected);
      this.handleChildrenCheck(row, selected);

      this.refreshTableSelections();
    },

    onChangeCheckbox (item, selected, { row }) {
      if(selected) {
        this.btnPermission.add(item.id);

        const nowArrBtnPermission = [...this.btnPermission];

        const selected = row.permList.filter(current => {
          const found = nowArrBtnPermission.find(innerCurrent => {
            if(current.id === innerCurrent) {
              return true;
            }
          });

          if(found) {
            return true;
          }
        });

        if(selected.length === 1) {
          if(!this.selections.has(row.menuId)) {
            this.onSelectTable('', row);
          }
          
        }

      } else {
        this.btnPermission.delete(item.id);
      }
      
      this.arrBtnPermission = [...this.btnPermission];
    },

    refreshTableSelections () {
      const selections = [...this.selections];

      this.$refs.tableData.clearSelection();

      selections.forEach(current => {
        const menu = this.tableData.find(innerCurrent => innerCurrent.menuId === current);

        if(menu) {
          this.$refs.tableData.toggleRowSelection(menu, true);
        }
      });
    },

    handleChildrenCheck (row, selected) {
      if(selected) {
        this.selections.add(row.menuId);

        if(row.parentId === '3' && row.permList && row.permList.length) {
          row.permList.forEach(current => {
            this.btnPermission.add(current.id);
          });

          this.arrBtnPermission = [...this.btnPermission];
        }
      } else {
        this.selections.delete(row.menuId);

        if(row.parentId === '3' && row.permList && row.permList.length) {
          row.permList.forEach(current => {
            this.btnPermission.delete(current.id);
          });

          this.arrBtnPermission = [...this.btnPermission];
        }
      }

      if(row.list && row.list.length) {
        row.list.forEach(current => {
          this.handleChildrenCheck(current, selected);
        });
      }
    },

    handleParentCheck (row, selected) {
      if(row.menuId !== '0') {
        if(selected) {
          this.selections.add(row.menuId);
        } else {
          this.selections.delete(row.menuId);
        }

        const nowParentId = row.parentId;

        if(!selected) {
          
          const selections = [...this.selections];

          const otherSiblings = selections.filter(current => {
            const menu = this.tableData.find(innerCurrent => innerCurrent.menuId === current);
            if(menu) {
              if(menu.parentId === nowParentId) return true;
            }
            
          });
          
          if(otherSiblings.length) {
            return;
          }
        }
        

        if(nowParentId) {
          const menu = this.tableData.find(current => current.menuId === nowParentId);

          if(menu) {
            this.handleParentCheck(menu, selected);
          }
        }
      }
    },

    onClickExtendBtn ({ row, $index }) {
      
      if(!row.isExtend) {
        this.$set(row, 'isExtend', true);

        const child = row.list.map(current => {
          Object.assign(current, {
            level: row.level + 1,
            isExtend: false,
            hasChild: !!(current.list && (current.list.length > 0)),
            isSelected: false
          });

          return current;
        });

        this.tableData.splice(($index + 1), 0, ...child);
        
      } else {
        this.$set(row, 'isExtend', false);
        const spliceLength = this.getExpandedChildrenLength(row);
        this.tableData.splice($index + 1, spliceLength);
      }

      this.refreshTableSelections();
    },

    getExpandedChildrenLength (clickedData) {
      let childrenLength = 0;
      function loop (clickedData) {
        clickedData.forEach(current => {
          if(current.isExtend) {
            //childrenLength += current.children.length;
            childrenLength++;
            if(current.list) {
              loop(current.list);
            }
          } else {
            childrenLength++;
          }
        });
      }

      loop(clickedData.list);
      return childrenLength;

    },

    onClickCancelBtn () {
      this.$router.back();
    },

    onClickSaveBtn () {
      this.$refs.formData.validate(valid => {
        if(valid) {
          this.handleSaveAction();
        }
      });
    },

    async handleSaveAction () {
      const url = this.isEdit ? 'updateRoleForm' : 'saveRoleForm';

      const res = await this.$post(url, Object.assign({}, this.formData, {
        menuIdList: [...this.selections],
        permIdList: [...this.btnPermission]
      }));

      if(res.returnCode === '1000') {
        this.$message.success('上传成功');
        this.onClickCancelBtn();
      } else {
        return this.$message.error(res.message);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page__layout {
  .header {
    background: #fff;
    padding: 10px 20px;
    font-size: 14px;
    border-radius: 4px;

    .bold {
      font-weight: bolder;
    }
  }

  .content {
    padding: 40px 20px;
    background: #fff;
    margin-top: 20px;
    border-radius: 4px;

    .pagination {
      text-align: right;
    }
  }

  
}
</style>