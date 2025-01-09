// 模拟记忆数据
const memories = [
    {
        id: 1,
        title: "高级数学知识包",
        description: "包含微积分、线性代数等高等数学知识的完整记忆包",
        price: 299,
        category: "knowledge",
        rating: 4.8,
        sales: 156
    },
    {
        id: 2,
        title: "钢琴演奏技能",
        description: "10年钢琴演奏经验的技能记忆",
        price: 599,
        category: "skill",
        rating: 4.9,
        sales: 89
    },
    {
        id: 3,
        title: "环球旅行经历",
        description: "来自专业旅行家的50个国家旅行记忆",
        price: 199,
        category: "experience",
        rating: 4.7,
        sales: 234
    }
];

// DOM 元素
const memoryList = document.getElementById('memory-list');
const categoryFilter = document.getElementById('category-filter');
const searchInput = document.getElementById('search');

// 渲染记忆卡片
function renderMemoryCard(memory) {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.innerHTML = `
        <h3>${memory.title}</h3>
        <p>${memory.description}</p>
        <div class="memory-stats">
            <span class="rating">⭐ ${memory.rating}</span>
            <span class="sales">已售 ${memory.sales}</span>
        </div>
        <div class="price">￥${memory.price}</div>
        <span class="category">${getCategoryName(memory.category)}</span>
        <button onclick="purchaseMemory(${memory.id})" class="purchase-btn">购买记忆</button>
    `;
    return card;
}

// 获取分类名称
function getCategoryName(category) {
    const categories = {
        knowledge: '知识类',
        experience: '经验类',
        skill: '技能类'
    };
    return categories[category] || category;
}

// 过滤和搜索记忆
function filterMemories() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;
    
    const filteredMemories = memories.filter(memory => {
        const matchesSearch = memory.title.toLowerCase().includes(searchTerm) ||
                            memory.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !selectedCategory || memory.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    displayMemories(filteredMemories);
}

// 显示记忆列表
function displayMemories(memoriesToShow) {
    memoryList.innerHTML = '';
    memoriesToShow.forEach(memory => {
        memoryList.appendChild(renderMemoryCard(memory));
    });
}

// 购买记忆
function purchaseMemory(memoryId) {
    const memory = memories.find(m => m.id === memoryId);
    if (memory) {
        // 这里可以添加实际的购买逻辑
        alert(`正在购买: ${memory.title}\n价格: ￥${memory.price}`);
    }
}

// 事件监听
categoryFilter.addEventListener('change', filterMemories);
searchInput.addEventListener('input', filterMemories);

// 初始化显示
displayMemories(memories);

// 添加平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
}); 