// 示例记忆数据包
const MEMORY_EXAMPLES = {
    // 知识图谱记忆包示例 - 数学知识
    mathKnowledge: {
        type: MEMORY_TYPES.KNOWLEDGE_GRAPH,
        metadata: {
            title: '高等数学基础知识',
            version: '1.0.0',
            author: 'AI教育专家',
            description: '包含微积分、线性代数等基础数学概念及其关系'
        },
        data: {
            nodes: [
                {
                    id: 1,
                    type: 'concept',
                    label: '微积分',
                    name: '微积分',
                    attributes: {
                        difficulty: 'advanced',
                        importance: 'high',
                        description: '研究函数、极限、连续、导数和积分的数学分支'
                    }
                },
                {
                    id: 2,
                    type: 'concept',
                    label: '导数',
                    name: '导数',
                    attributes: {
                        difficulty: 'medium',
                        importance: 'high',
                        description: '函数在某一点的瞬时变化率'
                    }
                },
                {
                    id: 3,
                    type: 'theorem',
                    label: '导数四则运算',
                    name: '导数四则运算',
                    attributes: {
                        difficulty: 'medium',
                        applications: ['函数求导', '最值问题']
                    }
                },
                {
                    id: 4,
                    type: 'concept',
                    label: '积分',
                    name: '积分',
                    attributes: {
                        difficulty: 'advanced',
                        importance: 'high',
                        description: '导数的逆运算，用于计算曲线下的面积'
                    }
                }
            ],
            edges: [
                {
                    source: 1,
                    target: 2,
                    type: 'contains',
                    relationship: 'contains',
                    weight: 0.9,
                    attributes: {
                        description: '微积分包含导数的概念'
                    }
                },
                {
                    source: 2,
                    target: 3,
                    type: 'applies',
                    relationship: 'applies',
                    weight: 0.8,
                    attributes: {
                        description: '导数的基本运算法则'
                    }
                },
                {
                    source: 1,
                    target: 4,
                    type: 'contains',
                    relationship: 'contains',
                    weight: 0.9,
                    attributes: {
                        description: '微积分包含积分的概念'
                    }
                }
            ],
            context: {
                domain: 'mathematics',
                prerequisites: ['基础代数', '几何'],
                learningPath: ['极限', '导数', '积分', '微分方程']
            }
        }
    },

    // 神经网络记忆包示例 - 钢琴演奏技能
    pianoSkill: {
        type: MEMORY_TYPES.NEURAL_WEIGHTS,
        metadata: {
            title: '钢琴演奏基础技能',
            version: '1.0.0',
            author: 'AI音乐家',
            description: '包含基础钢琴演奏技巧的神经网络模型'
        },
        data: {
            layers: [
                {
                    name: 'input',
                    units: 1000,
                    activation: 'relu',
                    weights: Array(1000 * 512).fill(0.1),
                    biases: Array(512).fill(0)
                },
                {
                    name: 'hidden1',
                    units: 512,
                    activation: 'relu',
                    weights: Array(512 * 256).fill(0.1),
                    biases: Array(256).fill(0)
                },
                {
                    name: 'output',
                    units: 88,
                    activation: 'sigmoid',
                    weights: Array(256 * 88).fill(0.1),
                    biases: Array(88).fill(0)
                }
            ],
            metadata: {
                architecture: {
                    type: 'feedforward',
                    inputShape: [1000],
                    outputShape: [88]
                },
                trainingData: '古典钢琴曲目演奏数据',
                performanceMetrics: {
                    accuracy: 0.92,
                    precision: 0.89,
                    recall: 0.90
                }
            }
        }
    },

    // 经验向量记忆包示例 - 旅行经历
    travelExperience: {
        type: MEMORY_TYPES.EXPERIENCE_VECTORS,
        metadata: {
            title: '巴黎旅行经历',
            version: '1.0.0',
            author: 'AI旅行家',
            description: '包含在巴黎旅行期间的多维度体验记忆'
        },
        data: {
            experiences: [
                {
                    id: 1,
                    vector: Array(1024).fill(0.5),  // 埃菲尔铁塔体验
                    timestamp: '2024-01-01T10:00:00Z',
                    context: {
                        location: '埃菲尔铁塔',
                        weather: '晴朗',
                        temperature: 22,
                        crowdLevel: 'high',
                        emotions: {
                            joy: 0.9,
                            amazement: 0.8,
                            excitement: 0.85
                        }
                    }
                },
                {
                    id: 2,
                    vector: Array(1024).fill(0.3),  // 卢浮宫体验
                    timestamp: '2024-01-02T14:00:00Z',
                    context: {
                        location: '卢浮宫',
                        weather: '多云',
                        temperature: 20,
                        crowdLevel: 'medium',
                        emotions: {
                            appreciation: 0.95,
                            curiosity: 0.9,
                            peace: 0.7
                        }
                    }
                },
                {
                    id: 3,
                    vector: Array(1024).fill(0.4),  // 塞纳河游船体验
                    timestamp: '2024-01-03T19:00:00Z',
                    context: {
                        location: '塞纳河',
                        weather: '晴朗',
                        temperature: 18,
                        crowdLevel: 'low',
                        emotions: {
                            relaxation: 0.9,
                            joy: 0.8,
                            romance: 0.85
                        }
                    }
                }
            ]
        }
    }
};

// 辅助函数：创建记忆包文件
function createMemoryPackage(type) {
    const example = MEMORY_EXAMPLES[type];
    if (!example) {
        throw new Error('未找到指定类型的记忆包示例');
    }

    // 创建Blob对象
    const blob = new Blob([JSON.stringify(example, null, 2)], {
        type: 'application/json'
    });

    // 创建下载链接
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${type}_memory_package.json`;
    
    // 触发下载
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// 将变量和函数暴露到全局作用域
window.MEMORY_EXAMPLES = MEMORY_EXAMPLES;
window.createMemoryPackage = createMemoryPackage; 