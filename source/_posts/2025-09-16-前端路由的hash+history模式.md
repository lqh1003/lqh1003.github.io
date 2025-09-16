---
title: 前端路由的hash+history模式
date: 2025-09-16 10:29:10
tags:
	- Vue-Router
	- Hash
	- History
categories: Vue-Router
cover: /images/前端路由的hash+history模式/cover.jpg # 封面图
---

前端路由的两种核心实现方式（hash 哈希模式、history 模式），主要用于管理 URL 与组件之间的映射关系，核心区别：

- URL 格式
- 底层原理
- 服务器依赖（hash ❌ 、history ✅）
- 功能限制

### 👉 URL 格式

- hash 模式

  - URL 包含 `#`，`#` 后面的部分为路由路径 `http://example.com/#/home`
  - **`#`及其后面的内容不会被发送到服务器，仅由前端路由解析**

- history 模式

  - URL 不包含 `#`，路径格式与传统 URL 一致 `http://example.com/home`
  - 路径看起来更 "整洁" ，符合用户对 URL 的常规认知

### 👉 底层原理

- hash 模式

  - 基于浏览器的 **哈希值（window.location.hash）** 实现
  - 哈希值的变化会触发 hashchange 事件，Vue Router 监听该事件并匹配对应的路由组件
  - 特点
    - **`#` 后面的内容不会被包含在 HTTP 请求中，仅在客户端解析**
    - 即使刷新页面，浏览器也不会向服务器请求该路径，而是直接加载当前页面并由前端路由处理

- history 模式

  - 基于 **HTML5 的 History API（window.history）** 实现，主要使用 pushState() 和 replaceState() 方法操作浏览器历史记录
  - 特点
    - 可以修改 URL 路径而不触发页面刷新（传统的 window.location.href 会导致刷新）
    - 路径变化时不会自动触发事件，Vue Router 内部通过拦截 `<a>` 标签点击和监听 popstate 事件（前进 / 后退按钮）实现路由切换。

### 👉 核心区别对比表

| 对比维度       | hash 模式                              | history 模式                            |
| :------------- | :------------------------------------- | :-------------------------------------- |
| URL 美观度     | 含 `#`，不够美观（如 `/#/about`）      | 无 `#`，更接近传统 URL（如 `/about`）   |
| 服务器依赖     | 无：刷新页面不会向服务器请求路径       | 有：刷新页面会向服务器请求该路径        |
| 兼容性         | 支持所有浏览器（包括 IE8 及以下）      | 仅支持 HTML5 浏览器（IE10+）            |
| 路径长度限制   | 有（不同浏览器对哈希值长度限制不同）   | 理论上无限制（取决于服务器配置）        |
| 部署复杂度     | 简单：无需服务器配置                   | 复杂：需服务器配置路由重定向            |
| 404 处理       | 不会出现 404（始终由前端处理）         | 可能出现 404（需服务器配置兜底页面      |

### 👉 使用场景

- 优先选择 hash 模式的情况

  - 项目需要兼容 旧浏览器（如：IE8 及以下）—— 理由：hash 兼容性强，无需后端配置
  - 部署环境无法修改服务器配置（如某些静态托管平台不支持自定义配置）
  - 对 URL 美观度要求不高，更注重开发和部署的简便

- 优先选择 history 模式的情况

  - 追求 URL 美观性（如：企业官网、产品展示页）
  - 需要使用 SEO 友好的 URL（虽然单页应用 SEO 需额外处理，但 history 模式的 URL 更符合搜索引擎规范）
  - **部署环境支持服务器配置（如 Nginx、Apache 等）**，可解决刷新 404 问题

## 👉 关键注意事项：

### ⚠️ history 模式的 404 问题 (空白页/页面 404/`Cannot GET /path`)

当用户直接访问`http://example.com/about`并刷新页面时，浏览器会向服务器请求`/about`路径。若服务器未配置该路径指向 index.html，会返回 404 错误 或者 `Cannot GET /about`

- 解决方法（**需在服务器配置中添加规则，将所有请求重定向到 index.html**）：

  - **开发环境**配置（本地调试）

    - 通过 `devServer.historyApiFallback` 选项，配置路由重定向到 index.html（通常用于支持 history 模式）

      ```javascript
      // Vue CLI（vue.config.js）
      module.exports = {
      	devServer: {
      		historyApiFallback: true, // 所有请求重定向到 index.html
      	},
      }

      // Vite（vite.config.js）
      export default defineConfig({
      	server: {
      		historyApiFallback: true,
      	},
      })
      ```

  - **生产环境**配置（服务器端）
    vue.config.js 仅负责开发环境配置，生产环境部署时仍需在服务器（如 Nginx、Apache）中配置重定向规则

### ⚠️ hash 模式的 SEO 局限

部分搜索引擎可能会忽略`#`后的内容，影响页面的 SEO 效果（虽然现代搜索引擎已逐步支持，但仍存在兼容性问题）

- URL 包含`#`，影响美观和 SEO

  - 问题：`#`符号可能让用户觉得 URL 不专业，且部分旧搜索引擎会忽略`#`后的内容（影响 SEO）
  - 解决：
    - 若对 URL 美观度要求高，直接改用 history 模式
    - SEO 需求可结合服务端渲染（SSR）或预渲染（Prerender）处理

- 哈希值被编码导致路由匹配失败
  - 问题：若路由参数包含特殊字符（如 `?、&`），会被自动编码（如 `?` 变为 `%3F`），可能导致路由匹配异常
  - 解决：
    - 使用 `encodeURIComponent` 和 `decodeURIComponent` 手动处理参数编码
    - 复杂参数建议通过 `Vuex/Pinia` 存储，而非放在 URL 中

### 👉 开发/测试环境（本地打开 dist/index.html）

- 直接双击 `dist/index.html` 打开（`file:// 协议`）时，history 模式会因浏览器安全限制失效（空白页）
- 或 右键使用 vscode 的 Live Server 这类简单文件服务打开页面时，出现空白页

![](/images/前端路由的hash+history模式/liveServer.png)

临时解决：使用本地服务器打开，如 serve 或 http-server

```bash
# 安装 serve 工具（需 Node.js）
npm install -g serve
# 在 dist 目录运行
cd dist
serve -s
# 全局安装
npm install -g http-server
# 在 dist 目录运行
cd dist
http-server
```

![](/images/前端路由的hash+history模式/httpServer.png)
