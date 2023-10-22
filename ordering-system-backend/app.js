const express = require("express");
const joi = require("joi");
const cors = require("cors");
const morgan = require("morgan");
const app = express();

app.use(cors());
app.use(express.json({ limit: 10 * 1024 * 1024 }));
app.use(express.urlencoded({ extended: true, limit: 10 * 1024 * 1024 }));
// 一定要在路由之前，封装 res的send函数
app.use((req, res, next) => {
  // status 默认值为 1，表示失败的情况
  // err 的值，可能是一个错误对象，也可能是一个错误的描述字符串
  res.my_send = (err, status = 1) => {
    // console.log(err);
    res.send({
      status,
      message: err instanceof Error ? err.message : err,
    });
  };
  next();
});
app.use(morgan());
// 一定要在路由之前配置解析 Token 的中间件
const { expressjwt: jwt } = require("express-jwt");
const config = require("./config");
app.use(
  jwt({ secret: config.jwtSecretKey, algorithms: ["HS256"] }).unless({
    path: /^\/(user|apidoc|order|ws|menus)*/,
  })
);
app.use(express.urlencoded({ extended: false }));
const expressWs = require("express-ws");
const wsInstance = expressWs(app);
module.exports = wsInstance;

app.use("/apidoc", express.static("apidoc"));
app.use("/", express.static("apidoc"));
const userRouter = require("./router/user");
const userinfoRouter = require("./router/userinfo");
const menu = require("./router/menu");
const order = require("./router/order");
app.use(order);
app.use(menu);
app.use("/user", userRouter);
app.use("/userinfo", userinfoRouter);

// 定义错误级别的中间件
app.use((err, req, res, next) => {
  // 验证失败导致的错误
  if (err instanceof joi.ValidationError) return res.my_send(err);
  // 身份认证失败后的错误
  if (err.name === "UnauthorizedError") return res.my_send("身份认证失败！");
  // 未知的错误
  res.my_send(err);
});
app.listen(9000, () => {
  console.log("api server running at http://127.0.0.1:9000");
});
