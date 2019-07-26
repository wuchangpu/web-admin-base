<template>
  <div class="layout__page">
    <h2 class="layout__title">新建图片</h2>

    <div class="layout__form">
      <el-form ref="formData" :model="formData" label-width="100px" :rules="ruler">
        <el-form-item label="标题：" prop="title">
          <el-input v-model="formData.title" />
        </el-form-item>

        <el-form-item label="位置：" prop="position">
          <el-select v-model="formData.position">
            <el-option
              v-for="option in positionList"
              :key="option.id"
              :label="option.dataValue"
              :value="option.dataKey"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="文件类型：" prop="bannerType">
          <el-radio-group v-model="formData.bannerType">
            <el-radio label="1">图片</el-radio>
            <el-radio label="2">视频</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="上传：" prop="bannerPath">
          <file-upload
            :file-lists="fileList"
            list-type="picture"
            :accept="accept"
            :limit="1"
            @getFiles="getFiles"
            @removeFile="removeFile"
          />

          <p>说明： 单张图片需小于xxx,推荐图片尺寸为：xxxx,支持jpg、jif、bmp、png格式。</p>
        </el-form-item>

        <el-form-item label="跳转链接：" prop="bannerUrl">
          <el-input v-model="formData.bannerUrl" />
        </el-form-item>

        <el-form-item label="生效时间：" prop="effectiveTime">
          <el-date-picker
            v-model="formData.effectiveTime"
            type="datetime"
            :picker-options="pickerOptions1"
            value-format="timestamp"
          />
        </el-form-item>

        <el-form-item label="失效时间：" prop="failureTime">
          <el-date-picker
            v-model="formData.failureTime"
            type="datetime"
            :picker-options="pickerOptions2"
            value-format="timestamp"
          />
        </el-form-item>

        <el-form-item label="排序值：" prop="sort">
          <el-input v-model="formData.sort" />
        </el-form-item>

        <el-form-item>
          <el-button @click="onClickBackBtn">返回</el-button>
          <el-button type="primary" @click="onClickSaveBtn">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { MIMETYPE, imageBaseUrl } from '@/config'
import { validateInt } from '@/utils/validate'
export default {
  data() {
    const _this = this
    return {
      formData: {
        appId: '',
        title: '',
        position: '',
        bannerType: '1',
        bannerName: '',
        bannerPath: '',
        bannerUrl: '',
        effectiveTime: '',
        failureTime: '',
        sort: ''
      },

      ruler: {
        title: { required: true, message: '请输入', trigger: 'blur' },
        position: { required: true, message: '请选择', trigger: 'change' },
        bannerType: { required: true, message: '请选择', trigger: 'change' },
        bannerPath: { required: true, message: '请选择', trigger: 'change' },
        bannerUrl: { required: true, message: '请输入', trigger: 'blur' },
        effectiveTime: { required: true, message: '请选择', trigger: 'change' },
        failureTime: { required: true, message: '请选择', trigger: 'change' },
        sort: [{ required: true, message: '请输入', trigger: 'blur' }, { validator: validateInt, trigger: 'blur' }]
      },

      fileList: [],

      positionList: [],

      accept: '',

      pickerOptions1: {
        disabledDate(time) {
          if (_this.formData.failureTime) {
            return time > _this.formData.failureTime
          } else {
            return false
          }
        }
      },

      pickerOptions2: {
        disabledDate(time) {
          return time < _this.formData.effectiveTime
        }
      },

      isEdit: false
    }
  },

  computed: {
    id() {
      return this.$route.query.id
    },

    appId() {
      return this.$route.query.appid
    }
  },

  watch: {
    'formData.bannerType'(value) {
      if (value === '1') {
        this.accept = Object.keys(MIMETYPE).slice(5, 6).join(',')
      } else {
        this.accept = Object.keys(MIMETYPE).slice(4, 5).join(',')
      }
    }
  },

  created() {
    this.accept = Object.keys(MIMETYPE).slice(5, 6).join(',')
    this.getDictionaryList()

    if (this.id) {
      this.isEdit = true
      this.getDetail()
    }
  },

  methods: {
    async getDetail() {
      const res = await this.$api.imageDetail({
        id: this.id
      })

      this.formData = {
        id: res.id,
        appId: res.appId,
        title: res.title,
        position: res.position,
        bannerType: res.bannerType,
        bannerName: res.bannerName,
        bannerPath: res.bannerPath,
        bannerUrl: res.bannerUrl,
        effectiveTime: res.effectiveTime,
        failureTime: res.failureTime,
        sort: res.sort
      }

      const bannerPathList = this.formData.bannerPath.split(',').filter(current => current)
      const bannerNameList = this.formData.bannerName.split(',').filter(current => current)

      this.fileList = bannerPathList.map((current, index) => ({
        name: bannerNameList[index],
        url: imageBaseUrl + '/' + current,
        __url: current
      }))
    },

    async getDictionaryList() {
      const res = await this.$api.getDictionaryByDicCodeList({
        dicCodeList: ['1001']
      })

      this.positionList = res['1001']
    },

    getFiles(val) {
      this.fileList.push({
        name: val.fileName,
        url: imageBaseUrl + '/' + val.filePath,
        __url: val.filePath
      })
    },

    removeFile(val) {
      this.fileList = val.fileList
    },

    onClickBackBtn() {
      this.$router.back()
    },

    onClickSaveBtn() {
      this.formData.bannerPath = this.fileList.map(current => current.__url).join(',')
      this.formData.bannerName = this.fileList.map(current => current.name).join(',')

      this.$refs.formData.validate(isValid => {
        if (isValid) {
          this.handleSaveAction()
        }
      })
    },

    async handleSaveAction() {
      const prop = this.isEdit ? 'imageUpdate' : 'imageAdd'

      const toSendData = this.$deepcopy(this.formData)

      if (!this.isEdit) {
        Object.assign(toSendData, {
          appId: this.appId
        })
      }

      await this.$api[prop](toSendData)

      this.$message.success('操作成功')
      this.onClickBackBtn()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
