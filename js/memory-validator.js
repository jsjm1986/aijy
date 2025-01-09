class MemoryValidator {
    static validateMemoryPackage(memoryData) {
        // 基本结构验证
        if (!memoryData || typeof memoryData !== 'object') {
            throw new Error('无效的记忆包格式');
        }

        // 验证必需字段
        const requiredFields = ['type', 'data', 'metadata'];
        for (const field of requiredFields) {
            if (!(field in memoryData)) {
                throw new Error(`记忆包缺少必需字段: ${field}`);
            }
        }

        // 验证类型
        if (!Object.values(MEMORY_TYPES).includes(memoryData.type)) {
            throw new Error('不支持的记忆类型');
        }

        // 验证元数据
        this.validateMetadata(memoryData.metadata);

        // 根据类型验证数据结构
        switch (memoryData.type) {
            case MEMORY_TYPES.KNOWLEDGE_GRAPH:
                this.validateKnowledgeGraph(memoryData.data);
                break;
            case MEMORY_TYPES.NEURAL_WEIGHTS:
                this.validateNeuralWeights(memoryData.data);
                break;
            case MEMORY_TYPES.EXPERIENCE_VECTORS:
                this.validateExperienceVectors(memoryData.data);
                break;
        }

        return true;
    }

    static validateMetadata(metadata) {
        const requiredMetadata = ['title', 'version', 'author', 'description'];
        for (const field of requiredMetadata) {
            if (!(field in metadata)) {
                throw new Error(`元数据缺少必需字段: ${field}`);
            }
            if (typeof metadata[field] !== 'string') {
                throw new Error(`元数据字段 ${field} 必须是字符串类型`);
            }
        }
    }

    static validateKnowledgeGraph(data) {
        if (!Array.isArray(data.nodes) || !Array.isArray(data.edges)) {
            throw new Error('知识图谱必须包含节点和边数组');
        }

        // 验证节点
        data.nodes.forEach((node, index) => {
            if (!node.id || !node.type || !node.label) {
                throw new Error(`节点 ${index} 缺少必需属性`);
            }
        });

        // 验证边
        data.edges.forEach((edge, index) => {
            if (!edge.source || !edge.target || !edge.type) {
                throw new Error(`边 ${index} 缺少必需属性`);
            }
        });
    }

    static validateNeuralWeights(data) {
        if (!data.layers || !Array.isArray(data.layers)) {
            throw new Error('神经网络必须包含层数组');
        }

        data.layers.forEach((layer, index) => {
            if (!layer.weights || !layer.biases) {
                throw new Error(`层 ${index} 缺少权重或偏置`);
            }
            if (!Array.isArray(layer.weights) || !Array.isArray(layer.biases)) {
                throw new Error(`层 ${index} 的权重和偏置必须是数组`);
            }
        });
    }

    static validateExperienceVectors(data) {
        if (!Array.isArray(data.experiences)) {
            throw new Error('经验向量必须包含经验数组');
        }

        data.experiences.forEach((exp, index) => {
            if (!exp.vector || !Array.isArray(exp.vector)) {
                throw new Error(`经验 ${index} 缺少向量数据`);
            }
            if (!exp.context || typeof exp.context !== 'object') {
                throw new Error(`经验 ${index} 缺少上下文信息`);
            }
        });
    }

    static getErrorMessage(error) {
        if (error instanceof Error) {
            return error.message;
        }
        return '未知错误';
    }
}

// 将类暴露到全局作用域
window.MemoryValidator = MemoryValidator; 