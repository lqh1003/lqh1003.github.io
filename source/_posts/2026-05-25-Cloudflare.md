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
    - 如果用户在北京，而服务器在美国：
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

  ```jsonc
  // 这个文件类似项目配置中心，意思是 D1 数据库、R2 存储
  {
    "name": "my-api",
    "main": "src/index.js",

    "d1_databases": [
      {
        "binding": "DB",
        "database_name": "mydb",
      },
    ],

    "r2_buckets": [
      {
        "binding": "BUCKET",
        "bucket_name": "images",
      },
    ],
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

> **学习路线**：① Pages 部署静态站 → ② Workers 接口 → ③ D1 数据库 → ④ R2 文件存储 → ⑤ 完整项目串联 → ⑥ 域名接入 + DNS/SSL/CDN

### **第一阶段：先把“部署网站”跑通**

> 不碰数据库，不碰后端，只学会把项目放到 Cloudflare，周期：1-2 天

#### 注册 [Cloudflare](https://dash.cloudflare.com/login)

- 使用 GitHub 或 邮箱+密码 登录 (我直接用验证完真人，选择点击 Github 登录)
  <img src="/images/Cloudflare/cloudflare_login.png" alt="image" class="max400 border1"/>
  <img src="/images/Cloudflare/cloudflare_login2.png" alt="image" class="max400 border1"/>
  <img src="/images/Cloudflare/cloudflare_default.png" alt="image" class="max700 border1"/>

#### 准备一个 HTML 项目 (Github)

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

#### Cloudflare Pages 绑定 GitHub 自动部署

> 部署一个 HTML 项目到 Cloudflare Pages，绑定 GitHub 自动部署

- 登录 Cloudflare → 进入 Workers & Pages → 选择 Create → 选择 Pages → 选择 Connect to Github → 选择todolist项目(第一次会要求授权 GitHub) → 部署
  <img src="/images/Cloudflare/project_html_c.png" alt="image" class="max700 border1"/>
  <img src="/images/Cloudflare/project_html_deploy.png" alt="image" class="max400 border1"/>
- 等待几秒部署完成
  - 这里就是可以访问的链接`https://项目名.账号ID.workers.dev`，也可以自己购买域名进行更换
    <img src="/images/Cloudflare/project_html_link.png" alt="image" class="max500 border1"/>
  - 继续等待几十秒刷新链接 https://todolist.2933213867.workers.dev/
    <img src="/images/Cloudflare/project_html_link1.png" alt="image" class="max500 border1"/>

#### 尝试改代码自动更新

> git push → GitHub → Cloudflare Pages → **自动构建** → 网站更新

- 修改代码，git push 到远程仓库
- 然后回 Cloudflare/计算/Workers & Pages/todolist/部署界面，可以看到部署正在进行（Building.../Deploying.../Success）
- 等待十几秒～几十秒，再刷新链接，成功
  <img src="/images/Cloudflare/project_html_link2.png" alt="image" class="max500 border1"/>

### **第二阶段：开始学 Workers**

> Worker API 返回加数据 (不要 D1，不要登录，不要增删改查)，周期：3-5 天

#### 创建项目 `npm create cloudflare@latest`

- 需要 node22+
  <img src="/images/Cloudflare/node_version.png" alt="image" class="max500 border1"/>
- Project name? —— 输入 todolist-worker
- What type of application? —— 选择 Hello World example
- Which language? —— 选择 Javascript
- ... 后面根据需要选择即可

#### 本地运行 `npm run dev`

- 初始化的项目目录：
  <img src="/images/Cloudflare/project_worker.png" alt="image" class="max800 border1"/>
- 运行链接：http://127.0.0.1:8787/

#### 修改 `src/index.js`

- 返回假数据，打开 http://127.0.0.1:8787/todos 可以看到返回 Json 数据

```javascript
// src/index.js 文件
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    switch (url.pathname) {
      case "/message":
        return new Response("Hello, World!");
      case "/random":
        return new Response(crypto.randomUUID());

      // *** 加一接口 /todos ***
      case "/todos":
        const todos = [
          {
            id: 1,
            text: "学习 Cloudflare",
            done: false,
          },
          {
            id: 2,
            text: "完成 Todo 页面",
            done: true,
          },
          {
            id: 3,
            text: "部署到 Workers",
            done: false,
          },
        ];
        return new Response(JSON.stringify(todos), {
          headers: { "Content-Type": "application/json" },
        });
      // *** End ***

      default:
        return new Response("Not Found", { status: 404 });
    }
  },
};
```

  <img src="/images/Cloudflare/project_worker1.png" alt="image" class="max300 border1"/>

#### **部署线上**

- 确认项目配置 wrangler.jsonc 是否正确
  - name、main 等属性
- 登录 Cloudflare
  - 全局安装：`npm install -g wrangler`
  - 登录：终端输入 **`npx wrangler login`**
    如果登陆着其他 Cloudflare 账号，要先运行命令退出登录 `npx wrangler logout`
  - 会自动打开浏览器(或手动打开控制台的链接) → 选择账号登录 → 点击授权Authorize → 最后控制台终端会显示 Successfully logged in
- 部署
  - 进入项目 `cd todolist-worker`
  - 执行 `npm run deploy` 或 `npx wrangler deploy`
  - 然后回 Cloudflare/计算/Workers & Pages
    - 可以看到多了一个 **todolist-worker**，可以看到部署正在进行（Building.../Deploying.../Success）
      <img src="/images/Cloudflare/project_worker2.png" alt="image" class="max700 border1"/>
  - 控制台终端看到部署成功和链接 https://todolist-worker.2933213867.workers.dev/
    <img src="/images/Cloudflare/project_worker3.png" alt="image" class="max500 border1"/>
  - https://todolist-worker.2933213867.workers.dev/todos 这个便是可以使用的接口数据了

### **第三阶段：加数据库 D1**

> 周期：3-7 天

#### **创建 D1 数据库**

- 命令创建，如：数据库名称 todolist：
  - 进入 worker 项目：`cd todolist-worker`
  - 输入命令 `npx wrangler d1 create todolist`
  - Cloudflare 会出现数据库：
    <img src="/images/Cloudflare/cloudflare_d1.png" alt="image" class="max700 border1"/>

  - 执行成功会返回到控制台：
    ```jsonc
    {
      "d1_databases": [
        {
          "binding": "DB", // Worker 代码里的变量名，习惯用 DB，即 env.DB （可自定义）
          "database_name": "todolist", // 数据库显示名称
          "database_id": "3ac1718a-cca3-4ee5-ba27-dc0efc128955", // 数据库唯一ID
        },
      ],
    }
    ```
  - 复制到 wrangler.jsonc
  - **有了 d1_databases 这个配置就会自动连接D1数据库 todolist**
    - Worker → env.DB → D1数据库

- 或手动创建
  - 在Cloudflare/存储和数据库/D1 数据库 → 点击创建数据库 todolist
  - 可以根据以上格式手动写到 wrangler.jsonc

#### **创建表/数据**

- 可以在项目中写一个 xxx.sql 文件 (包含建表、插入几条初始数据...)
  - 然后执行脚本命令 `npx wrangler d1 execute todolist --local --file=xxx.sql` 即可
- 当然也可以直接点击 Cloudflare/D1/todolist/探索数据 去操作建表/增删改查真实数据
  <img src="/images/Cloudflare/cloudflare_d1_2.png" alt="image" class="max700 border1"/>

#### **todolist 的增删改查接口，使用真实数据**

- 建表 sql，文件目录 migrations/0001_create_todos.sql

  ```SQL
    -- 待办事项表（D1 / SQLite）
    -- 执行：npx wrangler d1 migrations apply todolist --local
    -- 或：  npx wrangler d1 execute todolist --local --file=migrations/0001_create_todos.sql

    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,              -- 主键，自增
      text TEXT NOT NULL,                                -- 待办内容
      done INTEGER NOT NULL DEFAULT 0 CHECK (done IN (0, 1)), -- 是否完成：0 否，1 是
      created_at TEXT NOT NULL DEFAULT (datetime('now')), -- 创建时间（UTC 文本）
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))  -- 最后更新时间
    );

    -- 按创建时间倒序查询时加速
    CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos (created_at DESC);
  ```

  - 执行命令 `npx wrangler d1 execute todolist --local --file=migrations/0001_create_todos.sql`

- 修改 src/index.js，增加增删改查接口

  ```javascript
  /**
   * TodoList Worker — 基于 Cloudflare D1 的待办 CRUD API
   *
   * 路由（均需绑定 wrangler.jsonc 中的 DB）：
   *   GET    /api/todos       列表
   *   GET    /api/todos/:id   单条
   *   POST   /api/todos       创建，body: { text, done? }
   *   PUT    /api/todos/:id   更新，body: { text?, done? }
   *   DELETE /api/todos/:id   删除
   */

  /** JSON 响应默认头 */
  const JSON_HEADERS = { "Content-Type": "application/json; charset=utf-8" };

  /** 返回 JSON 响应 */
  function json(data, status = 200) {
    return new Response(JSON.stringify(data), {
      status,
      headers: JSON_HEADERS,
    });
  }

  /** 返回错误 JSON，默认 400 */
  function error(message, status = 400) {
    return json({ error: message }, status);
  }

  /**
   * 将 D1 查询行转为 API 对象
   * SQLite 中 done 存为 0/1，对外返回布尔值
   */
  function rowToTodo(row) {
    return {
      id: row.id,
      text: row.text,
      done: row.done === 1,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  }

  /** 查询全部待办，按 id 升序 */
  async function listTodos(db) {
    const { results } = await db
      .prepare(
        "SELECT id, text, done, created_at, updated_at FROM todos ORDER BY id ASC",
      )
      .all();
    return results.map(rowToTodo);
  }

  /** 按主键查询单条，不存在返回 null */
  async function getTodo(db, id) {
    const row = await db
      .prepare(
        "SELECT id, text, done, created_at, updated_at FROM todos WHERE id = ?",
      )
      .bind(id)
      .first();
    return row ? rowToTodo(row) : null;
  }

  /**
   * 创建待办
   * @returns {{ todo }} 或 {{ error, status }}
   */
  async function createTodo(db, body) {
    const text = typeof body.text === "string" ? body.text.trim() : "";
    if (!text) {
      return { error: "text is required", status: 400 };
    }
    const done = body.done === true ? 1 : 0;
    const result = await db
      .prepare(
        `INSERT INTO todos (text, done, updated_at)
          VALUES (?, ?, datetime('now'))`,
      )
      .bind(text, done)
      .run();
    const todo = await getTodo(db, result.meta.last_row_id);
    return { todo };
  }

  /**
   * 更新待办（部分字段：未传的 text/done 保留原值）
   * @returns {{ todo }} 或 {{ error, status }}
   */
  async function updateTodo(db, id, body) {
    const existing = await getTodo(db, id);
    if (!existing) {
      return { error: "todo not found", status: 404 };
    }

    const text =
      body.text !== undefined
        ? typeof body.text === "string"
          ? body.text.trim()
          : ""
        : existing.text;
    if (!text) {
      return { error: "text cannot be empty", status: 400 };
    }
    const done =
      body.done !== undefined
        ? body.done === true
          ? 1
          : 0
        : existing.done
          ? 1
          : 0;

    await db
      .prepare(
        `UPDATE todos
          SET text = ?, done = ?, updated_at = datetime('now')
          WHERE id = ?`,
      )
      .bind(text, done, id)
      .run();

    const todo = await getTodo(db, id);
    return { todo };
  }

  /**
   * 删除待办
   * @returns {{ ok: true }} 或 {{ error, status }}
   */
  async function deleteTodo(db, id) {
    const result = await db
      .prepare("DELETE FROM todos WHERE id = ?")
      .bind(id)
      .run();
    if (result.meta.changes === 0) {
      return { error: "todo not found", status: 404 };
    }
    return { ok: true };
  }

  /**
   * 处理 /api/todos 与 /api/todos/:id 的 HTTP 方法分发
   * @param {number|null} id 路径中的 id；列表/创建时为 null
   */
  async function handleTodos(request, env, id) {
    const db = env.DB;
    if (!db) {
      return error("database binding DB is not configured", 500);
    }

    const method = request.method;

    // 列表
    if (method === "GET" && id === null) {
      return json(await listTodos(db));
    }

    // 单条查询
    if (method === "GET" && id !== null) {
      const todo = await getTodo(db, id);
      return todo ? json(todo) : error("todo not found", 404);
    }

    // 创建
    if (method === "POST" && id === null) {
      let body;
      try {
        body = await request.json();
      } catch {
        return error("invalid JSON body");
      }
      const result = await createTodo(db, body);
      if (result.error) {
        return error(result.error, result.status);
      }
      return json(result.todo, 201);
    }

    // 更新
    if (method === "PUT" && id !== null) {
      let body;
      try {
        body = await request.json();
      } catch {
        return error("invalid JSON body");
      }
      const result = await updateTodo(db, id, body);
      if (result.error) {
        return error(result.error, result.status);
      }
      return json(result.todo);
    }

    // 删除
    if (method === "DELETE" && id !== null) {
      const result = await deleteTodo(db, id);
      if (result.error) {
        return error(result.error, result.status);
      }
      return json({ deleted: true, id });
    }

    return error("method not allowed", 405);
  }

  export default {
    async fetch(request, env, ctx) {
      const url = new URL(request.url);

      // 匹配 /api/todos 或 /api/todos/123
      const todosMatch = url.pathname.match(/^\/api\/todos(?:\/(\d+))?$/);

      if (todosMatch) {
        const id = todosMatch[1] ? Number(todosMatch[1]) : null;
        if (todosMatch[1] && Number.isNaN(id)) {
          return error("invalid todo id");
        }
        return handleTodos(request, env, id);
      }

      // 示例/静态资源联调用的保留路由
      switch (url.pathname) {
        case "/message":
          return new Response("Hello, World!");
        case "/random":
          return new Response(crypto.randomUUID());
        default:
          return new Response("Not Found", { status: 404 });
      }
    },
  };
  ```

- 代码推送到远程 `git push`

- **本地 vs 线上数据库**
  - `--local`：只影响本地 dev 环境
  - 上线前需执行【建表】：`npx wrangler d1 migrations apply todolist --remote`（或 `--remote --file=xxx.sql`）

- 部署 `npm run deploy`

- 前端项目即可使用 https://todolist-worker.2933213867.workers.dev/ 作为接口基地址了

#### 接口地址使用

- https://todolist-worker.2933213867.workers.dev/ 这个接口基地址 + 几个接口的相关使用给到前端项目
  - 前端项目：纯静态的 HTML 项目 git@github.com:lqh1003/todolist.git
  - 改成 vite 项目，且调用后端接口，本地运行正常：
    <img src="/images/Cloudflare/cloudflare_d1_3.png" alt="image" class="max700 border1"/>
  - 此时项目已经变成 vite 项目了，代码推送前，先在 Cloudflare 修改一下 todolist 的打包命令 (之前纯静态项目打包命令为空，现在vite项目 打包命令是`npm run build`)
    <img src="/images/Cloudflare/cloudflare_d1_4.png" alt="image" class="max700 border1"/>

  - 修改完成之后，推送代码到远程`git pull`
    - Cloudflare / Workers 和 Pages / todolistz 在自动构建，等待构建完成
    - 打开线上链接`https://todolist.2933213867.workers.dev/`可以访问了 (vite 项目 + 接口 + D1数据)

### **第四阶段：加 R2 文件上传**【待补充】

> 周期：2-3 天

- 创建 R2 存储桶 → 绑定到 `wrangler.jsonc` → Worker 实现上传/下载接口 → 前端对接
- 关键命令预览：`npx wrangler r2 bucket create <name>`、`env.BUCKET.put()` / `env.BUCKET.get()`

### **第五阶段：做一个完整项目**【待补充】

> 周期：1–2 周

- 串联 Pages 前端 + Worker API + D1 数据 + R2 文件，完成一个可上线的 Todo / 博客 / 工具站

### **第六阶段：域名接入**

> 把域名加入到 Cloudflare 账户，受 Cloudflare 保护

#### 添加域名

- 登录Cloudflare账号 → 域名/概览 → 添加域名 → 已有域名选择`连接域名`，没有选择`注册域名`
  <img src="/images/Cloudflare/add_domains1.png" alt="image" class="max500 border1"/>
  <img src="/images/Cloudflare/add_domains2.png" alt="image" class="max500 border1"/>

- **注册域名**，输入想要的域名，选择购买，填写对应的信息，支付金额即可
  <img src="/images/Cloudflare/add_domains3.png" alt="image" class="max500 border1"/>

    - 但是 Cloudflare Registrar 域名结账**原生无 Alipay 入口**，只支持 4 类支付：
      - VISA/Master/AE 双币信用卡、银联国际卡
      - PayPal（最常用中转）
      - Apple Pay（仅苹果设备单次付款，不能自动续费域名）
      - 企业合同对公（个人用不了）

- **连接域名 ✅**
  - 去其他平台购买域名，比如：国内云厂商（阿里云/腾讯云/华为云 ｜ 支付宝/微信秒付 ｜ 分国内/国际版）
    - 在华为云购买了域名 **lqhstudy.online**，10元/年，选择不自动续费，支付宝扫码秒付
      <img src="/images/Cloudflare/add_domains4.png" alt="image" class="max800 border1"/>

  - 选择连接域名 → 输入域名 lqhstudy.online，点击继续 → 选择按月付费，Free计划 → 点击`继续前往激活` → 就会得到图2的界面(激活步骤)
    <img src="/images/Cloudflare/add_domains5.png" alt="image" class="max500 border1"/>
    <img src="/images/Cloudflare/add_domains6.png" alt="image" class="max500 border1"/>

      - 复制好两条 NS 服务器，也就可以离开当前页面了，可以看到域名已经添加成功，但是状态还不可用
        <img src="/images/Cloudflare/add_domains9.png" alt="image" class="max700 border1"/>

  - 去激活，更换域名 NS（关键生效步骤）
    - 复制 Cloudflare 给出的两条 NS 服务器：`ara.ns.cloudflare.com` `theo.ns.cloudflare.com`
    - 进入你的域名注册商后台 → 点击域名管理 → 替换成 Cloudflare 分配的 2 条 NS 地址
      <img src="/images/Cloudflare/add_domains7.png" alt="image" class="max600 border1"/>
      <img src="/images/Cloudflare/add_domains8.png" alt="image" class="max600 border1"/>
    - 生效时间：10 分钟～24 小时，**Cloudflare 页面自动检测 NS 状态变成 Active，即接入成功**
      <img src="/images/Cloudflare/add_domains10.png" alt="image" class="max600 border1"/>

#### Cloudflare 接入域名后，按顺序：**DNS 域名解析 → SSL 证书 → CDN 缓存**

  <img src="/images/Cloudflare/add_domains11.png" alt="image" class="max600 border1"/>

- DNS 配置（**域名解析核心**）
  - 前提：域名在别家注册、NS 已经改成 Cloudflare
  - 点击域名 → 配置 DNS → 添加记录 (根据自己需要添加)
    <img src="/images/Cloudflare/add_domains12.png" alt="image" class="max700 border1"/>
  - 推荐添加的三条记录（`192.0.2.1` 是 Cloudflare 官方占位 IP，橙云开启时代理会自动转发，无需填真实服务器 IP）

    | 类型  | 主机/名称 | 内容/IPv4     | 云朵             | 备注                            |
    | :---- | :-------- | :------------ | :--------------- | :------------------------------ |
    | A     | @         | 192.0.2.1     | 橙云（开启代理） | 裸域名主站                      |
    | CNAME | www       | xxx.pages.dev | 橙云（开启代理） | www 优先走 Pages，不受 `*` 影响 |
    | A     | \*        | 192.0.2.1     | 橙云（开启代理） | 其余子域名兜底                  |

  - **绑定 Pages 自定义域名**（把域名和第一阶段部署的 Pages 项目连起来）
    1. Cloudflare → **Workers & Pages** → 选择 todolist 项目 → 选择`域` → **添加域名**
    2. 选择路由模式，随机添加几个路由，比如：
       <img src="/images/Cloudflare/add_domains14.png" alt="image" class="max600 border1"/>

    3. 等待 DNS 生效，访问 `https://lqhstudy.online`、`https://todos.lqhstudy.online` 验证，都可以打开站点
       <img src="/images/Cloudflare/add_domains15.png" alt="image" class="max500 border1"/>

    4. 同理，给第二阶段的 todolist-worker 自定义域名 也完美生效：`https://api.lqhstudy.online/api/todos`

- SSL/TLS 配置（**全站 HTTPS**）
  - SSL 的作用
    - 浏览器 → CF 服务器加密 HTTPS，地址栏小绿锁，去除不安全警告
    - 浏览器强制 HTTPS 访问，避免手动输 http 跳转失败
    - 搜索引擎优先收录 HTTPS 站点，提升 SEO 排名
    - 防止数据窃听、劫持、广告篡改网页内容
    - Pages 静态站必须 HTTPS，http 访问会报错
    - **CF 免费自动签发全球可信 SSL 证书，域名自带小绿锁，解决 https 证书购买、续期难题**
  - 点击域名 → **SSL/TLS** → **概述** 选择加密模式（4 种模式适合不同场景）

    | 模式                      | 适用场景                      | 博客/Pages 推荐                              |
    | :------------------------ | :---------------------------- | :------------------------------------------- |
    | 灵活 Flexible             | 源站只有 HTTP                 | ❌ 不推荐（浏览器到 CF 加密，CF 到源站明文） |
    | 完全 Full                 | 源站有 HTTPS 但证书可能不受信 | ⚠️ 可用                                      |
    | 完全（严格）Full (strict) | 源站有有效 HTTPS 证书         | ✅ **Pages 首选**                            |
    | 关闭 Off                  | 不加密                        | ❌ 禁用                                      |

    > Pages / Workers 托管站点选 **Full (strict)** 即可，证书由 Cloudflare 自动签发。

    <img src="/images/Cloudflare/add_domains13.png" alt="SSL/TLS 加密模式选择" class="max700 border1"/>

- CDN 配置（**缓存、提速、压缩**）

  分两大模块：**① Speed（速度 / 压缩全局开关）** 和 **② Page Rules 页面规则（自定义缓存）**。建议先做完 Speed 全局开关，再按需加 Page Rules 精细控制。
  - ① Speed —— 速度 / 压缩全局开关
    - 入口：点击域名 → 左侧 **速度 / Speed** → **优化 / Optimization**
    - 作用：全站生效，不用写规则。适合博客、静态站这类「HTML + CSS + JS + 图片」站点，一次打开，全球边缘节点自动压缩、加速传输

    - **推荐开启项（免费计划可用）**

      | 设置项         | 路径                   | 推荐值           | 说明                                                   |
      | :------------- | :--------------------- | :--------------- | :----------------------------------------------------- |
      | Brotli 压缩    | 速度 → 优化 → 内容优化 | **开启**         | 比 Gzip 压缩率更高，CSS/JS/HTML 体积更小，首屏加载更快 |
      | Early Hints    | 速度 → 优化 → 内容优化 | **开启**         | 提前告诉浏览器要加载哪些资源，减少等待时间             |
      | HTTP/2         | 速度 → 优化 → 协议优化 | **开启**（默认） | 多路复用，同一连接并行加载多个文件                     |
      | HTTP/3 (QUIC)  | 速度 → 优化 → 协议优化 | **开启**（默认） | 弱网、移动网络下延迟更低                               |
      | 0-RTT 连接恢复 | 速度 → 优化 → 协议优化 | **开启**         | 回访用户握手更快（安全性要求极高时可关）               |

    - **按需开启 / 建议关闭项**

      | 设置项                     | 推荐值     | 说明                                                            |
      | :------------------------- | :--------- | :-------------------------------------------------------------- |
      | Rocket Loader              | **关闭**   | 会改写 JS 加载顺序，Hexo / Vue / React 站点容易出白屏或交互异常 |
      | Auto Minify（HTML/CSS/JS） | **已下线** | Cloudflare 已移除该开关；构建阶段用 Vite/Webpack/Hexo 压缩即可  |
      | Polish（图片优化）         | 免费版有限 | 付费功能，博客图片建议本地压缩 + WebP，不必强开                 |
      | Mirage                     | **关闭**   | 已废弃，无需配置                                                |

    - **操作步骤**
      1. 进入域名控制台 → **速度 / Speed** → **优化 / Optimization**
      2. 找到 **内容优化 / Content Optimization**，打开 **Brotli**、**Early Hints**
      3. 找到 **协议优化**，确认 **HTTP/2**、**HTTP/3** 为开启状态
      4. 找到 **JavaScript**，确认 **Rocket Loader** 为关闭
      5. 保存后等 1～3 分钟生效，可用浏览器 DevTools → Network 查看响应头是否出现 `content-encoding: br`

    - **验证是否生效**
      - 打开站点 → F12 → Network → 刷新 → 点任意 `.css` 或 `.js` 文件
      - 响应头里看到 `content-encoding: br` 表示 Brotli 已生效
      - 响应头里看到 `cf-cache-status: HIT` 表示 CDN 缓存命中（需配合下方 Page Rules）

  - ② Page Rules —— 页面规则（自定义缓存）
    - 入口：点击域名 → 左侧 **规则 / Rules** → **页面规则 / Page Rules**
    - 作用：按 URL 模式单独控制缓存策略。Speed 是全局开关；Page Rules 用来区分「静态资源长期缓存」和「HTML 短缓存 / 不缓存」
    - 免费计划：**3 条** Page Rules，要精打细算，优先给静态资源

    - **博客 / 静态站推荐 3 条规则（按优先级从上到下）**

      | 优先级 | URL 匹配模式                | 设置项                      | 值                                | 用途         |
      | :----- | :-------------------------- | :-------------------------- | :-------------------------------- | :----------- |
      | 1      | `*lqhstudy.online/css/*`    | 缓存级别 Cache Level        | **缓存所有内容 Cache Everything** | CSS 长期缓存 |
      | 1      | 同上                        | 边缘缓存 TTL Edge Cache TTL | **1 个月**                        | 减少回源     |
      | 2      | `*lqhstudy.online/js/*`     | 缓存级别                    | **Cache Everything**              | JS 长期缓存  |
      | 2      | 同上                        | 边缘缓存 TTL                | **1 个月**                        | 同上         |
      | 3      | `*lqhstudy.online/images/*` | 缓存级别                    | **Cache Everything**              | 图片长期缓存 |
      | 3      | 同上                        | 边缘缓存 TTL                | **1 个月**                        | 同上         |

      > 把 `lqhstudy.online` 换成你自己的域名。若静态资源在 `/assets/` 等路径，把 `css`、`js`、`images` 改成对应目录即可。

    - **如果 3 条额度不够，合并成 1 条（省额度写法）**

      | URL 匹配模式                                                           | 设置项                           | 值                   |
      | :--------------------------------------------------------------------- | :------------------------------- | :------------------- |
      | `*lqhstudy.online/*.{css,js,png,jpg,jpeg,gif,webp,svg,ico,woff,woff2}` | 缓存级别                         | **Cache Everything** |
      | 同上                                                                   | 边缘缓存 TTL                     | **1 个月**           |
      | 同上                                                                   | 浏览器缓存 TTL Browser Cache TTL | **4 小时**（或按需） |

      这样 1 条规则覆盖所有静态资源，剩余 2 条可留给其他需求（如强制 HTTPS、www 跳转等）。

    - **HTML 页面要不要缓存？**

      | 场景                     | 建议                                                                     |
      | :----------------------- | :----------------------------------------------------------------------- |
      | 纯静态博客，很少改内容   | 可对 `*lqhstudy.online/*` 设 Cache Everything，Edge TTL **2 小时～1 天** |
      | 经常 `git push` 更新文章 | **不要**给 HTML 设长期缓存；只缓存 css/js/images，HTML 走默认策略即可    |
      | 有登录 / 后台 / API      | 对 `/api/*`、后台路径单独设 **绕过缓存 Bypass**                          |

    - **操作步骤（以静态资源规则为例）**
      1. 进入 **规则 / Rules** → **页面规则 / Page Rules** → 点击 **创建页面规则 / Create Page Rule**
      2. **URL** 填入：`*lqhstudy.online/css/*`（换成你的域名和路径）
      3. 点击 **+ 添加设置**，选择 **缓存级别** → 选 **缓存所有内容 / Cache Everything**
      4. 再 **+ 添加设置** → **边缘缓存 TTL** → 选 **1 个月**
      5. 点击 **保存并部署 / Save and Deploy**
      6. 按同样方式创建 `js`、`images` 规则（或合并为 1 条通配规则）
      7. 规则按列表从上到下匹配，**更具体的规则放上面**

    - **验证缓存是否命中**
      - 第一次访问某 CSS 文件，响应头 `cf-cache-status` 多为 `MISS` 或 `EXPIRED`（回源拉取）
      - 刷新后再访问，应变为 `HIT`（边缘节点直接返回，不再回源）
      - 若一直是 `DYNAMIC` 或 `BYPASS`，检查规则 URL 是否写错、是否开启了绕过缓存

    - **常见坑**
      - Page Rules 免费只有 3 条，**先配静态资源**，别浪费在「全站一条」上
      - URL 模式区分大小写，路径要和 Hexo 生成目录一致（如 `/css/`、`/js/`、`/images/`）
      - 更新静态资源后若用户看到旧版，可在 **缓存 / Caching** → **配置** → **清除缓存** 里做「清除所有内容」
      - 新版控制台还有 **缓存规则 Cache Rules**（更灵活），免费计划也够用；Page Rules 够用时不必强行迁移
