const router = require('koa-router')()
const Menu = require('../models/menuSchema')
const util = require('../utils/util')
router.prefix('/menu')
//用户登录


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
  const { _id, action, ...params } = ctx.request.body
  let res, info;
  try {
    if(action == 'add') {
      Menu.create(params)
      info = '新增成功'
    }else if(action == 'edit') {
      info = '修改成功'
    }else if(action == 'delete') {
      info = '删除成功'
    }
  } catch (error) {
    
  }

})

module.exports = router
