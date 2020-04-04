// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({env: 'se-course-0ypqs'})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('Holes').add({
    data:{
      title: event.holeTitle,
      content: event.holeContent,
      type: event.holeType,
      img: event.imgPath,
      position: event.position,
      createTime: db.serverDate(),
      hot:1,
      num_likes: 0,
      num_reply:0,
      userName: event.userName,
      userId: event.userId
    }
  })
}