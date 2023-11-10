<script setup>
import { useEvristicStore} from '@/store/evristicStore'

const lab_2 = useEvristicStore();
const step_childrens = ref([]);

const protocolStep = ref(0);

const mode = ref(true);

const modeName = computed(() => mode.value ? "Не на своих местах" : "Манхэттэнское расстояние");
const switchMode = () => {mode.value = !mode.value}

function oneStepDFS() {
    if (protocolStep.value == 0 || protocolStep.value == 2)
    {
        protocolStep.value = 1;
        step_childrens.value = lab_2.findWays(mode.value ? lab_2.nonOwnPlace : lab_2.manhattanDistance);
        console.log(step_childrens.value);
    }
    else {
        protocolStep.value = 2;
        lab_2.nextStep(true);
    }
}

const statusInterpreter = computed(() => {
    switch(protocolStep.value) {
        case 0: 
            return 'Начало алгоритма';
        case 1:
            return 'Раскрытие вершин';
        case 2:
            return 'Переход к следующей вершине';
    }
})

function reset() {
    lab_2.refresh();
    protocolStep.value = 0;
}
</script>

<template>
    <div class="centered">
        <h1>Пошаговый модфицированный алгоритм DFS</h1>
        ({{ modeName }})
        <nuxt-link to="/labs_2/dfs/">Перейти на автоматический алгоритм</nuxt-link>
        <v-btn @click="switchMode">Сменить алгоритм</v-btn>
    </div>
        <v-row>
            <v-col class="centered">
                <v-card>
                <div>
                    <h2>Пошаговый разбор алгоритма</h2>
                    <p>Непосещённые вершины помечены зелёным цветом,
                        посещённые - красным
                    </p>
                    <label>{{ statusInterpreter }}</label>
                    <div class="wrapper">
                        <div v-show="protocolStep == 1" class="row">
                           <configuration-sec-lab 
                                v-for="child in step_childrens"
                                :data="child"
                            />
                        </div>
                    </div>
                    <label>Текущее количество нераскрытых вершин: {{ lab_2.stackSize }}</label>
                    <div v-if="protocolStep != 0">
                        <label>Следующая вершина для раскрытия: </label>
                        <div class="wrapper">
                            <configuration-sec-lab
                                :data="{
                                    conf: lab_2.firstInStack(),
                                    visitStatus: 5,
                                    evristic: lab_2.firstStackPriorety(),
                                }"/>
                        </div>
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
            <v-btn @click="oneStepDFS">Один шаг DFS</v-btn>
            </v-col>
        </v-row>
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
        flex-wrap:wrap;
    }
    .wrapper {
        min-height: 7rem;
    }
</style>