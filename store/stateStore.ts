import { defineStore } from "pinia";
import { Statement, NodeStack, Direction } from "@/algo/objects";
import type { SolutionNode } from "@/algo/objects";
import { RefSymbol } from "@vue/reactivity";

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
    const view = ref(start_node.state);
    const solution = new Statement([1, 2, 3, 4, 0, 5,6, 7, 8]);
    const hashMap = ref(new Map());
    const stepCount = ref(0);
    hashMap.value.set(start_node.state.hash(), 1);
    const currentDepth = ref(0);

    const nodeQueue = new NodeStack;

    function findPosition(number: number) : Point {
        let ans = start_node.value.state.configuration.indexOf(number);
        if (ans !== -1) return {
            x: Math.floor(ans / 3),
            y: ans % 3,
        };
        else return {x: -1, y: -1};
    }

    function checkFinal() {
        let targetFlag = hashMap.value.get(start_node.value.state.hash());
        if (!targetFlag) {
            hashMap.value.set(start_node.value.state.hash(), 1);
            return false;
        }
        return true;
    }

    function findWays(maxdepth? : number) {
        const zeroPos = findPosition(0);
        // Попытка вправо
        if (zeroPos.y < 2) {
            let rSt = new Statement(start_node.value.state.configuration);
            rSt.swap(zeroPos.x * 3 + zeroPos.y + 1,
                zeroPos.x * 3 + zeroPos.y);
            if (!hashMap.value.has(rSt.hash()) && currentDepth.value + 1 != maxdepth)  {
                hashMap.value.set(rSt.hash(), 1);
                nodeQueue.push({
                    state: rSt,
                    depth: currentDepth.value + 1,
                    parent_direction: Direction.RIGHT,
                    parent_node: start_node.value,
                });
            }
        }
        // Аналогично вниз
        if (zeroPos.x < 2) {
            let downSt = new Statement(start_node.value.state.configuration);
            downSt.swap(zeroPos.x * 3 + zeroPos.y,
                (zeroPos.x + 1) * 3 + zeroPos.y);

            if (!hashMap.value.has(downSt.hash()) && currentDepth.value + 1 != maxdepth)  {

                hashMap.value.set(downSt.hash(), 1);
                nodeQueue.push({
                    state: downSt,
                    depth: currentDepth.value + 1,
                    parent_direction: Direction.DOWN,
                    parent_node: start_node.value,
                });
            }
        }
        
        // Аналогично влево
        if (zeroPos.y > 0) {
            let lSt = new Statement(start_node.value.state.configuration);
            lSt.swap(zeroPos.x  * 3 + zeroPos.y - 1,
                zeroPos.x * 3 + zeroPos.y);
            if (!hashMap.value.has(lSt.hash()) && currentDepth.value + 1 != maxdepth)  {
                hashMap.value.set(lSt.hash(), 1);
                nodeQueue.push({
                    state: lSt,
                    depth: currentDepth.value + 1,
                    parent_direction: Direction.LEFT,
                    parent_node: start_node.value,
                });
            }
        }
        // Аналогично вверх
        if (zeroPos.x > 0) {
            let upSt = new Statement(start_node.value.state.configuration);
            upSt.swap(zeroPos.x * 3 + zeroPos.y,
                (zeroPos.x - 1) * 3 + zeroPos.y); 
            
            if (!hashMap.value.has(upSt.hash()) && currentDepth.value + 1 != maxdepth)  {
                hashMap.value.set(upSt.hash(), 1);
                nodeQueue.push({
                    state: upSt,
                    depth: currentDepth.value + 1,
                    parent_direction: Direction.UP,
                    parent_node: start_node.value,
                });
            }
        }
    }
    function nextStep() : boolean {
        stepCount.value += 1;
        let step : SolutionNode = nodeQueue.pop();
        start_node.value = step;
        view.value = start_node.value.state;    
        currentDepth.value = step.depth;
        if (start_node.value.state.hash() == solution.hash()) return true;
        return false;
    }

    function autoDFS() {
        let flag = false;
        while (!flag && !nodeQueue.isEmpty()) {
            findWays();
            flag = nextStep();
        }
        simulatePath(pathRestoration(start_node.value));
    }

    function autoIterativ() {
        let limit : number = 1;

        let flag = false;
        while (!flag) {
            findWays(limit + 1);
            if (nodeQueue.isEmpty()) {
                limit++;
                start_node.value = 
            }
        }
    }

    function pathRestoration(final : SolutionNode) {
        let path = new Array<Statement>;
        console.log("Зашли в востановление пути");
        console.log(final);
        while (final.parent_node != null) {
            path.push(final.state);
            final = final.parent_node;
        }
        return path.toReversed();
    }

    function simulatePath(path: Array<Statement>) {
        let count = 0;
        let id = setInterval(() => {
            view.value = path[count];
            count++;
            if (count == path.length) clearInterval(id);
        }, 250);
    }

    return {checkFinal, findPosition, view, hashMap, findWays, nextStep, autoDFS, stepCount};
})