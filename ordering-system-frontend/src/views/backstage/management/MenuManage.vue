<template>
  <NavigationBar></NavigationBar>
  <div class="manage" v-for="(type, index) in menu" :key="index">
    <el-tag class="table" v-text="type.type"></el-tag>
    <div class="menu">
      <div class="dish" v-for="(dish, index) in type.dish" :key="index">
        <img class="cover" :src="dish.picture" />
        <div class="name" v-text="dish.name"></div>
        <div class="price" v-text="dish.price"></div>
        <span class="sub-dish" @click="subDish(dish)">
          <el-icon> <Minus /> </el-icon>删除<el-icon>
            <Minus />
          </el-icon>
        </span>
      </div>
      <MessageBox @getMenu="getMenu"></MessageBox>
    </div>
  </div>
  <MessageBox @getMenu="getMenu"></MessageBox>
</template>

<script lang="ts" setup>
import { reactive, onMounted, inject } from "vue";
import {
  getMenu as netGetMenu,
  subMenu as netSubMenu,
} from "@/network/menu/menu";
import NavigationBar from "@/components/NavigationBar.vue";
import MessageBox from "@/components/MessageBox.vue";
//获得菜单
let menu: any = reactive([]);
const loading = inject("loading") as any;
const elMessage = inject("elMessage") as any;
async function getMenu() {
  loading();
  try {
    const { data: res } = await netGetMenu(localStorage.user_id);
    if (res.status !== 0) {
      return elMessage(res.message);
    }
    menu.length = 0;
    menu.push(...res.data);
    loading().close();
    // console.log(res);
    // console.log(menu);
  } catch (error) {
    // console.log(error);
    return elMessage(error);
  }
}
onMounted(() => {
  getMenu();
});

//该函数可以节省删除菜单菜的性能
// function removeDish(menu, dish) {
//     console.log(menu);
//     console.log(dish);
// }

//从菜单上删去该菜
async function subDish(dish) {
  loading();
  try {
    const { data: res } = await netSubMenu(dish, localStorage.user_id);
    menu.length = 0;
    getMenu();
    return elMessage(res.message, res.status === 0 ? "success" : "error");
  } catch (error) {
    return elMessage(error);
  }
  // removeDish(menu, dish)
}
</script>

<style lang="scss" scoped>
.table {
  margin: 3vh;
}

.menu {
  display: flex;
  width: 100vw;
  height: auto;
  flex-wrap: wrap;

  .dish {
    padding: 3vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-wrap: wrap;
    cursor: pointer;

    .cover {
      height: 20vh;
    }

    .name {
      font-size: 2.3vh;
      margin: 0.25vh;
    }

    .price {
      color: red;
      font-size: 2.6vh;
    }

    .sub-dish {
      display: flex;
      flex-direction: row;
      align-items: center;
      color: blue;
    }
  }
}
</style>
