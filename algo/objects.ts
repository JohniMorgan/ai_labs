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
        const back = this.instance[this.instance.length - 1];
        this.instance.splice(this.instance.length - 1, 1);
        return back;
    };
    get() : SolutionNode {
        return this.instance[this.instance.length - 1];
    }
    isEmpty() : boolean {
        return this.instance.length == 0;
    };
    reset() {
        this.instance = [];
    };
}

class NodeStackA {
    private inst: Array<EvriSolutionNode>

    constructor() {
        this.inst = new Array<EvriSolutionNode>;
    }

    push(node: EvriSolutionNode) {
        this.inst.push(node);
    };
    pop() : EvriSolutionNode {
        const back = this.inst[this.inst.length - 1];
        this.inst.splice(this.inst.length - 1, 1);
        return back;
    };
    reset() {
        this.inst = [];
    };
    show = () : EvriSolutionNode => this.inst[this.inst.length - 1];
    get isEmpty() : boolean {
        return this.inst.length == 0;
    }
    get size() : number { return this.inst.length; }
}

enum Direction { START = "Start", UP = 'Вверх', RIGHT = 'Вправо', DOWN = 'Вниз',
  LEFT = 'Влево' }

interface SolutionNode {
    state: Statement;
    depth: number;
    parent_direction: Direction;
    parent_node: SolutionNode | null;
}

interface EvriSolutionNode extends SolutionNode {
    evristic: number;
}



export {Statement, NodeStack, Direction, NodeStackA}
export type { SolutionNode, EvriSolutionNode }