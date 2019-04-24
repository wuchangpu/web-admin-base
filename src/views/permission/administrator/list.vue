<template>
  <div class="permission_administrator">
    <div class="roles_wrapper">
      <el-form ref="form" :model="form" label-width="120px" class="form">
        <el-row>
          <el-col :span="8">
            <el-form-item label="姓名/工号：">
              <el-input v-model="form.username" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="角色：">
              <el-select v-model="form.roleId" placeholder="请选择" clearable style="width: 100%;">
                <el-option
                  v-for="(v,i) in roleList"
                  :key="'roleList'+i"
                  :label="v.roleName"
                  :value="v.roleId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态：">
              <el-select v-model="form.status" placeholder="请选择" clearable style="width: 100%;">
                <el-option label="启用" value="1"/>
                <el-option label="禁用" value="2"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="16">
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
          <el-button type="primary" size="mini" @click="addAdministratorClick">新增管理员</el-button>
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

          <el-table-column prop="username" label="姓名"></el-table-column>

          <el-table-column prop="jobNumber" label="工号"></el-table-column>

          <el-table-column prop="idCard" label="身份证" show-overflow-tooltip></el-table-column>

          <el-table-column prop="roleName" label="角色" show-overflow-tooltip></el-table-column>

          <el-table-column prop="mobile" label="联系方式" show-overflow-tooltip></el-table-column>

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
                @change="changeAdministratorStatus($event,scope)"
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
              <span
                class="del_item"
                @click="delTableItem(scope)"
                v-if="userInfo.user.userId != scope.row.userId"
              >删除</span>
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

      <div class="dialog-container">
        <el-dialog :title="dialogTitle" :visible.sync="centerDialogVisible" center>
          <el-form ref="addForm" :model="addForm" :rules="rules" label-width="120px">
            <el-row>
              <el-col :span="21">
                <el-form-item label="工号：" prop="jobNumber">
                  <el-input v-model="addForm.jobNumber" placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="21">
                <el-form-item label="姓名：" prop="username">
                  <el-input v-model="addForm.username" placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="21">
                <el-form-item label="身份证号：" prop="idCard">
                  <el-input v-model="addForm.idCard" placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="21">
                <el-form-item label="联系方式：" prop="mobile">
                  <el-input v-model="addForm.mobile" placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="21">
                <el-form-item label="角色：" prop="roleIdList">
                  <el-select
                    multiple
                    v-model="addForm.roleIdList"
                    placeholder="请选择"
                    clearable
                    style="width: 100%;"
                  >
                    <el-option
                      v-for="(v,i) in roleList"
                      :key="i"
                      :label="v.roleName"
                      :value="v.roleId"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="closeDialog('addForm')">取 消</el-button>
            <el-button type="primary" @click="submitForm('addForm')">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    const validateJobNum = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入工号"));
      } else if (!this.$reg.jobNumber.test(value)) {
        callback(new Error("工号格式不正确"));
      } else {
        callback();
      }
    };
    const validateIdCard = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入身份证号码"));
      } else if (!this.$reg.idCard.test(value)) {
        callback(new Error("身份证号码格式不正确"));
      } else {
        callback();
      }
    };
    const validateMobile = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入手机号码"));
      } else if (!this.$reg.phone.test(value)) {
        callback(new Error("手机号码格式不正确"));
      } else {
        callback();
      }
    };
    return {
      form: {
        username: "",
        roleId: "",
        status: "",
        timeBegin: "",
        timeEnd: "",
        pageNumber: 1,
        pageSize: 20
      },
      tableData: [],
      total: 0,
      roleList: [],
      batchDelIds: [],
      dialogTitle: "",
      centerDialogVisible: false,
      addForm: {
        jobNumber: "",
        username: "",
        idCard: "",
        mobile: "",
        roleIdList: []
      },
      rules: {
        jobNumber: [
          { required: true, message: "请输入工号", trigger: "change" },
          { validator: validateJobNum, trigger: "blur" }
        ],
        username: [
          { required: true, message: "请输入姓名", trigger: "change" },
          { required: true, message: "请输入姓名", trigger: "blur" }
        ],
        idCard: [
          { required: true, message: "请输入身份证号码", trigger: "change" },
          { validator: validateIdCard, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "change" },
          { validator: validateMobile, trigger: "blur" }
        ],
        roleIdList: [{ required: true, message: "请选择角色", trigger: "blur" }]
      },
      curClickItemIndex: -1
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  created() {
    this.getTableData();
    this.getRoleList();
  },
  methods: {
    // 获取table数据
    async getTableData() {
      const res = await this.$post("sysUserList", this.form);
      if (res.returnCode === "1000") {
        this.tableData = res.records;
        this.total = +res.total;
      } else {
        this.$message.error(res.message);
      }
    },
    // 获取角色列表
    async getRoleList() {
      const res = await this.$post("sysRoleSelect", {});
      if (res.returnCode === "1000") {
        this.roleList = res.dataInfo;
      } else {
        this.$message.error(res.message);
      }
    },
    // 管理员启用禁用
    async changeAdministratorStatus(e, scope) {
      const res = await this.$post("sysUserIsEnable", {
        userId: scope.row.userId
      });
      if (res.returnCode === "1000") {
        this.$message.success(
          `“${scope.row.username}”状态已${
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
    // 点击搜索按钮
    search() {
      this.form.pageNumber = 1;
      this.getTableData();
    },
    handleSelectionChange(arr) {
      this.batchDelIds = arr.map(item => item.userId);
    },
    // 点击新增管理员
    addAdministratorClick() {
      this.addForm = {
        jobNumber: "",
        username: "",
        idCard: "",
        mobile: "",
        roleIdList: []
      };
      this.dialogTitle = "新增管理员";
      this.centerDialogVisible = true;
    },
    // 点击批量删除
    batchDel() {
      let delArr = this.tableData.filter(item =>
        this.batchDelIds.includes(item.userId)
      );
      let arr = delArr.map(item => item.username);
      this.$confirm(
        `此操作将删除管理员 “${arr.join("、")}” , 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.delAdministrator(this.batchDelIds);
        })
        .catch(() => {});
    },
    // 行内点击编辑按钮
    editTableItem(scope) {
      this.curClickItemIndex = scope.$index;
      this.getAdministrator(scope.row.userId);
    },
    // 查询管理员信息
    async getAdministrator(userId) {
      const res = await this.$post("sysUserQuerUserinfo", { userId });
      if (res.returnCode === "1000") {
        Object.keys(this.addForm).forEach(item => {
          this.addForm[item] = res.dataInfo[item];
        });
        this.dialogTitle = "编辑管理员";
        this.centerDialogVisible = true;
      } else {
        this.$message.error(res.message);
      }
    },
    // 行内点击删除按钮
    delTableItem(scope) {
      this.curClickItemIndex = scope.$index;
      this.$confirm(
        `此操作将删除管理员 “${scope.row.username}” , 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.delAdministrator([scope.row.userId]);
        })
        .catch(() => {});
    },
    // 删除管理员
    async delAdministrator(idList) {
      const res = await this.$post("sysUserDelete", { idList });
      if (res.returnCode === "1000") {
        this.$message.success("删除成功");
        this.tableData = this.tableData.filter(
          item => !idList.includes(item.userId)
        );
        this.total -= idList.length;
      } else {
        this.$message.error(res.message);
      }
    },
    paginationChange(val) {
      this.form.pageNumber = val.page;
      this.form.pageSize = val.limit;
      this.getTableData();
    },
    // 关闭dialog
    closeDialog(formName) {
      this.centerDialogVisible = false;
      this.$refs[formName].clearValidate();
    },
    // 点击dialog确定按钮
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.dialogTitle === "新增管理员") {
            this.addAdministrator();
          } else if (this.dialogTitle === "编辑管理员") {
            this.editAdministrator();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 新增管理员
    async addAdministrator() {
      const res = await this.$post("sysUserSave", this.addForm);
      if (res.returnCode === "1000") {
        this.$message.success("新增成功");
        this.centerDialogVisible = false;
        this.search();
      } else {
        this.$message.error(res.message);
      }
    },
    // 编辑管理员
    async editAdministrator() {
      let userId = this.tableData[this.curClickItemIndex].userId;
      const res = await this.$post(
        "sysUserUpdate",
        Object.assign({}, this.addForm, { userId })
      );
      if (res.returnCode === "1000") {
        this.$message.success("修改成功");
        this.centerDialogVisible = false;
        this.search();
        // 如果是更改本人的信息则需更新本地缓存
        if (this.userInfo.user.userId == userId) {
          Object.keys(this.addForm).forEach(item => {
            this.userInfo.user[item] = this.addForm[item];
          });
          this.userInfo.user.roleName = this.getRoleNames(
            this.addForm.roleIdList
          );
          this.$store.dispatch("setUserInfo", this.userInfo);
        }
      } else {
        this.$message.error(res.message);
      }
    },
    // 根据roleIdList获取roleName
    getRoleNames(roleIdList) {
      let arr = this.roleList
        .filter(item => roleIdList.includes(item.roleId))
        .map(v => v.roleName);
      return arr.join(",");
    }
  }
};
</script>

<style lang="scss" scoped>
.permission_administrator {
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

