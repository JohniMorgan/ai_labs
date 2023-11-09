<script setup>
import {useEvristicStore} from "@/store/evristicStore"

const lab_2 = useEvristicStore();

function startFind() {
    lab_2.findWays(lab_2.nonOwnPlace);
    lab_2.nextStep(true);
}
function auto() {
    lab_2.autoDFS();
}
</script>

<template>
    <v-btn @click="startFind">Начать поиск путей</v-btn>
    <v-btn @click="auto">Запустить автоматический</v-btn>
    <label>Текущая глубина решения: {{ lab_2.solution_depth }}</label>
    <ai-game-board
        :configuration="lab_2.view.configuration"/>
        <label>Выполненых итераций: {{ lab_2.stepCountForUser }}</label>
        <label>Затрачено памяти: {{ lab_2.memoryUserCount }}</label>
        <label>Затрачено времени: {{ lab_2.result_time }}</label>
</template>

