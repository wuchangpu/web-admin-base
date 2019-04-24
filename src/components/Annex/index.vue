<template>
  <div class="annex">
    <div class="annex_content">
      <div class="annex_item" v-for="(v,i) in list" :key="i">
        <a :href="previewBaseUrl + v[keyOption.url]" target="_blank">{{ v[keyOption.name] }}</a>
        <a v-if="showDownload" :href="`${Host}/file/download?filePath=${v[keyOption.url]}&fileName=${v[keyOption.name]}`" 
        target="_blank">
          <span class="icon_container">
            <svg-icon icon-class="download"></svg-icon>
          </span>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { Host, previewBaseUrl } from '@/config'
export default {
  props: {
    list: {
      type: Array,
      default: function(){
        return []
      }
    },
    keyOption: {
      type: Object,
      default: function(){
        return {
          name: 'fileName',
          url: 'filePath'
        }
      }
    },
    showDownload: {
      type: Boolean,
      default: true
    },
  },
  data(){
    return {
      Host,
      previewBaseUrl,
    }
  },
}
</script>

<style lang="scss" scoped>
.annex{
  display: flex;
  font-size: 14px;
  line-height: 20px;
  color: #2e2e2e;
  .annex_content{
    display: flex;
    flex-direction: column;
    .annex_item{
      display: flex;
      margin-bottom: 10px;
      a{
        color: #007efc;
        margin-right: 10px;
        .icon_container{
          color: #629edb;
          font-size: 18px;
          padding: 5px;
        }
      }
    }
  }
}
</style>
