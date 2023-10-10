const db = require('../database/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * @api {post} /user/register 注册
 * @apiGroup users
 * @apiParam {String} username 用户名
 * @apiParam {String} password 密码
 * @apiParam {String} password_again 重复密码
 * */
exports.register = (req, res) => {
    const userinfo = req.body;
    if (!userinfo.username || !userinfo.password) {
        return res.my_send('用户名或密码不合法!');
    }

    const sqlStr = 'select * from users where username=?';
    db.query(sqlStr, userinfo.username, (err, results) => {
        if (err) {
            return res.my_send(err, 0);
        }

        if (results.length > 0) {
            return res.my_send('用户名被占用，请更换其他用户名!');
        }
        userinfo.password = bcrypt.hashSync(userinfo.password, 10);

        const sql = 'insert into users set ?';

        db.query(sql, { username: userinfo.username, password: userinfo.password }, (err, results) => {
            if (err) {
                return res.my_send(err);
            }
            if (results.affectedRows !== 1) {
                return res.my_send('注册用户失败，请稍后再试！');
            }
        });
        return res.send('注册成功');
    });
};
/**
 * @api {post} /user/login 登录
 * @apiGroup users
 * @apiParam {String} username 用户名
 * @apiParam {String} password  密码
 * */
exports.login = (req, res) => {
    // 接收表单的数据
    const userinfo = req.body;
    // 定义 SQL 语句
    const sql = `select * from users where username=?`;
    // 执行 SQL 语句，根据用户名查询用户的信息
    db.query(sql, userinfo.username, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.my_send(err);
        // 执行 SQL 语句成功，但是获取到的数据条数不等于 1
        if (results.length !== 1) return res.my_send('登录失败！');

        // TODO：判断密码是否正确
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password);
        // console.log(userinfo.password)
        // console.log(results[0].password)
        // console.log(results[0].id)
        if (!compareResult) return res.my_send('密码错误！');

        // TODO：在服务器端生成 Token 的字符串
        const user = { ...results[0], password: '', user_pic: '' };
        // 对用户的信息进行加密，生成 Token 字符串
        // const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn })
        const tokenStr = jwt.sign(user, config.jwtSecretKey);
        // 调用 res.send() 将 Token 响应给客户端
        res.send({
            status: 0,
            id: results[0].id,
            message: '登录成功！',
            token: 'Bearer ' + tokenStr,
        });
    });
};