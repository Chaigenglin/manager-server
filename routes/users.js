const router = require('koa-router')()
const User = require('../models/userSchema')
const util = require('../utils/util')
const jwt = require('jsonwebtoken')
router.prefix('/users')

router.post('/login',async (ctx)=> {
  try {
    const { userName, userPwd } = ctx.request.body
    const res = await User.findOne({
      userName,
      userPwd
    })
    const data = res._doc
    // console.log(data, '--=');
    const token = jwt.sign({
      userName,
      userPwd
    }, 'cgl', {expiresIn: 30})
    // console.log(token);
    if(res) {
      data.token = token
      ctx.body = util.success(data)
    }else {
      ctx.body = util.fail('账号或密码错误')
    }
  } catch (error) {
    ctx.body = util.fail(error.msg)
  }

})

module.exports = router
