import requests
from bs4 import BeautifulSoup
from flask import Flask, render_template, request, jsonify
import concurrent.futures
import time
import urllib.parse
from fake_useragent import UserAgent
import re

app = Flask(__name__)
ua = UserAgent()

class MetaSearchEngine:
    def __init__(self):
        self.headers = {
            'User-Agent': ua.random,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        }
        self.timeout = 10
        
    def search_google(self, query, num_results=10):
        """搜索Google"""
        results = []
        try:
            url = f"https://www.google.com/search?q={urllib.parse.quote(query)}&num={num_results}"
            response = requests.get(url, headers=self.headers, timeout=self.timeout)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            for result in soup.find_all('div', class_='g'):
                try:
                    title_elem = result.find('h3')
                    link_elem = result.find('a')
                    snippet_elem = result.find('span', class_='VwiC3b')
                    
                    if title_elem and link_elem:
                        title = title_elem.get_text()
                        link = link_elem.get('href')
                        snippet = snippet_elem.get_text() if snippet_elem else ""
                        
                        if link.startswith('/url?'):
                            link = urllib.parse.parse_qs(urllib.parse.urlparse(link).query)['q'][0]
                        
                        results.append({
                            'title': title,
                            'link': link,
                            'snippet': snippet,
                            'source': 'Google'
                        })
                except Exception as e:
                    continue
        except Exception as e:
            print(f"Google搜索错误: {e}")
        
        return results
    
    def search_bing(self, query, num_results=10):
        """搜索Bing"""
        results = []
        try:
            url = f"https://www.bing.com/search?q={urllib.parse.quote(query)}&count={num_results}"
            response = requests.get(url, headers=self.headers, timeout=self.timeout)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            for result in soup.find_all('li', class_='b_algo'):
                try:
                    title_elem = result.find('h2')
                    link_elem = title_elem.find('a') if title_elem else None
                    snippet_elem = result.find('p')
                    
                    if title_elem and link_elem:
                        title = title_elem.get_text()
                        link = link_elem.get('href')
                        snippet = snippet_elem.get_text() if snippet_elem else ""
                        
                        results.append({
                            'title': title,
                            'link': link,
                            'snippet': snippet,
                            'source': 'Bing'
                        })
                except Exception as e:
                    continue
        except Exception as e:
            print(f"Bing搜索错误: {e}")
        
        return results
    
    def search_duckduckgo(self, query, num_results=10):
        """搜索DuckDuckGo"""
        results = []
        try:
            url = f"https://duckduckgo.com/html/?q={urllib.parse.quote(query)}"
            response = requests.get(url, headers=self.headers, timeout=self.timeout)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            for result in soup.find_all('div', class_='result'):
                try:
                    title_elem = result.find('h2')
                    link_elem = title_elem.find('a') if title_elem else None
                    snippet_elem = result.find('a', class_='result__snippet')
                    
                    if title_elem and link_elem:
                        title = title_elem.get_text()
                        link = link_elem.get('href')
                        snippet = snippet_elem.get_text() if snippet_elem else ""
                        
                        results.append({
                            'title': title,
                            'link': link,
                            'snippet': snippet,
                            'source': 'DuckDuckGo'
                        })
                except Exception as e:
                    continue
        except Exception as e:
            print(f"DuckDuckGo搜索错误: {e}")
        
        return results
    
    def search_yahoo(self, query, num_results=10):
        """搜索Yahoo"""
        results = []
        try:
            url = f"https://search.yahoo.com/search?p={urllib.parse.quote(query)}&n={num_results}"
            response = requests.get(url, headers=self.headers, timeout=self.timeout)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            for result in soup.find_all('div', class_='dd algo'):
                try:
                    title_elem = result.find('h3')
                    link_elem = title_elem.find('a') if title_elem else None
                    snippet_elem = result.find('p')
                    
                    if title_elem and link_elem:
                        title = title_elem.get_text()
                        link = link_elem.get('href')
                        snippet = snippet_elem.get_text() if snippet_elem else ""
                        
                        results.append({
                            'title': title,
                            'link': link,
                            'snippet': snippet,
                            'source': 'Yahoo'
                        })
                except Exception as e:
                    continue
        except Exception as e:
            print(f"Yahoo搜索错误: {e}")
        
        return results
    
    def meta_search(self, query, selected_engines=None):
        """执行元搜索"""
        if not selected_engines:
            selected_engines = ['google', 'bing', 'duckduckgo', 'yahoo']
        
        search_functions = {
            'google': self.search_google,
            'bing': self.search_bing,
            'duckduckgo': self.search_duckduckgo,
            'yahoo': self.search_yahoo
        }
        
        all_results = []
        
        # 并发搜索
        with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
            future_to_engine = {
                executor.submit(search_functions[engine], query): engine 
                for engine in selected_engines if engine in search_functions
            }
            
            for future in concurrent.futures.as_completed(future_to_engine):
                engine = future_to_engine[future]
                try:
                    results = future.result()
                    all_results.extend(results)
                except Exception as e:
                    print(f"{engine}搜索失败: {e}")
        
        # 去重和排序
        unique_results = self.deduplicate_results(all_results)
        return unique_results
    
    def deduplicate_results(self, results):
        """去重搜索结果"""
        seen_links = set()
        unique_results = []
        
        for result in results:
            if result['link'] not in seen_links:
                seen_links.add(result['link'])
                unique_results.append(result)
        
        return unique_results

# 创建搜索引擎实例
search_engine = MetaSearchEngine()

@app.route('/')
def index():
    """首页"""
    return render_template('index.html')

@app.route('/search')
def search():
    """搜索页面"""
    query = request.args.get('q', '')
    engines = request.args.getlist('engines')
    
    if not query:
        return render_template('index.html', error="请输入搜索关键词")
    
    if not engines:
        engines = ['google', 'bing', 'duckduckgo', 'yahoo']
    
    start_time = time.time()
    results = search_engine.meta_search(query, engines)
    search_time = time.time() - start_time
    
    return render_template('results.html', 
                         query=query, 
                         results=results, 
                         search_time=round(search_time, 2),
                         total_results=len(results))

@app.route('/api/search')
def api_search():
    """API搜索接口"""
    query = request.args.get('q', '')
    engines = request.args.getlist('engines')
    
    if not query:
        return jsonify({'error': '请输入搜索关键词'}), 400
    
    if not engines:
        engines = ['google', 'bing', 'duckduckgo', 'yahoo']
    
    start_time = time.time()
    results = search_engine.meta_search(query, engines)
    search_time = time.time() - start_time
    
    return jsonify({
        'query': query,
        'results': results,
        'search_time': round(search_time, 2),
        'total_results': len(results)
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)