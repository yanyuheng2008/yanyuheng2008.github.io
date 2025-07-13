# 快速启动指南

## 🚀 一键启动

```bash
# 1. 安装依赖
pip install --break-system-packages -r requirements.txt

# 2. 启动应用
python3 app.py

# 3. 访问应用
# 浏览器打开: http://localhost:5000
```

## 🧪 功能测试

### Web界面测试
1. 打开浏览器访问 `http://localhost:5000`
2. 输入搜索关键词，如："人工智能"
3. 选择搜索引擎（默认全选）
4. 点击"开始搜索"
5. 查看搜索结果，尝试切换"混合视图"和"分组视图"

### API测试
```bash
# 搜索"python"关键词
curl "http://localhost:5000/api/search?q=python&engines=duckduckgo"

# 使用多个搜索引擎
curl "http://localhost:5000/api/search?q=机器学习&engines=google&engines=bing"
```

## 📋 项目结构
```
meta-search-engine/
├── app.py              # 🐍 Flask应用主文件
├── requirements.txt    # 📦 Python依赖
├── README.md          # 📖 详细文档
├── QUICKSTART.md      # 🚀 快速启动指南
├── templates/         # 🎨 HTML模板
│   ├── index.html     # 首页
│   └── results.html   # 搜索结果页
└── static/           # 🎯 静态文件
    ├── style.css     # 样式
    └── script.js     # JavaScript
```

## ✨ 主要特性
- ✅ **多引擎搜索**: Google、Bing、DuckDuckGo、Yahoo
- ✅ **并发搜索**: 快速获取结果
- ✅ **智能去重**: 自动去除重复结果
- ✅ **双视图**: 混合视图 & 分组视图
- ✅ **响应式**: 适配桌面和移动设备
- ✅ **API接口**: RESTful API支持

## 🔧 配置选项
在 `app.py` 中可以调整:
- `timeout = 10` # 搜索超时时间
- `port = 5000` # 服务器端口

## 📱 移动端访问
手机浏览器访问: `http://[你的IP]:5000`

## ⚠️ 注意事项
- 需要稳定的网络连接
- 某些搜索引擎可能有访问限制
- 建议适度使用避免IP被封

---
**🎉 享受更智能的搜索体验！**