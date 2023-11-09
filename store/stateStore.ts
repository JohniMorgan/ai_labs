import { defineStore } from "pinia";
import { Statement, NodeStack, Direction, NodeStackA } from "@/algo/objects";
import type { EvriSolutionNode, SolutionNode } from "@/algo/objects";
import { Logger } from "~/utils/logger";


interface Point {
    x: number;
    y: number;
}

enum Status {
    wait = 'Ожидает',
    simulate = 'Симуляция пути',
    ready = 'Готово',
    noSolution = 'Нет решений',
}

const algologger = new Logger('logs.txt');

export const useStateStore = defineStore('state', () => {
    const start_configuration = [0, 4, 3, 6, 2, 1, 7, 5, 8]; //Стартовая конфигурация
    const logsReady = ref(false); //Флаг готовности логов. Интерфейс
    
    algologger.openStream(); //Запросить открытие файла логов
    const start_node = { //Корень дерева решений
        state: new Statement(start_configuration),
        depth: 0,
        parent_direction : Direction.START,
        parent_node: null
    } as SolutionNode;
    const limit = ref(1); //Лимит для итеративного алгоритма
    const depthForUser = ref(0); //Глубина, отображаемая в интерфейсе
    let currentNode = start_node; // Текущая рассматриваемая вершина дерева решений
    const view = ref(new Statement(start_node.state.configuration)); //Отображение конфигурации у пользователя
    const solution = new Statement([1, 2, 3, 4, 0, 5,6, 7, 8]); //Конечное состояние - решение
    const hashMap = new Map(); //Хэш-множество, хранит информацию о посещённых вершинах
    const stepCountForUser = ref(0); //Отображаемое в интерфейсе кол-во шагов аглоритма
    let realStepCount = 0; //Рабочее количество шагов, рассчитывается в процессе
    hashMap.set(start_node.state.hash(), 1); //Постановка стартового состояния как посещённого
    const status = ref(Status.wait); //Текущий статус программы в целом
    const real_max_depth = ref(0); //Максимальная глубина отображаемая в интерфейсе
    let memoryCount = 0;
    const memoryUserCount = ref(0);

    const nodeQueue = new NodeStack();

    function refresh() {
        limit.value = 1;
        depthForUser.value = 0;
        currentNode = start_node;
        view.value = currentNode.state;
        hashMap.clear();
        hashMap.set(view.value.hash(), 1);
        stepCountForUser.value = 0;
        algologger.reset();
        algologger.openStream();
        nodeQueue.reset();
        real_max_depth.value = 0;
        memoryCount = 0;
        memoryUserCount.value = 0;

        logsReady.value = false;
        realStepCount = 0;
        status.value = Status.wait;
    }

    function findPosition(number: number) : Point {
        let ans = currentNode.state.configuration.indexOf(number);
        if (ans !== -1) return {
            x: Math.floor(ans / 3),
            y: ans % 3,
        };
        else return {x: -1, y: -1};
    }

    function checkFinal() {
        let targetFlag = hashMap.get(currentNode.state.hash());
        if (!targetFlag) {
            hashMap.set(currentNode.state.hash(), 1);
            return false;
        }
        return true;
    }

    function checkVisited(hash: number, nowDepth?: number, depth? : number) {
        if (hashMap.has(hash)) return 'visited'
        if (depth != undefined)
            if (nowDepth! + 1 >= depth) return 'untouch'
        return 'free'
    }


    //Функция применима к первой лабораторной работе
    function findWays(maxdepth? : number) {
        let childrens = [];
        algologger.buferrize(`Текущая итерация алгоритма: ${realStepCount}\n`);
        algologger.buferrize(`[${currentNode.state.configuration}]`);
        const zeroPos = findPosition(0);
        algologger.buferrize(' Потомки: ');
        // Попытка вправо
        if (zeroPos.y < 2) {
            let rSt = new Statement(currentNode.state.configuration);
            rSt.swap(zeroPos.x * 3 + zeroPos.y + 1,
                zeroPos.x * 3 + zeroPos.y);
            childrens.push( {
                conf: rSt.configuration,
                visited: (maxdepth == undefined) ? checkVisited(rSt.hash()) :
                 checkVisited(rSt.hash(), currentNode.depth, maxdepth),
            });
            algologger.buferrize(`[${rSt.configuration}] `);
            if (hashMap.has(rSt.hash())) {
                algologger.buferrize('{ПОСЕЩЕНО} ');
            } else if (currentNode.depth + 1 == maxdepth) algologger.buferrize('{НЕДОСТИЖИМО} ');
            if (!hashMap.has(rSt.hash()) && currentNode.depth + 1 != maxdepth)  {
                hashMap.set(rSt.hash(), 10);
                memoryCount++;
                nodeQueue.push({
                    state: rSt,
                    depth: currentNode.depth + 1,
                    parent_direction: Direction.RIGHT,
                    parent_node: currentNode,
                });
            }
        }
        // Аналогично вниз
        if (zeroPos.x < 2) {
            let downSt = new Statement(currentNode.state.configuration);
            downSt.swap(zeroPos.x * 3 + zeroPos.y,
                (zeroPos.x + 1) * 3 + zeroPos.y);
                childrens.push( {
                    conf: downSt.configuration,
                    visited: (maxdepth == undefined) ? checkVisited(downSt.hash()) :
                     checkVisited(downSt.hash(), currentNode.depth, maxdepth),
                });
                algologger.buferrize(`[${downSt.configuration}] `);
            if (hashMap.has(downSt.hash())) {
                algologger.buferrize('{ПОСЕЩЕНО} ');
            } else if (currentNode.depth + 1 == maxdepth) algologger.buferrize('{НЕДОСТИЖИМО} ');
            if (!hashMap.has(downSt.hash()) && currentNode.depth + 1 != maxdepth)  {
                hashMap.set(downSt.hash(), 1);
                memoryCount++;
                nodeQueue.push({
                    state: downSt,
                    depth: currentNode.depth + 1,
                    parent_direction: Direction.DOWN,
                    parent_node: currentNode,
                });
            }
        }
        // Аналогично влево
        if (zeroPos.y > 0) {
            let lSt = new Statement(currentNode.state.configuration);
            lSt.swap(zeroPos.x  * 3 + zeroPos.y - 1,
                zeroPos.x * 3 + zeroPos.y);
            algologger.buferrize(`[${lSt.configuration}] `);
            childrens.push( {
                conf: lSt.configuration,
                visited: (maxdepth == undefined) ? checkVisited(lSt.hash()) :
                 checkVisited(lSt.hash(), currentNode.depth, maxdepth),
            });
            if (hashMap.has(lSt.hash())) {
                algologger.buferrize('{ПОСЕЩЕНО} ');
            } else if (currentNode.depth + 1 == maxdepth) algologger.buferrize('{НЕДОСТИЖИМО} ');
            if (!hashMap.has(lSt.hash()) && currentNode.depth + 1 != maxdepth)  {
                hashMap.set(lSt.hash(), 1);
                memoryCount++;
                nodeQueue.push({
                    state: lSt,
                    depth: currentNode.depth + 1,
                    parent_direction: Direction.LEFT,
                    parent_node: currentNode,
                });
            }
        }
        // Аналогично вверх
        if (zeroPos.x > 0) {
            let upSt = new Statement(currentNode.state.configuration);
            upSt.swap(zeroPos.x * 3 + zeroPos.y,
                (zeroPos.x - 1) * 3 + zeroPos.y);
                childrens.push({
                    conf: upSt.configuration,
                    visited: (maxdepth == undefined) ? checkVisited(upSt.hash()) :
                     checkVisited(upSt.hash(), currentNode.depth, maxdepth),
                });
            algologger.buferrize('[' + upSt.configuration + '] ');
            if (hashMap.has(upSt.hash())) {
                algologger.buferrize('{ПОСЕЩЕНО} ');
            } else if (currentNode.depth + 1 == maxdepth) algologger.buferrize('{НЕДОСТИЖИМО} ');
            if (!hashMap.has(upSt.hash()) && currentNode.depth + 1 != maxdepth)  {
                hashMap.set(upSt.hash(), 1);
                memoryCount++;
                nodeQueue.push({
                    state: upSt,
                    depth: currentNode.depth + 1,
                    parent_direction: Direction.UP,
                    parent_node: currentNode,
                });
            }
        }
        algologger.buferrize('\n');
        return childrens;
    }
    //Функция применима к первой лабораторной работе
    function nextStep(user? : boolean) : boolean {
        realStepCount += 1;
        let step : SolutionNode = nodeQueue.pop();
        currentNode = step;
        view.value = step.state;
        if (user) {
            stepCountForUser.value = realStepCount;
            depthForUser.value = currentNode.depth;
            memoryUserCount.value = memoryCount;
        }
        if (currentNode.state.hash() == solution.hash()) {
            algologger.buferrize('Решение найдено!');
            return true;
        }
        return false;
    }
    //Автоматический запуск ДФС для первой работы
    function autoDFS() {
        let flag = false;
        const start = performance.now();
        while (!flag) {
            findWays();
            flag = nextStep();
            if (nodeQueue.isEmpty()) flag = true;
        }
        const algo_time = performance.now() - start;
        if (!nodeQueue.isEmpty()) {
            algologger.buferrize(`\nЗатраченное время: ${algo_time} мс.\n`);
            simulatePath(pathRestoration(currentNode));
        }
        else { algologger.buferrize("Решения не существует ")
            status.value = Status.noSolution;
            algologger.dump().then(() => logsReady.value = true);
        }
        stepCountForUser.value = realStepCount;
        memoryUserCount.value = memoryCount;
    }
    //Автоматический запуск итеративного ДФС для первой работы
    function autoIterativ() {
        const start = performance.now();

        let flag = false;
        while (!flag) {
            flag = IterativDFSStepForAuto();
        }
        const algo_time = performance.now() - start;
        algologger.buferrize('\nЗатраченное время: ' + algo_time + ' мс\n');
        stepCountForUser.value = realStepCount;
        memoryUserCount.value = memoryCount;
        if (status.value != Status.noSolution) simulatePath(pathRestoration(currentNode));        
    }
    //Функция шага алгоритма. Автоматический режим
    function IterativDFSStepForAuto() : boolean {
        findWays(limit.value + 1);
        real_max_depth.value = currentNode.depth > real_max_depth.value ? currentNode.depth : real_max_depth.value;
        if (nodeQueue.isEmpty()) {
            if (real_max_depth.value != limit.value) { 
                algologger.buferrize("Решений нет\n");
                status.value = Status.noSolution;
                return true;
            } else {
                limit.value += 2;
                currentNode = start_node;
                hashMap.clear();
                hashMap.set(start_node.state.hash(), 1);
                view.value = currentNode.state;
                return false;
            }
        } else return nextStep();
    }
    //Единичный поиск пути Итеративного алгоритма
    function IterativDFSFind() {
        return findWays(limit.value + 1);
    }
    //Проверка лимита Итеративного алгоритма
    function IterativDFSCheck() {
        if (nodeQueue.isEmpty()) {
            limit.value += 2;
            currentNode = start_node;
            hashMap.clear();
            hashMap.set(start_node.state.hash(), 1);
            view.value = currentNode.state;
            return false
        } return true;
    }
    //Шаг итеративного алгоритма
    function IterativDFSStep() {
        nextStep(true);
    }
    //Восстановление пути
    function pathRestoration(final : SolutionNode) {
        console.log("Поиск пути");
        let path_string = '';
        let path = new Array<Statement>;
         depthForUser.value = final.depth;
            while(final.parent_node != null) {
                path.push(final.state);
                path_string = final.parent_direction + " " + path_string; 
                if (final.parent_node != null)
                    final = final.parent_node;
            };
        algologger.buferrize(path_string);
        algologger.dump().then(() => logsReady.value = true);
        return path.toReversed();    
    }
    //Симуляция пути на экране
    async function simulatePath(path: Array<Statement>) {
        status.value = Status.simulate;
        let count = 1;
        view.value = path[0];
        let id = setTimeout(function oneStep() {
            if (status.value == Status.simulate) {
                view.value = path[count];
                count++;
                if (count == path.length) {
                    status.value = Status.ready;
                    clearTimeout(id);
                } else id = setTimeout(oneStep, 100);
            } else clearTimeout(id);
        }, 100);
    }
    //Вычисляемое свойство
    const loadingLogs = computed(() => {
        return status.value != Status.wait && !logsReady.value;
    })
    //Текущее количество нераскрытых вершин
    function stackSize() {
        return nodeQueue.getInst().length;
    }
    //Вернуть следующую нераскрытую вершину
    function firstInStack() {
        if (nodeQueue.isEmpty()) return null
        else return nodeQueue.get().state.configuration;
    }

    return {
    //Блок основных функций, а также функций первой лабораторной работы
    checkFinal, findPosition, loadingLogs, view, depthForUser, findWays, nextStep, autoDFS,
    autoIterativ, IterativDFSStep, stepCountForUser, pathRestoration, currentNode, logsReady, refresh,
    limit, IterativDFSFind, IterativDFSCheck, status, stackSize, firstInStack, memoryUserCount
    };
})