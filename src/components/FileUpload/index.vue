<template>
  <div class="file-upload">
    <el-upload
      :action="Host + Api.fileUpload"
      :list-type="listType"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-success="handleAvatarSuccess"
      :on-error="handleError"
      :before-upload="onBeforeUpload"
      :limit="limit"
      :disabled="disabled"
      :on-exceed="onExceed"
      :file-list="fileLists">
      <el-button size="small" type="primary" v-if="uploadBtn">点击上传</el-button>
    </el-upload>
  </div>
</template>

<script>
import Api from '@/service/api'
import { Host, MIMETYPE } from '@/config'

export default {
  data () {
    return {
      Api,
      Host,
      MIMETYPE,
      dialogImageUrl: '',
      dialogVisible: false,
      fileNum: 0,
      acceptObj: {
        suffix: '',
        type: ''
      },
    }
  },
  props: {
    value: {
      type: Array
    },
    requireEcho: {
      type: Boolean,
      default: false,
    },
    listType:{
      type: String,
      default: 'text'
    },
    fileLists:{
      type:Array,
    },
    uploadBtn:{
      type:Boolean,
      default:true,
    },
    limit: {
      type: Number,
      default: 1000
    },
    accept: {
      type: String,
    },
    hasUploading: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    fileNum(val){
      this.$emit('update:hasUploading', val > 0);
    },
    accept(val){
      this.getMimeType();
    },
  },
  created(){
    this.getMimeType();
  },
  methods:{
    // 获取 accept 的MIMETYPE
    getMimeType(){
      if(!this.accept) return;
      let typeArr = [],suffixArr = [],
      indexArr = this.accept.split(',');
      for(let i = 0; i < indexArr.length; i++){
        typeArr.push(this.MIMETYPE[indexArr[i]].type)
        suffixArr.push(this.MIMETYPE[indexArr[i]].suffix)
      }
      this.acceptObj.type = typeArr.join(',');
      this.acceptObj.suffix = suffixArr.join(',');
    },

    // 获取成功上传的文件列表
    getFileList(eleFileList){
      let arr = [];
      eleFileList.forEach(item => {
        if(item.response){
          arr.push(JSON.parse(item.response.dataInfo));
        } else {
          arr.push({ fileName: item.name, filePath: item.url });
        }
      });
      return arr;
    },

    // 上传文件之前的钩子
    onBeforeUpload (file) {
      // console.log('file', file);
      if(this.accept){
        if(file.type){
          if( !this.acceptObj.type.includes(file.type) ){
            this.$message.error('仅支持上传的文件类型：' + this.accept);
            return false;
          }
        } else {
          let arr = file.name.split('.');
          let suffix = arr[arr.length-1];
          if( !this.acceptObj.suffix.includes(suffix) ){
            this.$message.error('仅支持上传的文件类型：' + this.accept);
            return false;
          }
        }
      }
      this.$emit('beforeUpload', file);
      this.fileNum ++ ;
    },

    // 文件上传成功时的钩子
    handleAvatarSuccess(res, file,fileList) {
      this.fileNum -- ;

      let dataInfo = JSON.parse(file.response.dataInfo)
      this.$emit('getFiles',dataInfo)
      
      let files = this.getFileList(fileList);
      this.$emit('input', files);
    },

    // 文件上传失败时的钩子
    handleError(err, file, fileList){
      this.fileNum -- ;
      let str = err.toString().split('<head><title>')[1].split('</title></head>')[0];
      this.$message.error(str);
    },

    // 文件列表移除文件时的钩子
    handleRemove(file, fileList) {
      this.$emit('removeFile',{file,fileList})
      
      let files = this.getFileList(fileList);
      this.$emit('input', files);
    },

    // 点击文件列表中已上传的文件时的钩子
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    // 文件超出个数限制时的钩子
    onExceed () {
      return this.$message.error('最多只能上传 ' + this.limit + ' 个文件');
    },
  },
}
</script>

<style lang="scss">
.file-upload{
  .el-upload-list{
    .el-upload-list__item{
      width: 60% !important;
    }
  }
}
</style>
