const db = require('../database')
const wsInstance = require('../app')

/**
 * @api {get} /order/:id 获取订单信息
 * @apiDescription 获取商铺订单信息 
 * @apiGroup order
 * @apiParams {Number} id 商铺id
 */
exports.getOrder = (req, res) => {
    const id = req.params.id
    const sql = `select * from my_order where master_id=? order by time;`
    db.query(sql, id, (err, results) => {
        // 执行 SQL 语句失败
        if (err) {
            console.log(err)
            return res.my_send(err)
        }
        // 执行 SQL 语句成功，但是查询的结果可能为空
        if (results.length < 0) return res.my_send('获取菜单信息失败！')

        // 用户信息获取成功
        res.send({
            status: 0,
            message: '获取菜单信息成功！',
            data: results,
        })
    })
}

/**
 * @api {get} /order_table/:id 获取当前桌号订单信息
 * @apiGroup order
 * @apiParams {Number} table_number 桌号
 */
exports.getOrderTable = (req, res) => {
    const id = req.params.id
    // console.log(id);
    const sql = `select * from my_order where table_number=? order by time;`
    db.query(sql, id, (err, results) => {
        // 执行 SQL 语句失败
        if (err) {
            console.log(err)
            return res.my_send(err)
        }
        // 执行 SQL 语句成功，但是查询的结果可能为空
        if (results.length < 0) return res.my_send('获取菜单信息失败！')

        // 用户信息获取成功
        res.send({
            status: 0,
            message: '获取菜单信息成功！',
            data: results,
        })
    })
}


/**
 * @api {patch} /orders 更新订单状态
 * @apiDescription 商铺出菜，标记订单状态
 * @apiGroup order
 * @apiBody {object[]} order_finish 已完成订单列表
 */
exports.updateOrder = (req, res) => {
    const info = req.body
    // console.log(info);
    // console.log(info.time);
    const sql = `update my_order set finish=1 where id=? and time=?;`
    db.query(sql, [info.id, info.time], (err, results) => {
        // 执行 SQL 语句失败
        if (err) {
            console.log(err)
            return res.my_send(err)
        }
        // 执行 SQL 语句成功，但是查询的结果可能为空
        if (results.length < 0) return res.my_send('修改菜单信息失败！')

        // 用户信息获取成功
        res.send({
            status: 0,
            message: '修改菜单信息成功！',
            data: results,
        })
    })
}

/**
 * @api {post} /order 添加订单
 * @apiDescription 用户点单，包含桌号信息
 * @apiGroup order
 * @apiBody {object} order 订单 
 */
exports.submitOrder = (req, res) => {
    const order = req.body
    const sqlData = []
    for (const key in order.dish) {
        order.dish[key].time = order.time
        order.dish[key].finish = 0
        sqlData.push(Object.values(order.dish[key]))
    }
    // console.log(sqlData);
    const sql = 'insert into my_order(id,master_id,name,description,price,picture,num,type,table_number,time,finish) values ?'
    db.query(sql, [sqlData], (error, results) => {
        if (error) {
            // console.log(error)
            return res.my_send(error);
        }
        if (results.affectedRows == 0) {
            return res.my_send('提交订单失败，请稍后再试！');
        }
        return res.my_send('点单成功', 0)
    })
}

/**
 * @api {websocket} /ws 订单实时更新
 * @apiGroup order
 * @apiDescription 具体使用请联系后端人员
 */
exports.wsSubmitOrder = (ws, req) => {
    // console.log(wsInstance.getWss().clients);
    ws.send(JSON.stringify({ type: 'auth', isMessage: false, tip: 'Please return your identification information' }))
    ws.on('message', (msg) => {
        info = JSON.parse(msg)
        ws['type'] = info.type
        if (info.isMessage) {
            if (info.type == 'mobile') {
                ws['table_number'] = info.table_number
                // wsInstance.getWss().clients[0]
                // console.log(wsInstance.getWss().clients);
                // console.log(info.message.dish);
                for (const key in info.message.dish) {
                    // console.log(key);
                    wsInstance.getWss().clients.forEach(element => {
                        // 如果遍历到的客户端的user和info中的to相同 则发送信息给该客户端
                        // console.log(element['type']);
                        if (element['type'] == 'pc' && element['id'] == info.message.dish[key].master_id) {
                            element.send(JSON.stringify({ type: 'server', isMessage: true, message: info.message }))
                            // console.log(info.message);
                        }
                    });
                }
            } else if (info.type == 'pc') {

            }
        } else if (info.type == 'pc') {
            ws['id'] = info.id
        }
    })
}
