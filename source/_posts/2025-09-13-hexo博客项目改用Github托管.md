---
title: hexo博客项目改用Github托管
date: 2025-09-13 17:20:30
tags:
  - hexo
  - github
  - Github Pages
cover: /images/hexo博客项目改用Github托管/cover.jpg # 封面图
categories: Hexo # 分类
---

### 常用的静态页面托管服务

- Gitee Pages
  - [gitee.com](https://gitee.com)
  - Gitee Pages 2024.05 已暂停服务，无法使用
- Gitlab Pages
  - [gitlab.com](https://gitlab.com) 2025.09.07 已停止向大陆内地提供服务
  - [jihulab.com](https://jihulab.com)、[gitlab.hk](https://gitlab.hk) 90 天免费试用，后续需付费试用
- GitHub Pages
  - 免费版 ✅ [github.com](https://github.com)
  - 付费版

📝 之前我使用 Gitlab 托管 hexo 博客项目，而 Gitlab.com 已暂停向大陆内地提供服务，需要迁移，我选择 Github

- [旧博客链接 Gitlab](https://lqh1003-gitlab-io-cd3511.gitlab.io)
- [新博客链接 GitHub](https://lqh1003.github.io)

### 新建仓库/代码迁移

- [github.com](https://github.com) 登录 → 新建仓库 "`用户名.github.io`" → 仓库状态设置为 public 状态
- 远程迁移仓库（Gitlab → GitHub）
  ```bash
      git clone --mirror https://gitee.com/oldProject.gitlab.io.git
      git remote set-url origin git@github.com:newProject.github.io.git
      git push -f origin --mirror
  ```
- 重新拉取新仓库到本地 `git clone git@github.com:newProject.github.io.git`
- 修改 `_config.yml` 的 repository 为新仓库地址
  ![](/images/hexo博客项目改用Github托管/repository.png)

- 删除 `.gitlab-ci.yml`（Gitlab 自动化部署配置文件）

- 推送本地源代码到远程仓库 `git push -f origin main`

【此时】也只是上传了 hexo 博客项目的源代码而已，`https://用户名.github.io` 根本打不开

### 为 Hexo 博客项目配置 GitHub Actions (自动化)

📖 实现 "**提交 Markdown 源码后，自动生成静态文件并部署到 GitHub Pages**"

- 前置准备工作：

  - 确保你的 GitHub 仓库中存储的是 Hexo 源码（而非仅 public 静态文件），核心目录/文件包括：

  ```plaintext
    仓库根目录/
    ├── source/ # Markdown 文章（source/_posts/）
    ├── themes/ # 博客主题（如 Next、Butterfly）
    ├── _config.yml # Hexo 全局配置
    ├── package.json # 依赖配置（含 hexo 等依赖）
    └── .github/workflows/ # 后续创建的 Actions 配置目录
  ```

  - 本地已通过 `npm install -g hexo-cli` 安装 Hexo，且能正常生成静态文件（hexo g 无报错
  - GitHub 仓库已创建
    - 推荐命名为 用户名.github.io，用于直接通过 https://用户名.github.io 访问
    - 如果用其他命名，链接会比较混乱，看起来没那么简洁

- **开始配置 Github Actions**

  - 在 Hexo 项目根目录，按路径 **`.github/workflows/deploy.yml`** 创建配置文件
    - xxx.yml 文件名可以自定义，**当把本地内容推送到远程仓库，github 会自动识别到这两个文件夹和 yml 文件**

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
            publish_dir: ./public #  待部署的静态文件目录（Hexo 生成的 public 目录）
            publish_branch: gh-pages # 目标分支(GitHub Pages读取的分支，与源分支 main 区分)
            force_orphan: true # 可选：强制创建独立分支，避免历史冲突
  ```

  - 注意区分源分支和目标分支
    - `main` 分支：仅存放 Hexo 源码（源文件）
    - `gh-pages` 分支：仅存放自动生成的静态文件 public（部署的内容），自定义静态文件存放分支

- 然后代码提交/推送到 github 远程：git push 或 git push -u origin main

  - 触发条件：当且仅当代码推送到 main 分支时触发部署（main 分支是自己配置的源码分支）

- 配置 **GitHub Pages** 来源

  - 进入你的 GitHub 仓库 → 点击顶部 Settings → 左侧菜单 Pages
  - 在 Build and deployment 区域：

    - `Source`：选择  Deploy from a branch
    - `Branch`：选择与配置文件中 publish_branch 一致的分支（gh-pages），目录默认选择 /(root) 【xxx.yml 文件推送远程之后，会多一个 gh-pages 分支可以选择】
    - 点击 `Save`，GitHub 会自动识别 Pages 资源
      ![](/images/hexo博客项目改用Github托管/ghPages.png)

  - Github Pages 分支修改且 `Save` 之后再次查看部署进度（多一条工作流、分支也变成 gh-pages）：
    ![](/images/hexo博客项目改用Github托管/actions.png)

  - （成功之后）点击进入日志记录可以看到博客链接 `https://用户名.github.io`（大概延迟等待 1-5 分钟可以看到内容）
    ![](/images/hexo博客项目改用Github托管/flowsLink.png)
