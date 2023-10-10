<template>
    <div class="manage" v-for="(type, index) in menu" :key="index">
        <el-tag class="table" v-text="type.type"></el-tag>
        <div class="menu">
            <div class="dish" v-for="(dish, index) in type.dish" :key="index">
                <img class="cover" :src="dish.picture">
                <div class="name" v-text="dish.name"></div>
                <div class="price" v-html="`<span style='color:black'>单价：</span>` + dish.price + '￥'"></div>
                <el-input-number v-model="dish.num" :min="0" :max="10"
                    @change="(currentValue: number, oldValue: number) => handleChange(currentValue, oldValue, dish, type)" />
                <div class="total-price" v-html="`<span>总价：</span>` + dish.num * dish.price + '￥'">
                </div>
            </div>
        </div>
    </div>
    <div class="submit">
        <span v-html="`<span style='color:black'>订单总价：</span>` + order.TotalPrice + '￥'"></span>
        <el-button type="primary" @click="submitOrder">提交订单</el-button>
    </div>
    <div class="order-link" @click="router.push({ name: 'DeskDish' })">
        <el-icon>
            <DishDot />
        </el-icon>
        <div>已点菜单</div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, getCurrentInstance, ref } from 'vue';
import { getMenus as netGetMenu } from '@/network/menu/menu'
import { submitOrder as netSubmitOrder } from '@/network/order/order'
import { useWebSocket } from '@/hooks/websocket';
import { useRouter, useRoute } from 'vue-router'
//获得菜单
let menu: any = reactive([]);
let order = reactive({
    TotalPrice: 0,
    dish: [] as any,
    table_number: 0,
    time: ''
})

const { proxy } = getCurrentInstance() as any
async function getMenu() {
    proxy.$loading()
    try {
        const { data: res } = await netGetMenu()
        if (res.status !== 0) {
            proxy.$elMessage(res.message)
        }
        menu.length = 0
        menu.push(...res.data)
        // console.log(res);
        // console.log(menu);
    } catch (error) {
        // console.log(error);
        proxy.$elMessage(error)
    }
    proxy.$loading().close()
}
onMounted(() => {
    init()
    getMenu()
})

async function submitOrder() {
    // console.log(order);
    order.time = new Date().toLocaleString()
    try {
        const { data: res } = await netSubmitOrder(order)
        for (const index in order.dish) {
            order.dish[index].time = order.time
        }
        // console.log(res);
        ws.send(JSON.stringify({ type: 'mobile', isMessage: true, message: order }))
        router.push({ name: 'DeskDish' })
    } catch (error) {
        console.log(error);
    }
}

const ws = useWebSocket(handleMessage)

function handleMessage(msg) {
    const info = JSON.parse(msg.data)
    if (info.type == 'auth') {
        return ws.send(JSON.stringify({
            type: 'mobile',
            table_number: route.params.table_number,
            isMessage: false,
            tip: '这是服务端'
        }))
    }

}

const handleChange = (currentValue: number, oldValue: number, dish, type) => {
    // console.log(currentValue);
    // console.log(oldValue);
    if (currentValue == 1 && oldValue == 0) {
        // console.log(type);
        dish.type = type.type
        dish.table_number = order.table_number
        order.dish.push(dish)
    }
    // console.log(order);
    order.TotalPrice = 0
    for (const key in order.dish) {
        // order.TotalPrice += order.dish[key].num * order.dish[key].price
        order.dish[key].num == 0 ? order.dish.splice(key, 1) : order.TotalPrice += order.dish[key].num * order.dish[key].price
    }
}

const router = useRouter()
const route = useRoute()
const init = () => {
    order.table_number = parseInt(route.params.table_number as any)
}
</script>

<style lang="scss" scoped>
.table {
    margin: 3vw;
}

.el-input-number {
    width: 150px;
    line-height: 30px;
}

.menu {
    display: flex;
    width: 100vw;
    height: auto;
    flex-wrap: wrap;

    .dish {
        padding: 3vw;
        display: flex;
        flex-direction: column;
        align-items: center;
        flex-wrap: wrap;
        cursor: pointer;

        .cover {
            height: 20vw;
        }

        .name {
            font-size: 2.3vw;
            margin: 0.25vw;
        }

        .price {
            color: red;
            font-size: 2.6vw;
        }

        .total-price {
            color: red;
            font-size: 4vw;
        }

        .sub-dish {
            display: flex;
            flex-direction: row;
            align-items: center;
            color: blue;
        }
    }
}

.submit {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;

    >span {
        color: red;
    }
}

.order-link {
    position: fixed;
    bottom: 5vh;
    right: 10vw;
    z-index: 999;
    font-size: 3vw;
    color: #409EFF;
    background-color: #ECF5FF;
    border-radius: 3vw;
    text-align: center;
}
</style>