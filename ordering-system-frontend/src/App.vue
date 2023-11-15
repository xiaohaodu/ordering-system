<template>
  <router-view></router-view>
</template>

<script lang="ts" setup>
import { elMessage } from "@/function/message";
import loading from "@/network/loading";
import { provide } from "vue";
provide("elMessage", elMessage);
provide("loading", loading);
</script>

<style></style>
