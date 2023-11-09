import { Statement, Direction, type EvriSolutionNode, NodeStackA } from "~/algo/objects";

const logger = new Logger('lab_2.logs.txt');

interface Point {x: number, y: number};

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
       [7, 2, 4,
        5, 0, 6,
        8, 3, 1];
    let end_configuration = //Конечное состояние
       [0, 1, 2,
        3, 4, 5,
        6, 7, 8];
    logger.openStream();
    
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

    //Переменные интерфейса
    const stepCountForUser = ref(0);
    const memoryUserCount = ref(0);
    const view = ref(new Statement(start_configuration));
    const result_time = ref(0);
    const solution_depth = ref(0);

    function refresh() { //Сбросить состояние в начальное
        limit = 1;
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
        view.value = currentNode.state;
    }

    function changeSetting(start: [number], end: [number]) {
        start_configuration = start;
        end_configuration = end;
        solution.configuration = end_configuration;
    }

    function check(st: Statement) {
        if (hashMap.has(st.hash())) {
            return true;
        } else {
            hashMap.set(st.hash(), 1);
            return false;
        }
    }

    function findPosition(number: number) : Point {
        let ans = currentNode.state.configuration.indexOf(number);
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

    function findWays(evriFunc: (conf: Array<number>) => number, maxdepth? : number) {
        let childrens = new Array<EvriSolutionNode>;
        let childrensLog = [];
        //logger.buferrize(`Текущая итерация алгоритма: ${stepCount}\n`);
        //logger.buferrize(`[${currentNode.state.configuration}] `);
        const nullPosition = findPosition(0);
        Object.values(Direction).forEach((d) => {
            if (d != Direction.START) { // Обойти стартовое состояние
            const move : Point = getDirectionPoint(d);
            
            const nextPosition = {x: nullPosition.x + move.x, y:  nullPosition.y + move.y };
            if (nextPosition.x >= 0 && nextPosition.x <= 2 && nextPosition.y >=0 && nextPosition.y <= 2) {
                const arrayPosition = nextPosition.x * 3 + nextPosition.y; 
                
                //Движение возможно
                let temp = new Statement(currentNode.state.configuration);
                temp.swap(nullPosition.x * 3 + nullPosition.y, arrayPosition);
                childrensLog.push({conf: temp.configuration});
                if (!check(temp) && (currentNode.depth + 1 != maxdepth)) {
                    hashMap.set(temp.hash(), 1);
                    memoryCount += 1;
                    childrens.push({
                        state: temp,
                        depth: currentNode.depth + 1,
                        parent_direction: d,
                        parent_node: currentNode,
                        evristic: evriFunc(temp.configuration) + currentNode.depth + 1,
                    });
                }
            }
        }
        });

        childrens.sort((a, b) => b.evristic - a.evristic);

        childrens.forEach(el => {
            nodeStack.push(el);
        })
        
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
            console.log("Решение найдено");
            return true;
        }
        return false;
    }
    //Функция автоматического DFS
    function autoDFS(non_place?: boolean) {
        let stopFlag = false;

        const start = performance.now();
        while (!stopFlag) {
            findWays(nonOwnPlace);
            stopFlag = nextStep() || nodeStack.isEmpty;
        };
        const algo_time = performance.now() - start;

        result_time.value = algo_time;

        if (nodeStack.isEmpty) console.log("Решение не найдено");
        view.value = currentNode.state
        stepCountForUser.value = stepCount;
        memoryUserCount.value = memoryCount;
        solution_depth.value = currentNode.depth;
    }


    let real_max_depth = 0;

    function IterativFindWays() : void {
        findWays(nonOwnPlace , limit + 1);
    }
    function IterativCheck() : boolean {
        if (nodeStack.isEmpty) {
            limit += 2;
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

    function IterativStep(flag? : boolean) : boolean {
        return nextStep();
    }

    function IterativStepForAuto() : boolean {
        findWays(nonOwnPlace, limit + 1);
        real_max_depth = Math.max(real_max_depth, currentNode.depth);
        if (nodeStack.isEmpty) {
            if (real_max_depth != limit) { 
                //algologger.buferrize("Решений нет\n");
                //status.value = Status.noSolution;
                console.log("Решений нет");
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

    function autoIterativ(non_place? : boolean) {
        const start = performance.now();
        
        let stopFlag = false;
        while (!stopFlag) {
            stopFlag = IterativStepForAuto();
        }
        const algo_time = performance.now() - start;

        stepCountForUser.value = stepCount;
        memoryUserCount.value = memoryCount;
        result_time.value = algo_time;
        solution_depth.value = currentNode.depth;
        view.value = currentNode.state;
    }

    return {findWays, nonOwnPlace, nextStep, view, 
        stepCountForUser, memoryUserCount, autoDFS, 
        result_time, solution_depth, autoIterativ,
    IterativCheck, IterativFindWays, IterativStep};
})