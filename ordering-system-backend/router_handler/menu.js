const db = require('../database')

/**
 * @api {get} /menu/:id 获取菜单信息
 * @apiDescription 通过商铺id获取商家自己的菜单信息
 * @apiGroup menu
 * @apiParam {number} id 商铺id
 */
exports.getMenu = (req, res) => {
    const userid = req.params.id
    const sql = `select * from menu where master_id=? order by type;`
    db.query(sql, userid, (err, ress) => {
        // 执行 SQL 语句失败
        if (err) {
            console.log(err)
            return res.my_send(err)
        }
        // 执行 SQL 语句成功，但是查询的结果可能为空
        if (ress.length < 0) return res.my_send('获取菜单信息失败！')

        // const results = JSON.parse(JSON.stringify(ress))
        let results = []
        ress.forEach((obj) => {
            results.push(obj)
        })
        // console.log(results[0]);

        let _results = []
        let menu = {}
        menu.dish = []
        for (const key in results) {
            if (key > 0) {
                // console.log(results[key].type);
                // console.log(results[parseInt(key) - 1].type);
                // console.log(results[key].type !== results[parseInt(key) - 1].type);
                if (results[key].type !== results[parseInt(key) - 1].type) {
                    _results.push(menu)
                    menu = {}
                    menu.dish = []
                    menu.type = results[key].type
                    menu.dish.push(results[key])
                } else {
                    menu.dish.push(results[key])
                    if (key == results.length - 1) {
                        _results.push(menu)
                    }
                }
            } else {
                // console.log(results[key]);
                menu.type = results[key].type
                menu.dish.push(results[key])
                if (results.length == 1) {
                    _results.push(menu)
                }
            }
        }
        for (const key1 in _results) {
            for (const key2 in _results[key1].dish) {
                _results[key1].dish[key2].type = undefined
                _results[key1].dish[key2].num = 0
            }
        }
        // 用户信息获取成功
        res.send({
            status: 0,
            message: '获取菜单信息成功！',
            data: _results,
        })
    })
}

/**
 * @api {get} /menus 获取菜单
 * @apiDescription 获取所有菜单内容
 * @apiGroup menu
 */
exports.getMenus = (req, res) => {
    const sql = `select * from menu order by type;`
    db.query(sql, (err, ress) => {
        // 执行 SQL 语句失败
        if (err) {
            console.log(err)
            return res.my_send(err)
        }
        // 执行 SQL 语句成功，但是查询的结果可能为空
        if (ress.length < 0) return res.my_send('获取菜单信息失败！')

        // const results = JSON.parse(JSON.stringify(ress))
        let results = []
        ress.forEach((obj) => {
            results.push(obj)
        })
        // console.log(results[0]);

        let _results = []
        let menu = {}
        menu.dish = []
        for (const key in results) {
            if (key > 0) {
                // console.log(results[key].type);
                // console.log(results[parseInt(key) - 1].type);
                // console.log(results[key].type !== results[parseInt(key) - 1].type);
                if (results[key].type !== results[parseInt(key) - 1].type) {
                    _results.push(menu)
                    menu = {}
                    menu.dish = []
                    menu.type = results[key].type
                    menu.dish.push(results[key])
                } else {
                    menu.dish.push(results[key])
                    if (key == results.length - 1) {
                        _results.push(menu)
                    }
                }
            } else {
                // console.log(results[key]);
                menu.type = results[key].type
                menu.dish.push(results[key])
                if (results.length == 1) {
                    _results.push(menu)
                }
            }
        }
        for (const key1 in _results) {
            for (const key2 in _results[key1].dish) {
                _results[key1].dish[key2].type = undefined
                _results[key1].dish[key2].num = 0
            }
        }
        // 用户信息获取成功
        res.send({
            status: 0,
            message: '获取菜单信息成功！',
            data: _results,
        })
    })
}

/**
 * @api {post} /menu/:id 添加菜品
 * @apiGroup menu
 * @apiParams {Number} id 商铺id
 * @apiBody {Object} dish 添加的菜品信息
 */
exports.addMenu = (req, res) => {
    const dish = req.body;
    dish.master_id = req.params.id
    if (!dish.type || !dish.name || !dish.price || !dish.picture) {
        return res.my_send('请传入完整信息！')
    }
    const sqlStr = 'select * from menu where name=?'
    db.query(sqlStr, dish.name, (err1, results) => {
        if (err1) {
            // console.log(err1)
            return res.my_send(err1)
        }
        if (results.length > 0) {
            return res.my_send('菜单上已存在')
        }
        const sql = 'insert into menu set ?'
        db.query(sql, { type: dish.type, master_id: dish.master_id, name: dish.name, price: dish.price, picture: dish.picture }, (err2, results) => {
            if (err2) {
                console.log(err2)
                return res.my_send(err2);
            }
            if (results.affectedRows !== 1) {
                return res.my_send('添加菜单失败，请稍后再试！');
            }
            return res.my_send('添加成功', 0)
        })
    });
}

/**
 * @api {delete} /menu 删除菜品
 * @apiGroup menu
 * @apiBody {object} dish 删除的菜品信息 
 */
exports.subMenu = (req, res) => {
    // console.log(req.body.id);
    const dishId = req.body.id
    const sql = `delete from menu where id=?`
    db.query(sql, dishId, (err, results) => {
        if (err) {
            return res.my_send(err);
        }
        // console.log(results);
        return res.my_send('删除成功', 0)
    })
}