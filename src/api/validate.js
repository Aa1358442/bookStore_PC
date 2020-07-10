// 各种验证信息
// 是否手机或者电话号码
export function validatePhoneTwo (rule, value, callback) {
  const reg = /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/
  if (value === '' || value === undefined || value === null) {
    callback()
  } else {
    if ((!reg.test(value)) && value !== '') {
      callback(new Error('请输入正确的电话号码或者固话号码'))
    } else {
      callback()
    }
  }
}

//   是否身份证号码
export function validateIdNo (rule, value, callback) {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  if (value === '' || value === undefined || value === null) {
    callback()
  } else {
    if ((!reg.test(value)) && value !== '') {
      callback(new Error('请输入正确的身份证号码'))
    } else {
      callback()
    }
  }
}

//   是否手机号码
export function validatePhone (rule, value, callback) {
  const reg = /^[1][3-9][0-9]{9}$/
  if (value === '' || value === undefined || value === null) {
    callback()
  } else {
    if ((!reg.test(value)) && value !== '') {
      callback(new Error('请输入正确的电话号码'))
    } else {
      callback()
    }
  }
}

//   是否邮箱
export function validateEMail (rule, value, callback) {
  const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
  if (value === '' || value === undefined || value === null) {
    callback()
  } else {
    if (!reg.test(value)) {
      callback(new Error('请输入正确的邮箱'))
    } else {
      callback()
    }
  }
}

//   自动检验数值的范围
export function checkMax20000 (rule, value, callback) {
  if (value === '' || value === undefined || value === null) {
    callback()
  } else if (!Number(value)) {
    callback(new Error('请输入[1,20000]之间的数字'))
  } else if (value < 1 || value > 20000) {
    callback(new Error('请输入[1,20000]之间的数字'))
  } else {
    callback()
  }
}

//   验证是否1-99之间
export function isOneToNinetyNine (rule, value, callback) {
  if (!value) {
    return callback(new Error('输入不可以为空'))
  }
  setTimeout(() => {
    if (!Number(value)) {
      callback(new Error('请输入正整数'))
    } else {
      const re = /^[1-9][0-9]{0,1}$/
      const rsCheck = re.test(value)
      if (!rsCheck) {
        callback(new Error('请输入正整数，值为【1,99】'))
      } else {
        callback()
      }
    }
  }, 0)
}

//   验证是否整数
export function isInteger (rule, value, callback) {
  if (!value) {
    return callback(new Error('输入不可以为空'))
  }
  setTimeout(() => {
    if (!Number(value)) {
      callback(new Error('请输入正整数'))
    } else {
      const re = /^[0-9]*[1-9][0-9]*$/
      const rsCheck = re.test(value)
      if (!rsCheck) {
        callback(new Error('请输入正整数'))
      } else {
        callback()
      }
    }
  }, 0)
}

//   密码校验
export const validatePsdReg = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入密码'))
  }
  if (!/^(?![\d] $)(?![a-zA-Z] $)(?![^\da-zA-Z] $)([^\u4e00-\u9fa5\s]){6,20}$/.test(value)) {
    callback(new Error('请输入6-20位英文字母、数字或者符号至少2种'))
  } else {
    callback()
  }
}

//   账号校验
export const validateCode = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入账号'))
  }
  if (!/^(?![0-9]*$)(?![a-zA-Z]*$)[a-zA-Z0-9]{6,20}$/.test(value)) {
    callback(new Error('账号必须为6-20位字母和数字组合'))
  } else {
    callback()
  }
}

//   姓名校验

export function validateRealName (rule, value, callback) {
  const realnameReg = /^([a-zA-Z0-9\u4e00-\u9fa5·]{1,10})$/
  if (!value) {
    return callback(new Error('真实姓名不能为空!!'))
  }
  setTimeout(() => {
    if (!realnameReg.test(value)) {
      return callback(new Error('您的真实姓名格式错误,请输入英文或汉字!'))
    } else {
      callback()
    }
  }, 100)
}

// 纯数字校验
export const validateNumber = (rule, value, callback) => {
  let numberReg = /^\d+$|^\d+[.]?\d+$/
  if (value !== '') {
    if (!numberReg.test(value)) {
      callback(new Error('请输入数字'))
    } else {
      callback()
    }
  } else {
    callback(new Error('请输入值'))
  }
}
