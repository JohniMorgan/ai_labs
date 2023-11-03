import { defineStore } from "pinia";
import { Statement, NodeStack, Direction } from "@/algo/objects";
import type { SolutionNode } from "@/algo/objects";
import { Logger } from "~/utils/logger";


interface Point {
    x: number;
    y: number;
}

const algologger = new Logger('logs.txt');

export const useStateStore = defineStore('state', () => {
    const start_configuration = [0, 4, 3, 6, 2, 1, 7, 5, 8];
    const logsReady = ref(false);
    
    algologger.openStream();
    const start_node = {
        state: new Statement(start_configuration),
        depth: 0,
        parent_direction : Direction.START,
        parent_node: null
    } as SolutionNode;
    const limit = ref(1);
    const depthForUser = ref(0);
    let currentNode = start_node;
    const view = ref(new Statement(start_node.state.configuration));
    const solution = new Statement([1, 2, 3, 4, 0, 5,6, 7, 8]);
    const hashMap = new Map();
    const stepCountForUser = ref(0);
    let realStepCount = 0;
    hashMap.set(start_node.state.hash(), 1);


    const nodeQueue = new NodeStack();

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

    function findWays(maxdepth? : number) {
        algologger.buferrize(`Текущая итерация алгоритма: ${realStepCount}\n`);
        //logContent += confToString(currentNode.state.configuration);
        algologger.buferrize(`[${currentNode.state.configuration}]`);
        const zeroPos = findPosition(0);
        algologger.buferrize(' Потомки: ');
        // Попытка вправо
        if (zeroPos.y < 2) {
            let rSt = new Statement(currentNode.state.configuration);
            rSt.swap(zeroPos.x * 3 + zeroPos.y + 1,
                zeroPos.x * 3 + zeroPos.y);
            algologger.buferrize(`[${rSt.configuration}] `);
            if (hashMap.has(rSt.hash())) algologger.buferrize('{ПОСЕЩЕНО} ');
            if (!hashMap.has(rSt.hash()) && currentNode.depth + 1 != maxdepth)  {
                hashMap.set(rSt.hash(), 10);
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
                algologger.buferrize(`[${downSt.configuration}] `);
            if (hashMap.has(downSt.hash())) algologger.buferrize('{ПОСЕЩЕНО} ');
            if (!hashMap.has(downSt.hash()) && currentNode.depth + 1 != maxdepth)  {
                hashMap.set(downSt.hash(), 1);
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
            if (hashMap.has(lSt.hash())) algologger.buferrize('{ПОСЕЩЕНО} ');
            if (!hashMap.has(lSt.hash()) && currentNode.depth + 1 != maxdepth)  {
                hashMap.set(lSt.hash(), 1);
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
            algologger.buferrize('[' + upSt.configuration + '] ');
            if (hashMap.has(upSt.hash())) algologger.buferrize('{ПОСЕЩЕНО} ');
            if (!hashMap.has(upSt.hash()) && currentNode.depth + 1 != maxdepth)  {
                hashMap.set(upSt.hash(), 1);
                nodeQueue.push({
                    state: upSt,
                    depth: currentNode.depth + 1,
                    parent_direction: Direction.UP,
                    parent_node: currentNode,
                });
            }
        }
        algologger.buferrize('\n');
    }
    function nextStep() : boolean {
        realStepCount += 1;
        let step : SolutionNode = nodeQueue.pop();
        currentNode = step;
        view.value = step.state;
        if (currentNode.state.hash() == solution.hash()) {
            algologger.buferrize('Решение найдено! ');
            return true;
        }
        return false;
    }

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
            algologger.buferrize('Решение найдено!!! ');
            algologger.buferrize(`\nЗатраченное время: ${algo_time} мс.\n`);
            //const path = pathRestoration(currentNode);
            //console.log(path);
            simulatePath(pathRestoration(currentNode));
        }
        else algologger.buferrize("Решения не существует ")
        algologger.dump().then(() => logsReady.value = true);
        stepCountForUser.value = realStepCount;
    }
    function autoIterativ() {
        const start = performance.now();
        let flag = false;
        while (!flag) {
            flag = IterativDFSStep();
        }
        const algo_time = performance.now() - start;
        algologger.buferrize('\nЗатраченное время: ' + algo_time + ' мс\n');
        simulatePath(pathRestoration(currentNode));        
    }

    function IterativDFSStep() : boolean {
        findWays(limit.value + 1);
        if (nodeQueue.isEmpty()) {
            limit.value += 2;
            currentNode = start_node;
            hashMap.clear();
            hashMap.set(start_node.state.hash(), 1);
            view.value = currentNode.state;
            return false;
        } else return nextStep();
    }

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

    async function simulatePath(path: Array<Statement>) {
        algologger.buferrize("Полученный путь до решения: ");
        let count = 1;
        console.log(path);
        view.value = path[0];
        let id = setTimeout(function oneStep() {
            view.value = path[count];
            count++;
            id = setTimeout(oneStep, 100)
            if (count == path.length) {
                clearTimeout(id);
            }
        }, 100);
    }

    return {checkFinal, findPosition, view, depthForUser, findWays, nextStep, autoDFS,
     autoIterativ, IterativDFSStep, stepCountForUser, pathRestoration, currentNode, logsReady};
})