/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * 邮箱
 * @param {*} s
 */
export function isEmail(s) {
  return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s)
}

/**
 * 手机号码
 * @param {*} s
 */
export function isMobile(s) {
  return /^([0-9]{1,})$/.test(s)
}

/**
 * the Validate Method for Element UI
 * @params { string } ruler
 * @params { string | value } value
 * @params { function } callback
 * @returns void
 */
export function validateInt(ruler, value, callback) {
  if (Number.isNaN(+value)) {
    callback(new Error('请输入数字'))
  }

  if (value < 0) {
    callback(new Error('请输入正数'))
  }

  if (!/^([0-9]{1,})$/.test(value)) {
    callback(new Error('请输入整数'))
  }

  callback()
}

export function validateMobile(ruler, value, callback) {
  if (!value) {
    callback(new Error('请输入手机号码'))
  } else if (!isMobile(value)) {
    callback(new Error('手机号码格式不正确'))
  }

  callback()
}

export function validateEmail(ruler, value, callback) {
  if (!value) {
    callback(new Error('请输入邮箱'))
  }

  if (!isEmail(value)) {
    callback(new Error('请输入正确的邮箱'))
  }

  callback()
}

export function validateArray(ruler, value, callback) {
  if (!value.length) {
    callback(new Error('请选择'))
  }

  callback()
}
