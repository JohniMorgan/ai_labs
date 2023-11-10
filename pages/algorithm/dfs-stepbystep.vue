<script setup>
import { useStateStore} from '@/store/stateStore'

const stateStore = useStateStore();
const step_childrens = ref([]);

const status = ref(0);

function oneStepDFS() {
    if (status.value == 0 || status.value == 2)
    {
        status.value = 1;
        step_childrens.value = stateStore.findWays();
    }
    else {
        status.value = 2;
        stateStore.nextStep(true);
    }
}

const statusInterpreter = computed(() => {
    switch(status.value) {
        case 0: 
            return 'Начало алгоритма';
        case 1:
            return 'Раскрытие вершин';
        case 2:
            return 'Переход к следующей вершине';
    }
})

function reset() {
    stateStore.refresh();
    status.value = 0;
}
</script>

<template>
    <div class="centered">
        <h1>Пошаговый алгоритм DFS</h1>
        <nuxt-link to="/algorithm/dfs">Перейти на автоматический алгоритм</nuxt-link>
        <v-row>
            <v-col class="centered">
                <v-card class="to-end">
                <div>
                    <h2>Пошаговый разбор алгоритма</h2>
                    <p>Непосещённые вершины помечены зелёным цветом,
                        посещённые - красным
                    </p>
                    <label>{{ statusInterpreter }}</label>
                    <div class="wrapper">
                        <div v-show="status == 1" class="row">
                            <configuration-view 
                                v-for="child in step_childrens"
                                :data="child"
                            />
                        </div>
                    </div>
                    <label>Текущее количество нераскрытых вершин: {{ stateStore.stackSize() }}</label>
                    <div v-if="status != 0">
                        <label>Следующая вершина для раскрытия: </label>
                        <div class="wrapper">
                            <configuration-view
                                :data="{
                                    conf: stateStore.firstInStack(),
                                    visited: none,
                                }"/>
                        </div>
                    </div>
                </div>
                    <v-card-action>
                        <v-btn @click="reset">Сбросить состояние</v-btn>
                    </v-card-action>
                </v-card>
            </v-col>
            <v-col class="centered">
                <label>Текущая глубина решения {{ stateStore.depthForUser }}</label>
            <ai-game-board :configuration="stateStore.view.configuration"/>
            <label>Текущая итерация: {{ stateStore.stepCountForUser }}</label>
            <label>Затрачено памяти: {{ stateStore.memoryUserCount }}</label>
            <v-btn @click="oneStepDFS">Один шаг DFS</v-btn>
            <div v-if="stateStore.loadingLogs">
                <v-progress-circular
                    indeterminate
                    color="red"/>
                <label>Идёт запись логов, необходимо подождать</label>
            </div>
            <a href="/logs.txt" download v-if="stateStore.logsReady">Получить логи отработанного алгоритма</a>
            </v-col>
        </v-row>
    </div>
</template>

<style lang="scss">
    .v-row {
        width: 100%;
    }
    .v-card {
        background-color: $surface;
        color: $text;
        max-width: 400px;
        min-height: 200px;
    }
    .row {
        display: flex;
        flex-direction: row;
    }
    .wrapper {
        min-height: 7rem;
    }
</style>
