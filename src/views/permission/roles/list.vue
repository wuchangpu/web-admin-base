<template>
  <div class="permission_roles">
    <div class="roles_wrapper">
      <el-form ref="form" :model="form" label-width="120px" class="form">
        <el-row>
          <el-col :span="6">
            <el-form-item label="角色：" label-width="80px">
              <el-input v-model="form.roleName" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态：" label-width="80px">
              <el-select v-model="form.status" placeholder="请选择" style="width: 100%;" clearable>
                <el-option label="启用" value="1"/>
                <el-option label="禁用" value="2"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="更新时间：">
              <el-col :span="11">
                <date-picker v-model="form.timeBegin" fullWidth/>
              </el-col>
              <el-col :span="2" class="line">-</el-col>
              <el-col :span="11">
                <date-picker v-model="form.timeEnd" fullWidth end/>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row class="search_button_row">
          <el-button type="primary" size="mini" @click="search">搜索</el-button>
        </el-row>
      </el-form>

      <div class="roles_container">
        <div class="btn_container">
          <el-button type="primary" size="mini" @click="toAddRole">新增角色</el-button>
          <el-button size="mini" @click="batchDel">批量删除</el-button>
        </div>
        <el-table
          ref="roleTable"
          :data="tableData"
          border
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection"></el-table-column>

          <el-table-column label="角色">
            <template slot-scope="scope">
              <span class="role_name" @click="toRoleDetail(scope)">{{ scope.row.roleName }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>

          <el-table-column label="状态" width="150">
            <template slot-scope="scope">
              <el-switch
                style="display: block"
                v-model="scope.row.status"
                :active-value="'1'"
                :inactive-value="'2'"
                inactive-color="#ccc"
                active-text="启用"
                inactive-text="禁用"
                @change="changeRoleStatus($event,scope)"
              ></el-switch>
            </template>
          </el-table-column>

          <el-table-column label="更新时间">
            <template
              slot-scope="scope"
            >{{ scope.row.updatedTime | filterTime('YYYY-MM-DD hh:mm') }}</template>
          </el-table-column>

          <el-table-column prop="address" label="操作">
            <template slot-scope="scope">
              <span class="edit_item" @click="editTableItem(scope)">编辑</span>
              <span class="del_item" @click="delTableItem(scope)">删除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="pagination">
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="form.pageNumber"
          :limit.sync="form.pageSize"
          @pagination="paginationChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        roleName: "",
        status: "",
        timeBegin: "",
        timeEnd: "",
        pageNumber: 1,
        pageSize: 20
      },
      tableData: [],
      total: 0,
      roleList: [],
      batchDelIds: []
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    // 角色启用禁用
    async changeRoleStatus(e, scope) {
      const res = await this.$post("sysRoleIsEnable", {
        roleId: scope.row.roleId
        // a: '1'
      });
      // console.log('response', typeof res)
      if (res.returnCode === "1000") {
        this.$message.success(
          `“${scope.row.roleName}”状态已${
            e === "1" ? "启用" : e === "2" ? "禁用" : ""
          }`
        );
      } else {
        this.tableData[scope.$index].status =
          e === "1" ? "2" : e === "2" ? "1" : "";
        // console.log('scope',scope.$index,this.tableData)
        this.$message.error(res.message);
      }
    },
    // 获取table数据
    async getTableData() {
      const res = await this.$post("sysRoleList", this.form);
      if (res.returnCode === "1000") {
        this.tableData = res.records;
        this.total = +res.total;
      } else {
        this.$message.error(res.message);
      }
    },
    // 点击搜索按钮
    search() {
      this.form.pageNumber = 1;
      this.getTableData();
    },
    editTableItem(scope) {
      this.$router.push({
        path: "/permission/roles/uodate",
        query: { id: scope.row.roleId }
      });
    },
    toAddRole() {
      this.$router.push("/permission/roles/save");
    },
    toRoleDetail(scope) {
      this.$router.push({
        path: "/permission/roles/info",
        query: { id: scope.row.roleId }
      });
    },
    handleSelectionChange(arr) {
      let array = [];
      arr.forEach(item => {
        array.push(item.roleId);
      });
      this.batchDelIds = array;
    },
    batchDel() {
      this.delRole(this.batchDelIds);
    },
    delTableItem(scope) {
      this.delRole([scope.row.roleId]);
    },
    // 删除角色
    async delRole(roleIds) {
      const res = await this.$post("sysRoleDelete", { roleIds });
      if (res.returnCode === "1000") {
        this.$message.success("删除成功");
        this.tableData = this.tableData.filter(
          item => !roleIds.includes(item.roleId)
        );
      } else {
        this.$message.error(res.message);
      }
    },
    paginationChange(val) {
      this.form.pageNumber = val.page;
      this.form.pageSize = val.limit;
      this.getTableData();
    }
  }
};
</script>

<style lang="scss" scoped>
.permission_roles {
  background-color: #fff;
  min-height: calc(100vh - 84px - 58px);
  .roles_wrapper {
    background-color: #f9f9f9;
    .form {
      padding: 20px;
      background-color: #fff;
      margin-bottom: 20px;
      box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.1);
      .line {
        text-align: center;
      }
      .search_button_row {
        text-align: right;
      }
    }
    .roles_container {
      padding: 20px;
      background-color: #fff;
      .btn_container {
        margin-bottom: 10px;
      }
      .role_name {
        color: #007efc;
        cursor: pointer;
      }
      .el-switch {
        height: auto;
      }
      .edit_item,
      .del_item {
        display: inline-block;
        margin: 0 10px;
        cursor: pointer;
      }
      .edit_item {
        color: #007efc;
      }
    }
    .pagination {
      text-align: right;
    }
  }
}
</style>

