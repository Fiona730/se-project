// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({env: 'se-course-0ypqs'})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  db.collection('Holes').doc(event.holeId).update({
    data: {
      hot:_.inc(-1)
    }
  })

  return await db.collection('Users').doc(event.userId).update({
    data: {
      collections: _.pull(event.holeId)
    }
  }).then(res => { console.log(res) })
}