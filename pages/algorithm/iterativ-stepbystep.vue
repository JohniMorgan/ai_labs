<template>
    <div class="centered">
        <h1>Пошаговый алгоритм Итеративный DFS</h1>
        <nuxt-link to="/algorithm/iterativ">Перейти на автоматический алгоритм</nuxt-link>
        <v-row>
            <v-col class="centered">
                <v-card class="to-end">
                <div>
                    <h2>Пошаговый разбор алгоритма</h2>
                    <p>Непосещённые вершины помечены зелёным цветом,
                        посещённые - красным, недостижимые - оранжевым
                    </p>
                    <p>Текущая глубина алгоритма: {{ stateStore.limit }}</p>
                    <label>{{ statusInterpreter }}</label>
                    <div class="wraper">
                        <div v-if="status == 1" class="row">
                            <configuration-view 
                                v-for="child in step_childrens"
                                :data="child"
                            />
                        </div>
                    </div>
                </div>
                <label>Текущее количество нераскрытых вершин: {{ stateStore.stackSize() }}</label>
                    <div v-if="stateStore.firstInStack() != null">
                        <label>Следующая вершина для раскрытия: </label>
                        <div class="wrapper">
                            <configuration-view
                                :data="{
                                    conf: stateStore.firstInStack(),
                                    visited: none,
                                }"/>
                        </div>
                    </div>
                    <v-card-action>
                        <v-btn @click="reset">Сбросить</v-btn>
                    </v-card-action>
                
                </v-card>
            </v-col>
            <v-col class="centered">
                <label>Текущая глубина решения {{ stateStore.depthForUser }}</label>
            <ai-game-board :configuration="stateStore.view.configuration"/>
            <label>Текущая итерация: {{ stateStore.stepCountForUser }}</label>
            <v-btn @click="oneStepIterDFS">Один шаг Итеративный</v-btn>
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

<script setup>

import { useStateStore} from '@/store/stateStore'

const stateStore = useStateStore();

function oneStepIterDFS() {
    if (status.value == 0 || status.value == 3) {
        status.value = 1;
        step_childrens.value = stateStore.IterativDFSFind();
    }
    else if (status.value == 1) {
        let need_lim = !stateStore.IterativDFSCheck();
        status.value = need_lim ? 0 : 3;
    }
    if (status.value == 3) {
        stateStore.IterativDFSStep();
    }
}

const step_childrens = ref([]);

const status = ref(0);

const statusInterpreter = computed(() => {
    switch(status.value) {
        case 0: 
            return 'Обновление предела';
        case 1:
            return 'Раскрытие вершин';
        case 2:
            return 'Проверка необходимости лимита';
        case 3: 
            return 'Переход к новой вершине';
    }
})

function reset() {
    stateStore.refresh();
    status.value = 0;
}

</script>

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

    .wraper {
        height: 7rem;
    }
</style>