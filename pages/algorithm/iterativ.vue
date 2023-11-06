<template>
    <div class="centered">
        <h1>Автоматический алгоритм Итеративный</h1>
        <nuxt-link to="/algorithm/iterativ-stepbystep">Перейти на пошаговый алгоритм</nuxt-link>
        <label>Полученая глубина решения {{ stateStore.depthForUser }}</label>
            <ai-game-board :configuration="stateStore.view.configuration"/>
            <label>Выполненых итераций: {{ stateStore.stepCountForUser }}</label>
            <v-btn @click="startAutoIterativ" v-if="stateStore.status == 'Ожидает'">Автоматический Итеративный</v-btn>
            <v-btn v-else @click="stateStore.refresh()">Сбросить алгоритм</v-btn>
            <div v-if="stateStore.loadingLogs">
                <v-progress-circular
                    indeterminate
                    color="red"/>
                <label>Идёт запись логов, необходимо подождать</label>
            </div>
        <a href="/logs.txt" download v-if="stateStore.logsReady">Получить логи отработанного алгоритма</a>
    </div>
</template>

<script setup>
import { useStateStore } from "@/store/stateStore"
const stateStore = useStateStore();

function startAutoIterativ() {
    stateStore.autoIterativ();
}

</script>