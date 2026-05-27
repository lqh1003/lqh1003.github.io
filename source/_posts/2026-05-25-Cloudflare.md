---
title: Cloudflare
date: 2026-05-25 10:44:26
tags:
  - Cloudflare
  - Workers
  - D1
  - R2
  - Wrangler
categories: Cloudflare
cover: /images/Cloudflare/cover.png # 封面图
---

## 📌 了解 [Cloudflare](https://www.cloudflare.com/zh-cn/)

### Cloudflare —— 开发平台

- Cloudflare 最早很多人知道它是 CDN、DNS、防护服务（抗 DDoS）。现在已经发展成一个完整的开发平台，相当于：“把服务器搬到全球边缘节点运行”。“把计算能力放到离用户更近的位置，而不是集中在几台服务器上。”
  - 传统模式：用户 → 服务器（东京/新加坡/美国） → 数据库
    - 如果用户在背景，而服务器在美国：
      - 请求要跨洋
      - 延迟可能 200ms+
      - 高峰时可能堵
      - 自己维护服务器、扩容、负载均衡

  - **Cloudflare 模式：用户 → 最近的 Cloudflare 边缘节点 → Worker 执行代码 → 数据库/存储**
    - 延迟更低
    - 不用关心“服务器在哪台机器”，部署后，代码自动出现在全球边缘节点

  - 二者对比
    - 不是因为传统服务器不好，而是因为很多场景里维护成本很高
    - Cloudflare 方便的原因，是因为**省掉运维**
    - 但 Cloudflare 不是“全面替代服务器”，它是另一种架构选择
    - 对于博客、工具站、API、个人 SaaS，很多人会倾向 Cloudflare；对于大型后台系统、复杂数据库、AI训练任务，传统服务器依然很常见

- 很多开发者现在会说：**“全栈部署到 Cloudflare”**，通常意思就是：前端（React/Next）+ Workers + D1 + R2 整个应用都在 Cloudflare 上跑，而不是租 VPS 自己维护服务器。**自然进入“全栈”状态，而不是停留在纯前端**

### Workers —— 代码运行

- Workers 是 Cloudflare 的 Serverless（无服务器）运行环境
- 写 JS/TS/WASM → 部署 → **自动在全球边缘节点运行**
  - 传统后端：浏览器 → Nginx → Node.js服务器 → 数据库
  - Workers：浏览器 → Cloudflare Worker → 数据库/存储
- 它直接处理 HTTP 请求，相当于：
  - API 服务
  - 网页SSR
  - 鉴权
  - 中间件
  - Webhook
  - AI 调用层

### D1 —— 数据库

- D1 是 Cloudflare 的 SQL 数据库服务。底层核心是 **SQLite**。但它不是把 SQLite 文件放在本地，而是 Cloudflare 帮你托管、同步
- Worker 可以直接查询：

  ```javascript
  const result = await env.DB.prepare("SELECT * FROM users").all();
  ```

  - Worker ≈ Node 后端
  - D1 ≈ MySQL/PostgreSQL (但是 D1 更偏轻量)

### R2 —— 文件存储

- R2 是 Cloudflare 的对象存储（Object Storage）
- 用于存储：
  - 图片
  - 视频
  - PDF
  - 上传文件
  - 静态资源
- Worker 可以直接查询：

  ```javascript
  await env.BUCKET.put("avatar.png", file);
  ```

- Worker、D1、R2 三者的关系：

  ```bash
  用户
  ↓
  Cloudflare CDN
  ↓
  Worker
  ↓       ↓
  D1      R2
  (SQL)  (文件)
  ```

  - 例如做一个博客系统：
    - Worker
      - 处理 API
      - 登录
      - 页面渲染
    - D1
      - 存文章、用户、评论
    - R2
      - 存图片、附件

### Wrangler —— 开发/部署工具

- **Wrangler** 可以理解成 **Cloudflare 开发平台的命令行管家（CLI）**，它 = **本地开发、配置、部署Worker、D1、R2的工具**。你平时并不是手动去 Cloudflare 网页后台点来点去，而是在终端里敲命令
- **Wrangler** 还有一个非常重要的文件 `wrangler.jsonc`（以前很多项目是 `wrangler.toml`）

  ```JSON
  # 这个文件类似项目配置中心，意思是 D1数据库、R2存储
  {
    "name": "my-api",
    "main": "src/index.js",

    "d1_databases": [{
        "binding": "DB",
        "database_name": "mydb"
    }],

    "r2_buckets": [{
        "binding": "BUCKET",
        "bucket_name": "images"
    }]
  }
  ```

## 📌 开通 [Cloudflare](https://www.cloudflare.com/zh-cn/plans/)

- 个人使用 Cloudflare 的门槛其实很低：**直接注册账号即可，不需要先买服务器**
  - 很多人刚接触会误以为：“我要买一台 Cloudflare 服务器”，实际上不是。Cloudflare 大部分产品是：**先开通 → 使用 → 按量付费（或免费额度）**

- Cloudflare 主要是按量模式，如果只是（学习 Cloudflare + 做几个项目）的阶段，可能花费：
  - 账号：免费
  - Workers：免费额度
  - D1：免费额度
  - R2：免费额度
  - 域名：单独买（约 $10–15/年）

- 举例：
  - 场景1：个人博客（Worker + D1 + R2）
    - 访问量：
      - 每天 1000–5000 PV
      - 图片几 GB
      - 少量数据库查询

    - 费用：≈ $0/月，通常免费额度够用

  - 场景2：个人 SaaS（1000 用户）
    - 前端 + Worker API + D1 + R2
    - 费用：约 $5–15/月，很多独立开发者就在这个区间

## 📌 使用 [Cloudflare](https://www.cloudflare.com/zh-cn)

### **第一阶段：先把“部署网站”跑通（1–2天）【不碰数据库，不碰后端，只学会把项目放到 Cloudflare】**

- 注册 [Cloudflare](https://dash.cloudflare.com/login)
  - 使用 GitHub / 邮箱+密码 登录
    <img src="/images/Cloudflare/cloudflare_login.png" alt="image" class="max400 border1"/>
    <img src="/images/Cloudflare/cloudflare_default.png" alt="image" class="max700 border1"/>

- 部署一个 HTML 项目到 Cloudflare Pages
  - 适合项目：
    - 纯 HTML/CSS/JS
    - Vue / React / Vite / Next 静态导出
    - 博客 - 文档站
    - Landing Page
    ```bash
        my-site/
          ├── index.html
          ├── style.css
          ├── script.js
          ├── images/
    ```
  - 准备一个静态项目 git@github.com:lqh1003/todolist.git
    - 仓库不需要公开。Cloudflare Pages 和 Workers 都支持私有 GitHub 仓库
      <img src="/images/Cloudflare/project_html.png" alt="image" class="max700 border1"/>

- 绑定 GitHub 自动部署
  - 登录 Cloudflare → 进入 Workers & Pages → 选择 Create → 选择 Pages → 选择 Connect to Github → 选择todolist项目(第一次会要求授权 GitHub) → 部署
    <img src="/images/Cloudflare/project_html_c.png" alt="image" class="max700 border1"/>
    <img src="/images/Cloudflare/project_html_deploy.png" alt="image" class="max400 border1"/>
  - 等待几秒部署完成
    - 这里就是可以访问的链接`https://项目名.账号ID.workers.dev`，也可以自己购买域名进行更换
      <img src="/images/Cloudflare/project_html_link.png" alt="image" class="max500 border1"/>
    - 继续等待几十秒刷新链接 https://todolist.2933213867.workers.dev/
      <img src="/images/Cloudflare/project_html_link1.png" alt="image" class="max500 border1"/>

- 尝试改代码自动更新（git push → GitHub → Cloudflare Pages → 自动构建 → 网站更新）
  - 修改代码，git push 到远程仓库
  - 然后回 Cloudflare/Workers & Pages/todolist/部署，可以看到部署正在进行（Building.../Deploying.../Success）
  - 等待十几秒～几十秒，再刷新链接，成功
    <img src="/images/Cloudflare/project_html_link2.png" alt="image" class="max500 border1"/>

### **第二阶段：开始学 Workers（3–5天）**

### **第三阶段：加数据库 D1（3–7天）**

### **第四阶段：加 R2 文件上传（2–3天）**

### **第五阶段：做一个完整项目（1–2周）**
