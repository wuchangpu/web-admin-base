<template>
  <div class="_outter__wrap-box" style="width: 100px; height: 100px;" v-if="src">
    <img v-if="isPic" class="_outter_wrap" style="width: 100%; height: 100%; overflow: hidden;" :src="picturePrefix + src" @click="onClickShowPreviewDialog" />
    <span v-else @click="onClickShowPreviewDialog" style="text-decoration: underline; cursor: pointer;">点击下载</span>

    <el-dialog @close="onClosePreviewDialog" :visible="isShowPreviewDialog" append-to-body>
      <div class="_preview__wrap-box" style="width: 100%">
        <div>
          <el-button type="primary" @click.prevent="onClickDownloadBtn" size="small">
            <a style="color: #fff;" :href="getFilePath()" target="_blank">下载 {{ fileName || '文件' }}</a>
          </el-button>
        </div>
        <img v-if="isPic" :src="picturePrefix + src" style="width: 100%;" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { imageBaseUrl, Host } from '@/config';
export default {
  name: 'File-Preview',
  data () {
    return {
      isShowPreviewDialog: false,
      picturePrefix: imageBaseUrl,
      isPic: false,
    }
  },
  props: ['src', 'name', 'file-name'],

  created () {
    if(this.src) {
      this.isPic = /^.*?\.(jpg|jpeg|bmp|gif|png)$/ig.test(this.src);
    }

  },

  updated () {
    if(this.src) {
      this.isPic = /^.*?\.(jpg|jpeg|bmp|gif|png)$/ig.test(this.src);
    }
  },

  methods: {
    onClickShowPreviewDialog () {
      this.isShowPreviewDialog = true;
    },

    onClosePreviewDialog () {
      this.isShowPreviewDialog = false;
    },

    getFilePath () {
      return Host + 'file/download?fileName=' + (this.fileName || this.src || '文件下载') + '&filePath=' + this.src;
    },

    onClickDownloadBtn () {
      // const res = await this.$get('/zuul/common/file/download', {
      //   fileName: this.name || this.src || '文件下载',
      //   filePath: this.src
      // });
      window.open(Host + 'file/download?fileName=' + (this.fileName || this.src || '文件下载') + '&filePath=' + this.src, 'Downloading');
    }
  }
}
</script>

<style lang="scss">
._outter_wrap-box {
  
  
  ._outter_wrap {
    
  }
}
</style>

<style lang="scss">
._preview__wrap-box {
  
  img {
    
  }
}
</style>