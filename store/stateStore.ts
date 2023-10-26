import { defineStore } from "pinia";
import { Statement, NodeStack, Direction } from "@/algo/objects";
import type { SolutionNode } from "@/algo/objects";

interface Point {
    x: number;
    y: number;
}

export const useStateStore = defineStore('state', () => {
    const start_configuration = [0, 4, 3, 6, 2, 1, 7, 5, 8];

    const start_node = {
        state: new Statement(start_configuration),
        depth: 0,
        parent_direction : null,
        parent_node: null
    } as SolutionNode;
    const limit = ref(1);
    const currentNode = ref(start_node);
    const view = ref(start_node.state);
    const solution = new Statement([1, 2, 3, 4, 0, 5,6, 7, 8]);
    const hashMap = ref(new Map());
    const stepCount = ref(0);
    hashMap.value.set(start_node.state.hash(), 1);


    const nodeQueue = new NodeStack;

    function findPosition(number: number) : Point {
        let ans = view.value.configuration.indexOf(number);
        if (ans !== -1) return {
            x: Math.floor(ans / 3),
            y: ans % 3,
        };
        else return {x: -1, y: -1};
    }

    function checkFinal() {
        let targetFlag = hashMap.value.get(currentNode.value.state.hash());
        if (!targetFlag) {
            hashMap.value.set(currentNode.value.state.hash(), 1);
            return false;
        }
        return true;
    }

    function findWays(maxdepth? : number) {
        const zeroPos = findPosition(0);
        // Попытка вправо
        if (zeroPos.y < 2) {
            let rSt = new Statement(currentNode.value.state.configuration);
            rSt.swap(zeroPos.x * 3 + zeroPos.y + 1,
                zeroPos.x * 3 + zeroPos.y);
            if (!hashMap.value.has(rSt.hash()) && currentNode.value.depth + 1 != maxdepth)  {
                hashMap.value.set(rSt.hash(), 1);
                nodeQueue.push({
                    state: rSt,
                    depth: currentNode.value.depth + 1,
                    parent_direction: Direction.RIGHT,
                    parent_node: currentNode.value,
                });
            }
        }
        // Аналогично вниз
        if (zeroPos.x < 2) {
            let downSt = new Statement(currentNode.value.state.configuration);
            downSt.swap(zeroPos.x * 3 + zeroPos.y,
                (zeroPos.x + 1) * 3 + zeroPos.y);

            if (!hashMap.value.has(downSt.hash()) && currentNode.value.depth + 1 != maxdepth)  {

                hashMap.value.set(downSt.hash(), 1);
                nodeQueue.push({
                    state: downSt,
                    depth: currentNode.value.depth + 1,
                    parent_direction: Direction.DOWN,
                    parent_node: currentNode.value,
                });
            }
        }
        
        // Аналогично влево
        if (zeroPos.y > 0) {
            let lSt = new Statement(currentNode.value.state.configuration);
            lSt.swap(zeroPos.x  * 3 + zeroPos.y - 1,
                zeroPos.x * 3 + zeroPos.y);
            if (!hashMap.value.has(lSt.hash()) && currentNode.value.depth + 1 != maxdepth)  {
                hashMap.value.set(lSt.hash(), 1);
                nodeQueue.push({
                    state: lSt,
                    depth: currentNode.value.depth + 1,
                    parent_direction: Direction.LEFT,
                    parent_node: currentNode.value,
                });
            }
        }
        // Аналогично вверх
        if (zeroPos.x > 0) {
            let upSt = new Statement(currentNode.value.state.configuration);
            upSt.swap(zeroPos.x * 3 + zeroPos.y,
                (zeroPos.x - 1) * 3 + zeroPos.y); 
            if (!hashMap.value.has(upSt.hash()) && currentNode.value.depth + 1 != maxdepth)  {
                hashMap.value.set(upSt.hash(), 1);
                nodeQueue.push({
                    state: upSt,
                    depth: currentNode.value.depth + 1,
                    parent_direction: Direction.UP,
                    parent_node: currentNode.value,
                });
            }
        }
    }
    function nextStep() : boolean {
        stepCount.value += 1;
        let step : SolutionNode = nodeQueue.pop();
        currentNode.value = step;
        view.value = step.state;
        if (currentNode.value.state.hash() == solution.hash()) {
            console.log("Решение найдено!");
            return true;
        }
        return false;
    }

    function autoDFS() {
        let flag = false;
        while (!flag) {
            findWays();
            flag = nextStep();
            if (nodeQueue.isEmpty()) flag = true;
            console.log(stepCount.value);
        }
        if (!nodeQueue.isEmpty()) console.log("Решение найдено!");
            //simulatePath(pathRestoration(currentNode.value));
        else console.log("Решение не найдено");
    }
    function autoIterativ() {
        let flag = false;
        while (!flag) {
            flag = IterativDFSStep();
        }
        simulatePath(pathRestoration(currentNode.value));
        
    }

    function IterativDFSStep() : boolean {
        findWays(limit.value + 1);
        if (nodeQueue.isEmpty()) {
            limit.value += 2;
            currentNode.value = start_node;
            hashMap.value.clear();
            hashMap.value.set(start_node.state.hash(), 1);
            view.value = currentNode.value.state;
            return false;
        } else return nextStep();
    }

    function pathRestoration(final : SolutionNode) {
        console.log("Поиск пути");
        let path = new Array<{
            state: Statement,
            moveTo: Direction | null,
        }>;
        let temp = final;
        while (temp.parent_node != null) {
            path.push({
                state: temp.state,
                moveTo: temp.parent_direction,
            });
            temp = temp.parent_node;
        }
        return path.toReversed();
    }

    function simulatePath(path: Array<{state: Statement, moveTo: Direction | null}>) {
        useFetch('/api/logs', {
            method: 'post',
            body: {
                content: 'Начата симуляция пути'
            }
        });
        let count = 0;
        let id = setInterval(() => {
            view.value = path[count].state;
            count++;
            if (count == path.length) clearInterval(id);
        }, 250);
    }

    return {checkFinal, findPosition, view, hashMap, findWays, nextStep, autoDFS, autoIterativ, IterativDFSStep, stepCount, pathRestoration, currentNode};
})