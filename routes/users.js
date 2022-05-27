const router = require('koa-router')()
const User = require('../models/userSchema')
const Counter = require('../models/counterSchema')
const util = require('../utils/util')
const jwt = require('jsonwebtoken')
const md5 = require('md5')
const { query } = require('koa/lib/request')
router.prefix('/users')
//用户登录
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
    }, 'cgl', {expiresIn: '1h'})
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

// 用户列表
router.get('/list',async (ctx)=> {
  const { userName, userId, state } = ctx.request.query
  const { page, skipIndex } = util.pager(ctx.request.query)
  let params = {}
  if(userName) params.userName = userName
  if(userId) params.userId = userId
  if(state&&state != '0') params.state = state
  try {
    let query = User.find(params, {_id: 0, userPwd: 0})
    let list = await query.skip(skipIndex).limit(page.pageSize)
    const total = await User.countDocuments(params)

    ctx.body = util.success({
      page: {
        ...page,
        total
      },
      list
      // query
    })
  } catch (error) {
    ctx.body = util.fail(error.stack)
  }
})

//删除用户
router.post('/delete', async (ctx)=> {
  const {userIds} = ctx.request.body
  const res = await User.updateMany({userId: { $in: userIds }}, {state: 2})
  if(res.nModified) {
    ctx.body = util.success(`共删除${res.nModified}条数据`)
    return
  }
  ctx.body = util.fail('删除失败')
})

//新增编辑用户
router.post('/operate', async (ctx)=> {
  const { userId, userName, userEmail, job, mobile, state, roleList, deptId, action } = ctx.request.body
  if(action == 'add') {
    if(!userName || !userEmail || !deptId) {
      ctx.body = util.fail('参数错误', util.CODE.PARAM_ERROR)
      return
    }
    const res = await User.findOne({$or: [{ userName }, {userEmail}] }, '_id userName userEmail')
    if(res) {
      console.log(res);
      ctx.body = util.fail(`系统监测到有重复的用户${userName} - ${userEmail}`)
    }else {
      const doc = await Counter.findOneAndUpdate({_id: 'userId'}, { $inc: {sequence_val: 1} }, { new: true })
      try {        
        const user = new User({
          userId: doc.sequence_val,
          userName,              
          userPwd: md5('123456'),
          userEmail,
          role: 1,
          roleList,
          job,
          state,
          deptId,
          mobile
        })
        user.save()
        ctx.body = util.success({},'新增成功')
      } catch (error) {
        ctx.body = util.fail('新增失败')
      }
    }
  }else {
    if(!deptId) {
      ctx.body = util.fail('部门为必填项', util.CODE.PARAM_ERROR)
      return
    }
    try {
      const res = await User.findOneAndUpdate({userId}, {job, mobile, state, roleList, deptId})
      ctx.body = util.success({},'更新成功')
    } catch (error) {
      ctx.body = util.fail('更新失败')
    }
  }
})

module.exports = router
