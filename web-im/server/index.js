// https://www.jianshu.com/p/f0baf93a3795

var ws = require("nodejs-websocket");
var moment = require("moment");

console.log("开始建立连接...");

let users = []; // 在线用户列表
let conns = {}; // conn 连接集
let groups = []; // 在线群列表

function boardcast(obj) {
  // 单聊
  if (obj.bridge && obj.bridge.length) {    
    obj.bridge.forEach(item => {
      conns[item].sendText(JSON.stringify(obj));
    });
    return;
  }
  // 群聊
  if (obj.groupId) {
    console.log('群聊', JSON.stringify(groups));
    group = groups.filter(item => {
      return item.id === obj.groupId;
    })[0];
    group.users.forEach(item => {
      conns[item.uid].sendText(JSON.stringify(obj));
    });
    return;
  }

  // 系统消息扩播
  server.connections.forEach((conn, index) => {
    // console.log(index)
    conn.sendText(JSON.stringify(obj));
  });
}

var server = ws
  .createServer(function(conn) {
    // console.log(conn)
    conn.on("text", function(obj) {
      obj = JSON.parse(obj);
      conns["" + obj.uid + ""] = conn;  // conn 集合
      switch (obj.type) {
        // 创建连接
        case 1:
          let isuser = users.some(item => {
            return item.uid === obj.uid;
          });
          if (!isuser) {  // 增加用户
            users.push({
              nickname: obj.nickname,
              uid: obj.uid,
              status: 1 // --> 用户在线状态
            });
          } else { // 更新用户在线状态
            users.map((item, index) => {
              if (item.uid === obj.uid) {
                item.status = 1;
              }
              return item;
            });
          }
          boardcast({
            type: 1,
            date: moment().format("YYYY-MM-DD HH:mm:ss"),
            msg: obj.nickname + "加入聊天室",
            users: users,
            groups: groups,
            uid: obj.uid,
            nickname: obj.nickname,
            bridge: obj.bridge
          });
          break;
        // 注销
        case 2:
          // delete conns[''+obj.uid+''];          
          /* users.map((item, index) => {
            if (item.uid === obj.uid) {
              item.status = 0;
            }
            return item;
          }); */

          users = users.filter(item => item.uid != obj.uid);

          let userIds = users.map(v => v.uid);  // 线上用户

          groups = groups.filter(item => {
            return item.users.find(v => userIds.includes(v.uid))    
          })  || [];  // 线上用户群组

          console.log(JSON.stringify(groups))

          groups.forEach(item => {
            item.users = item.users.filter(v => v.uid != obj.uid)
          })

          boardcast({
            type: 1,
            date: moment().format("YYYY-MM-DD HH:mm:ss"),
            msg: obj.nickname + "退出了聊天室",
            users: users,
            groups: groups,
            uid: obj.uid,
            nickname: obj.nickname,
            bridge: []
          });
          break;
        // 创建群
        case 10:
          groups.push({
            id: moment().valueOf(),
            name: obj.groupName,
            users: [
              {
                uid: obj.uid,
                nickname: obj.nickname
              }
            ]
          });
          boardcast({
            type: 1,
            date: moment().format("YYYY-MM-DD HH:mm:ss"),
            msg: obj.nickname + "创建了群" + obj.groupName,
            users: users,
            groups: groups,
            uid: obj.uid,
            nickname: obj.nickname,
            bridge: obj.bridge
          });
          break;
        // 加入群
        case 20:
          let group = groups.filter(item => {
            return item.id === obj.groupId;
          })[0];
          group.users.push({
            uid: obj.uid,
            nickname: obj.nickname
          });
          boardcast({
            type: 1,
            date: moment().format("YYYY-MM-DD HH:mm:ss"),
            msg: obj.nickname + "加入了群" + obj.groupName,
            users: users,
            groups: groups,
            uid: obj.uid,
            nickname: obj.nickname,
            bridge: obj.bridge
          });
          break;
        // 发送消息
        default:
          boardcast({
            type: 2,
            date: moment().format("YYYY-MM-DD HH:mm:ss"),
            msg: obj.msg,
            uid: obj.uid,
            nickname: obj.nickname,
            bridge: obj.bridge,
            groupId: obj.groupId,
            status: 1   // 消息状态：未查看
          });
          break;
      }
    });
    conn.on("close", function(code, reason) {
      console.log("关闭连接");
    });
    conn.on("error", function(code, reason) {
      console.log("异常关闭");
    });
  })
  .listen(8001);
console.log("WebSocket建立完毕");
