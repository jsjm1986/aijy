// 记忆类型枚举
const MEMORY_TYPES = {
    KNOWLEDGE_GRAPH: 'knowledge_graph',
    NEURAL_WEIGHTS: 'neural_weights',
    EXPERIENCE_VECTORS: 'experience_vectors'
};

// 记忆包类
class MemoryPackage {
    constructor(memory, description = '') {
        this.memory = memory;
        this.description = description;
        this.size = JSON.stringify(memory).length;
    }

    static import(data) {
        return new MemoryPackage(data);
    }

    export() {
        return JSON.stringify(this.memory, null, 2);
    }
}

// 将类和常量暴露到全局作用域
window.MEMORY_TYPES = MEMORY_TYPES;
window.MemoryPackage = MemoryPackage;

