const express = require('express')
const router = express.Router()

const order = require('../router_handler/order')
router.post('/order', order.submitOrder)
router.get('/order/:id', order.getOrder)
router.get('/order_table/:id', order.getOrderTable)
router.patch('/order', order.updateOrder)
router.ws('/ws', order.wsSubmitOrder)
module.exports = router
