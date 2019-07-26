<template>
  <el-popover
    placement="bottom"
    min-width="400px"
    trigger="click"
    :disabled="disabled"
  >
    <el-tree
      ref="tree"
      :data="data"
      :node-key="nodeKey"
      :props="defaultProps"
      style="overflow: auto; max-height: 400px"
      @node-click="handleNodeClick"
      :expand-on-click-node="true"
    />

    <el-input slot="reference" :disabled="disabled" v-model="orgName" :readonly="true" placeholder="全部" />
  </el-popover>
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'input'
  },

  props: {
    data: {
      required: true,
      type: Array
    },

    nodeKey: {
      required: true,
      type: String
    },

    defaultProps: {
      required: true,
      type: Object
    },

    value: {
      required: true
    },

    disabled: {
      type: Boolean
    }
  },

  data() {
    return {
      orgName: ''
    }
  },

  watch: {
    value() {
      const item = this.$refs.tree.getNode(this.value)
      if (item) {
        this.orgName = item.data[this.defaultProps.label]
      } else {
        this.orgName = ''
      }
    }
  },
  
  methods: {
    handleNodeClick(data) {
      this.orgName = data[this.defaultProps.label]

      this.$emit('input', data[this.nodeKey])
      this.$emit('node-click', data)
    },

    getOrgName() {
      return this.orgName
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
