const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const log4js = require('./utils/log4j')
const users = require('./routes/users')
const menus = require('./routes/menus')
const router = require('koa-router')()
const koajwt = require('koa-jwt')
const util = require('./utils/util')
// var log = log4js.getLogger()
// error handler
onerror(app)
require('./config/db')
// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  log4js.info('out put')
  await next().catch(err=> {
    if(err.status == '401') {
      ctx.status = 200
      ctx.body = util.fail('Token认证失败', util.CODE.AUTH_ERROR)
    }else {
      throw err
    }
  })
})
app.use(koajwt({
  secret: 'cgl'
}).unless({
  path: [/^\/api\/users\/login/]
}))
// routes
router.prefix("/api")
router.get('/leave/count', ctx => {
  ctx.body = 'body'
})
router.use(users.routes(), users.allowedMethods())
router.use(menus.routes(), menus.allowedMethods())
app.use(router.routes(), router.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
