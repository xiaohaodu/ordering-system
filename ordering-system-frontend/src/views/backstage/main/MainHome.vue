<template>
  <NavigationBar></NavigationBar>
  <span
    style="width: 100px; position: fixed; top: 60px; right: 0; z-index: 4"
    :draggable="true"
    @dragstart="drag.dragEventStart"
    @dragend="drag.dragEventEnd"
  >
    <QrCode :config="config"></QrCode>
  </span>
  <el-table
    :data="PendOrder"
    stripe
    style="width: 100%"
    :default-sort="{ prop: 'time', order: 'ascending' }"
  >
    <el-table-column label="待处理订单" align="center">
      <el-table-column
        prop="table_number"
        label="桌号"
        align="center"
      ></el-table-column>
      <el-table-column prop="name" label="菜名" width="180" align="center" />
      <el-table-column prop="num" label="数量" width="180" align="center" />
      <el-table-column prop="price" label="单价" align="center" />
      <el-table-column prop="time" label="时间" align="center" />
      <el-table-column label="状态" align="center">
        <template #default="scope">
          <el-button
            size="small"
            type="primary"
            @click="handleDelete(scope.$index, scope.row)"
            >出菜</el-button
          >
        </template>
      </el-table-column>
    </el-table-column>
  </el-table>
  <el-table :data="CompletedOrder" stripe style="width: 100%">
    <el-table-column label="已完成订单" align="center">
      <el-table-column
        prop="table_number"
        label="桌号"
        align="center"
      ></el-table-column>
      <el-table-column prop="name" label="菜名" width="180" align="center" />
      <el-table-column prop="num" label="数量" width="180" align="center" />
      <el-table-column prop="price" label="价格" align="center" />
      <el-table-column prop="time" label="时间" align="center" />
      <el-table-column label="状态" align="center">
        <template #default>
          <el-button size="small" type="success">已出菜</el-button>
        </template>
      </el-table-column>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import { reactive, ref, getCurrentInstance, onMounted } from "vue";
import NavigationBar from "@/components/NavigationBar.vue";
import { useWebSocket } from "@/hooks/websocket";
import { getOrder as netGetOrder } from "@/network/order/order";
import { updateOrder } from "@/network/order/order";
import QrCode from "@/views/frontdesk/QrCode.vue";
import base from "@/network/base";
let kk = ref(null);
const drag = {
  top: 0,
  left: 0,
  dragEventStart: (dragEvent) => {
    drag.top = dragEvent.offsetY;
    drag.left = dragEvent.offsetX;
  },
  dragEventEnd: (dragEvent) => {
    drag.top = dragEvent.offsetY - drag.top;
    drag.left = dragEvent.offsetX - drag.left;
    dragEvent.target.style.top = dragEvent.target.offsetTop + drag.top + "px";
    dragEvent.target.style.left =
      dragEvent.target.offsetLeft + drag.left + "px";
  },
};

onMounted(() => {
  getOrder();
});
const config = {
  //二维码存储内容
  qrUrl: base.frontendUrl,
  //
  qrParams: 1,
  // canvas width
  width: 100,
  // canvas height
  height: 100,
  // 二维码尺寸（正方形 长宽相同）
  qrSize: 100,
  // 二维码底部文字
  qrText: "桌号",
  //底部说明文字字号
  qrTextSize: 10,
};

//待处理订单
const PendOrder = ref([]);

//已完成订单
const CompletedOrder = ref([]);

const { proxy } = getCurrentInstance() as any;
async function getOrder() {
  proxy.$loading();
  try {
    console.log(localStorage.user_id);

    const { data: res } = await netGetOrder(localStorage.user_id);
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
    // console.log(res.data);
    // console.log(menu);
  } catch (error) {
    // console.log(error);
    proxy.$elMessage(error);
  }
  proxy.$loading().close();
}

const ws = useWebSocket(handleMessage);
function handleMessage(msg) {
  const info = JSON.parse(msg.data);
  if (info.type == "auth") {
    return ws.send(
      JSON.stringify({
        type: "pc",
        id: localStorage.user_id,
        isMessage: false,
        tip: "这是客户端",
      })
    );
  } else if (info.type == "server") {
    const _order = info.message.dish as [];
    PendOrder.value.push(..._order);
    proxy.$elMessage("有新的订单！", "success", false);
    console.log(PendOrder.value);
  }
}

const handleDelete = async (index, row) => {
  // console.log(index, row)
  try {
    CompletedOrder.value.push(PendOrder.value[index]);
    const { data: res } = await updateOrder(PendOrder.value[index]);
    console.log(res);
    PendOrder.value.splice(index, 1);
  } catch (error) {
    console.log(error);
  }
};
</script>

<style lang="scss" scoped>
.pending-order {
}

.completed-order {
}
</style>
