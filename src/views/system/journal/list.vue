<template>
	<div class="daily_record">
		<el-form ref="form" :model="form" label-width="120px" class="form"> 
        <el-row>
          <el-col :span="6">
            <el-form-item label="操作人/工号:">
              <el-input v-model="form.username" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="角色">
              <el-input v-model="form.roleName" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="日志详情:">
              <el-input v-model="form.logOperation" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="更新时间:">
							<el-col :span="11">
								<date-picker v-model="form.timeBegin" fullWidth />
							</el-col>
							<el-col :span="2" class="line">-</el-col>
							<el-col :span="11">
								<date-picker v-model="form.timeEnd" fullWidth end />
							</el-col>
						</el-form-item>
					</el-col>
				</el-row>
        <el-row class="search_button_row">
          <el-button type="primary" size="mini" @click="search">搜索</el-button>
        </el-row>
      </el-form>
			<el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        label="操作时间"
        width="180">
				<template slot-scope="scope">
					{{ scope.row.createDate | filterTime('YYYY-MM-DD hh:mm:ss')}}
				</template>
      </el-table-column>
      <el-table-column
        prop="username"
        label="操作人"
        width="180">
      </el-table-column>
      <el-table-column
        prop="jobNumber"
        label="工号">
      </el-table-column>
			<el-table-column
        prop="roleName"
        label="角色">
      </el-table-column>
			<el-table-column
        prop="logOperation"
        label="日志详情">
      </el-table-column>
    </el-table>
		<div class="pagination">
      <pagination 
        v-show="total>0" 
        :total="total" 
        :page.sync="form.pageNumber" 
        :limit.sync="form.pageSize" 
        @pagination="onPageChange" 
      />
    </div>
	</div>
</template>


<script>
export default {
	data() {
		return {
			form: {
				username: '',
				roleName: '',
				logOperation: '',
				timeBegin: '',
				timeEnd: '',
				pageNumber: 1,
				pageSize: 20,
			},
			tableData: [],
			total: 0,
		}
	},
	methods: {
		search() {
			this.getData()
		},
		async getData() {
			const res = await this.$post('logList',this.form)
			if(res.returnCode === '1000'){
				this.tableData = res.records
				this.total = +res.total
			}else{
				return this.$message.error(res.message)
			}
		},
		onPageChange (val) {
      this.form.pageNumber = val.page;
      this.form.pageSize = val.limit;
      this.getData();
    },
	},
	created() {
		this.getData()
	},
}
</script>


<style lang="scss" scoped>
.daily_record{
	background-color: #fff;
	padding: 20px;
	.form{
		.line{
			text-align: center;
		}
	}
	.search_button_row{
		text-align: right;
	}
	.pagination{
    text-align: right;
  }
}
</style>
