<script setup>
import {useEvristicStore} from "@/store/evristicStore"

const lab_2 = useEvristicStore();

const non_place_mode = ref(true);

const refresh = () => {lab_2.refresh()}

function auto() {
    lab_2.autoDFS(non_place_mode.value);
}
const switchMode = () => { non_place_mode.value = !non_place_mode.value };
const modeName = computed(() => non_place_mode.value ? "Не на своих местах" : "Манхэттэнское расстояние");
</script>

<template>
    <div class="centered">
        <h1>Автоматический модифицированный DFS</h1>
            ({{ modeName }})
        <v-btn @click="switchMode">Сменить функцию</v-btn>
    </div>
    <v-row>
        <v-col class="centered">
            <v-card class="protocol">
                <h2 class="self-center">Протокол алгоритма</h2>
                <label>Выполненых итераций: {{ lab_2.stepCountForUser }}</label>
                <label>Затрачено памяти: {{ lab_2.memoryUserCount }}</label>
                <label>Затрачено времени: {{ lab_2.result_time }}</label>
            </v-card>
        </v-col>
        <v-col class="centered">
            <nuxt-link to="/labs_2/dfs/step-by-step">Перейти на пошаговый алгоритм</nuxt-link>
            <label>Текущая глубина решения: {{ lab_2.solution_depth }}</label>
            <ai-game-board
                :configuration="lab_2.view.configuration"
            />
            <v-btn @click="auto"
            v-if="lab_2.status == 'Ожидает'">Запустить автоматический</v-btn>
            <v-btn @click="refresh" v-else>Сбросить алгоритм</v-btn>
            <div v-if="lab_2.loadingLogs">
                <v-progress-circular
                    indeterminate
                    color="red"/>
                <label>Идёт запись логов, необходимо подождать</label>
            </div>
            <a 
                :href="`/${lab_2.log_link}`" 
                download
                v-if="lab_2.logsReady"
                class="link-as-btn"
            >
                Получить логи отработанного алгоритма
            </a>
        </v-col>
    </v-row>
</template>

<style lang="scss">
    .v-card.protocol {
        display: flex;
        flex-direction: column;
        .self-center {
            align-self: center;
        }
    }
    .board {
        width: 40%;
    }
</style>
