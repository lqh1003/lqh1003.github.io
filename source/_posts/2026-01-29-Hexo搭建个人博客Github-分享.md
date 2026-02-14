---
title: Hexo搭建个人博客Github-分享
date: 2026-01-29 10:56:54
tags:
    - hexo
    - github
    - Github Pages
categories: Hexo
cover: /images/Hexo搭建个人博客Github-分享/cover.png # 封面图
---

## 🚀 搭建个人博客的方案有哪些？
### 🔹1. 快速搭建方案🔹
主流静态博客框架，用现成框架，零基础友好，无需复杂环境，几分钟就能跑起来

| 框架       | 特点                                             | 适合人群                    |   快速初始化命令                                                       |
| :--------- | :---------------------------------------------- | :------------------------- | :--------------------------------------------------------------------- |
| VitePress  | 基于 Vite，速度快，Vue 语法，配置简单，支持 AI 插件 | 懂一点 Vue，想要轻量简约博客 | `pnpm create vitepress my-blog; cd my-blog; pnpm install`             |
| ✅ Hexo    | 生态最丰富，主题多，文档全，部署简单               | 纯新手，想要快速出效果       | `npm install -g hexo-cli; hexo init my-blog; cd my-blog; npm install` |
| Gatsby     | 基于 React，性能极致，支持 GraphQL，拓展性强       | 懂 React，想要个性化定制     | `npm init gatsby my-blog; cd my-blog; npm run develop`                |
| Hugo       | 基于 Go，打包速度极快（毫秒级），无需 Node.js      | 追求极致速度，不想装 Node.js | 官网下载二进制包，直接 `hugo new site my-blog`                           |


### 🔹2. 自定义开发🔹
从零搭建代码，适合有开发基础，需要配置前端/后端/数据库基础环境，适配个性化开发需求
+ **通用环境**
    - Node.js + npm/pnpm（前端开发必备，也可做 Node.js 后端）；
    - Git（版本控制 + 部署）；
    - 代码编辑器：Cursor/VS Code（前端）、IDEA/PyCharm（后端，可选）；
    - 终端工具：Windows 用 Windows Terminal，macOS/Linux 用系统终端，方便执行命令
+ **前端环境（选一个框架，博客前端以轻量为主）**
    - Vue3 + Vite
    - React + Vite
    - 原生 HTML/CSS/JS
+ **后端环境（选一个语言 / 框架，个人博客推荐轻量后端）**
    - Node.js + Express/Koa
    - PHP + Laravel/ThinkPHP
    - Python + FastAPI/Django
    - Java + Spring Boot
+ **数据库环境（选一个，个人博客推荐轻量型，无需复杂配置）**
    - MySQL/MariaDB 关系型数据库
    - MongoDB 非关系型（文档型）
    - SQLite 轻量关系型
+ **辅助工具**
    - 接口调试：Postman/ApiFox
    - 数据库管理：Navicat/DBeaver（可视化操作 MySQL/MongoDB，比命令行友好）、SQLite Studio（SQLite 专用）
    - 跨域调试：VS Code 插件 CORS Everywhere，或后端配置 Cors 跨域
    - 本地服务代理：Nginx（本地模拟生产环境，配置前端 / 后端反向代理）

## 📚 Hexo搭建个人博客需要哪些知识储备？
+ 零基础，只需要会根据步骤安装环境、搭建项目即可，对搞开发的来说更简单
+ `Markdown`语法，这个在写 .md 文档的过程中慢慢累积就行

## 🎈开发环境准备
Windows/macOS/Linux 三大系统，以下都是Windows系统的安装流程。

### 🔹Node.js + npm/yarn/pnpm🔹
+ Node.js 核心运行环境，静态框架的依赖
+ **安装 [Node.js](https://nodejs.org/en/download/)**
    - 一键安装（默认配置，全程Next）
        + 双击下载的.msi安装包，弹出安装向导，点击Next；
        + 勾选「I accept the terms in the License Agreement」（同意协议），点击Next；
        + 选择安装路径（默认C:\Program Files\nodejs\，无需修改，新手直接下一步），点击Next；
        + 保持默认配置（所有选项都勾选，尤其是Add to PATH，**自动配置环境变量**），点击Next；
        + 无需勾选「Tools for Native Modules」，直接点击Next→Install，等待安装完成；
        + 安装结束后点击Finish。
    - 验证是否安装成功
        + 按下Win+R，输入cmd打开命令提示符
        + 依次输入两个命令，能显示版本号即代表成功
        ```bash
            # 验证Node.js版本
            node -v
            # 验证npm版本（随Node自动安装）
            npm -v
        ```
    - ⚡关键后续配置：替换 npm 国内源
       + 国外npm 源下载依赖速度极慢，甚至失败。为避免卡顿，替换为国内淘宝源/网易源
          + ⭐ <a href="javascript:;" onclick="navigator.clipboard.writeText('https://registry.npmjs.org/')">npm 官方源</a>
            - 特点：官方原版，包最全
            - 适用场景：国外网络 或 需安装最新包时
          + ⭐ <a href="javascript:;" onclick="navigator.clipboard.writeText('https://registry.npmmirror.com/')">淘宝源（npmmirror）</a>
            - 特点：国内最稳定
            - 适用场景：国内网络（首选，替代旧淘宝源）
          + ⭐ <a href="javascript:;" onclick="navigator.clipboard.writeText('https://registry.npm.163.com/')">网易源</a>
            - 特点：国内稳定，备用选择
            - 适用场景：淘宝源访问卡顿 / 失败时备用

       + 打开终端/CMD，执行以下命令
        ```bash
            # 配置淘宝源
            npm config set registry https://registry.npmmirror.com/
         ```
       + 验证源是否成功
        ```bash
            npm config get registry
        ```
    - 可选：安装 pnpm（比 npm/yarn 更快，推荐）
    ```bash
      # 全局安装pnpm
      npm install -g pnpm
      # 验证安装
      pnpm -v
    ```

### 🔹Git (版本控制 + 部署必备)🔹
+ 管理博客源码，推送到 GitHub 实现免费部署
+ 安装 Git 
    + 下载安装包，打开 [Git 官网](https://git-scm.com/install/windows)，自动适配 64 位，直接下载最新稳定版
    + 一键安装：双击 .exe 包，全程默认配置（关键确保勾选「Add Git to PATH」，让 CMD/编辑器能调用 Git），一路「Next」→「Install」
    + 验证安装：打开 CMD/Git Bash，输入 `git --version`，输出版本号即成功

### 🔹开发工具 Cursor🔹
+ 安装 [Cursor](https://nodejs.org/en/download/)
    + 官网首页点击**Download for Windows**，自动下载最新稳定版（.exe格式，适配 64 位 Windows 10/11）
    + 一键安装（默认配置，全程Next）
        + 双击下载的.exe安装包，弹出安装向导，点击Next；
        + 勾选「I accept the agreement」（同意协议），点击Next；
        + 选择安装路径（默认C:\Users\你的用户名\AppData\Local\Programs\Cursor\，新手无需修改），点击Next；
        + 保持默认组件（勾选「Create a desktop shortcut」创建桌面快捷方式），点击Next；
        + 直接点击Install，等待 1-2 分钟安装完成；
        + 安装结束后，勾选「Run Cursor」，点击Finish启动编辑器
    + 验证安装：桌面出现Cursor 图标，双击能正常打开编辑器界面，即安装成功

## 💻 博客搭建
+ 安装博客框架 hexo 脚手架
  ```bash
      # 全局安装Hexo脚手架（首次搭建必装，仅需执行1次）
      npm install -g hexo-cli
      # 验证Hexo安装成功
      hexo -v
  ```
+ 搭建博客项目
  ```bash
      # hexo init 博客目录名
      hexo init my-blog
      cd my-blog
      npm i
      hexo s   # 启动本地预览博客,实时看效果
      hexo s -p 5000   # 指定端口
  ```
- 默认的项目目录结构，有一篇默认的"`hello-world.md`"博客
  ![](/images/Hexo搭建个人博客Github-分享/hexo_1.png)
- 本地预览效果
  ![](/images/Hexo搭建个人博客Github-分享/hexo_preview.png)


## 📊 博客部署
### 🔹为什么选 Github 托管服务🔹
**代码托管平台**：Gitee、极狐GitLab、Github、腾讯云Coding ...
- **🌐 Gitee**
  - **Gitee 的版本结构**
    - ✅ Gitee 社区版（免费）：SaaS 在线服务（在线账号），永久免费，个人/小团队用
    - Gitee 专业/企业版（付费）：SaaS 在线服务（在线账号），付费订阅，团队/企业用
    - Gitee 私有化部署版：企业专属，付费定制，**自己服务器安装**
      - Gitee 官方提供的私有化部署软件包，企业购买后在自己服务器安装、运维
  - **Gitee Pages** 入口：「[gitee.com](https://gitee.com)」，打开一个 Gitee 仓库 → 点击仓库顶部的「服务」→「Gitee Pages」
    - Gitee Pages 是完全免费的
    - Gitee Pages 2024.05 已暂停服务，无法使用
    - ❌ 2025 年底起，**Gitee Pages（功能已下线）**，仓库顶部「服务」菜单里不再有「Gitee Pages」选项
  - **Gitee 的腾讯云托管**，适合替代已下线的「Gitee Pages」
    - 2020-09-29 腾讯云托管服务正式集成到 Gitee 平台，在仓库页面「服务」菜单中出现入口
    - 是收费的，但是有免费额度
      - 👉 Hexo 静态博客：正常访问量下，基本可以长期免费使用
      - 超出后计费（阶梯价，很便宜），个人博客月均通常 几元到十几元
    - 相比较于 Gitee Pages，需要**腾讯云账号**
  
- **🌐 Gitlab**
  - **Gitlab 的版本结构**
    - ✅ 在线 SaaS 服务 (在线账号)
      - 无需安装、注册即用、官方运维、按订阅付费
      - **无永久免费个人版，仅提供 90 天免费试用**，💰到期需付费或迁移
      - Pages 试用可用，到期需付费，入口：仓库左侧菜单 → 部署 → Pages
    - 下载 GitLab 官方开源软件包，私有化，安装在自己的服务器（云服务器、物理机）上
      - 自托管开源软件：按功能分为 **Free（免费）、Premium（高级）、Ultimate（旗舰）** 三个层级
        - Free（免费）：极狐 GitLab 社区版（CE），永久免费、功能完整、数据自主
        - Premium 层级（付费），高级 CI/CD、代码质量管控，适合中大型团队、企业项目
        - Ultimate 层级（付费，最高级），大型企业、对安全与合规要求高的组织

  - **[gitlab.com](https://gitlab.com) (GitLab 国际版)**
    - 全球版，但是 2025.09.07 已停止向大陆内地提供服务（未迁移账号永久删除），服务器在海外
  - **[gitlab.cn](https://gitlab.cn) / [jihulab.com](https://jihulab.com) (极狐 Gitlab)** 
    - 极狐是 GitLab 在中国的独家授权运营方，服务器在内地
    - 无永久免费个人版，仅提供 90 天免费试用💰
  - **[gitlab.hk](https://gitlab.hk)** — 与极狐 Gitlab 一样的策略，链接不太稳定
    - 极狐 GitLab 面向香港及国际市场，服务器在香港
    - 无永久免费个人版，仅提供 90 天免费试用💰

- **🌐 GitHub**
  - **GitHub 的版本结构**
    - 核心可以总结为：按 “个人/组织”+“免费/付费” 划分，分为 Free（免费）、Team（团队）、Enterprise（企业）三大核心版本，且所有版本都基于 SaaS 模式（无自托管开源版）
  - ✅ GitHub Free（免费版）「[github.com](https://github.com)」
    - 个人开发者、开源项目、小型团队的基础版本，永久免费
    - Github Pages，自动化工作流 Actions 2000 分钟/月，用完流水线暂停至次月重置，对个人足够（比如：部署博客、小项目 CI/CD，单次任务通常几分钟）
  - GitHub Team（团队版，付费）
    - 中小团队、需要高级协作与安全能力的组织，按用户/月订阅
  - GitHub Enterprise（企业版，付费）
    - GitHub Enterprise Cloud（云端 SaaS）
    - GitHub Enterprise Server（自托管版）

### 🔹认识 Hexo 几个常用指令🔹
- `hexo new "我的第一篇Hexo博客"`，简写 `hexo n "xxxx"`
    - 新建博客文章
    - 执行后在`source/_posts/`目录下生成`xxx文章标题.md`文件
- `hexo server`，简写 `hexo s`
    - 本地启动预览服务（开发/写文章时实时查看效果）
    - 执行后终端输出 http://localhost:4000/ ，浏览器打开该地址即可预览博客，修改 Markdown 文章/配置后，浏览器会自动刷新
    - 若端口被占用时，可指定端口启动`hexo s -p 5000`
- `hexo generate`，简写 `hexo g`
    - 打包构建静态文件（部署前必做，生成可上线的 HTML/CSS/JS）
    - 执行后，博客根目录会生成 public/ 文件夹，里面是完整的静态博客文件，后续部署只需将该文件夹推送到 GitHub/Gitee Pages 或上传到云服务器
- `hexo deploy`，简写 `hexo d`
    - 需要先安装 Hexo 部署插件(仅首次执行一次) `npm install hexo-deployer-git -D`
    - 执行后，Hexo 会自动将public/文件夹的静态文件推送到你配置的 Git 仓库，等待 1-2 分钟，即可通过「`用户名.github.io`」访问你的在线博客

### 🔹新建仓库/建立连接🔹
- [github.com](https://github.com) 登录 → 新建仓库 "`用户名.github.io`" → 仓库状态设置为 `public` 状态(必须)
    - 推荐命名为`用户名.github.io`，用于直接通过 `https://用户名.github.io` 访问博客
    - 如果用其他命名，链接会看起来没那么简洁
      - 比如：`hexo-lqh`，最后博客链接是 [https://liqinghua-ty.github.io/hexo-lqh/](https://liqinghua-ty.github.io/hexo-lqh/)

- 建立连接
    - 拉取新仓库到本地 `git clone git@github.com:用户名.github.io.git`
    - 将本地仓库 `my-blog` 的代码复制到新仓库`用户名.github.io`
    - 配置 `_config.yml` 的 `repository` 为新仓库地址
    - 配置 `_config.yml` 的 `url`
      ```bash
        # 配置 url 和 root （绝对不能错！）
        url: https://用户名.github.io  # 不配置线上链接可能排版混乱
        root: /  # 如果需要则可以配置，若博客部署在子目录（如xxx.github.io/blog），填 /blog/
      ```
    - 推荐新建一个`.gitignore`文件，把不必要的更新忽略，比如 `node_modules`、`public`、`.deploy_git`

- 推送本地源代码到远程仓库`git push -f origin main`
    - 【此时】也只是上传了 hexo 博客项目的源代码而已，`https://用户名.github.io` 根本打不开

### 🔹为 Hexo 博客项目配置 GitHub Actions (自动化)🔹
📖 实现 "**在main分支提交 Markdown 源码后，自动生成静态文件并部署到 GitHub Pages，几分钟后可以看到博客内容更新到最新**"

- 准备工作：确保你的 GitHub 仓库中存储的是 Hexo 源码（而非仅 public 静态文件），核心目录/文件包括：

  ```plaintext
    仓库根目录/
    ├── source/ # Markdown 文章（source/_posts/）
    ├── themes/ # 博客主题（如 Next、Butterfly）
    ├── _config.yml # Hexo 全局配置
    ├── package.json # 依赖配置（含 hexo 等依赖）
    └── .github/workflows/ # 后续创建的 Actions 配置目录
  ```
  ![](/images/Hexo搭建个人博客Github-分享/hexo_origin_first_commit.png)

- **开始配置 Github Actions**

  - 在 Hexo 项目根目录，按路径 **`.github/workflows/deploy.yml`** 创建配置文件
    - xxx.yml 文件名可以自定义，**当把本地内容推送到远程仓库，github 会自动识别到`.github/workflows/`这个目录和目录下的 yml 文件**
    - ✅ 推送成功之后，在 Actions 下就可以看见 **commit** 和 **工作流** 记录 (不管是成功的还是失败的)

    ```yml
    name: 部署到GitHub Pages

    # 关键：添加权限配置，允许 Actions 写入仓库内容
    permissions:
      contents: write # 授予写入内容的权限(包括推送分支)

    on:
      push: # 常用事件：push(代码推送)、pull_request(PR 操作)、schedule(定时任务)、workflow_dispatch(手动触发)
        branches: [main] # 推送到main分支时触发

    jobs:
      deploy:
        runs-on: ubuntu-latest # 运行环境(ubuntu-latest(推荐/速度快)/windows-latest/macos-latest)；github提供的虚拟服务器
        steps:
          - name: 拉取 Hexo 源码
            uses: actions/checkout@v4 # 官方动作：拉取仓库代码
            with:
              fetch-depth: 0

          - name: 安装Node.js环境
            uses: actions/setup-node@v4 # 官方动作：配置 Node 环境
            with:
              node-version: 18.x
              cache: 'npm'

          - name: 安装Hexo及项目依赖
            run: |
              npm install -g hexo-cli  # 全局安装 Hexo 命令行工具
              npm install

          - name: 生成静态文件（public 目录）
            run: |
              hexo clean   # 清除缓存和旧静态文件（避免残留问题）
              hexo generate   # 生成新静态文件（输出到 public 目录）

          - name: 将静态文件部署到GitHub Pages分支
            uses: peaceiris/actions-gh-pages@v4 # 第三方动作：简化 Pages 部署with
            with:
              github_token: ${{ secrets.GITHUB_TOKEN }} # 部署授权：使用GitHub内置秘钥(无需手动生成，自动生效)
              publish_dir: ./public  # 待部署的静态文件目录（Hexo 生成的 public 目录）
              publish_branch: gh-pages # 目标分支(GitHub Pages读取的分支，与源分支 main 区分)
              force_orphan: true # 可选：强制创建独立分支，避免历史冲突
    ```

  - ⚡注意区分源分支和目标分支
    - `main` 分支：仅存放 Hexo 源码（源文件）
    - `gh-pages` 分支：仅存放自动生成的静态文件 public（部署的内容），自定义静态文件存放分支

  - 然后代码提交/推送到 github 远程：`git push` 或 `git push -u origin main`
    - 触发条件：当且仅当代码推送到 main 分支时触发部署（main 分支是自己配置的源码分支）

  - ⚡项目的 GitHub Actions 配置文件 deploy.yml 在 commit + 推送到远程后，定要检查 GitHub Actions 工作流是否触发且触发成功
    - 状态：绿色对勾(成功)、红色叉号(失败)、无记录(未触发)
    - 这条 commit 是告诉 GitHub「有一个自动化工作流要执行」
      - 如果工作流 **没有自动触发（或触发后失败）**，就也不会自动创建目标分支`gh-pages`，也不会生成/推送静态文件到目标分支`gh-pages`
      - 如果工作流触发成功，`Settings` → `Pages` → 切换分支为目标分支`gh-pages` → 此时Actions下会再出现一条工作流，对应的分支正是目标分支 → 等待成功就可以打开博客链接了
    - Hexo+GitHub Actions 的核心是：**推送源码 → Actions 自动构建静态文件 → Actions 将静态文件推送到指定分支（如gh-pages）→ Pages 关联该分支提供访问**

  - 我提交 deploy.yml 配置文件之后，工作流触发了但执行失败了❗❗❗
    ![](/images/Hexo搭建个人博客Github-分享/hexo_origin_second_commit.png)
    - ❌失败的原因可能是：
      - 配置文件 deploy.yml 有语法/逻辑错误
      - GitHub Actions 工作流未触发，或触发后执行失败。存在即使配置文件正确，也需要重新推送一次源码触发工作流的情况
      - 未手动将 GitHub Pages 关联到目标分支【这一步要在工作流成功，目标分支`gh-pages`被自动创建之后】
  
  - 确保 deploy.yml 配置文件格式正确，随便改点什么，再次commit + 推送到远程【✅这次成功了】
    ![](/images/Hexo搭建个人博客Github-分享/hexo_origin_third_commit.png)
   
  - GitHub Pages 里的「目标分支」是需要先存在（由 Actions 创建/手动创建），再到 Pages 设置里手动关联，才会在下拉框中显示，不会凭空出现⚠️
    - 第一次 deploy.yml 配置文件推送到远程，工作流触发但执行失败了，Github Pages 下没有创建目标分支 `gh-pages`
    - 第二次 工作流执行成功了， 目标分支也会被 Action 自动创建 (还需要再去手动关联目标分支)

- 配置 **GitHub Pages** 关联的目标分支🔗

  - 进入你的 GitHub 仓库 → 点击顶部 `Settings` → 左侧菜单 `Pages`
  - 在 Build and deployment 区域：

    - `Source`：选择  Deploy from a branch
    - `Branch`：选择与配置文件中 publish_branch 一致的分支（gh-pages），目录默认选择 /(root) 【xxx.yml 文件推送远程之后，会多一个 gh-pages 分支可以选择】
    - 点击 `Save`，GitHub 会自动识别 Pages 资源
      ![](/images/Hexo搭建个人博客Github-分享/hexo-ghPages.png)

  - Github Pages 分支修改且 `Save` 之后再次查看部署进度（多一条工作流、分支也变成 gh-pages）
    ![](/images/Hexo搭建个人博客Github-分享/hexo-ghPages1.png)

  - （成功之后）点击进入日志记录可以看到博客链接 `https://用户名.github.io`（大概延迟等待 1-5 分钟可以看到内容）
    ![](/images/Hexo搭建个人博客Github-分享/hexo-flowsLink.png)

- 📌之后每次 main 分支 commit 都会触发工作流，自动生成/推送静态文件到目标分支`gh-pages`，博客链接也会自动更新到最新内容。


## ✅ 我的操作步骤
- 我的 github 登录用户名 `liqinghua-ty`
- 我的 git 仓库地址 `git@github.com:liqinghua-ty/liqinghua-ty.github.io.git`
  ```bash
    # 建立链接
    git clone git@github.com:liqinghua-ty/liqinghua-ty.github.io.git
    # 安装需要依赖
    npm i
    npm install hexo-deployer-git -D # 后续自动化部署会用到插件
    # 开启本地预览
    hexo s
  ```
- 新建 `.gitignore` 文件，若本身已存在则跳过
  ```bash
    .DS_Store
    Thumbs.db
    db.json
    *.log
    node_modules/
    public/
    .deploy*/
    _multiconfig.yml
  ```
- 配置 `_config.yml` 的 `repository` 为新仓库地址
  ```bash
    deploy:
      type: git
      repository: git@github.com:liqinghua-ty/liqinghua-ty.github.io.git
      branch: main
  ```
  ![](/images/Hexo搭建个人博客Github-分享/hexo_set_repository.png)

- 配置 `_config.yml` 的 `url` 为博客链接
  ![](/images/Hexo搭建个人博客Github-分享/hexo_github_url.jpg)

- 推送代码到远程，首次代码推送：`git push` 或 `git push -f origin main`

- 在 Hexo 项目根目录，按路径 **`.github/workflows/deploy.yml`** 创建配置文件(内容在上述步骤中复制)，两次推送到远程，确保工作流成功触发并执行

- 手动将 GitHub Pages 关联到目标分支 `gh-pages`

- 等待3-5分钟就可以打开 [https://liqinghua-ty.github.io/](https://liqinghua-ty.github.io/) 博客链接了

## 👉 博客个性化
### 🔹更换博客主题🔹
- hexo 有很多开源免费的主题：https://hexo.io/themes

- 使用 npm 方式下载主题依赖，如 butterfly 主题官网 https://butterfly.js.org/
  - 安装主题依赖
    - `npm install hexo-theme-butterfly -D`
  - 安装这个主题需要的插件
    - `npm install hexo-renderer-pug hexo-renderer-stylus -D`
  - 修改 `_config.yml` 文件
    - theme 值改为 `butterfly`
  - 创建主题配置文件
    - `_config.butterfly.yml`，从`node_modules/hexo-theme-butterfly/_config.yml`复制默认配置到 `_config.butterfly.ym`l 文件
  - 重启查看效果：hexo clean; hexo s (如下：主题修改成功)
    ![](/images/Hexo搭建个人博客Github-分享/hexo-theme-butterfly.png)
  - 将代码推送到远程，等构建完成(1-5 分钟)，线上博客链接的主题也完成了更换

- 针对某一个主题，修改博客的样式，可以看[主题官网文档](https://butterfly.js.org/posts/4aa8abbe/)
  - 1. 简单的一些配置，如：
    - 图片设置，在 source 目录下创建 theme_images 文件夹，把主题需要的文件保存在目录下
    - cover封面图设置
    - 作者、语言设置
    - 导航栏设置
    - ...
    ```bash
      # ico 图
      favicon: /theme_images/f.ico

      # 头像
      avatar:
        img: /theme_images/avatar.png
        effect: true # 头像会一直转圈

      # 页脚背景图
      footer_img: /theme_images/footer.jpg

      # 全局背景图: color(纯色) | image(图片) 为空则背景留白
      # background: /theme_images/bg.jpg
      # background: 'linear-gradient(180deg, #B9D394 30%, #D2E3B9 100%)'
      background: '#49b1f594'

      # 顶部图(文章页/首页/分类页/归档页... 顺序和优先级不同)
      index_img： ''
      default_top_img： ''
      archive_img： ''
      category_img： ''

      # 文章的封面图，下载文章顶部的cover
      cover: /images/Hexo搭建个人博客Github-分享/cover.png # 封面图
    ```
  - 2. 创建导航栏、路由
    - 创建文件：
      - 归档: /archives 已存在
      - 标签: /tags 、分类: /categories 两个路由已存在，在/source/目录下创建路由同名文件夹
        - 新建 `/tags/index.md` 文件
          ```bash
          ---
          title: 标签
          date: 2026-01-29 10:18:56
          type: 'tags'  # 页面类型，标签页必须是 tags
          orderby: random   # 排序方式：random随机/标签名称排序/length标签数量排序
          order: 1   # 排序次序： 1（升序），-1（降序）
          comments: false  # 是否开启评论，默认为true
          ---
          ```
        - 新建 `/categories/index.md` 文件
          ```bash
          ---
          title: 分类
          date: 2026-01-29 10:18:56
          type: 'categories'  # 页面类型，分类页必须是 categories
          comments: false  # 是否开启评论，默认为true
          ---
          ```

      - 其他路由可自定义，比如：说说
        - 新建 `/shuoshuo/index.md `文件
        ```bash
        ---
        title: 说说
        date: 2026-01-29 10:18:56
        type: 'shuoshuo'
        comments: false
        ---
        ```
    - 配置菜单路由 `_config.butterfly.yml`
    ```bash
    menu:
      首页: / || fas fa-home
      页面 || fas fa-book:
        归档: /archives/ || fas fa-archive
        标签: /tags/ || fas fa-tags
        分类: /categories/ || fas fa-folder-open
      说说: /shuoshuo/ || fas fa-link
    ```
  - 更多主题配置可以自行解锁，大概的修改后的效果：
  ![](/images/Hexo搭建个人博客Github-分享/hexo-theme-set.png)

### 🔹增加看板娘（Live2D 动态人物）🔹
- 安装依赖
  ```bash
    # 安装 live2d 核心插件
    npm install -D hexo-helper-live2d
    # 安装人物模型（选一个即可，也可装多个）
    npm install --save live2d-widget-model-hibiki
  ```
- `_config.yml` 中增加一段配置
  ```bash
  live2d:
    pluginRootPath: live2dw/
    pluginJsPath: lib/
    pluginModelPath: assets/
    tagMode: false
    use: live2d-widget-model-hibiki  # 模型名称
    display:
      position: left # 左右位置（left/right）
      width: 230      # 宽度
      height: 370     # 高度
      hOffset: 50     # 水平偏移（px）
      vOffset: 0    # 垂直偏移（px，负数向上移动）
      zIndex: 100     # 层级
    mobile:
      show: false      # 移动端是否显示
      scale: 0.5      # 移动端缩放比例
  ```
- `hexo g; hexo s -p 5000` 重新预览，刷新即可看到看板娘

### 🔹增加评论系统🔹
待续...
