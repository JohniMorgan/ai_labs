<template>
    <h1>Hello, world!</h1>

    <nuxt-link to="/about">То же самое но nuxt-link</nuxt-link>

    <v-row>
        <v-col class="centered">
            <v-btn @click="oneStepDFS">Один шаг DFS</v-btn>
            <v-btn @click="startAutoDFS">Автоматически DFS</v-btn>
        </v-col>
        <v-col cols="4" class="centered">
            <label>Текущая глубина решения {{ stateStore.depthForUser }}</label>
            <ai-game-board :configuration="stateStore.view.configuration"/>
            <label>Текущая итерация: {{ stateStore.stepCountForUser }}</label>
            <a href="/logs.txt" download v-if="stateStore.logsReady">Получить логи отработанного алгоритма</a>
        </v-col>
        <v-col class="centered">
            <v-btn @click="oneStepIterDFS">Один шаг итеративного DFS</v-btn>
            <v-btn @click="startAutoIterativ">Автоматически (iterDFS)</v-btn>
        </v-col>
</v-row>
    
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

function debugCheck() {
    const lentgh = 40000;
    let count = 0;

    setTimeout(function oneStep() {
        count++;
        if (count != lentgh) setTimeout(oneStep, 100);
    }, 100);
    console.log(count);
}
</script>

<style lang="scss">
    .centered {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        > label {
            padding: 15px 0px;
        }
    }

    .v-btn {
        margin-top: 10px;
        margin-bottom: 5px;
    }
</style>