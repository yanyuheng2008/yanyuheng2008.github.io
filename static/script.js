// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeSearchForm();
    initializeResultsPage();
});

// 初始化搜索表单
function initializeSearchForm() {
    const searchForm = document.querySelector('.search-form');
    if (!searchForm) return;

    // 搜索表单验证
    searchForm.addEventListener('submit', function(e) {
        const searchInput = this.querySelector('input[name="q"]');
        const selectedEngines = this.querySelectorAll('input[name="engines"]:checked');

        if (!searchInput.value.trim()) {
            e.preventDefault();
            showError('请输入搜索关键词');
            searchInput.focus();
            return;
        }

        if (selectedEngines.length === 0) {
            e.preventDefault();
            showError('请至少选择一个搜索引擎');
            return;
        }

        // 显示加载状态
        showLoading();
    });

    // 搜索引擎选择交互
    const engineOptions = document.querySelectorAll('.engine-option');
    engineOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            if (e.target.type !== 'checkbox') {
                const checkbox = this.querySelector('input[type="checkbox"]');
                checkbox.checked = !checkbox.checked;
                updateEngineSelection();
            }
        });
    });

    // 监听复选框变化
    const checkboxes = document.querySelectorAll('input[name="engines"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateEngineSelection);
    });

    updateEngineSelection();
}

// 初始化搜索结果页面
function initializeResultsPage() {
    const resultsPage = document.querySelector('.results-page');
    if (!resultsPage) return;

    // 初始化视图切换
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const viewType = this.onclick.toString().match(/'([^']+)'/)[1];
            toggleView(viewType);
        });
    });

    // 为搜索结果添加点击统计（可选）
    const resultLinks = document.querySelectorAll('.search-result h3 a');
    resultLinks.forEach(link => {
        link.addEventListener('click', function() {
            // 这里可以添加点击统计逻辑
            console.log('Clicked result:', this.textContent);
        });
    });

    // 添加键盘快捷键
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K 聚焦搜索框
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('.search-box-compact input');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }
    });
}

// 全选搜索引擎
function selectAll() {
    const checkboxes = document.querySelectorAll('input[name="engines"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = true;
    });
    updateEngineSelection();
}

// 全不选搜索引擎
function deselectAll() {
    const checkboxes = document.querySelectorAll('input[name="engines"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    updateEngineSelection();
}

// 更新引擎选择状态
function updateEngineSelection() {
    const checkboxes = document.querySelectorAll('input[name="engines"]');
    const engineOptions = document.querySelectorAll('.engine-option');
    
    checkboxes.forEach((checkbox, index) => {
        const option = engineOptions[index];
        if (option) {
            if (checkbox.checked) {
                option.classList.add('selected');
            } else {
                option.classList.remove('selected');
            }
        }
    });

    // 更新搜索按钮状态
    const selectedCount = document.querySelectorAll('input[name="engines"]:checked').length;
    const searchButton = document.querySelector('.search-btn.primary');
    
    if (searchButton) {
        if (selectedCount === 0) {
            searchButton.disabled = true;
            searchButton.style.opacity = '0.5';
            searchButton.style.cursor = 'not-allowed';
        } else {
            searchButton.disabled = false;
            searchButton.style.opacity = '1';
            searchButton.style.cursor = 'pointer';
        }
    }
}

// 切换视图模式
function toggleView(viewType) {
    const mixedView = document.getElementById('mixed-view');
    const groupedView = document.getElementById('grouped-view');
    const mixedBtn = document.getElementById('mixed-btn');
    const groupedBtn = document.getElementById('grouped-btn');

    if (!mixedView || !groupedView || !mixedBtn || !groupedBtn) return;

    // 移除所有活动状态
    mixedBtn.classList.remove('active');
    groupedBtn.classList.remove('active');

    if (viewType === 'mixed') {
        mixedView.style.display = 'block';
        groupedView.style.display = 'none';
        mixedBtn.classList.add('active');
        
        // 添加动画效果
        mixedView.style.opacity = '0';
        setTimeout(() => {
            mixedView.style.opacity = '1';
        }, 10);
        
    } else if (viewType === 'grouped') {
        mixedView.style.display = 'none';
        groupedView.style.display = 'block';
        groupedBtn.classList.add('active');
        
        // 添加动画效果
        groupedView.style.opacity = '0';
        setTimeout(() => {
            groupedView.style.opacity = '1';
        }, 10);
    }

    // 保存用户偏好到本地存储
    localStorage.setItem('preferredView', viewType);
}

// 显示错误消息
function showError(message) {
    // 移除现有的错误消息
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // 创建新的错误消息
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        ${message}
    `;

    // 插入到表单前面
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.parentNode.insertBefore(errorDiv, searchForm);
        
        // 3秒后自动移除
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 3000);
    }
}

// 显示加载状态
function showLoading() {
    const searchButton = document.querySelector('.search-btn.primary');
    if (searchButton) {
        const originalText = searchButton.innerHTML;
        searchButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 搜索中...';
        searchButton.disabled = true;
        
        // 保存原始文本用于恢复
        searchButton.dataset.originalText = originalText;
    }
}

// 恢复加载状态
function hideLoading() {
    const searchButton = document.querySelector('.search-btn.primary');
    if (searchButton && searchButton.dataset.originalText) {
        searchButton.innerHTML = searchButton.dataset.originalText;
        searchButton.disabled = false;
    }
}

// 平滑滚动到顶部
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 复制链接到剪贴板
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        showToast('链接已复制到剪贴板');
    }).catch(function() {
        // 降级方案
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('链接已复制到剪贴板');
    });
}

// 显示提示消息
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #333;
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // 显示动画
    setTimeout(() => {
        toast.style.opacity = '1';
    }, 10);
    
    // 自动隐藏
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }, 2000);
}

// 高亮搜索关键词
function highlightKeywords(text, keywords) {
    if (!keywords || !text) return text;
    
    const keywordArray = keywords.split(/\s+/);
    let highlightedText = text;
    
    keywordArray.forEach(keyword => {
        if (keyword.length > 1) {
            const regex = new RegExp(`(${keyword})`, 'gi');
            highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
        }
    });
    
    return highlightedText;
}

// 页面初始化时应用用户偏好
function applyUserPreferences() {
    // 恢复视图偏好
    const preferredView = localStorage.getItem('preferredView');
    if (preferredView && (preferredView === 'mixed' || preferredView === 'grouped')) {
        toggleView(preferredView);
    }
}

// 添加搜索结果动画
function animateResults() {
    const results = document.querySelectorAll('.search-result');
    results.forEach((result, index) => {
        result.style.opacity = '0';
        result.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            result.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            result.style.opacity = '1';
            result.style.transform = 'translateY(0)';
        }, index * 50);
    });
}

// 应用用户偏好
document.addEventListener('DOMContentLoaded', function() {
    applyUserPreferences();
    
    // 如果是结果页面，添加动画效果
    if (document.querySelector('.results-page')) {
        setTimeout(animateResults, 100);
    }
});

// 搜索建议功能（可选扩展）
function initializeSearchSuggestions() {
    const searchInput = document.querySelector('input[name="q"]');
    if (!searchInput) return;

    let suggestTimeout;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(suggestTimeout);
        const query = this.value.trim();
        
        if (query.length >= 2) {
            suggestTimeout = setTimeout(() => {
                // 这里可以调用搜索建议API
                console.log('Getting suggestions for:', query);
            }, 300);
        }
    });
}

// 错误处理
window.addEventListener('error', function(e) {
    console.error('JavaScript错误:', e.error);
    // 可以在这里添加错误报告逻辑
});

// 导出主要函数供HTML使用
window.selectAll = selectAll;
window.deselectAll = deselectAll;
window.toggleView = toggleView;
window.scrollToTop = scrollToTop;