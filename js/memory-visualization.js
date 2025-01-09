class MemoryVisualizer {
    constructor(container) {
        this.container = container;
        this.svg = null;
        this.simulation = null;
        this.zoom = null;
        this.width = container.clientWidth;
        this.height = container.clientHeight;
        this.showLabels = true;
        this.showWeights = true;
        this.initializeControls();
    }

    initializeControls() {
        // 缩放控制
        document.getElementById('zoomIn').addEventListener('click', () => this.handleZoom(1.2));
        document.getElementById('zoomOut').addEventListener('click', () => this.handleZoom(0.8));
        document.getElementById('zoomReset').addEventListener('click', () => this.resetZoom());

        // 显示选项控制
        document.getElementById('showLabels').addEventListener('change', (e) => {
            this.showLabels = e.target.checked;
            this.updateLabels();
        });

        document.getElementById('showWeights').addEventListener('change', (e) => {
            this.showWeights = e.target.checked;
            this.updateWeights();
        });
    }

    // 知识图谱可视化
    visualizeKnowledgeGraph(data) {
        this.clearVisualization();
        
        // 创建SVG
        this.svg = d3.select('#visSvgContainer')
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height);

        // 添加缩放功能
        this.zoom = d3.zoom()
            .scaleExtent([0.1, 4])
            .on('zoom', (event) => {
                this.svg.selectAll('g').attr('transform', event.transform);
            });

        this.svg.call(this.zoom);

        // 创建力导向图
        this.simulation = d3.forceSimulation(data.nodes)
            .force('link', d3.forceLink(data.edges).id(d => d.id))
            .force('charge', d3.forceManyBody().strength(-100))
            .force('center', d3.forceCenter(this.width / 2, this.height / 2));

        // 绘制连接线
        const links = this.svg.append('g')
            .selectAll('line')
            .data(data.edges)
            .enter()
            .append('line')
            .attr('stroke', '#999')
            .attr('stroke-opacity', 0.6)
            .attr('stroke-width', d => d.weight ? d.weight * 2 : 1);

        // 绘制节点
        const nodes = this.svg.append('g')
            .selectAll('circle')
            .data(data.nodes)
            .enter()
            .append('circle')
            .attr('r', 5)
            .attr('fill', d => this.getNodeColor(d.type))
            .call(d3.drag()
                .on('start', this.dragstarted.bind(this))
                .on('drag', this.dragged.bind(this))
                .on('end', this.dragended.bind(this)));

        // 添加标签
        const labels = this.svg.append('g')
            .selectAll('text')
            .data(data.nodes)
            .enter()
            .append('text')
            .text(d => d.name)
            .attr('font-size', 12)
            .attr('dx', 8)
            .attr('dy', 3)
            .style('visibility', this.showLabels ? 'visible' : 'hidden');

        // 更新力导向图
        this.simulation.on('tick', () => {
            links
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            nodes
                .attr('cx', d => d.x)
                .attr('cy', d => d.y);

            labels
                .attr('x', d => d.x)
                .attr('y', d => d.y);
        });

        // 添加图例
        this.createLegend(['concept', 'theorem'], this.getNodeColor);
    }

    // 神经网络可视化
    visualizeNeuralNetwork(data) {
        this.clearVisualization();

        const svg = d3.select('#visSvgContainer')
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height);

        const layers = data.layers;
        const layerSpacing = this.width / (layers.length + 1);
        const maxNeurons = Math.max(...layers.map(l => l.neurons));
        const neuronSpacing = this.height / (maxNeurons + 1);

        // 绘制神经元
        layers.forEach((layer, layerIndex) => {
            const x = layerSpacing * (layerIndex + 1);
            const neurons = Array(layer.neurons).fill(0);

            neurons.forEach((_, neuronIndex) => {
                const y = (neuronSpacing * (neuronIndex + 1)) * 
                    (maxNeurons / layer.neurons);

                // 绘制神经元
                svg.append('circle')
                    .attr('cx', x)
                    .attr('cy', y)
                    .attr('r', 5)
                    .attr('fill', this.getLayerColor(layer.name));

                // 绘制连接
                if (layerIndex < layers.length - 1) {
                    const nextLayer = layers[layerIndex + 1];
                    const nextX = layerSpacing * (layerIndex + 2);
                    const nextNeurons = Array(nextLayer.neurons).fill(0);

                    nextNeurons.forEach((_, nextNeuronIndex) => {
                        const nextY = (neuronSpacing * (nextNeuronIndex + 1)) *
                            (maxNeurons / nextLayer.neurons);

                        svg.append('line')
                            .attr('x1', x)
                            .attr('y1', y)
                            .attr('x2', nextX)
                            .attr('y2', nextY)
                            .attr('stroke', '#999')
                            .attr('stroke-opacity', 0.2);
                    });
                }
            });

            // 添加层名称标签
            if (this.showLabels) {
                svg.append('text')
                    .attr('x', x)
                    .attr('y', this.height - 10)
                    .attr('text-anchor', 'middle')
                    .text(layer.name);
            }
        });
    }

    // 经验向量可视化
    visualizeExperienceVectors(data) {
        this.clearVisualization();

        const svg = d3.select('#visSvgContainer')
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height);

        // 使用t-SNE或UMAP将高维向量降维到2D
        // 这里使用模拟的2D坐标
        const points = data.vectors.map((_, i) => ({
            x: Math.random() * this.width,
            y: Math.random() * this.height,
            emotion: data.emotions[i],
            timestamp: data.timestamps[i]
        }));

        // 绘制散点图
        const dots = svg.selectAll('circle')
            .data(points)
            .enter()
            .append('circle')
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('r', 8)
            .attr('fill', d => this.getEmotionColor(d.emotion))
            .attr('opacity', 0.7);

        // 添加标签
        if (this.showLabels) {
            svg.selectAll('text')
                .data(points)
                .enter()
                .append('text')
                .attr('x', d => d.x + 10)
                .attr('y', d => d.y)
                .text(d => new Date(d.timestamp).toLocaleDateString())
                .attr('font-size', 10);
        }

        // 添加情感图例
        this.createEmotionLegend(data.emotions);
    }

    // 辅助方法
    clearVisualization() {
        d3.select('#visSvgContainer').selectAll('*').remove();
        d3.select('.vis-legend').selectAll('*').remove();
    }

    handleZoom(scale) {
        if (this.zoom && this.svg) {
            const transform = d3.zoomTransform(this.svg.node());
            this.svg.transition()
                .duration(300)
                .call(this.zoom.transform, transform.scale(scale));
        }
    }

    resetZoom() {
        if (this.zoom && this.svg) {
            this.svg.transition()
                .duration(300)
                .call(this.zoom.transform, d3.zoomIdentity);
        }
    }

    updateLabels() {
        this.svg.selectAll('text')
            .style('visibility', this.showLabels ? 'visible' : 'hidden');
    }

    updateWeights() {
        this.svg.selectAll('line')
            .style('opacity', this.showWeights ? 0.6 : 0.1);
    }

    getNodeColor(type) {
        const colors = {
            concept: '#4a90e2',
            theorem: '#f5a623',
            default: '#7ed321'
        };
        return colors[type] || colors.default;
    }

    getLayerColor(name) {
        const colors = {
            input: '#4a90e2',
            hidden: '#f5a623',
            output: '#7ed321',
            default: '#b8e986'
        };
        return colors[name.toLowerCase()] || colors.default;
    }

    getEmotionColor(emotion) {
        const colors = {
            joy: '#f5a623',
            surprise: '#4a90e2',
            peace: '#7ed321',
            excitement: '#d0021b'
        };
        return colors[Object.keys(emotion)[0]] || '#999';
    }

    createLegend(types, colorFn) {
        const legend = d3.select('.vis-legend')
            .append('div')
            .attr('class', 'legend-container');

        types.forEach(type => {
            const item = legend.append('div')
                .attr('class', 'legend-item');

            item.append('span')
                .attr('class', 'legend-color')
                .style('background-color', colorFn(type));

            item.append('span')
                .attr('class', 'legend-label')
                .text(type);
        });
    }

    createEmotionLegend(emotions) {
        const uniqueEmotions = new Set();
        emotions.forEach(e => uniqueEmotions.add(Object.keys(e)[0]));
        this.createLegend([...uniqueEmotions], this.getEmotionColor);
    }

    // 拖拽相关方法
    dragstarted(event, d) {
        if (!event.active) this.simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    dragended(event, d) {
        if (!event.active) this.simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
}

// 创建可视化实例并暴露到全局作用域
window.visualizer = new MemoryVisualizer(document.getElementById('visSvgContainer')); 