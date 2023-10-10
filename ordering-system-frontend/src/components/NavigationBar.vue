<template>
    <el-menu class="el-menu" :router="true" mode="horizontal" :ellipsis="false">
        <el-menu-item index="/"><img src="@/assets/logo.svg" alt="logo" class="logo"></el-menu-item>
        <div class="flex-grow"></div>
        <el-menu-item index="/menu">菜单管理</el-menu-item>
    </el-menu>
</template>

<script setup>
// import { ref } from 'vue'
</script>

<style>
.flex-grow {
    flex-grow: 1;
}

.logo {
    width: 56px;
}
</style>
