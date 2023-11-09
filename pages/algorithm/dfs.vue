<template>
    <div class="centered">
        <h1>Автоматический алгоритм DFS</h1>
        <nuxt-link to="/algorithm/dfs-stepbystep">Перейти на пошаговый алгоритм</nuxt-link>
        <label>Полученая глубина решения {{ stateStore.depthForUser }}</label>
            <ai-game-board :configuration="stateStore.view.configuration"/>
            <label>Выполненых итераций: {{ stateStore.stepCountForUser }}</label>
            <label>Затрачено памяти: {{ stateStore.memoryUserCount }}</label>
            <v-btn @click="startAutoDFS"
                v-if="stateStore.status == 'Ожидает'"
            >Автоматически DFS</v-btn>
            <v-btn @click="resetState" v-else>Сбросить алгоритм</v-btn>
            <div v-if="stateStore.loadingLogs">
                <v-progress-circular
                    indeterminate
                    color="red"/>
                <label>Идёт запись логов, необходимо подождать</label>
            </div>
            <a 
                href="/logs.txt" 
                download
                v-if="stateStore.logsReady"
                class="link-as-btn"
            >
                Получить логи отработанного алгоритма
            </a>
    </div>
</template>

<script setup>
import { useStateStore } from "@/store/stateStore"
const stateStore = useStateStore();

function startAutoDFS() {
    stateStore.autoDFS();
}

function resetState() {
    stateStore.refresh();
}

</script>