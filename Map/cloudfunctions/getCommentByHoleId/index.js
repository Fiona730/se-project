// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: 'se-course-0ypqs' })
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('Comments').where({holeId:event.holeId}).get()
}