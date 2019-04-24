<template>
  <div class="permission_add_role">
    <el-form ref="form" :model="form" :inline-message="true" :rules="rules" label-width="120px" class="form">
      <el-row>
        <el-col :span="5">
          <el-form-item label="角色：" label-width="80px" prop="roleName">
            <el-input v-model="form.roleName" placeholder="请输入" :disabled="disabled"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="3">
          <el-form-item label="状态：" label-width="80px" prop="status">
            <el-radio-group v-model="form.status" size="mini" :disabled="disabled">
              <el-radio label="1">启用</el-radio>
              <el-radio label="2">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row>
        <el-col :span="16">
          <el-form-item label="备注：" label-width="80px">
            <el-input v-model="form.remark" placeholder="请输入" :disabled="disabled"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div class="tree-contianer">
      <p>操作权限</p>
      <div class="tree">
        <permission-tree :treeData="treeData" :checkedKeys.sync="form.menuIdList"></permission-tree>
      </div>
    </div>

    <div class="btn-container">
      <el-button v-if="!disabled" type="primary" size="mini" @click="submitForm('form')">确定</el-button>
      <el-button size="mini" @click="$router.go(-1)">返回</el-button>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        roleName: '',
        status: '',
        remark: '',
        menuIdList: [],
      },
      treeData: [],
      rules: {
        roleName: [
          {required: true, message: '请输入角色名称', trigger: 'blur'}
        ],
        status: [
          {required: true, message: '请选择状态', trigger: 'change'}
        ],
      },
      whichOperate: '',
      disabled: false,
    }
  },
  computed: {
  },
  created(){
    this.getWhich();
    this.getTreeData();
    this.disabled = this.whichOperate === 'detail'
    if(this.whichOperate !== 'add'){
      this.getRolePermission();
    }
  },
  methods: {
    getWhich(){
      let arr = this.$route.path.split('/');
      this.whichOperate = arr[arr.length - 1];
    },
    // 禁用权限树
    disabledTree(arr){
      arr.forEach(item => {
        item.disabled = true;
        if(item.list){
          this.disabledTree(item.list);
        }
      });
    },
    // 获取权限树
    async getTreeData(){
      const res = await this.$post('sysMenuSelect', {});
      if(res.returnCode === '1000'){
        this.treeData = res.dataInfo;
        if(this.whichOperate === 'detail'){
          this.disabledTree(this.treeData);
        }
      } else {
        this.$message.error(res.message);
      }
    },
    // 角色查询
    async getRolePermission(){
      const res = await this.$post('sysRoleInfo', {
        roleId: this.$route.query.id
      });
      if(res.returnCode === '1000'){
        Object.keys(this.form).forEach(item => {
          this.form[item] = res.dataInfo[item];
        });
      } else {
        this.$message.error(res.message);
      }
    },
    // 点击确定按钮
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(!this.form.menuIdList.length) return this.$message.error('至少选择一个权限');
          if(this.whichOperate === 'add'){
            this.addRole();
          } else if(this.whichOperate === 'edit'){
            this.editRole();
          }
        } else {
          this.$message.error('有信息未填写');
          return false;
        }
      });
    },
    // 新增角色请求
    async addRole(){
      const res = await this.$post('sysRoleSave', this.form);
      if(res.returnCode === '1000'){
        this.$message.success('新增成功');
        this.$router.go(-1);
      } else {
        this.$message.error(res.message);
      }
    },
    // 编辑角色请求
    async editRole(){
      const res = await this.$post('sysRoleUpdate', Object.assign({}, this.form, {
        roleId: this.$route.query.id,
      }));
      if(res.returnCode === '1000'){
        this.$message.success('修改成功');
        this.$router.go(-1);
      } else {
        this.$message.error(res.message);
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.permission_add_role{
  padding: 10px 20px;
  background-color: #fff;
  box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.1);
  min-height: calc(100vh - 84px - 58px);
  .form{
    padding-top: 30px;
  }
  .tree-contianer{
    padding: 20px;
    margin-bottom: 100px;
    .tree{
      padding-left: 20px;
    }
  }
  .btn-container{
    text-align: center;
    margin-bottom: 30px;
  }
}
</style>

