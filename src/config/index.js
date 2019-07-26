export const imageBaseUrl = process.env.VUE_APP_IMAGE_BASE_URL

/**
 * 文件类型，此处顺序勿更改，添加直接加在最后
 */
export const MIMETYPE = {
  word: {
    suffix: 'doc,docx',
    type: 'application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  },
  excel: {
    suffix: 'xls,xlsx',
    type: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  },
  ppt: {
    suffix: 'ppt,pptx',
    type: 'application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation'
  },
  pdf: {
    suffix: 'pdf',
    type: 'application/pdf'
  },
  video: {
    suffix: 'mp4,ogv,webm',
    type: 'video/mp4,video/ogg,video/webm'
  },
  image: {
    suffix: 'gif,jpg,png,bmp',
    type: 'image/gif,image/jpeg,image/png,image/bmp'
  },
  text: {
    suffix: 'txt',
    type: 'text/plain'
  },
  zip: {
    suffix: 'zip',
    type: 'application/zip, application/octet-stream, application/x-zip-compressed, multipart/x-zip'
  },
  rar: {
    suffix: 'rar',
    type: 'application/x-rar-compressed, application/octet-stream'
  }
}
