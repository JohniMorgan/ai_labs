<template>
    <div class="centered">
        <h1>Пошаговый модифицированный Итеративный DFS</h1>
        ({{ modeName }})
        <v-btn @click="switchMode">Сменить функцию</v-btn>
        <nuxt-link to="/labs_2/iterativ">Перейти на автоматический алгоритм</nuxt-link>
        <v-row>
            <v-col class="centered">
                <v-card class="to-end">
                <div>
                    <h2>Пошаговый разбор алгоритма</h2>
                    <p>Непосещённые вершины помечены зелёным цветом,
                        посещённые - красным, недостижимые - оранжевым
                    </p>
                    <p>Текущая глубина алгоритма: {{ lab_2.limitForUser }} </p>
                    <label>{{ statusInterpreter }}</label>
                    <div class="wraper">
                        <div v-if="status == 1" class="row">
                            <configuration-sec-lab
                                v-for="child in step_childrens"
                                :data="child"
                            />
                        </div>
                    </div>
                </div>
                <label>Текущее количество нераскрытых вершин: {{ lab_2.stackSize }}</label>
                    <div v-if="lab_2.firstInStack() != null">
                        <label>Следующая вершина для раскрытия: </label>
                        <div class="wrapper">
                            <configuration-sec-lab
                                :data="{
                                    conf: lab_2.firstInStack(),
                                    visitStatus: null,
                                    evristic: lab_2.firstStackPriorety(), 
                                }"/>
                        </div>
                    </div>
                    <v-card-action>
                        <v-btn @click="reset">Сбросить</v-btn>
                    </v-card-action>
                
                </v-card>
            </v-col>
            <v-col class="centered">
                <label>Текущая глубина решения {{ lab_2.depthForUser }}</label>
            <ai-game-board :configuration="lab_2.view.configuration"/>
            <label>Текущая итерация: {{ lab_2.stepCountForUser }}</label>
            <label>Затрачено памяти: {{ lab_2.memoryUserCount }}</label>
            <v-btn @click="oneStepIterDFS">Один шаг Итеративный</v-btn>
            </v-col>
        </v-row>
    </div>
</template>

<script setup>

import { useEvristicStore} from '@/store/evristicStore'

const lab_2 = useEvristicStore();

const mode = ref(true);
const modeName = computed(() => mode.value ? "Не на своих местах" : "Манхэттэнское расстояние");
const switchMode = () => mode.value = !mode.value;

function oneStepIterDFS() {
    if (status.value == 0 || status.value == 3) {
        status.value = 1;
        step_childrens.value = lab_2.IterativFindWays(mode.value);
    }
    else if (status.value == 1) {
        let need_lim = lab_2.IterativCheck();
        status.value = need_lim ? 0 : 3;
    }
    if (status.value == 3) {
        lab_2.IterativStep();
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
    lab_2.refresh();
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
        flex-wrap: wrap;
    }

    .wraper {
        min-height: 7rem;
    }
</style>