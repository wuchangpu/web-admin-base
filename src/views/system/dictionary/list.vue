<template>
<div class="system-dictionary-list">
  <el-form :model="formData" label-width="120px" class="form">
    <el-row>
      <el-col :span="8">
        <el-form-item label="字典名称：" prop="dicName">
          <el-input v-model="formData.dicName" clearable @clear="onClearFormItem(formData, 'dicName')" />
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="状态：" prop="deleted">
          <el-select v-model="formData.deleted" clearable @clear="onClearFormItem(formData, 'deleted')">
            <el-option label="启用" value="1" />
            <el-option label="禁用" value="2" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24" style="text-align: right;">
        <el-form-item>
          <el-button type="primary" size="mini" @click="onClickSearchBtn">搜索</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>

  <div class="table__container">
    <div class="btn_container" style="margin-bottom: 20px">
      <el-button type="primary" size="mini" @click="onClickAddBtn">新增字典</el-button>
    </div>

    <el-table
      :data="tableData"
      border
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column type="selection" />

      <el-table-column prop="dicName" label="字典名称" min-width="200">
        <template slot-scope="scope">
          <router-link 
            :to="{ name: 'SystemDictionaryDetail', query: { id: scope.row.id, dic_id: scope.row.dicCode } }" 
            style="color: #66b1ff"
          >
            {{ scope.row.dicName }}
          </router-link>
        </template>
      </el-table-column>

      <el-table-column prop="dicCode" label="字典码" />

      <el-table-column prop="deleted" label="状态">
        <template slot-scope="scope">
          <el-switch 
            :active-text="'启用'"
            :inactive-text="'禁用'"
            :active-value="'1'"
            :inactive-value="'2'"
            :value="scope.row.deleted"
            @change="onChangeStatus($event, scope.row.id,)"
          />
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="onClickEditBtn(scope)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

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

  <el-dialog
    :visible="isShowDialog"
    :close-on-click-modal="false"
    @close="onClickCloseBtn"
    :title="isEdit ? '编辑数据字典' : '新增数据字典'"
  >
    <el-form 
      :model="dialogForm" 
      label-width="120px"
      ref="dialogForm"
      :rules="ruler"
    >
      <el-row>
        <el-col :span="14">
          <el-form-item label="字典名称：" prop="dicName">
            <el-input v-model="dialogForm.dicName" />
          </el-form-item>

          <el-form-item label="状态：" prop="deleted">
            <el-radio-group v-model="dialogForm.deleted">
              <el-radio label="1">启用</el-radio>
              <el-radio label="2">禁用</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" size="small" @click="onClickSaveBtn">确认</el-button>
            <el-button size="small" @click="onClickCloseBtn">取消</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      
    </el-form>
  </el-dialog>
</div>
</template>

<script>
export default {
  data () {
    return {

      formData: {
        dicName: '',
        dicCode: '',
        deleted: '',
      },

      copyData: {},

      pageData: {
        pageSize: 5,
        pageNumber: 1,
      },

      total: 0,

      tableData: [],

      isShowDialog: false,

      dialogForm: {
        id: '',
        dicName: '',
        dicCode: '',
        deleted: ''
      },

      ruler: {
        dicName: { required: true, message: '请输入', trigger: 'blur' },
        deleted: { required: true, message: '请选择', trigger: 'change' }
      },

      isEdit: false

    }
  },

  created () {
    this.getTableData();
  },

  methods: {

    onClearFormItem (obj, prop) {
      obj[prop] = '';
    },

    async onChangeStatus (val, ...ids) {
      const res = await this.$post('dictionaryStatusChange', {
        idList: ids,
        deleted: val
      });

      if(res.returnCode === '1000') {
        this.$message.success('修改成功');
        this.getTableData();
      } else {
        return this.$message.error(res.message);
      }
    },

    onClickEditBtn ({ row }) {
      this.isEdit = true;

      this.dialogForm = {
        id: row.id,
        dicName: row.dicName,
        dicCode: row.dicCode,
        deleted: row.deleted
      }

      this.isShowDialog = true;
    },

    async getTableData () {
      const res = await this.$post('dictionaryList', Object.assign({}, this.formData, this.pageData));

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
    },

    onPageChange (val) {
      this.pageData.pageNumber = val.page;
      this.pageData.pageSize = val.limit;
      this.formData = this.$deepCopy(this.copyData);

      this.getTableData();
    },

    onClickAddBtn () {
      this.isShowDialog = true;
    },

    onClickSaveBtn () {
      this.$refs.dialogForm.validate(isValid => isValid && this.handleSaveAction());
    },

    async handleSaveAction () {
      const res = await this.$post('dictionaryAdd', Object.assign({}, this.dialogForm));

      if(res.returnCode === '1000') {
        this.$message.success('操作成功');
        this.onClickCloseBtn();

        this.onClickSearchBtn();
      } else {
        return this.$message.error(res.message);
      }
    },

    onClickCloseBtn () {
      this.isShowDialog = false;

      this.dialogForm = {
        id: '',
        dicName: '',
        dicCode: '',
        deleted: ''
      };

      this.$refs.dialogForm.resetFields();
    }
  }
}
</script>

<style lang="scss" scoped>
.system-dictionary-list {
  .form{
    padding: 20px;
    background-color: #fff;
    margin-bottom: 20px;
    box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.1);
    .line{
      text-align: center;
    }
    .search_button_row{
      text-align: right;
    }
  }

  .table__container {
    margin-top: 20px;
    padding: 20px;
    background: #fff;
  }

  .pagination{
    text-align: right;
  }
}
</style>