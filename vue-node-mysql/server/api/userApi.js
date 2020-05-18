const express = require('express');
const router = express.Router();

const DBHelper = require('../utils/DBHelper');
const sql = require('../utils/sqlMap');

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
    console.log('Time: ', Date.now())   // 终端输出
    next()
});

router.use(function requestTime (req, res, next) {
    req.requestTime = Date.now()
    next()
});

// 增加用户
router.post('/addUser', (req, res) => {
    let sqlStr = sql.user.add;
    let params = req.body;
    let conn = new DBHelper().getConn();
    conn.query(sqlStr, [params.name, params.age], (err, result) => {
        if (err) {
            res.json(err);
        } else {
            res.json(result);
        }
    });
    conn.end();
});

// 删除用户
router.post('/delUser', (req, res) => {
    let sqlStr = sql.user.del;
    let params = req.body;
    let conn = new DBHelper().getConn();
    conn.query(sqlStr, [params.id], (err, result) => {
        if (err) {
            res.json(err);
        } else {
            res.json(result);
        }
    });
    conn.end();
})

// 查询用户
router.post('/selectUser', (req, res) => {
    let sqlStr = sql.user.select;
    let params = req.body;

    if (! params.name) {
        sqlStr = sql.user.selectAll;
    }

    let conn = new DBHelper().getConn();
    conn.query(sqlStr, [params.name], (err, result) => {
        if (err) {
            res.json(err);
        } else {
            res.json(result)
        }
    });
    conn.end();
});

module.exports = router;