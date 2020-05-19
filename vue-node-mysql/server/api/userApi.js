/*
 * @Author: tim
 * @Date: 2020-05-18 09:59:23
 * @LastEditors: tim
 * @LastEditTime: 2020-05-19 10:01:28
 * @Description:
 */

const express = require("express");
const router = express.Router();

const DBHelper = require("../utils/DBHelper");
const conn = new DBHelper().getConn();
const sql = require("../utils/sqlMap");

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log("Time: ", Date.now()); // 终端输出
  next();
});

// router.use(function requestTime (req, res, next) {
//     req.requestTime = Date.now()
//     console.log(req)
//     next()
// });

// 增加用户
router.post("/addUser", (req, res) => {
  let sqlStr = sql.user.add;
  let params = req.body;
  // let conn = new DBHelper().getConn();
  conn.query(sqlStr, [params.name, params.age], (err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
    }
  });
  // conn.end(); // 此次关闭连接，则每次在执行数据库操作前须先创建连接
});

// 删除用户
router.post("/delUser", (req, res) => {
  let sqlStr = sql.user.del;
  let params = req.body;
  // let conn = new DBHelper().getConn();
  conn.query(sqlStr, [params.id], (err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
    }
  });
  // conn.end();
});

// 查询用户
router.post("/selectUser", (req, res) => {
  let sqlStr = sql.user.select;
  let params = req.body;

  if (!params.name) {
    sqlStr = sql.user.selectAll;
  }

  // let conn = new DBHelper().getConn();
  conn.query(sqlStr, [params.name], (err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
    }
  });
  // conn.end();
});

module.exports = router;
