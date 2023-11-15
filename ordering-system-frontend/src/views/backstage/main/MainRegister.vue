<template>
  <div class="background">
    <el-form :model="user" class="register" label-position="left">
      <div class="head">
        <div class="register_text">注册</div>
        <router-link to="/login" class="to_login">登录</router-link>
      </div>
      <el-form-item label="账号">
        <el-input
          v-model="user.username"
          type="text"
          placeholder="Please input your username"
        />
      </el-form-item>
      <el-form-item label="密码">
        <el-input
          v-model="user.password"
          type="password"
          :show-password="true"
          placeholder="Please input your password"
        />
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input
          v-model="user.password_again"
          type="password"
          :show-password="true"
          placeholder="Please input your password again"
        />
      </el-form-item>
      <div class="register-button">
        <el-button @click.prevent native-type="submit" @click="register"
          >注册</el-button
        >
      </div>
    </el-form>
    <!-- <div></div> -->
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, inject } from "vue";
import { register as netRegister } from "@/network/register/register";
import router from "@/router";
onMounted(() => {});
let user = reactive({
  username: "",
  password: "",
  password_again: "",
});
const loading = inject("loading") as any;
const elMessage = inject("elMessage") as any;
async function register() {
  loading();
  if (user.password === user.password_again) {
    const { data: res } = await netRegister(user);
    if (res.message) {
      return elMessage(res.message);
    } else {
      router.push("/login");
      return elMessage(res, "success");
    }
  } else {
    return elMessage("两次输入密码不一致");
  }
}
</script>

<style lang="scss" scoped>
.background {
  height: 100vh;
  width: 100vw;

  background: {
    image: url("@/assets/background.jpg");
    size: 100vw;
    repeat: no-repeat;
  }

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: black;
}

.register {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  flex-direction: column;

  :deep(.el-form-item__label) {
    color: black;
  }

  .el-form-item {
    padding-right: 4.25vw;
  }

  .el-message {
    float: top;
  }

  .register-button {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .head {
    display: flex;
    width: 20.5vw;
    line-height: 100%;
    padding-bottom: 1.5vh;
    font-family: "Agency FB", serif;

    .register_text {
      color: black;
      font-size: 1.75vw;
    }

    .to_login {
      padding-left: 3vw;
      color: black;
      font-size: 0.75vw;
    }
  }
}
</style>
