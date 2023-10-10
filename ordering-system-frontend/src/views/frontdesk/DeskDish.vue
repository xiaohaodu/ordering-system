<template>
    <el-table :data="PendOrder" show-summary sum-text="合计" stripe style="width: 100%"
        :default-sort="{ prop: 'time', order: 'ascending' }">
        <el-table-column label="未完成订单" align="center">
            <!-- <el-table-column prop="table_number" label="桌号" align="center"></el-table-column> -->
            <el-table-column prop="name" label="菜名" align="center" />
            <el-table-column prop="num" label="数量" align="center" />
            <el-table-column prop="price" label="单价" align="center" />
            <el-table-column label="状态" align="center">
                <template #default>
                    <el-button size="small" type="primary">未出菜</el-button>
                </template>
            </el-table-column>
        </el-table-column>
    </el-table>
    <el-table :data="CompletedOrder" show-summary sum-text="合计" stripe style="width: 100%"
        :default-sort="{ prop: 'time', order: 'ascending' }">
        <el-table-column label="已完成订单" align="center">
            <!-- <el-table-column prop="table_number" label="桌号" align="center"></el-table-column> -->
            <el-table-column prop="name" label="菜名" align="center" />
            <el-table-column prop="num" label="数量" align="center" />
            <el-table-column prop="price" label="单价" align="center" />
            <el-table-column label="状态" align="center">
                <template #default>
                    <el-button size="small" type="success">已出菜</el-button>
                </template>
            </el-table-column>
        </el-table-column>
    </el-table>
    <div class="order-link" @click="router.push({ name: 'OrderDish' })">
        <el-icon>
            <Dish />
        </el-icon>
        <div>点单</div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, getCurrentInstance, ref, onUnmounted, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getOrderTable as netGetOrderTable } from '@/network/order/order';
//待处理订单
const PendOrder = ref([]);

//已完成订单
const CompletedOrder = ref([]);

const { proxy } = getCurrentInstance() as any;
async function getOrderTable() {
    try {
        const { data: res } = await netGetOrderTable(route.params.table_number);
        if (res.status !== 0) {
            proxy.$elMessage(res.message);
        }
        PendOrder.value.length = 0;
        CompletedOrder.value.length = 0;
        for (const key in res.data) {
            if (res.data[key].finish == 1) {
                CompletedOrder.value.push(res.data[key]);
            } else {
                PendOrder.value.push(res.data[key]);
            }
        }
        // console.log(res);
        // console.log(menu);
    } catch (error) {
        // console.log(error);
        proxy.$elMessage(error);
    }
}

onMounted(() => {
    init();
});

const router = useRouter();
const route = useRoute();
const timer = reactive({});
const init = () => {
    getOrderTable();
    timer.timerInterval = setInterval(getOrderTable, 2000);
};

// onUnmounted(() => {
//     clearInterval()
// })

onBeforeUnmount(() => {
    clearInterval(timer.timerInterval);
})

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