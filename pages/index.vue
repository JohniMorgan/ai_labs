<template>
    <h1>Hello, world!</h1>

    <a href="/about">Эта ссылка ведёт на страницу "О нас"</a><br>
    <nuxt-link to="/about">То же самое но nuxt-link</nuxt-link>

    <ai-game-board :configuration="stateStore.view.configuration"/>
    <jm-btn @click="switchTile">Один шаг DFS</jm-btn>
    <jm-btn @click="startAutoDFS">Запустить поиск решения (DFS)</jm-btn>
    Текущая итерация: {{ stateStore.stepCount }}
</template>

<script setup lang="ts">
import {useStateStore} from "@/store/stateStore"

const stateStore = useStateStore();

function switchTile() {
    stateStore.findWays();
    stateStore.nextStep();
}

function startAutoDFS() {
    stateStore.autoDFS();
}
</script>