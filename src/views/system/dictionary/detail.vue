<template>
<div class="system-dictionary-detail">
  <el-row class="detail">
    <el-col :span="8">
      <dl>
        <dt>字典名称：</dt>
        <dd>{{ detailData.dicName }}</dd>
      </dl>
    </el-col>
    
    <el-col :span="8">
      <dl>
        <dt>字典码：</dt>
        <dd>{{ detailData.dicCode }}</dd>
      </dl>
    </el-col>

    <el-col :span="8">
      <dl>
        <dt>状态：</dt>
        <dd>
          <el-radio-group v-model="detailData.deleted">
            <el-radio label="1">启用</el-radio>
            <el-radio label="2">禁用</el-radio>
          </el-radio-group>
        </dd>
      </dl>
    </el-col>
  </el-row>

  <div class="table__container">
    <h6>字典数据列表</h6>

    <div class="btn_container" style="margin-bottom: 20px">
      <el-button type="primary" size="mini" @click="onClickAddBtn">新增字典数据</el-button>
    </div>

    <el-table
      :data="tableData"
      border
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column type="index" />

      <el-table-column prop="dataKey" label="字典数据键" />

      <el-table-column prop="dataValue" label="选项名称" />
      
      <el-table-column prop="remark" label="备注" />

      <el-table-column prop="deleted" label="状态">
        <template slot-scope="scope">
          <el-switch 
            active-text="启用"
            active-value="1"
            inactive-text="禁用"
            inactive-value="2"
            :value="scope.row.deleted"
            @change="onChangeStatus($event, scope.row.id)"
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
    @close="onCloseDialog"
    :title="isEdit ? '编辑字典数据' : '新增字典数据'"
  >
    <el-row>
      <el-col :span="14">
        <el-form 
          :model="formData" 
          label-width="150px" 
          ref="dialogForm"
          :rules="ruler"
        >
          <el-form-item prop="dataValue" label="选项名称：">
            <el-input v-model="formData.dataValue" />
          </el-form-item>

          <el-form-item prop="dataSort" label="序号：">
            <el-input v-model="formData.dataSort" />
          </el-form-item>

          <el-form-item prop="deleted" label="状态：">
            <el-radio-group v-model="formData.deleted">
              <el-radio label="1">启用</el-radio>
              <el-radio label="2">禁用</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item prop="remark" label="备注：">
            <el-input v-model="formData.remark" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" size="small" @click="onClickSaveBtn">确认</el-button>
            <el-button size="small" @click="onCloseDialog">取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    
  </el-dialog>
</div>
</template>

<script>
export default {
  data () {
    return {
      tableData: [],
      isShowDialog: false,

      pageData: {
        pageSize: 5,
        pageNumber: 1,
      },

      total: 0,

      formData: {
        id: '',
        dicId: '',
        dataValue: '',
        dataSort: '',
        remark: '',
        deleted: '1'
      },

      ruler: {
        deleted: { required: true, message: '请选择', trigger: 'change' },
        dataSort: { required: true, message: '请输入', trigger: 'blur' },
        dataValue: { required: true, message: '请输入', trigger: 'blur' }
      },

      id: '',
      dicId: '',

      detailData: {
        dicName: '',
        dicCode: '',
        deleted: ''
      },

      isEdit: false,
    };
  },

  created () {
    if(this.$route.query.id) {
      this.id = this.$route.query.id;
      this.dicId = this.$route.query.dic_id;
      this.getCodeDetail();
      this.getTableData();
    }
  },
  
  methods: {
    async onChangeStatus (val, ...ids) {
      const res = await this.$post('dictionaryValueStatusChange', {
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

    async getCodeDetail () {
      const res = await this.$post('dictionaryDetail', {
        id: this.id
      });

      if(res.returnCode === '1000') {
        this.detailData = res.dataInfo;
      } else {
        return this.$message.error(res.message);
      }
    },

    async getTableData () {
      const res = await this.$post('dictionaryValueList', Object.assign({}, this.pageData, {
        dicId: this.id
      }));

      if(res.returnCode === '1000') {
        this.tableData = res.records;
        this.total = +res.total;
      } else {
        return this.$message.error(res.message);
      }
    },

    onPageChange ({ page, limit }) {
      this.pageData.pageNumber = page;
      this.pageData.pageSize = limit;
      this.getTableData();
    },

    onClickAddBtn () {
      this.isShowDialog = true;
    },

    onClickSaveBtn () {
      this.$refs.dialogForm.validate(isValid => isValid && this.handleSaveAction());
    },

    onClickEditBtn ({ row }) {
      this.isShowDialog = true;

      this.isEdit = true;

      this.formData = {
        id: row.id,
        dicId: row.dicId,
        dataValue: row.dataValue,
        dataSort: row.dataSort,
        remark: row.remark,
        deleted: row.deleted
      };
    },

    async handleSaveAction () {
      const res = await this.$post('dictionaryValueAdd', Object.assign({}, this.formData, {
        dicId: this.id
      }));

      if(res.returnCode === '1000') {
        this.$message.success('操作成功');
        this.onCloseDialog();
        this.getTableData();
      } else {
        return this.$message.error(res.message);
      }
    },

    onCloseDialog () {
      this.isShowDialog = false;

      this.formData = {
        id: '',
        dicId: '',
        dataValue: '',
        dataSort: '',
        remark: '',
        deleted: '1'
      };

      this.$refs.dialogForm.resetFields();
    }
  }
}
</script>

<style lang="scss" scoped>
.system-dictionary-detail {
  .detail {
    background: #fff;
    padding: 20px;
    dd, dt {
      display: inline-block;
      font-size: 12px;
      color: #666;
    }

    dd {
      margin-left: 10px;
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