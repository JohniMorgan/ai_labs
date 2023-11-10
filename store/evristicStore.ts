import { Statement, Direction, type EvriSolutionNode, NodeStackA, type SolutionNode } from "~/algo/objects";

const logger = new Logger();

interface Point {x: number, y: number};

enum Status {
    wait = "Ожидает",
    ok = "Решение найдено",
    simulate = "Симуляция пути",
    noSolution = "нет решений",
}

const getDirectionPoint = (d: Direction) : Point => {
    switch(d) {
        case Direction.UP: return {x: -1, y: 0};
        case Direction.DOWN: return {x: 1, y: 0};
        case Direction.RIGHT: return {x: 0, y: 1};
        case Direction.LEFT: return {x: 0, y: -1};
    } 
    return {x: 0, y: 0}
}

export const useEvristicStore = defineStore('evristic', () => {
    let start_configuration = //Стартовое состояние
       [0, 4, 3,
        6, 2, 1,
        7, 5, 8];
    let end_configuration = //Конечное состояние
       [1, 2, 3,
        4, 0, 5,
        6, 7, 8];
        logger.openStream().then(res => {
            logger.setFilePath(res.data.value!.filename);
        });
    

    const logsReady = ref(false);
    
    let limit = 1; //Текущий лимит алгоритма
    let currentNode = { //Текущая отслеживаемая вершина
        state: new Statement(start_configuration),
        depth: 0,
        parent_direction: Direction.START,
        parent_node: null,
        evristic: 0,
    } as EvriSolutionNode;
    let solution = new Statement(end_configuration);

    

    const hashMap = new Map(); // Хэш множетсво посещённых вершин
    hashMap.set(currentNode.state.hash(), 1);
    let stepCount = 0;
    let memoryCount = 0;
    const nodeStack = new NodeStackA();

    
    let real_max_depth = 0;

    //Переменные интерфейса
    const stepCountForUser = ref(0);
    const memoryUserCount = ref(0);
    const view = ref(new Statement(start_configuration));
    const result_time = ref(0);
    const solution_depth = ref(0);
    const limitForUser = ref(1);
    const status = ref(Status.wait);
    const log_link = ref('');

    function refresh() { //Сбросить состояние в начальное
        logsReady.value = false;
        logger.reset();
        logger.openStream().then(res => logger.setFilePath(res.data.value!.filename));
        status.value = Status.wait;
        limit = 1;
        limitForUser.value = 1;
        real_max_depth = 0;
        currentNode = { 
            state: new Statement(start_configuration),
            depth: 0,
            parent_direction: Direction.START,
            parent_node: null,
            evristic: 0,
        };
        hashMap.clear();
        hashMap.set(currentNode.state.hash(), 1);
        stepCount = 0;
        memoryCount = 0;
        nodeStack.reset();
        //Обнуление переменных интерфейса
        view.value = currentNode.state;
        stepCountForUser.value = 0;
        memoryUserCount.value = 0;
        solution_depth.value = 0;
        result_time.value = 0;
    }

    function changeSetting(start: [number], end: [number]) {
        start_configuration = start;
        end_configuration = end;
        solution.configuration = end_configuration;
    }

    function checkNodeStatusLog(hash: number, nowDepth?: number, depth? : number) {
        if (hashMap.has(hash)) return -1
        if (depth != undefined)
            if (nowDepth! + 1 >= depth) return -2
        return 0
    }

    function check(st: Statement) {
        if (hashMap.has(st.hash())) {
            return true;
        } else {
            hashMap.set(st.hash(), 1);
            return false;
        }
    }

    function findPosition(number: number, target: Array<number>) : Point {
        let ans = target.indexOf(number);
        if (ans !== -1) return {
            x: Math.floor(ans / 3),
            y: ans % 3,
        };
        else return {x: -1, y: -1};
    }

    function nonOwnPlace(conf: Array<number>) : number {
        let count : number = 0;

        conf.forEach((el, index) => {
            if (end_configuration[index] != el) count += 1;
        })
        return count;
    }

    function manhattanDistance(conf: Array<number>) : number {
        let count : number = 0;

        conf.forEach((el) => {
            let currPos = findPosition(el, conf);
            let endPos = findPosition(el, end_configuration);
            count += Math.abs(currPos.x - endPos.x) + Math.abs(currPos.y - endPos.y);
        });
        return count;
    }

    function findWays(evriFunc: (conf: Array<number>) => number, maxdepth? : number) {
        let childrens = new Array<EvriSolutionNode>;
        let childrensLog = new Array<{
            conf: Array<number>,
            visitStatus: number,
            evristic: number,
        }>;
        logger.buferrize(`Текущая итерация алгоритма: ${stepCount}\n`);
        logger.buferrize(`[${currentNode.state.configuration}] `);
        logger.buferrize(' Потомки выбранной вершины: \n');
        const nullPosition = findPosition(0, currentNode.state.configuration);
        Object.values(Direction).forEach((d) => {
            if (d != Direction.START) { // Обойти стартовое состояние
            const move : Point = getDirectionPoint(d);
            
            const nextPosition = {x: nullPosition.x + move.x, y:  nullPosition.y + move.y };
            if (nextPosition.x >= 0 && nextPosition.x <= 2 && nextPosition.y >=0 && nextPosition.y <= 2) {
                const arrayPosition = nextPosition.x * 3 + nextPosition.y; 
                
                //Движение возможно
                let temp = new Statement(currentNode.state.configuration);
                temp.swap(nullPosition.x * 3 + nullPosition.y, arrayPosition);
                let child = {
                    conf: temp.configuration,
                    visitStatus: checkNodeStatusLog(temp.hash(), currentNode.depth, maxdepth),
                    evristic: Math.max(evriFunc(temp.configuration) + currentNode.depth + 1, currentNode.evristic),
                }
                childrensLog.push(child);
                logger.buferrize(`[${child.conf}] `);  
                logger.buferrize((child.visitStatus == -1) ? "{ПОСЕЩЕНО} " : ' ');
                logger.buferrize((child.visitStatus == -2) ? "{НЕДОСТИЖИМО} " : ' ');
                logger.buferrize(`Значение f(n) = ${child.evristic}\n`);
                if (!check(temp) && (currentNode.depth + 1 != maxdepth)) {
                    hashMap.set(temp.hash(), 1);
                    memoryCount += 1;
                    childrens.push({
                        state: temp,
                        depth: currentNode.depth + 1,
                        parent_direction: d,
                        parent_node: currentNode,
                        evristic: Math.max(evriFunc(temp.configuration) + currentNode.depth + 1, currentNode.evristic),
                    });
                }
            }
        }
        
        });

        childrens.sort((a, b) => b.evristic - a.evristic);

        childrens.forEach(el => {
            nodeStack.push(el);
        })

        return childrensLog;        
    }
    
    function nextStep(user? : boolean) : boolean {
        stepCount += 1;
        let step : EvriSolutionNode = nodeStack.pop();
        currentNode = step;

        if (user) {
            memoryUserCount.value = memoryCount;
            stepCountForUser.value = stepCount;
            view.value = step.state;
        }

        if (currentNode.state.hash() == solution.hash()) {
            logger.buferrize('Решение найдено!\n');
            status.value = Status.ok;
            return true;
        }
        return false;
    }
    //Функция автоматического DFS
    function autoDFS(non_place: boolean) {
        let stopFlag = false;

        const start = performance.now();
        while (!stopFlag) {
            findWays(non_place ? nonOwnPlace : manhattanDistance);
            stopFlag = nextStep() || nodeStack.isEmpty;
        };
        const algo_time = performance.now() - start;

        result_time.value = algo_time;
        logger.buferrize(`\nВремя работы алгоритма: ${algo_time} мс.\n`)

        if (nodeStack.isEmpty) {
            status.value = Status.noSolution;
            logger.buferrize('Решение не найдено!\n');
            logger.dump().then(() => logsReady.value = true);
        }
        if (status.value == Status.ok) simulatePath(pathRestoration(currentNode));

        stepCountForUser.value = stepCount;
        memoryUserCount.value = memoryCount;
        solution_depth.value = currentNode.depth;
    }

    function IterativFindWays(non_place : boolean) {
       return findWays(non_place ? nonOwnPlace : manhattanDistance, limit + 1);
    }
    function IterativCheck() : boolean {
        if (nodeStack.isEmpty) {
            limit += 2;
            limitForUser.value += 2;
            currentNode = { 
                state: new Statement(start_configuration),
                depth: 0,
                parent_direction: Direction.START,
                parent_node: null,
                evristic: 0,
            };
            hashMap.clear();
            hashMap.set(currentNode.state.hash(), 1);
            return true;
        } return false;
    }

    function IterativStep() : boolean {
        return nextStep(true);
    }

    function IterativStepForAuto(non_place : boolean) : boolean {
        findWays(non_place ? nonOwnPlace : manhattanDistance, limit + 1);
        real_max_depth = Math.max(real_max_depth, currentNode.depth);
        if (nodeStack.isEmpty) {
            if (real_max_depth != limit) { 
                logger.buferrize("Решение не найдено!\n");
                status.value = Status.noSolution;
                logger.dump().then(() => logsReady.value = true);
                return true;
            } else {
                limit += 2;
                real_max_depth = 0;
                currentNode = { 
                    state: new Statement(start_configuration),
                    depth: 0,
                    parent_direction: Direction.START,
                    parent_node: null,
                    evristic: 0,
                };
                hashMap.clear();
                hashMap.set(currentNode.state.hash(), 1);
                view.value = currentNode.state;
                return false;
            }
        } else return nextStep();
    } 

    function autoIterativ(non_place : boolean) {
        const start = performance.now();
        
        let stopFlag = false;
        while (!stopFlag) {
            stopFlag = IterativStepForAuto(non_place);
        }
        const algo_time = performance.now() - start;
        logger.buferrize(`\nВремя раболты алгоритма: ${algo_time} мс.\n`)

        if (status.value == Status.ok) simulatePath(pathRestoration(currentNode));

        stepCountForUser.value = stepCount;
        memoryUserCount.value = memoryCount;
        result_time.value = algo_time;
        solution_depth.value = currentNode.depth;
    }

    //Набор функций для восстановления и отображения пользователю пути
    function pathRestoration(final : EvriSolutionNode) {
        let pathNode : SolutionNode;
        pathNode = final;
        let path_string = '';
        let path = new Array<Statement>;
            while(pathNode.parent_node != null) {
                path.push(pathNode.state);
                path_string = pathNode.parent_direction + " " + path_string; 
                if (pathNode.parent_node != null)
                    pathNode = pathNode.parent_node;
            };
        logger.buferrize(path_string);
        logger.dump()//.then(() => logsReady.value = true);
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
                    status.value = Status.ok;
                    clearTimeout(id);
                } else id = setTimeout(oneStep, 100);
            } else clearTimeout(id);
        }, 100);
    }

    const loadingLogs = computed(() => status.value != Status.wait && !logsReady.value);
    const firstInStack = () => {
        if (!nodeStack.isEmpty) return nodeStack.show().state.configuration
        else return null
    };
    const firstStackPriorety = () => {
        if (!nodeStack.isEmpty) return nodeStack.show().evristic
        else return 0;
    }
    const stackSize = computed(() => nodeStack.size);
    

    return {
        findWays, nonOwnPlace, manhattanDistance, nextStep, view,
        refresh, stepCountForUser, memoryUserCount, autoDFS, 
        result_time, solution_depth, autoIterativ,
        firstStackPriorety, limitForUser,
        IterativCheck, IterativFindWays, IterativStep, loadingLogs, firstInStack,
        stackSize, logsReady, status
    };
})