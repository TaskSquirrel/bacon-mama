export interface Metadata {
    id: string;
    name: string;
    description?: string;
}

export interface Item {
    name: string;
    description?: string;
    image?: string;
}

/**
 * A `Step` is a transaction that takes a set of input items and creates
 * an output item from a verb.
 */
export interface Step {
    name: string;
    description?: string;
    dependencies: string[];
    creates: string;
    verb: string;
    sequence: number;
}

/**
 * A recipe contains metadata, a set of steps ordered, and an item bank.
 */
export interface Recipe {
    id: string;
    name: string;
    description?: string;
    steps: Step[];
    items: Item[];
}
