<template>
    <div class="background">
        <el-form :model="user" class="login" label-position="left">
            <div class="head">
                <div class="login_text">登录</div>
                <router-link :to="{ name: 'Register' }" class="to_register">注册</router-link>
            </div>
            <div style="align-self: center;">提供系统测试账号</div>
            <el-form-item label="账号">
                <el-input v-model="user.username" type="text" placeholder="Please input your username" />
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="user.password" type="password" :show-password=true
                    placeholder="Please input your password" />
            </el-form-item>
            <div class="login-button">
                <el-button class="button" @click="login">登录</el-button>
            </div>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import router from "@/router";
import { login as netLogin } from "@/network/login/login";
import { reactive, onMounted, getCurrentInstance, ref } from "vue";



onMounted(() => {
});
let user = reactive({
    username: 'test',
    password: '123456',
});
const { proxy } = getCurrentInstance() as any;
async function login() {
    proxy.$loading();
    try {
        const { data: res } = await netLogin(user);
        if (res.status === 0) {
            localStorage.Authorization = res.token;
            localStorage.isAuthenticated = true;
            localStorage.user_id = res.id;
            router.push('/');
        }
        return proxy.$elMessage(res.message, res.status === 0 ? 'success' : 'error');
    } catch (error) {
        // console.log(error);
        return proxy.$elMessage(error);
    }
}

</script>

<style lang="scss" scoped>
.background {
    height: 100vh;
    width: 100vw;

    background: {
        image: url('@/assets/background.jpg');
        size: 100vw;
        repeat: no-repeat;
    }

    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: black;
}

.login {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;


    .el-form-item {
        padding-right: 2.5vw;
    }

    .el-form-item__content:nth-child(2) {
        height: 5vh;
        width: 20vw;
        margin-bottom: 1.5vh;
    }

    .el-form-item__content:nth-child(3) {
        height: 5vh;
        width: 20vw;
        margin-top: 1.5vh;
    }

    :deep(.el-form-item__label) {
        color: black;
    }

    .login-button {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    .head {
        display: flex;
        width: 19.25vw;
        line-height: 100%;
        font-family: "Agency FB", serif;
        padding-bottom: 1.5vh;

        .login_text {
            color: black;
            font-size: 1.75vw;
        }

        .to_register {
            padding-left: 3vw;
            color: black;
            font-size: 0.75vw;
        }
    }
}
</style>