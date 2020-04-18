// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: 'se-course-0ypqs' })
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  db.collection('Holes').doc(event.holeId).update({
    data: {
      num_reply: _.inc(1),
      hot:_.inc(1)
    }
  })
  return await db.collection('Comments').add({
    data: {
      content: event.commentContent,
      createTime: db.serverDate(),
      holeId: event.holeId,
      userUrl: event.userUrl,
      userName: event.userName,
      userId: event.userId
    }
  })
}