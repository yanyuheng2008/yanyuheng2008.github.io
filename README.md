# 元搜索引擎 (Meta Search Engine)

一个强大的元搜索引擎，同时搜索多个搜索引擎并汇总结果，提供更全面的搜索体验。

## 🚀 特性

- **多引擎搜索**: 同时搜索 Google、Bing、DuckDuckGo、Yahoo 等主流搜索引擎
- **并发搜索**: 使用多线程并发搜索，快速获取结果
- **智能去重**: 自动去除重复的搜索结果
- **双视图模式**: 支持混合视图和按引擎分组视图
- **响应式设计**: 完美适配桌面和移动设备
- **现代化界面**: 美观的用户界面和流畅的交互体验
- **API 接口**: 提供 RESTful API 用于程序化访问

## 📦 安装

### 环境要求

- Python 3.7+
- pip

### 安装步骤

1. 克隆项目（或下载文件）:
```bash
git clone <repository-url>
cd meta-search-engine
```

2. 安装依赖:
```bash
pip install -r requirements.txt
```

3. 运行应用:
```bash
python app.py
```

4. 打开浏览器访问:
```
http://localhost:5000
```

## 🖥️ 使用方法

### Web 界面

1. **搜索**: 在首页输入搜索关键词
2. **选择引擎**: 勾选想要搜索的引擎（默认全选）
3. **查看结果**: 搜索结果支持两种视图模式：
   - **混合视图**: 所有引擎的结果混合显示
   - **分组视图**: 按搜索引擎分组显示结果

### API 接口

#### 搜索 API

```bash
GET /api/search?q=关键词&engines=google&engines=bing
```

**参数说明:**
- `q`: 搜索关键词（必需）
- `engines`: 搜索引擎列表（可选，可多个）
  - 可选值: `google`, `bing`, `duckduckgo`, `yahoo`
  - 默认: 所有引擎

**响应示例:**
```json
{
  "query": "人工智能",
  "results": [
    {
      "title": "搜索结果标题",
      "link": "https://example.com",
      "snippet": "搜索结果摘要",
      "source": "Google"
    }
  ],
  "search_time": 2.34,
  "total_results": 25
}
```

## 🛠️ 技术架构

### 后端技术

- **Flask**: Web 框架
- **BeautifulSoup**: HTML 解析
- **Requests**: HTTP 请求
- **concurrent.futures**: 并发搜索
- **fake-useragent**: 模拟浏览器请求

### 前端技术

- **HTML5 + CSS3**: 现代化界面
- **JavaScript (ES6+)**: 交互功能
- **Font Awesome**: 图标库
- **响应式设计**: 适配各种设备

### 搜索引擎支持

| 引擎 | 状态 | 特点 |
|------|------|------|
| Google | ✅ | 最全面的搜索结果 |
| Bing | ✅ | 微软搜索引擎 |
| DuckDuckGo | ✅ | 注重隐私保护 |
| Yahoo | ✅ | 经典搜索引擎 |

## 🎨 界面预览

### 首页
- 简洁的搜索界面
- 引擎选择功能
- 特性介绍

### 搜索结果页
- 搜索统计信息
- 双视图切换
- 结果来源标识

## ⚙️ 配置选项

在 `app.py` 中可以配置以下选项：

```python
# 搜索超时时间（秒）
timeout = 10

# 默认搜索结果数量
num_results = 10

# 服务器端口
port = 5000
```

## 🔧 开发

### 目录结构

```
meta-search-engine/
├── app.py              # 主应用文件
├── requirements.txt    # Python 依赖
├── README.md          # 项目说明
├── templates/         # HTML 模板
│   ├── index.html     # 首页模板
│   └── results.html   # 结果页模板
└── static/           # 静态文件
    ├── style.css     # 样式文件
    └── script.js     # JavaScript 文件
```

### 添加新的搜索引擎

1. 在 `MetaSearchEngine` 类中添加新的搜索方法
2. 更新 `meta_search` 方法中的 `search_functions` 字典
3. 在前端模板中添加新引擎的选项

## 🚨 注意事项

- **搜索频率限制**: 为避免被搜索引擎封禁，请适度使用
- **网络依赖**: 需要稳定的网络连接
- **反爬虫机制**: 某些搜索引擎可能有反爬虫保护
- **结果准确性**: 搜索结果的准确性依赖于各搜索引擎

## 📝 许可证

本项目基于 MIT 许可证开源。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 📧 联系

如有问题或建议，请通过以下方式联系：
- 提交 Issue
- 发送邮件

---

**享受更智能的搜索体验！** 🔍