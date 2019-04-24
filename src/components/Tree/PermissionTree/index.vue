<template>
  <div class="permission_tree">
    <el-tree
      ref="tree"
      class="my_tree"
      :data="treeData"
      :show-checkbox="isShowCheckbox"
      :node-key="nodeKey"
      highlight-current
      :props="defaultProps"
      :default-expand-all="defaultExpandAll || defaultExpandAll === ''"
      :expand-on-click-node="expandOnClickNode"
      :filter-node-method="filterNodeMethod"
      :indent="10"
      @check="checkChange"
      @node-click="nodeClick">
        <span slot-scope="scope" class="custom_tree_node_wrapper">

          <span v-if="whichCustomTreeNode === 'allAdmissionsTeam'" class="custom_tree_node all_admissions_team" @mouseenter="scope.data.showBtn = true" @mouseleave="scope.data.showBtn = false">
            <span class="left">
              <span class="dot" v-if="scope.data.status === '1'"></span>
              <span class="dot disabled" v-else></span>
              <span>{{ scope.node.label }}</span>
            </span>
            <span>
              <el-button v-show="scope.data.showBtn" type="text" size="mini" @click.stop="() => editNode(scope)">编辑</el-button>
            </span>
          </span>
          
          <span v-if="whichCustomTreeNode === 'menuTree'" class="custom_tree_node">
            <span>{{ scope.node.label }}</span>
            <span>
              <el-button type="text" size="mini" @click="() => editNode(scope)">编辑</el-button>
              <el-button type="text" size="mini" @click="() => removeNode(scope)">删除</el-button>
            </span>
          </span>
          
          <span v-if="whichCustomTreeNode === 'default'" class="custom_tree_node">
            <span>{{ scope.node.label }}</span>
          </span>

        </span>
    </el-tree>
  </div>
</template>

<script>
export default {
  props: {
    treeData: {
      required: true,
      type: Array,
    },
    nodeKey: {
      type: String,
      default: 'menuId'
    },
    isShowCheckbox: {
      type: Boolean,
      default: true
    },
    defaultProps: {
      type: Object,
      default: function(){
        return {
          children: 'list',
          label: 'menuName'
        }
      },
    },
    defaultExpandAll: {
      type: Boolean | String,
      default: false,
    },
    expandOnClickNode: {
      type: Boolean,
      default: true,
    },
    checkedKeys: {  // 多选时被选中项的keys
      type: Array,
      default: function(){
        return []
      },
    },
    filterText: { // 节点过滤传入的 输入框的文本
      type: String,
      default: '',
    },
    filterNodeMethod: { // 节点过滤方法
      type: Function,
      default: function(){
        return true
      }
    },
    whichCustomTreeNode: {
      type: String,
      default: 'default'
    },
  },
  data() {
    return {
    }
  },
  watch: {
    treeData(){
      this.setCurrentChoosed();
    },
    checkedKeys(){
      this.setCurrentChoosed();
    },
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    setCurrentChoosed(){
      if( !(this.treeData.length && this.checkedKeys.length) ) return;
      this.$refs.tree.setCheckedKeys(this.checkedKeys);
    },
    checkChange(data, checkedObj){
      this.$emit('update:checkedKeys', checkedObj.checkedKeys);
      this.$emit('checkChange', { last: data, checkedObj })
    },
    // menuTree时新增节点
    editNode(scope){
      this.$emit('editNode', scope);
    },
    // menuTree时删除节点
    removeNode(scope){
      this.$emit('removeNode', scope);
    },
    // 节点被点击
    nodeClick(data, node, component){
      this.$emit('nodeClick', data)
    },
  },
}
</script>

<style lang="scss" scoped>
.permission_tree{
  .my_tree{
    overflow: auto;
    max-height: 300px;
    .custom_tree_node_wrapper{
      width: 100%;
      .custom_tree_node{
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-right: 10px;
        &.all_admissions_team{
          .left{
            display: flex;
            align-items: center;
            .dot{
              margin-right: 5px;
              display: inline-block;
              width: 6px;
              height: 6px;
              border-radius: 50%;
              background-color: #007efc;
              &.disabled{
              background-color: #F56C6C;
              }
            }
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
.permission_tree{
  .el-tree-node__content{
    width: 500px;
  }
}
</style>

