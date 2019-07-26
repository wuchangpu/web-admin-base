<template>
  <div class="file-upload">
    <el-upload
      ref="upload"
      :action="Host + API.fileUpload[0]"
      :list-type="listType"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :on-error="handleError"
      :before-upload="onBeforeUpload"
      :limit="limit"
      :data="otherParams"
      :disabled="disabled"
      :on-exceed="onExceed"
      :headers="headerObject"
      :file-list="fileLists"
    >
      <el-button v-if="uploadBtn" size="small" type="primary">点击上传</el-button>
    </el-upload>
  </div>
</template>

<script>
import API from '@/config/api'
import { MIMETYPE } from '@/config'
import { mapGetters } from 'vuex'
const uuidv4 = require('uuid/v4')

export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    requireEcho: {
      type: Boolean,
      default: false
    },
    listType: {
      type: String,
      default: 'text'
    },
    fileLists: {
      type: Array,
      default: () => []
    },
    uploadBtn: {
      type: Boolean,
      default: true
    },
    limit: {
      type: Number,
      default: 1000
    },
    accept: {
      type: String,
      default: ''
    },
    hasUploading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      API,
      Host: process.env.NODE_ENV === 'development' ? '/dev-api' : process.env.VUE_APP_API_URL,
      MIMETYPE,
      dialogImageUrl: '',
      dialogVisible: false,
      fileNum: 0,
      acceptObj: {
        suffix: '',
        type: ''
      },
      otherParams: {
        uuid: ''
      },
      headerObject: {
        token: ''
      }
    }
  },

  computed: {
    userInfo() {
      return this.$store.state.user.userInfo
    },
    token() {
      return this.$store.state.user.token
    }
  },
  watch: {
    fileNum(val) {
      this.$emit('update:hasUploading', val > 0)
    },
    accept(val) {
      this.getMimeType()
    }
  },
  created() {
    this.headerObject.token = this.token
    this.getMimeType()
  },

  methods: {
    // 获取 accept 的MIMETYPE
    getMimeType() {
      if (!this.accept) return
      const typeArr = []
      const suffixArr = []
      const indexArr = this.accept.split(',')
      for (let i = 0; i < indexArr.length; i++) {
        typeArr.push(this.MIMETYPE[indexArr[i]].type)
        suffixArr.push(this.MIMETYPE[indexArr[i]].suffix)
      }
      this.acceptObj.type = typeArr.join(',')
      this.acceptObj.suffix = suffixArr.join(',')
    },

    // 获取成功上传的文件列表
    getFileList(eleFileList) {
      const arr = []
      eleFileList.forEach(item => {
        if (item.response) {
          arr.push(JSON.parse(item.response.dataInfo))
        } else {
          arr.push({ fileName: item.name, filePath: item.url })
        }
      })
      return arr
    },

    // 上传文件之前的钩子
    onBeforeUpload(file) {
      if (file.size > (20 * 1024 * 1024)) {
        this.$message.error('上传文件不能大于 20M')
        return false
      }

      this.otherParams.uuid = uuidv4()
      this.otherParams.uuid += file.uid
      // console.log('onBeforeUpload', file, file.uid.length)
      if (this.accept) {
        if (file.type) {
          if (!this.acceptObj.type.includes(file.type)) {
            this.$message.error('仅支持上传的文件类型：' + this.accept)
            return false
          }
        } else {
          const arr = file.name.split('.')
          const suffix = arr[arr.length - 1]
          if (!this.acceptObj.suffix.includes(suffix)) {
            this.$message.error('仅支持上传的文件类型：' + this.accept)
            return false
          }
        }
      }
      this.$emit('beforeUpload', file)
      this.fileNum++
    },

    // 文件上传成功时的钩子
    async handleUploadSuccess(res, file, fileList) {
      // console.log('handleUploadSuccess', res, file, fileList);
      // 获取文件信息
      if (res.returnCode === '1000') {
        const fileInfo = await this.getFilePathByUid()
        file.response.dataInfo = fileInfo
        const find = fileList.find(item => item.uid === file.uid)
        if (find) {
          find.response.dataInfo = fileInfo
        }

        this.fileNum--

        const dataInfo = JSON.parse(file.response.dataInfo)
        this.$emit('getFiles', dataInfo)

        const files = this.getFileList(fileList)
        this.$emit('input', files)
      } else {
        this.$refs.upload.abort(file)
        const foundIndex = this.fileLists.findIndex(current => file === current)
        this.fileLists.splice(foundIndex, 1)
        this.$message.error('上传失败')
      }
    },

    // 文件上传失败时的钩子
    handleError(err, file, fileList) {
      this.fileNum--
      const str = err.toString().split('<head><title>')[1].split('</title></head>')[0]
      this.$message.error(str)
    },

    // 文件列表移除文件时的钩子
    handleRemove(file, fileList) {
      // console.log('handleRemove', file, fileList);
      this.$emit('removeFile', { file, fileList })

      const files = this.getFileList(fileList)
      this.$emit('input', files)
    },

    // 点击文件列表中已上传的文件时的钩子
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },

    // 文件超出个数限制时的钩子
    onExceed() {
      return this.$message.error('最多只能上传 ' + this.limit + ' 个文件')
    },

    // 根据uid获取文件路径
    async getFilePathByUid() {
      const res = await this.$api.getResourceInfo({ uuidList: [this.otherParams.uuid] })
      
      const info = res.map(item => ({
        fileName: item.resourceName,
        filePath: item.resourceUrl
      }))
      return JSON.stringify(info[0])
    }
  }
}
</script>

<style lang="scss">
.file-upload{
  .el-upload-list{
    .el-upload-list__item{
      width: 60% !important
    }
  }
}
</style>
