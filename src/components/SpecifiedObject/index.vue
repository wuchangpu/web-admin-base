<template>
  <div class="specified_object" v-show="['2','3','4'].includes(type)">

    <vue-draggable-resizable :w="200" :h="300" :resizable="false" :z="9999" class-name="my_draggable" drag-handle=".switch_btn_row">
      <div class="specified_object_container">
          
        <el-row class="switch_btn_row">
          <el-button type="primary" size="small" style="width: 100%">
            {{ type === '2' ? '招生组' : type === '3' ? '指定角色' : type === '4' ? '自定义成员' : '' }}
          </el-button>
        </el-row>

        <el-row class="search_row">
          <el-input placeholder="请输入" size="small" v-model="filterText">
            <i slot="suffix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-row>

        <el-row class="content_wrapper">
          <!-- <permission-tree v-show="type === '2'" :treeData="admissionsTeamList" :defaultProps="treeProps" nodeKey="id" :filterNodeMethod="filterNodeMethod" :filterText="filterText" @checkChange="checkChange" /> -->

          <div class="checkbox_wrapper" v-show="type === '2'">
            <el-checkbox-group v-model="admissionsTeamCheckList" @change="checkChange" :disabled="disabled">
              <el-checkbox v-for="(v,i) in admissionsTeamList" :key="'teamList' + i" :label="v.id">{{ v.groupName }}</el-checkbox>
            </el-checkbox-group>
          </div>

          <div class="checkbox_wrapper" v-show="type === '3'">
            <el-checkbox-group v-model="roleCheckList" @change="checkChange" :disabled="disabled">
              <el-checkbox v-for="(v,i) in roleList" :key="'roleList' + i" :label="v.dataKey">{{ v.dataValue }}</el-checkbox>
            </el-checkbox-group>
          </div>

        <div class="checkbox_wrapper" v-show="type === '4'">
          <el-checkbox-group v-model="customCheckList" @change="checkChange" :disabled="disabled">
            <el-checkbox @change="onChangeSingleCheck($event, v.userId, customCheckList)" v-for="v in cadreList" :key="v.userId" :label="v.userId">
              <span class="username ellipsis" :title="v.username">{{ v.username }}</span>
              <span class="jobNumber">({{ v.jobNumber }})</span>
            </el-checkbox>
          </el-checkbox-group>
        </div>

        </el-row>
        
      </div>
    </vue-draggable-resizable>

  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array | String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data(){
    return {
      filterText: '',
      treeProps: {
        label: 'groupName',
        children: 'child',
      },
      admissionsTeamCheckList: [],
      roleCheckList: [],
      customCheckList: [],

      admissionsTeamList: [],
      backupAdmissionsTeamList: [],
      cadreList: [],
      backupCadreList: [],
      roleList: [
        { dataKey: '1', dataValue: '一级组长' },
        { dataKey: '2', dataValue: '二级组长' },
        { dataKey: '3', dataValue: '招生干部' }
      ],
      backupRoleList: [
        { dataKey: '1', dataValue: '一级组长' },
        { dataKey: '2', dataValue: '二级组长' },
        { dataKey: '3', dataValue: '招生干部' }
      ],
    }
  },
  created(){
    this.getAdmissionsTeamList();
    this.getCadreList();
  },
  watch: {
    filterText(val){
      switch(this.type){
        case '2':
          this.filterTeamList();
        case '3':
          this.filterRoleList();
          break;
        case '4':
          this.filterCadreList();
          break;
      }
    },
    type(){
      this.filterText = '';
    },
    value(){
      this.echo();
    },
  },
  methods: {
    // filterNodeMethod(value, data, node){
    //   if (!value) return true;
    //   return data.groupName.indexOf(value) !== -1;
    // },
    filterTeamList(){
      if(!this.filterText) return this.admissionsTeamList = this.backupAdmissionsTeamList;
      this.admissionsTeamList = this.backupAdmissionsTeamList.filter(item => item.groupName.includes(this.filterText));
    },
    filterRoleList(){
      if(!this.filterText) return this.roleList = this.backupRoleList;
      this.roleList = this.backupRoleList.filter(item => item.dataValue.includes(this.filterText));
    },
    filterCadreList(){
      if(!this.filterText) return this.cadreList = this.backupCadreList;
      this.cadreList = this.backupCadreList.filter(item => item.username.includes(this.filterText));
    },
    // 选择框change
    checkChange(val){
      // console.log('val', val)
      this.$emit('input', val);
      if(this.type === '3') {
        this.$emit('change-role', val);
      }
    },

    onChangeSingleCheck (val, id, selected) {
      this.$emit('select-change', {
        val,
        id,
        list: this.cadreList
      });
      
      if(this.type === '4') {
        this.$emit('change-user', id, this.backupCadreList, selected);
      }
    },
    // 回显
    echo(){
      if( !(this.value instanceof Array) ) return;
      switch(this.type){
        case '2':
          this.admissionsTeamCheckList = this.value;
          break;
        case '3':
          this.roleCheckList = this.value;
          break;
        case '4':
          this.customCheckList = this.value;
          break;
      }
    },
    /**
     * 清空复选框(父组件手动点击切换时需要调用此方法)
     */
    clearCheckbox(){
      this.admissionsTeamCheckList = [];
      this.roleCheckList = [];
      this.customCheckList = [];
      this.$emit('input', '');
    },
    // 获取招生组列表
    async getAdmissionsTeamList(){
      const res = await this.$post('adminssionGroupList', { groupName: '' });
      if(res.returnCode === '1000'){
        this.backupAdmissionsTeamList = this.admissionsTeamList = res.dataInfo;
      } else {
        this.$message.error(res.message);
      }
    },
    // 获取所有成员
    async getCadreList(username = ''){
      const res = await this.$post('adminssionCadreSelect', { username });
      if(res.returnCode === '1000'){
        this.backupCadreList = this.cadreList = res.dataInfo;
      } else {
        this.$message.error(res.message);
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.specified_object{
  position: fixed;
  top: 100px;
  right: 230px;
  z-index: 666;
  .my_draggable{
    border: none;
  }
  .specified_object_container{
    // position: fixed;
    // top: 100px;
    // right: 30px;
    // height: calc(100vh - 120px);
    // width: 200px;
    // overflow-y: auto;
    // overflow-x: hidden;  
    overflow-x: hidden;
    background-color: #fff;
    border-radius: 2px;
    .content_wrapper{
      height: calc(100vh - 180px);
      overflow-x: hidden;
      overflow-y: auto;
      border: 1px solid #D1D4DA;
      padding: 5px 0;
      font-size: 14px;
      border-top: none;
      border-bottom-left-radius: 2px;
      border-bottom-right-radius: 2px;
    }
  }
}
</style>

<style lang="scss">
.specified_object{
  .specified_object_container{
    .switch_btn_row{
      button{
        border: none;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
      }
    }
    .search_row{
      .el-input{
        .el-input__inner{
          border-radius: 0;
        }
      }
    }
    .content_wrapper{
      .checkbox_wrapper{
        .el-checkbox-group{
          display: flex;
          flex-direction: column;
          .el-checkbox{
            display: flex;
            align-items: center;
            width: 180px;
            margin: 2px 10px;
            .el-checkbox__label{
              width: 166px;
              overflow: hidden;
              text-overflow: ellipsis;
              display: flex;
              align-items: center;
              .username{
                display: inline-block;
                font-size: 14px;
                width: 50px;
              }
              .jobNumber{
                font-size: 12px;
                color: #999;
              }
            }
          }
        }
      }
    }
  }
}
</style>
