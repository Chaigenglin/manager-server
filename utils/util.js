const request = require("koa/lib/request")

/**
 * 通用函数
 */
const log4js = require("./log4j.js")
const CODE = {
  SUCCESS: 200,
  PARAM_ERROR: 10001, //参数出错
  USER_ACCOUNT_ERROR: 20001, //账号密码错误
  USER_LOGIN_ERROR: 30001, //用户未登录
  BUSINESS_ERROR: 40001,//业务请求失败
  AUTH_ERROR: 50001,//TOKEN错误
}

//分页
module.exports = {
  pager({pageNum=1, pageSize=10}) {
    //字符串转数字
    pageNum *= 1
    pageSize *= 1
    const startIndex = (pageNum - 1) * pageSize
    return {
      page: {
        pageNum,
        pageSize,
      },
      startIndex,
    }
  },
  success(data='', msg='', code=CODE.SUCCESS) {
    log4js.debug(data)
    return {
      code,
      data,
      msg
    }
  },
  fail(msg='', code=CODE.BUSINESS_ERROR, data='',) {
    log4js.debug(msg)
    return {
      code,
      data,
      msg
    }
  },
}