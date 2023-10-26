<template>
    <h1>Hello, world!</h1>

    <nuxt-link to="/about">То же самое но nuxt-link</nuxt-link>

    <span>Текущая глубина решения {{ stateStore.currentNode.depth }}</span>

    <ai-game-board :configuration="stateStore.view.configuration"/>
    <jm-btn @click="oneStepDFS">Один шаг DFS</jm-btn>
    <jm-btn @click="startAutoDFS">Запустить поиск решения (DFS)</jm-btn>
    <jm-btn @click="oneStepIterDFS">Один шаг итеративного DFS</jm-btn>
    <jm-btn @click="startAutoIterativ">Запустить поиск решения (IterDFS)</jm-btn>
    Текущая итерация: {{ stateStore.stepCount }}
</template>

<script setup lang="ts">
import {useStateStore} from "@/store/stateStore"

const stateStore = useStateStore();

function oneStepDFS() {
    stateStore.findWays();
    stateStore.nextStep();
}

function oneStepIterDFS() {
    stateStore.IterativDFSStep();
}

function startAutoDFS() {
    stateStore.autoDFS();
}

function startAutoIterativ() {
    stateStore.autoIterativ();
}
</script>