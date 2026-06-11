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

### 🌐 Cloudflare —— 开发平台

Cloudflare 最早很多人知道它是 CDN、DNS、防护服务（抗 DDoS）。现在已经发展成一个完整的开发平台，核心思路是：**把计算能力放到离用户更近的位置运行，而不是集中在几台中心服务器上。**

**传统模式 vs Cloudflare 模式：**

| <div style="width:70px">维度</div> | 传统模式                                                                    | Cloudflare 模式                                                                          |
| ---------------------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| 请求路径                           | 用户 → 服务器（东京/新加坡/美国）→ 数据库                                   | 用户 → 最近的边缘节点 → Worker → 数据库/存储                                             |
| 延迟                               | 如果用户在北京，而服务器在美国，请求要跨洋，延迟可能 200ms+，高峰时期可能堵 | 就近处理，延迟大幅降低（不用关心“服务器在哪台机器”，部署后，代码自动出现在全球边缘节点） |
| 运维                               | 自己维护服务器、扩容、负载均衡                                              | 零运维，部署即上线                                                                       |
| 适合场景                           | 大型后台系统、复杂数据库、AI 训练任务                                       | 博客、工具站、API、个人 SaaS                                                             |

> Cloudflare 不是“全面替代服务器”，而是**另一种架构选择**——省掉运维，降低复杂度。

很多开发者现在会说：**“全栈部署到 Cloudflare”**，通常意思就是前端（React/Next）+ Workers + D1 + R2 整个应用都跑在 Cloudflare 上，而不是需要租 VPS 自己去维护服务器，**自然进入“全栈”状态，而不是停留在纯前端**。

### ⚡ Workers —— 代码运行

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

### 💾 D1 —— 数据库

- D1 是 Cloudflare 的 SQL 数据库服务。底层核心是 **SQLite**。但它不是把 SQLite 文件放在本地，而是 Cloudflare 帮你托管、同步
- Worker 可以直接查询：

  ```javascript
  const result = await env.DB.prepare("SELECT * FROM users").all();
  ```

  - Worker ≈ Node 后端
  - D1 ≈ MySQL/PostgreSQL (但是 D1 更偏轻量)

### 📁 R2 —— 文件存储

- R2 是 Cloudflare 的对象存储（Object Storage）
- 用于存储：
  - 图片
  - 视频
  - PDF
  - 上传文件
  - 静态资源
- Worker 可以直接查询：

  ```javascript
  await env.R2.put("avatar.png", file);
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

### 🔧 Wrangler —— 开发/部署工具

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

### 📦 Cloudflare 核心产品一览

| 产品           | 定位                   | 类比                         | 免费额度                 |
| -------------- | ---------------------- | ---------------------------- | ------------------------ |
| **Workers**    | 代码运行（Serverless） | 后端服务器 / Node.js         | 每天 10 万次请求         |
| **Pages**      | 静态网站托管 + CI/CD   | Vercel / Netlify             | 无限部署，无限带宽       |
| **D1**         | 关系型数据库（SQLite） | MySQL / PostgreSQL（轻量版） | 500MB 存储，500万行读/天 |
| **R2**         | 对象存储（文件/图片）  | AWS S3（但出流量免费）       | 10GB 存储，免出流量费    |
| **KV**         | 键值对存储（全球缓存） | Redis                        | 10万次读/天              |
| **Wrangler**   | 本地开发 + 部署 CLI    | npm / 项目管理工具           | 免费工具                 |
| **CDN / DNS**  | 全球加速 + 域名解析    | 国内 CDN + 阿里云 DNS        | 免费                     |
| **DDoS / WAF** | 安全防护               | 云盾 / 防火墙                | 免费无限量               |

> 四件套核心组合：**Pages（前端）+ Workers（后端）+ D1（数据库）+ R2（存储）** → 零成本跑完整全栈应用

---

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

---

### 🚀 第一阶段：先把"部署网站"跑通

> 不碰数据库，不碰后端，只学会把项目放到 Cloudflare，周期：1-2 天

#### 📝 注册 [Cloudflare](https://dash.cloudflare.com/login)

- 使用 GitHub 或 邮箱+密码 登录 (我直接用验证完真人，选择点击 Github 登录)
  <img src="/images/Cloudflare/cloudflare_login.png" alt="image" class="max400 border1"/>
  <img src="/images/Cloudflare/cloudflare_login2.png" alt="image" class="max400 border1"/>
  <img src="/images/Cloudflare/cloudflare_default.png" alt="image" class="max700 border1"/>

#### 📁 准备一个 HTML 项目 (Github)

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

#### 🔗 Cloudflare Pages 绑定 GitHub 自动部署

> 部署一个 HTML 项目到 Cloudflare Pages，绑定 GitHub 自动部署

- 登录 Cloudflare → 进入 Workers & Pages → 选择 Create → 选择 Pages → 选择 Connect to Github → 选择todolist项目(第一次会要求授权 GitHub) → 部署
  <img src="/images/Cloudflare/project_html_c.png" alt="image" class="max700 border1"/>
  <img src="/images/Cloudflare/project_html_deploy.png" alt="image" class="max400 border1"/>
- 等待几秒部署完成
  - 这里就是可以访问的链接`https://项目名.账号ID.workers.dev`，也可以自己购买域名进行更换
    <img src="/images/Cloudflare/project_html_link.png" alt="image" class="max500 border1"/>
  - 继续等待几十秒刷新链接 https://todolist.2933213867.workers.dev/
    <img src="/images/Cloudflare/project_html_link1.png" alt="image" class="max500 border1"/>

#### 🔄 尝试改代码自动更新

> git push → GitHub → Cloudflare Pages → **自动构建** → 网站更新

- 修改代码，git push 到远程仓库
- 然后回 Cloudflare/计算/Workers & Pages/todolist/部署界面，可以看到部署正在进行（Building.../Deploying.../Success）
- 等待十几秒～几十秒，再刷新链接，成功
  <img src="/images/Cloudflare/project_html_link2.png" alt="image" class="max500 border1"/>

---

### ⚡ 第二阶段：开始学 Workers

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

#### 🚀 **部署线上**

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

---

### 💾 第三阶段：加数据库 D1

> 周期：3-7 天

#### 💾 **创建 D1 数据库**

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

#### 📊 **创建表/数据**

- 可以在项目中写一个 xxx.sql 文件 (包含建表、插入几条初始数据...)
  - 然后执行脚本命令 `npx wrangler d1 execute todolist --local --file=xxx.sql` 即可
- 当然也可以直接点击 Cloudflare/D1/todolist/探索数据 去操作建表/增删改查真实数据
  <img src="/images/Cloudflare/cloudflare_d1_2.png" alt="image" class="max700 border1"/>

#### 🔄 **todolist 的增删改查接口，使用真实数据**

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

#### 🔌 接口地址使用

- https://todolist-worker.2933213867.workers.dev/ 这个接口基地址 + 几个接口的相关使用给到前端项目
  - 前端项目：纯静态的 HTML 项目 git@github.com:lqh1003/todolist.git
  - 改成 vite 项目，且调用后端接口，本地运行正常：
    <img src="/images/Cloudflare/cloudflare_d1_3.png" alt="image" class="max700 border1"/>
  - 此时项目已经变成 vite 项目了，代码推送前，先在 Cloudflare 修改一下 todolist 的打包命令 (之前纯静态项目打包命令为空，现在vite项目 打包命令是`npm run build`)
    <img src="/images/Cloudflare/cloudflare_d1_4.png" alt="image" class="max700 border1"/>

  - 修改完成之后，推送代码到远程`git pull`
    - Cloudflare / Workers 和 Pages / todolistz 在自动构建，等待构建完成
    - 打开线上链接`https://todolist.2933213867.workers.dev/`可以访问了 (vite 项目 + 接口 + D1数据)

---

### 📁 第四阶段：加 R2 文件上传

> 周期：2-3 天，只需要创建 R2 桶，在 worker 项目wrangler.jsonc中进行配置，就可以直接通过 `env.R2` 操作了

#### 📁 创建 R2 存储桶

- Cloudflare 账号，**首次创建** R2 桶，需要先开通 / 激活
  - Cloudflare 目前主要支持：
    - Visa 卡 (我使用的是平安银行 Visa 卡)
    - Mastercard
    - American Express

  <img src="/images/Cloudflare/r2_step_1.png" alt="image" class="max800 border1"/>
  <img src="/images/Cloudflare/r2_step_2.png" alt="image" class="max700 border1"/>

- Cloudflare → 左侧导航栏 存储和数据/R2对象存储/概述 → 新建R2桶，输入 todolist-uploads
  <img src="/images/Cloudflare/r2_step_3.png" alt="image" class="max700 border1"/>

- 也可使用命令
  - 关键命令 `npx wrangler r2 bucket create <bucket_name>`
  - 在项目根目录 `todolist-worker` 打开终端：

    ```bash
        # 1. 安装依赖，包括工具 wrangler
        npm install

        # 2. 登录 Cloudflare（需要浏览器授权）
        npx wrangler login

        # 3. 创建 R2 存储桶（文件/头像上传用）
        npx wrangler r2 bucket create todolist-uploads
    ```

    <img src="/images/Cloudflare/r2_step_4.png" alt="image" class="max700 border1"/>

#### 🔗 绑定到 `wrangler.jsonc`

- binding 是变量名，叫 R2、BUCKET、UPLOADS 都可以

  <img src="/images/Cloudflare/r2_step_5.png" alt="image" class="max500 border1"/>

#### 📤 Worker 实现上传/下载接口

> `env.R2` 对应 `wrangler.jsonc` 里绑定的 R2 存储桶，名称要与 `binding` 字段一致。 关键命令：`env.R2.put()`上传 / `env.R2.get()`下载

- 上传 /api/upload
  - 把前端上传的文件 file 进行处理
    - 处理文件，const resolved = resolveUploadType(file)
    - 组装成一个路径key：`uploads/${crypto.randomUUID()}.${resolved.ext}`
      - uploads 是在 R2 桶中的文件目录
      - 后面一节存储在 R2 桶中的文件名称
      - env.R2.put 把文件上传到 R2 桶 (关键)

    - 返回完整 url 给前端，`${url.origin}/api/files/${key}`
      - https://todolist-worker.2933213867.workers.dev/api/files/uploads/27e65672-a89e-491e-99da-a6b42468e5fb.jpg
      - https://todolist-worker.2933213867.workers.dev 后端服务接口基地址
      - /api/files 下载/获取文件的接口
      - /uploads/27e65672-a89e-491e-99da-a6b42468e5fb.jpg 存储在 R2 桶中的位置

- 下载 /api/files
  - 接口 return `${url.origin}/api/files/${key}`;

#### 💻 前端对接

- 前端操作：上传文件成功后，返回完整资源链接 url: https://xxx/api/files/uploads/xxxxx
- 前端拿到数据直接展示资源，把资源链接作为字段存进 todos 表

#### 自定义资源域名

> 想要自定义资源域名，可以公开访问 R2 文件，**不经过 worker** (通过下载接口拼接冗长的接口基地址)

- 公开访问 R2 资源配置：
  - 登录 Cloudflare → R2对象存储 → 找到`todolist-uploads` → 设置 → 设置两个地方 (不过前提是：域名已经按照阶段六的步骤接入了)
    <img src="/images/Cloudflare/r2_step_6.png" alt="image" class="max700 border1"/>
  - 设置成功之后，直接访问资源：
    - https://file.lqhstudy.online/uploads/3d6fddf4-3a3a-464e-aa0b-6405e6e409f2.jpg

- Worker 项目拼接的资源地址换一下
  - 在 wrangler.jsonc 配置一下变量
  - 在上面提到的上传接口中返回完整 url 资源路径的逻辑：改成有`R2_PUBLIC_URL`就拼接这个，没有就按照原逻辑，将改动`npm run deploy`部署上线
    <img src="/images/Cloudflare/r2_step_7.png" alt="image" class="max700 border1"/>

  - 这样前端上传文件操作，返回的 url 就是 https://file.lqhstudy.online 拼接的了，存储到todos表也是 https://file.lqhstudy.online/xxx/xxx 的资源格式链接了
    <img src="/images/Cloudflare/r2_step_9.png" alt="image" class="max900 border1"/>

---

### 🏗️ 第五阶段：做一个完整项目

> 周期：1–2 周。把前四阶段全部串联，部署一个真正可对外使用的应用。

#### 🏗️ 整体架构

```
用户浏览器
    ↓  HTTPS
Cloudflare CDN（全球边缘加速）
    ↓
Pages（前端 HTML/JS）  ←→  Worker API（后端逻辑）
                                ↓           ↓
                               D1          R2
                           （数据库）    （文件存储）
```

### 🌍 第六阶段：域名接入

> 把域名加入到 Cloudflare 账户，受 Cloudflare 保护

#### 🌐 添加域名

- 登录Cloudflare账号 → 域名/概览 → 添加域名 → 已有域名选择`连接域名`，没有选择`注册域名`
  <img src="/images/Cloudflare/add_domains1.png" alt="image" class="max500 border1"/>
  <img src="/images/Cloudflare/add_domains2.png" alt="image" class="max500 border1"/>

- **注册域名**，输入想要的域名，选择购买，填写对应的信息，支付金额即可
  - 但是 Cloudflare Registrar 域名结账**原生无 Alipay 入口**，只支持 4 类支付：
    - VISA/Master/AE 双币信用卡、银联国际卡
    - PayPal（最常用中转）
    - Apple Pay（仅苹果设备单次付款，不能自动续费域名）
    - 企业合同对公（个人用不了）

  <img src="/images/Cloudflare/add_domains3.png" alt="image" class="max500 border1"/>

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

    5. 绑定域名之后的连接更稳定和美观了，之前的链接 https://xxx.xxx/workers.dev 动不动就报错 500 (网络异常加载失败)

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

---

## 📌 [Cloudflare](https://www.cloudflare.com/zh-cn/)、[AWS](https://aws.amazon.com/cn/)、[GCP](https://cloud.google.com/?hl=zh-cn) 全面对比

> 三者并不是竞争关系，更多时候是"各擅其长"，可以组合使用。理解它们的定位差异，才能在技术选型时做出合理决策。

---

### 一、🏷️ 整体定位

| 维度             | Cloudflare                 | AWS（Amazon Web Services）  | GCP（Google Cloud Platform）  |
| ---------------- | -------------------------- | --------------------------- | ----------------------------- |
| 公司背景         | Cloudflare（独立公司）     | Amazon 旗下                 | Google 旗下                   |
| 诞生时间         | 2010 年                    | 2006 年                     | 2008 年                       |
| 核心出身         | CDN、安全防护、边缘网络    | 云计算基础设施（IaaS/PaaS） | Google 内部大规模基础设施外化 |
| 全球节点         | 330+ 边缘 PoP（覆盖极广）  | 30+ 大区（Region）          | 40+ 大区（Region）            |
| 市场份额         | 较小但增长快，CDN 市场第一 | 全球云计算第一（~33%）      | 全球云计算第三（~11%）        |
| 定价模式         | 慷慨的免费套餐 + 按量计费  | 按量计费，免费层较少        | 按量计费，免费层居中          |
| 学习曲线         | 低（概念简洁，文档友好）   | 高（服务繁多，概念复杂）    | 中等                          |
| 独立开发者友好度 | ⭐⭐⭐⭐⭐                 | ⭐⭐⭐                      | ⭐⭐⭐⭐                      |
| 企业采用率       | 中                         | ⭐⭐⭐⭐⭐                  | ⭐⭐⭐⭐                      |

---

### 二、📦 核心产品对比

| 能力类别               | Cloudflare                             | AWS                       | GCP                         |
| ---------------------- | -------------------------------------- | ------------------------- | --------------------------- |
| **计算（Serverless）** | Workers（边缘 JS/TS/WASM，冷启动 0ms） | Lambda（标准 Serverless） | Cloud Functions / Cloud Run |
| **计算（虚拟机）**     | ❌ 无                                  | EC2                       | Compute Engine              |
| **容器**               | ❌ 无                                  | ECS / EKS（Kubernetes）   | GKE（Kubernetes，业界标杆） |
| **对象存储**           | R2（无出流量费！）                     | S3（出流量收费）          | GCS（出流量收费）           |
| **关系型数据库**       | D1（SQLite，边缘，免费层大）           | RDS / Aurora              | Cloud SQL / AlloyDB         |
| **KV 存储**            | Workers KV（全球复制，最终一致）       | DynamoDB / ElastiCache    | Firestore / Bigtable        |
| **CDN**                | 核心产品，全球最快之一                 | CloudFront                | Cloud CDN                   |
| **DNS**                | 极快 DNS（1.1.1.1），免费              | Route 53（收费）          | Cloud DNS（收费）           |
| **DDoS 防护**          | 免费无限量防护                         | AWS Shield（付费）        | Cloud Armor（付费）         |
| **AI 推理**            | Workers AI（边缘推理，GPU 节点）       | SageMaker / Bedrock       | Vertex AI                   |
| **消息队列**           | Queues                                 | SQS / SNS / EventBridge   | Pub/Sub                     |
| **静态站点托管**       | Pages（CI/CD 一体，免费）              | S3 + CloudFront           | Firebase Hosting            |
| **实时通信**           | Durable Objects（WebSocket 状态保持）  | API Gateway WebSocket     | ❌ 无原生等价               |
| **邮件服务**           | Email Routing（免费转发）              | SES                       | ❌ 无原生邮件发送           |
| **访问控制/零信任**    | Access / ZTNA（Zero Trust 领先）       | IAM + Cognito             | Cloud IAM + BeyondCorp      |

---

### 三、⚖️ 优缺点对比

| 对比项         | Cloudflare                                       | AWS                                              | GCP                                       |
| -------------- | ------------------------------------------------ | ------------------------------------------------ | ----------------------------------------- |
| **核心优势**   | 边缘低延迟、安全免费内置、免费层慷慨、零运维     | 服务最全（200+）、生态最成熟、企业合规证书最齐全 | AI/ML 领先、BigQuery 数仓最强、GKE 最原生 |
| **最大劣势**   | 无虚拟机/容器，不能跑长时任务（> 30s）、复杂后端 | 定价复杂，账单容易超支，学习曲线陡               | 市场份额最小，部分地区无 Region           |
| **数据库**     | D1（SQLite），不适合高并发大型场景               | RDS / Aurora，强但配置复杂                       | Cloud SQL / AlloyDB，强但非云原生设计     |
| **计算限制**   | Worker 单次 CPU 上限（免费 10ms，付费 30s）      | 无明显上限                                       | 无明显上限                                |
| **中国大陆**   | 部分功能有限制                                   | 无中国 Region（北京/宁夏独立合规）               | 无中国 Region                             |
| **生态成熟度** | 相对新，第三方集成少                             | 最丰富                                           | 比 AWS 少，K8s 生态共享                   |

---

### 四、💰 费用直观对比（以常见场景为例）

| 场景                       | Cloudflare                              | AWS                                              | GCP                                     |
| -------------------------- | --------------------------------------- | ------------------------------------------------ | --------------------------------------- |
| 100GB 存储 + 1TB 出流量/月 | R2：约 **$1.5**（仅存储费，出流量免费） | S3：约 **$111**（存储 $2.3 + 流量 $92 + 请求费） | GCS：约 **$82**（存储 $2.6 + 流量 $80） |
| 每月 100 万次 API 请求     | Workers：**免费**（每天 10 万免费）     | Lambda + API GW：约 **$4.5**                     | Cloud Functions：约 **$4**              |
| 静态网站托管               | Pages：**永久免费**                     | S3 + CloudFront：约 **$3–10/月**                 | Firebase Hosting 有免费层，超出收费     |
| 小型 SQLite 数据库         | D1：**免费**（500MB）                   | RDS MySQL 最低配：约 **$15/月**                  | Cloud SQL 最低配：约 **$10/月**         |

> R2 的无出流量费是 Cloudflare 最大的"杀手锏"之一，对图片/视频类应用节省显著。

---

### 五、🎯 适用场景对比（决策参考表）

| 项目类型                                    | 推荐平台       | 推荐产品              | 关键原因                           |
| ------------------------------------------- | -------------- | --------------------- | ---------------------------------- |
| 个人博客 / 静态网站                         | **Cloudflare** | Pages                 | 免费、全球 CDN、自动 CI/CD，最简单 |
| 个人 API / 小工具 / SaaS MVP                | **Cloudflare** | Workers + D1 + R2     | 免费层够用，边缘低延迟，零运维     |
| 需要长时任务（> 30s）/ 复杂后端（成本敏感） | **AWS**        | Lambda + EC2          | 弹性伸缩，按量付费，生态完善       |
| 需要容器化部署                              | **GCP / AWS**  | Cloud Run / ECS       | Cloud Run 最简单；ECS 最成熟       |
| AI 轻量边缘推理                             | **Cloudflare** | Workers AI            | 边缘节点就近推理，延迟极低         |
| AI 大模型训练 / 微调                        | **GCP / AWS**  | Vertex AI / SageMaker | GPU 资源丰富，训练框架完整         |
| 大数据分析 / 数仓                           | **GCP**        | BigQuery              | 业界最强云数仓，PB 级秒出结果      |
| 企业级 / 需要合规证书                       | **AWS**        | 全套服务              | SOC2 / HIPAA / ISO 等认证最齐全    |
| Kubernetes 应用                             | **GCP**        | GKE                   | K8s 发源地，托管最原生             |
| 大量文件 / 媒体存储                         | **Cloudflare** | R2                    | 无出流量费，省钱显著               |
| 零信任安全 / 内网穿透                       | **Cloudflare** | Access / Tunnel       | 免费，行业领先                     |

---

### 六、🛠️ CLI 工具对比

| 平台           | 工具名     | 安装方式            | 常用命令示例                              |
| -------------- | ---------- | ------------------- | ----------------------------------------- |
| **Cloudflare** | `wrangler` | `npm i -g wrangler` | `wrangler deploy` / `wrangler d1 execute` |
| **AWS**        | `aws cli`  | 下载安装包          | `aws s3 cp` / `aws lambda invoke`         |
| **GCP**        | `gcloud`   | 下载安装包          | `gcloud run deploy` / `gsutil cp`         |

- Wrangler 是三者中最简洁的，命令语义直白
- AWS CLI 功能最全但参数繁多，很多人依赖 `aws configure` 配置多账号
- gcloud 设计较现代，但 Google 产品名改来改去，文档有时容易混淆

---

### 七、⚠️ 常见误区澄清

**❌ 误区一："Cloudflare 可以完全替代 AWS"**

**实际情况：** 不能。Cloudflare 没有虚拟机，无法跑需要长时间执行的任务（如视频转码、AI 训练、定时脚本超过 30 秒）。两者定位不同，Cloudflare 擅长**边缘轻量计算**，AWS 擅长**重型后端基础设施**。

**❌ 误区二："AWS 最贵，Cloudflare 最便宜"**

**实际情况：** AWS 有大量免费层，合理使用并不贵。反过来，Cloudflare 的付费计划（Pro $20/月，Business $200/月）对某些场景也不便宜。关键是**用对场景**：

- 静态资源大量出流量 → Cloudflare R2 便宜很多
- 复杂后端微服务 → AWS 按量付费反而更划算

**❌ 误区三："GCP 就是 Google，所以 YouTube、Gmail 数据都在上面"**

**实际情况：** Google 自己的产品（Gmail、YouTube、Search）运行在 Google 内部基础设施上，和对外售卖的 GCP 是**物理隔离**的不同系统。GCP 是将 Google 的技术**对外商业化**的产品。

**❌ 误区四："Cloudflare Workers 就是 Node.js"**

**实际情况：** Workers 运行在 **V8 引擎**（和 Chrome 同款）上，但**不是 Node.js**。它没有 `fs`（文件系统）、`net`（原生 TCP）、`child_process` 等 Node.js 模块。只支持 Web 标准 API（fetch、Request、Response、crypto 等）。如果你的代码依赖 Node.js 特有模块，需要改造或换平台。

**❌ 误区五："用了 Cloudflare 就安全了"**

**实际情况：** Cloudflare 能防 DDoS、过滤恶意请求，但：

- 应用层漏洞（SQL 注入、XSS）需要开发者自己修
- 源站 IP 泄露后 Cloudflare 的防护失效
- WAF 规则需要正确配置才能生效
- 安全是多层防御，Cloudflare 是其中一层，不是全部

---

### 八、📚 初学者推荐的学习路径

|    步骤    | 【CF】前端/独立开发者                           | 【AWS】后端/云原生                                   | 【GCP】AI/数据工程                                        |
| :--------: | ----------------------------------------------- | ---------------------------------------------------- | --------------------------------------------------------- |
|   **1**    | 注册 Cloudflare 账号（免费）                    | 完成 AWS 免费层的 EC2 入门（起一台虚拟机，SSH 进去） | 注册 GCP，领取 $300 免费额度                              |
|   **2**    | 用 Cloudflare Pages 部署一个静态网站（10 分钟） | 学 S3 存储桶的基本操作                               | 用 BigQuery 跑一个公开数据集的 SQL 查询（体验秒级大数据） |
|   **3**    | 写一个 Workers Hello World（5 分钟）            | 写一个 Lambda 函数，配上 API Gateway                 | 用 Cloud Run 部署一个容器应用                             |
|   **4**    | 用 Wrangler 创建 D1 数据库，写一个简单 CRUD API | 学 IAM 权限管理（这是 AWS 最核心也最难的部分）       | 接触 Vertex AI 的 API，调用 Gemini 模型                   |
|   **5**    | 把静态资源上传到 R2，体验无流量费存储           | 了解 VPC 网络隔离基础                                | —                                                         |
| **完成后** | 理解了"边缘计算全栈"是什么感觉                  | 具备完整后端 + 云基础能力                            | 具备 AI 应用 + 大数据分析能力                             |

---

### 九、✅ 总结

> 三者不是互相替代，而是互补——选对工具比选贵工具更重要。

| 平台           | 一句话定位                                        | 典型用户                                        |
| -------------- | ------------------------------------------------- | ----------------------------------------------- |
| **Cloudflare** | "把应用放到离用户最近的地方跑，安全免费省心"      | 独立开发者、个人项目、初创团队                  |
| **AWS**        | "你需要什么我都有，企业级，但请做好预算管理"      | 中大型企业、后端工程师、需要合规的业务          |
| **GCP**        | "我是 Google 基础设施的外化，AI 和数据是我的主场" | 数据工程师、AI 团队、深度使用 Kubernetes 的团队 |

**常见组合：**

- **个人 / 独立开发者**：`Cloudflare Pages` + `Workers` + `D1` + `R2` → 近乎零成本跑完整应用
- **创业公司**：`Cloudflare`（CDN + 安全 + 边缘 API） + `AWS`（数据库 + 后端服务） → 最佳性价比
- **AI 产品**：`Cloudflare Workers AI`（边缘轻量推理） + `GCP Vertex AI`（大模型训练/推理）
- **大型企业**：多云架构，AWS 主力 + GCP 数据分析 + Cloudflare 做统一网络入口和安全层
