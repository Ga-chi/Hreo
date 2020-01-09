const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");
const cors = require("cors");
const upload = multer({ dest: path.join(__dirname, "imgs/") }).single("icon");

//创建服务器
const app = express();
//利用 multer 第三方包 multer 初始化上传图片函数

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// 使用第三方中间件 cors 实现跨域
app.use(cors());

// /**
//  * 函数封装：根据路径，获取数据。
//  * @param {*} file          文件路径
//  * @param {*} defaultData   默认返回数据
//  */
function getFileData(file = "./json/user.json", defaultData = []) {
  // 同步写法可能会出现读取失败的情况
  try {
    // 通过 path 拼接绝对路径
    const filePath = path.join(__dirname, file);
    // 把获取到的数据转换成 JS 对象
    return JSON.parse(fs.readFileSync(filePath));
  } catch (error) {
    // 如果读取失败
    // 读取失败返回一个空数组
    return defaultData;
  }
}

// 服务器在 3000 端口启动
app.listen(3000, () => {
  console.log("服务器开启： http://127.0.0.1:3000/login");
});

// get 姿势打开的首页
app.get("/", (req, res) => {
  res.send("<h1>英雄联盟接口</h1>");
});

// post 姿势打开的首页
app.post("/", (req, res) => {
  res.send("<h1>POST姿势打开的首页</h1>");
});

// ### 用户登录
// 请求地址：/login
// 请求方式：post
// 请求参数：
// | 名称     | 类型   | 说明            |
// | -------- | ------ | --------------- |
// | username | string | 用户名（admin） |
// | password | string | 密码(123456)    |
app.post("/login", (req, res) => {
  // 从 req.body 对象中解构出 username 和 password
  console.log(req);

  const { username, password } = req.body;

  // 调用封装好的函数，获取文件信息，内部返回<数组>格式数据，保存到 data 常量中
  const data = getFileData("./josn/user.json");

  // 调用数组 find 方法，获取数组中某个用户名的信息
  const user = data.find(item => item.username === username);

  // 如果能获取到信息，验证用户名和密码
  if (user) {
    // 判断用户输入的用户名密码是否都和本地的用户名密码相同
    if (username === user.username && password === user.password) {
      // 如果完全相同，返回登录成功
      res.send({
        code: 200,
        msg: "登录成功"
      });
    }
    // 如果不相同，提示错误
    else {
      res.send({
        code: 400,
        msg: "用户名或密码错误"
      });
    }
  }
  // 如果通过 find 方法找不到用户就执行 else 逻辑
  else {
    // 没有用户提示用户名不存在
    res.send({
      code: 400,
      msg: "用户不存在"
    });
  }
});
//英雄列表
app.get("/list", (req, res) => {
  console.log("请求对象", req);
  console.log("响应对象", res);
  //   const { id, name, skill, icon } = res.file;
  const data = getFileData("./josn/list.json");
  console.log(data.data);

  res.send(data.data);
});

//英雄新增
app.post("/add", upload, (req, res, next) => {
  console.log("请求对象", req);
  console.log("响应对象", res);
  const { filename } = req.file;
  const { name, skill } = req.body;
  let data = getFileData("./josn/list.json");
  console.log(data);
  const newId = data.data.length + 1;
  // console.log(newId);
  //判断用户名和技能是否为空
  // if(name!==''&&skill!==''){
  // //图片参数错误
  // //没有上传图片
  // }
  const newData = {
    id: newId,
    name: name,
    skil: skill,
    icon: filename
  };
  data.data.push(newData);
  console.log(data);

  fs.writeFileSync(
    path.join(__dirname, "./josn/list.json"),
    JSON.stringify(data)
  );
  // res.send(data);

  res.send({
    code: 200,
    msg: "新增成功"
  });
});

//英雄删除
app.get("/delete", (req, res) => {
  console.log("请求对象", req);
  console.log("响应对象", res);
  const { id } = req.body;
  // console.log(id);
  if (id !== "") {
    let data = getFileData("./josn/list.json");
    // console.log(data);

    const index = data.data.findIndex(item => item.id == id);
    // console.log(index);
    if (index === -1) {
      res.send({
        code: 400,
        msg: "没有此ID"
      });
    } else {
      data.data.splice(index, 1);
      // console.log(data);

      fs.writeFileSync(
        path.join(__dirname, "./josn/list.json"),
        JSON.stringify(data)
      );
      res.send({
        code: 200,
        msg: "删除成功"
      });
    }
  } else {
    res.send({
      code: 400,
      msg: "参数错误"
    });
  }
});

//英雄查询
app.get("/search", (req, res) => {
  console.log("请求对象", req);
  console.log("响应对象", res);
  const { id } = req.query;

  if (id !== "") {
    let data = getFileData("./josn/list.json");
    // console.log(data);

    const index = data.data.findIndex(item => item.id == id);
    // console.log(index);
    if (index === -1) {
      res.send({
        code: 400,
        msg: "没有此id的英雄"
      });
    } else {
      // console.log(data);
      res.send({
        code: 200,
        msg: "查询成功",
        data: data.data[index]
      });
    }
  } else {
    res.send({
      code: 400,
      msg: "参数错误"
    });
  }
});

//英雄编辑
app.post("/edit", upload, (req, res, next) => {
  console.log("请求对象", req);
  console.log("响应对象", res);
  const { id, name, skill } = req.body;
  const { filename } = req.file;
  //读取文件进行操作
  let data = getFileData("./josn/list.json");
  //根据id找到对应的英雄数据
  const index = data.data.findIndex(item => item.id == id);
  console.log(index);

  if (index == false || id === "" || name === "" || skill === "") {
    index;
    res.send({
      code: 400,
      msg: "参数错误"
    });
  } else {
    //修改
    data.data[index] = {
      id: index,
      name: name,
      skill: skill,
      icon: filename
    };
    //重新写入list.json文件
    fs.writeFileSync(
      path.join(__dirname, "./josn/list.json"),
      JSON.stringify(data)
    );
    res.send({
      code: 200,
      msg: "修改成功"
    });
  }
});
