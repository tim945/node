// sql语句
var sqlMap = {
  user: {
    // 添加用户
    add: "insert into user(name, age) values (?, ?)",
    // 删除用户
    del: "delete from user where id=?",
    // 查询用户
    select: 'select * from user where name like "%"?"%" order by id desc',
    // 查询用户列表
    selectAll: "select * from user order by id desc",
  },
};

module.exports = sqlMap;
