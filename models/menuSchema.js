const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
  menuType: Number,
  menuState: Number,
  menuName: String,
  menuCode: String,
  path: String,
  icon: String,
  component: String,
  parentId: [mongoose.Types.ObjectId],
  "createTime" : {
      type:Date,
      default:Date.now()
  },//创建时间
  "updateTime" : {
      type:Date,
      default:Date.now()
  },//更新时间
})

module.exports = mongoose.model('menus',userSchema)