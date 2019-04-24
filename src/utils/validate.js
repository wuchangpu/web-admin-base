/**
 * Created by jiachenpan on 16/11/18.
 */

export function isvalidUsername(str) {
  return true
    // const valid_map = ['admin', 'editor']
    // return valid_map.indexOf(str.trim()) >= 0
}

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}


export function idCard (rule, value, callback) {
  if (!this.$reg.idCard.test(value)) {
    callback(new Error('身份证号码格式不正确'));
  } else {
    callback();
  }
};
export function mobile (rule, value, callback) {
  if (!this.$reg.phone.test(value)) {
    callback(new Error('手机号码格式不正确'));
  } else {
    callback();
  }
};