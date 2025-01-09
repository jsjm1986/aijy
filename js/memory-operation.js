class MemoryOperationManager {
    constructor() {
        this.currentMemory = null;
        this.similarityThreshold = 0.8;
        this.initializeUI();
        this.initializeEventListeners();
        this.initializeTooltips();
        this.initializeExampleButtons();
    }

    initializeUI() {
        // 获取DOM元素
        this.uploadArea = document.getElementById('uploadArea');
        this.memoryFile = document.getElementById('memoryFile');
        this.memoryInfo = document.getElementById('memoryInfo');
        this.operationButtons = {
            extract: document.getElementById('extractBtn'),
            merge: document.getElementById('mergeBtn'),
            validate: document.getElementById('validateBtn'),
            export: document.getElementById('exportBtn')
        };

        // 获取使用区域元素
        this.knowledgeQuery = document.getElementById('knowledgeQuery');
        this.neuralInput = document.getElementById('neuralInput');
        this.sceneDesc = document.getElementById('sceneDesc');
        this.emotionState = document.getElementById('emotionState');

        // 获取可视化区域元素
        this.visContent = document.getElementById('visContent');
        this.visTabs = document.querySelectorAll('.vis-tab');

        // 获取示例按钮
        this.exampleButtons = document.querySelectorAll('.example-btn');
    }

    initializeEventListeners() {
        // 文件上传相关事件
        this.uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.uploadArea.classList.add('dragover');
        });

        this.uploadArea.addEventListener('dragleave', () => {
            this.uploadArea.classList.remove('dragover');
        });

        this.uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            this.uploadArea.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            this.handleFileUpload(file);
        });

        this.memoryFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            this.handleFileUpload(file);
        });

        // 操作按钮事件
        this.operationButtons.extract.addEventListener('click', () => this.extractMemory());
        this.operationButtons.merge.addEventListener('click', () => this.mergeMemory());
        this.operationButtons.validate.addEventListener('click', () => this.validateMemory());
        this.operationButtons.export.addEventListener('click', () => this.exportMemory());

        // 使用区域事件
        document.querySelector('.query-btn')?.addEventListener('click', () => this.queryKnowledge());
        document.querySelector('.process-btn')?.addEventListener('click', () => this.processNeural());
        document.querySelector('.retrieve-btn')?.addEventListener('click', () => this.retrieveExperience());

        // 可视化标签切换事件
        this.visTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const type = tab.dataset.type;
                if (type) {
                    this.switchVisualization(type);
                }
            });
        });

        // 情感标签事件
        document.querySelectorAll('.emotion-tags .tag').forEach(tag => {
            tag.addEventListener('click', () => this.handleEmotionTagClick(tag));
        });

        // 相似度滑块事件
        const similaritySlider = document.getElementById('similaritySlider');
        const thresholdValue = document.querySelector('.threshold-value');
        if (similaritySlider && thresholdValue) {
            similaritySlider.addEventListener('input', (e) => {
                const value = e.target.value;
                thresholdValue.textContent = `${value}%`;
                this.similarityThreshold = value / 100;
            });
        }

        // 场景描述输入事件
        this.sceneDesc?.addEventListener('input', () => this.handleSceneInput());
    }

    initializeTooltips() {
        // 添加工具提示
        const tooltips = {
            'extractBtn': '从记忆包中提取原始记忆数据',
            'mergeBtn': '将两个相同类型的记忆融合',
            'validateBtn': '验证记忆数据的完整性',
            'exportBtn': '导出记忆包为文件'
        };

        Object.entries(tooltips).forEach(([id, text]) => {
            const element = document.getElementById(id);
            if (element) {
                element.title = text;
            }
        });
    }

    async handleFileUpload(file) {
        try {
            const content = await this.readFile(file);
            const memoryData = JSON.parse(content);
            this.loadMemory(memoryData);
        } catch (error) {
            this.showError('文件加载失败：' + error.message);
        }
    }

    readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(new Error('文件读取失败'));
            reader.readAsText(file);
        });
    }

    loadMemory(data) {
        console.log('开始加载记忆包:', data);
        try {
            // 使用验证器验证记忆包
            MemoryValidator.validateMemoryPackage(data);

            // 验证通过后加载记忆包
            this.currentMemory = {
                memory: data,
                size: JSON.stringify(data).length
            };

            console.log('记忆包加载成功:', this.currentMemory);
            
            this.updateUI();
            this.showSuccess('记忆包加载成功');
            
            // 自动显示对应类型的可视化
            switch (data.type) {
                case MEMORY_TYPES.KNOWLEDGE_GRAPH:
                    this.switchVisualization('graph');
                    break;
                case MEMORY_TYPES.NEURAL_WEIGHTS:
                    this.switchVisualization('network');
                    break;
                case MEMORY_TYPES.EXPERIENCE_VECTORS:
                    this.switchVisualization('vector');
                    break;
            }
        } catch (error) {
            console.error('记忆包加载失败:', error);
            this.showError('记忆包验证失败：' + MemoryValidator.getErrorMessage(error));
        }
    }

    updateUI() {
        // 更新记忆信息显示
        if (!this.currentMemory) return;

        this.memoryInfo.innerHTML = `
            <div class="memory-details">
                <h3>${this.currentMemory.memory.metadata.title}</h3>
                <p><strong>类型：</strong>${this.getMemoryTypeName(this.currentMemory.memory.type)}</p>
                <p><strong>版本：</strong>${this.currentMemory.memory.metadata.version}</p>
                <p><strong>作者：</strong>${this.currentMemory.memory.metadata.author}</p>
                <p><strong>描述：</strong>${this.currentMemory.memory.metadata.description}</p>
            </div>
        `;

        // 启用操作按钮
        Object.values(this.operationButtons).forEach(btn => btn.disabled = false);
    }

    getMemoryTypeName(type) {
        const types = {
            'knowledge_graph': '知识图谱',
            'neural_weights': '神经网络',
            'experience_vectors': '经验向量'
        };
        return types[type] || '未知类型';
    }

    // 记忆操作方法
    async extractMemory() {
        if (!this.currentMemory) return;
        try {
            const extractedData = await this.currentMemory.memory.decompress();
            this.showSuccess('记忆提取成功');
            this.updateVisualization(extractedData);
        } catch (error) {
            this.showError('记忆提取失败：' + error.message);
        }
    }

    async mergeMemory() {
        // 打开文件选择器选择要合并的记忆
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,.mem';
        input.onchange = async (e) => {
            try {
                const file = e.target.files[0];
                const content = await this.readFile(file);
                const memoryData = JSON.parse(content);
                const otherMemory = MemoryPackage.import(memoryData);
                
                const mergedMemory = this.currentMemory.memory.merge(otherMemory.memory);
                this.currentMemory = new MemoryPackage(mergedMemory, '合并后的记忆包');
                this.updateUI();
                this.showSuccess('记忆融合成功');
            } catch (error) {
                this.showError('记忆融合失败：' + error.message);
            }
        };
        input.click();
    }

    validateMemory() {
        if (!this.currentMemory) {
            this.showError('没有加载的记忆包可供验证');
            return;
        }

        try {
            MemoryValidator.validateMemoryPackage(this.currentMemory.memory);
            this.showSuccess('记忆包验证通过');
        } catch (error) {
            this.showError('记忆包验证失败：' + MemoryValidator.getErrorMessage(error));
        }
    }

    exportMemory() {
        if (!this.currentMemory) return;
        try {
            const exportData = this.currentMemory.export();
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `memory_${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
            this.showSuccess('记忆导出成功');
        } catch (error) {
            this.showError('记忆导出失败：' + error.message);
        }
    }

    // 记忆使用方法
    queryKnowledge() {
        if (!this.currentMemory || this.currentMemory.memory.type !== MEMORY_TYPES.KNOWLEDGE_GRAPH) {
            this.showError('请先加载知识图谱类型的记忆');
            return;
        }

        const queryType = this.knowledgeQuery.value;
        if (!queryType) {
            this.showError('请选择查询类型');
            return;
        }

        try {
            let result;
            const memory = this.currentMemory.memory.data;
            
            switch (queryType) {
                case 'concept':
                    result = this.queryConcepts(memory);
                    break;
                case 'relation':
                    result = this.queryRelations(memory);
                    break;
                case 'path':
                    result = this.queryLearningPath(memory);
                    break;
            }

            this.showQueryResult('.knowledge-usage .usage-result', result);
        } catch (error) {
            this.showError('查询失败：' + error.message);
        }
    }

    async processNeural() {
        if (!this.currentMemory || this.currentMemory.memory.type !== MEMORY_TYPES.NEURAL_WEIGHTS) {
            this.showError('请先加载神经网络类型的记忆');
            return;
        }

        const input = this.neuralInput.value;
        if (!input) {
            this.showError('请输入处理数据');
            return;
        }

        try {
            this.showProcessingStatus('处理中...', 'loading');
            
            // 解析输入数据
            const processedInput = await this.parseNeuralInput(input);
            
            // 处理数据
            const result = await this.processNeuralNetwork(processedInput);
            
            this.showProcessingStatus('处理成功', 'success');
            this.showQueryResult('.neural-usage .usage-result', result);
        } catch (error) {
            this.showProcessingStatus('处理失败: ' + error.message, 'error');
            this.showError('处理失败：' + error.message);
        }
    }

    async retrieveExperience() {
        if (!this.currentMemory || this.currentMemory.memory.type !== MEMORY_TYPES.EXPERIENCE_VECTORS) {
            this.showError('请先加载经验向量类型的记忆');
            return;
        }

        const scene = this.sceneDesc.value;
        const emotion = this.emotionState.value;
        if (!scene || !emotion) {
            this.showError('请输入场景描述和情感状态');
            return;
        }

        try {
            const result = await this.findSimilarExperiences(
                scene, 
                emotion, 
                this.similarityThreshold
            );
            
            // 对结果进行排序和过滤
            result.similarExperiences = result.similarExperiences
                .filter(exp => exp.similarity >= this.similarityThreshold)
                .sort((a, b) => b.similarity - a.similarity);

            this.showQueryResult('.experience-usage .usage-result', result);
        } catch (error) {
            this.showError('检索失败：' + error.message);
        }
    }

    // 辅助方法
    showSuccess(message) {
        const toast = document.createElement('div');
        toast.className = 'toast success';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(toast);
                }, 300);
            }, 3000);
        }, 100);
    }

    showError(message) {
        const toast = document.createElement('div');
        toast.className = 'toast error';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(toast);
                }, 300);
            }, 3000);
        }, 100);
    }

    showQueryResult(selector, result) {
        const resultElement = document.querySelector(selector);
        resultElement.innerHTML = `<pre>${JSON.stringify(result, null, 2)}</pre>`;
    }

    async switchVisualization(type) {
        // 更新标签状态
        this.visTabs.forEach(tab => {
            const isSelected = tab.dataset.type === type;
            tab.setAttribute('aria-selected', isSelected);
        });

        // 如果没有加载记忆，显示提示信息
        if (!this.currentMemory) {
            const visContent = document.getElementById('visSvgContainer');
            visContent.innerHTML = `
                <div class="vis-placeholder">
                    <h3>请先加载记忆数据</h3>
                    <p>上传记忆包文件以查看可视化效果</p>
                </div>
            `;
            return;
        }

        // 清除之前的可视化内容
        const visContent = document.getElementById('visSvgContainer');
        visContent.innerHTML = '';

        try {
            // 根据不同类型更新可视化
            switch (type) {
                case 'graph':
                    if (this.currentMemory.memory.type === MEMORY_TYPES.KNOWLEDGE_GRAPH) {
                        await visualizer.visualizeKnowledgeGraph(this.currentMemory.memory.data);
                    } else {
                        throw new Error('当前记忆包不是知识图谱类型');
                    }
                    break;
                case 'network':
                    if (this.currentMemory.memory.type === MEMORY_TYPES.NEURAL_WEIGHTS) {
                        await visualizer.visualizeNeuralNetwork(this.currentMemory.memory.data);
                    } else {
                        throw new Error('当前记忆包不是神经网络类型');
                    }
                    break;
                case 'vector':
                    if (this.currentMemory.memory.type === MEMORY_TYPES.EXPERIENCE_VECTORS) {
                        await visualizer.visualizeExperienceVectors(this.currentMemory.memory.data);
                    } else {
                        throw new Error('当前记忆包不是经验向量类型');
                    }
                    break;
                default:
                    throw new Error('不支持的可视化类型');
            }
        } catch (error) {
            console.error('可视化错误:', error);
            this.showError('可视化失败：' + error.message);
            
            // 显示错误提示
            visContent.innerHTML = `
                <div class="vis-placeholder">
                    <h3>可视化失败</h3>
                    <p>${error.message}</p>
                </div>
            `;
        }
    }

    // 具体的查询实现方法
    queryConcepts(memory) {
        return {
            type: '概念查询',
            concepts: memory.nodes.filter(node => node.type === 'concept')
        };
    }

    queryRelations(memory) {
        return {
            type: '关系推理',
            relations: memory.edges
        };
    }

    queryLearningPath(memory) {
        return {
            type: '学习路径',
            path: memory.context.learningPath
        };
    }

    processNeuralNetwork(input) {
        return {
            type: '神经网络处理',
            input: input,
            output: '模拟的输出结果'
        };
    }

    findSimilarExperiences(scene, emotion) {
        return {
            type: '经验检索',
            query: { scene, emotion },
            similarExperiences: [
                {
                    similarity: 0.85,
                    context: this.currentMemory.memory.data.context
                }
            ]
        };
    }

    // 处理情感标签点击
    handleEmotionTagClick(tag) {
        const emotion = tag.dataset.emotion;
        const emotionInput = document.getElementById('emotionState');
        
        tag.classList.toggle('active');
        
        const activeTags = document.querySelectorAll('.emotion-tags .tag.active');
        const emotions = Array.from(activeTags).map(t => t.textContent);
        emotionInput.value = emotions.join(', ');
    }

    // 处理场景输入
    handleSceneInput() {
        const input = this.sceneDesc.value.trim();
        if (input.length < 2) {
            this.hideSuggestions();
            return;
        }

        // 模拟场景建议
        const suggestions = this.getSceneSuggestions(input);
        this.showSuggestions(suggestions);
    }

    // 获取场景建议
    getSceneSuggestions(input) {
        // 这里可以实现实际的场景匹配逻辑
        const commonScenes = [
            '在图书馆学习',
            '参加音乐会',
            '在海边散步',
            '在咖啡厅工作',
            '在公园运动'
        ];

        return commonScenes.filter(scene => 
            scene.toLowerCase().includes(input.toLowerCase())
        );
    }

    // 显示场景建议
    showSuggestions(suggestions) {
        const suggestionsDiv = document.querySelector('.scene-suggestions');
        if (!suggestions.length) {
            this.hideSuggestions();
            return;
        }

        suggestionsDiv.innerHTML = suggestions.map(scene => `
            <div class="suggestion-item" onclick="manager.selectScene('${scene}')">${scene}</div>
        `).join('');
        
        suggestionsDiv.classList.add('active');
    }

    // 隐藏场景建议
    hideSuggestions() {
        const suggestionsDiv = document.querySelector('.scene-suggestions');
        suggestionsDiv.classList.remove('active');
    }

    // 选择场景
    selectScene(scene) {
        this.sceneDesc.value = scene;
        this.hideSuggestions();
    }

    // 解析神经网络输入
    async parseNeuralInput(input) {
        // 判断输入类型
        if (input.startsWith('[') && input.endsWith(']')) {
            // JSON数组格式
            return JSON.parse(input);
        } else if (input.startsWith('http')) {
            // 图像URL
            return await this.processImageUrl(input);
        } else {
            // 文本描述
            return await this.textToVector(input);
        }
    }

    // 处理图像URL
    async processImageUrl(url) {
        // 模拟图像处理
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(new Float32Array(1000).fill(0.5));
            }, 1000);
        });
    }

    // 文本转向量
    async textToVector(text) {
        // 模拟文本编码
        return new Promise((resolve) => {
            setTimeout(() => {
                const vector = new Float32Array(1000);
                for (let i = 0; i < vector.length; i++) {
                    vector[i] = Math.random();
                }
                resolve(vector);
            }, 500);
        });
    }

    // 显示处理状态
    showProcessingStatus(message, type) {
        const statusDiv = document.querySelector('.processing-status');
        statusDiv.textContent = message;
        statusDiv.className = 'processing-status ' + type;
    }

    async downloadExampleMemory(type) {
        console.log('开始下载示例记忆包:', type);
        try {
            // 获取示例数据
            const example = MEMORY_EXAMPLES[type];
            if (!example) {
                throw new Error('未找到指定类型的记忆包示例');
            }

            console.log('获取到示例数据:', example);

            // 加载记忆包
            this.loadMemory(example);
            
            // 创建并下载文件
            const blob = new Blob([JSON.stringify(example, null, 2)], {
                type: 'application/json'
            });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${type}_memory_package.json`;
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            this.showSuccess(`${type} 记忆包已下载并加载`);
        } catch (error) {
            console.error('记忆包下载失败:', error);
            this.showError('记忆包下载失败：' + error.message);
        }
    }

    // 初始化示例记忆包按钮
    initializeExampleButtons() {
        const exampleButtons = document.querySelectorAll('.example-btn');
        exampleButtons.forEach(button => {
            button.addEventListener('click', () => {
                const type = button.dataset.type;
                console.log('示例按钮被点击:', type);
                if (type) {
                    this.downloadExampleMemory(type);
                }
            });
        });
    }
}

// 初始化操作管理器并暴露到全局作用域
window.manager = new MemoryOperationManager();

// 确保在DOM加载完成后再初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM加载完成，初始化操作管理器');
}); 