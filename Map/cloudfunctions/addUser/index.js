// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({env: 'se-course-0ypqs'})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('Users').add({
    data:{
      openid: event.openId,
      userinfo: event.userInformation,
      nickname: event.nickName,
      friends: [], // friends' openids
      posts: [], // holes' ids
      collections: [], // holes' ids
      messages: [], //data structure to be considered
    }
  })
}