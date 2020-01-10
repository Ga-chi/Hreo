//引入mysql包
const mysql = require("mysql");
//创建mysql 数据库连接
const connection = mysql.createConnection({
  // 数据库地址
  host: "localhost",
  //   用户名
  user: "root",
  //   密码
  password: "root",
  //   数据库名称
  database: "gzqd42"
});

connection.connect();
//查询数据库数据
// connection.query("select * from hero", function(error, results) {
//   if (error) throw error;
//   console.log("英雄列表: ", results);
// });

//查询一条数据
// connection.query("select * from hero where id=3", function(error, results) {
//   if (error) throw error;
//   const [data] = results;
//   console.log("结果为: ", data);
// });

//修改数据
// connection.query(
//   'update hero set name="曹操",skill="掠夺", icon="ooo" where id=11',
//   function(error, results) {
//     if (error) throw error;
//     const { affectedRows } = results;
//     if (affectedRows == 1) {
//       console.log("修改成功", results);
//     } else {
//       console.log("修改失败");
//     }
//   }
// );
// //删除
// connection.query("delete from hero where id=2", function(error, results) {
//   if (error) throw error;
//   const { affectedRows } = results;
//   if (affectedRows == 1) {
//     console.log("删除成功", results);
//   } else {
//     console.log("删除失败");
//   }
// });
// //增加数据
// connection.query(
//   "insert into hero(name,skill,icon)values('辛弃疾','打仗','xx')",
//   function(error, results) {
//     if (error) throw error;
//     const { affectedRows } = results;
//     if (affectedRows == 1) {
//       console.log("新增成功", results);
//     } else {
//       console.log("新增失败");
//     }
//   }
// );

module.exports = {
  //增加
  add({ name, skill, icon, success = () => {}, fail = () => {} }) {
    connection.query(
      `insert into hero(name,skill,icon)values('${name}','${skill}','${icon}')`,
      function(error, results) {
        if (error) throw error;
        const { affectedRows } = results;
        if (affectedRows == 1) {
          success(results);
        } else {
          fail(results);
        }
      }
    );
  },
  //删除
  delete({ id, success = () => {}, fail = () => {} }) {
    connection.query(`delete from hero where id='${id}'`, function(
      error,
      results
    ) {
      if (error) throw error;
      const { affectedRows } = results;
      if (affectedRows == 1) {
        // console.log("删除成功");
        success(results);
      } else {
        fail(results);
      }
    });
  },
  //修改
  edit({ id, name, skill, icon, success = () => {}, fail = () => {} }) {
    connection.query(
      `update hero set name="${name}",skill="${skill}", icon="${icon}" where id="${id}"`,
      function(error, results) {
        if (error) throw error;
        const { affectedRows } = results;
        if (affectedRows == 1) {
          success(results);
        } else {
          fail(results);
        }
      }
    );
  },
  //查询全部
  get({ success = () => {}, fail = () => {} }) {
    connection.query("select * from hero", function(error, results) {
      if (error) return fail(error);
      // success(results);
      success(results);
    });
  },
  //查询一条
  search({ id, success = () => {}, fail = () => {} }) {
    connection.query(`select * from hero where id=${id};`, function(
      error,
      results
    ) {
      if (error) throw error;
      const [data] = results;
      if (data) {
        success(results);
      } else {
        fail(error);
      }
    });
  }
};
//测试代码
// 查
// db.get();
// debugger;

// 编辑
// db.edit({
//   id: 12,
//   name: "刘备",
//   skill: "摔孩子",
//   icon: "xxxxxyyyy",
//   success: res => {
//     console.log("修改成功");
//   }
// });

// 新增;
// db.add({
//   name: "吕布",
//   skill: "貂蝉在哪里",
//   icon: "aaaaaa",
//   success: res => {
//     console.log("新增成功");
//   }
// });

// // 删除
// db.delete({
//   id: 12,
//   success: res => {
//     console.log("删除成功");
//   },
//   fail: err => {
//     console.log("失败");
//   }
// });

// db.get({
//   success: res => {
//     console.log(res);
//   }
// });

// db.search({
//   id: 14,
//   success: res => {
//     console.log("结果为：", res);
//   },
//   fail: err => {
//     console.log("失败");
//   }
// });
