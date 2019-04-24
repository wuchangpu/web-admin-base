<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name:{{ name }}</div>
    <div class="dashboard-text">roles:<span v-for="role in roles" :key="role">{{ role }}</span></div>

    <file-upload></file-upload>

    <tinymce v-model="content"></tinymce>
    <el-button @click="click">click</el-button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data(){
    return {
      content: '',
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  created(){
  },
  methods: {
    click(){
      console.log('content', this.content)
    },
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
