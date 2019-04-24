<template>
<div class="page__layout">
  <div class="header">
    <p class="bold">本界面您可以查看角色权限情况，点击每行记录后的“查看/修改”可查看管理员详细信息</p>

    <p>更多注意事项与使用帮助请查看【打开本页帮助】</p>
  </div>

  <div class="content">
    <el-form class="form" @submit.prevent="onClickSearchBtn" :model="formData">
      <el-row>
        <el-col :span="8">
          <el-form-item>
            <el-input v-model="formData.roleName" placeholder="请输入姓名/工号" />
          </el-form-item>
        </el-col>

        <el-col :span="16" style="text-align: right;">
          <el-form-item>
            <el-button type="primary" native-type="submit" @click="onClickSearchBtn">查询</el-button>
            <el-button type="primary" @click="onClickAddBtn" v-permission="'creator:role:add'">添加角色</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div class="table">
      <el-table
        :data="tableData"
        border
        style="width: 100%;"
      >
        <el-table-column label="序号">
          <template slot-scope="scope">
            {{ (scope.$index + 1) + (pageData.pageSize * (pageData.pageNumber - 1)) }}
          </template>
        </el-table-column>

        <el-table-column prop="roleName" label="角色权限" />

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="onClickDetailBtn(scope)">查看</el-button>
            <el-button type="text" @click="onClickEditBtn(scope)">修改</el-button>
            <el-button type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination">
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="pageData.pageNumber"
        :limit.sync="pageData.pageSize"
        @pagination="onPageChange"
      />
    </div>
  </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      tableData: [],
      formData: {
        roleName: ''
      },

      copyData: {},

      pageData: {
        pageNumber: 1,
        pageSize: 20,
      },
      total: 0,
    };
  },

  created () {
    this.getTableData();
  },

  methods: {
    async getTableData () {
      const res = await this.$post('getRoleList', Object.assign({}, this.formData, this.pageData));

      if(res.returnCode === '1000') {
        this.tableData = res.records;
        this.total = +res.total;

        this.copyData = this.$deepCopy(this.formData);
      } else {
        return this.$message.error(res.message);
      }
    },
    
    onClickSearchBtn () {
      this.pageData.pageNumber = 1;
      this.getTableData();
      return false;
    },

    onPageChange ({ page, limit }) {
      this.pageData.pageNumber = page;
      this.pageData.pageSize = limit;

      this.formData = this.$deepCopy(this.copyData);
      this.getTableData();
    },

    onClickAddBtn () {
      this.$router.push({ name: 'RoleManagementForm' });
    },

    onClickEditBtn ({ row: { roleId } }) {
      this.$router.push({ name: 'RoleManagementFormUpdate', query: { id: roleId } });
    },

    onClickDetailBtn ({ row: { roleId } }) {
      this.$router.push({ name: 'RoleManagementDetail', query: { id: roleId, detail: '1' } });
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