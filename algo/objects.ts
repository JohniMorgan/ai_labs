class Statement {
    configuration: Array<number>;

    constructor(configuration: Array<number>) {
        this.configuration = configuration.slice();
    }

    hash() {
        let sum : number = 0;
        this.configuration.forEach((el: number) => {
            sum = sum * 10 + el;
        })
        return sum;
    }
    swap(firstIndex: number, secondIndex: number) {
        const value = this.configuration[firstIndex];
        this.configuration[firstIndex] = this.configuration[secondIndex];
        this.configuration[secondIndex] = value;
    }
}

class NodeStack {
    private instance: Array<SolutionNode>;

    constructor() {
        this.instance = new Array<SolutionNode>;
    };

    push(state: SolutionNode) {
        this.instance.push(state);
    };
    getInst() {
        return this.instance;
    }
    pop() : SolutionNode {
        const back = this.instance[this.instance.length-1];
        this.instance.splice(this.instance.length-1, 1);
        return back;
    };
    isEmpty() : boolean {
        return this.instance.length == 0;
    }
}

enum Direction { START, UP, DOWN, RIGHT, LEFT }

interface SolutionNode {
    state: Statement;
    depth: number;
    parent_direction: Direction;
    parent_node: SolutionNode | null;
}



export {Statement, NodeStack, Direction}
export type { SolutionNode }