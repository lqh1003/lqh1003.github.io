---
title: Hexo搭建个人博客-Gitlab
date: 2025-07-23 12:07:48
tags:
  - hexo
  - gitlab
  - Gitlab Pages
cover: /images/Hexo搭建个人博客-Gitlab/cover.jpg # 封面图
categories: Hexo # 分类
---

## 搭建开发环境(安装 node.js)

```bash
npm - v
node - v # 检查是否安装完成
```

## 安装博客框架 hexo 脚手架

```bash
npm install -g hexo-cli
```

## 切换到国内镜像源

```bash
npm config set https://registry.npmmirror.com  # 淘宝镜像源(安装更快)
```

## 搭建博客项目

```bash
hexo init my-blog
cd my-blog
npm i
hexo server   # 本地预览博客，默认端口 4000，简写 hexo s
```

![](/images/Hexo搭建个人博客-Gitlab/hexo_init.png)

## 代码托管到 gitlab

- 新建一个 gitlab 仓库，仓库名是 xxx.gitlab.io，xxx 是你的 gitlab 用户名
- 与本地仓库 my-blog 建立连接

  ```bash
  git init   # 初始化.git
  git remote add origin https://gitlab.com/xxx.gitlab.io.git  # 建立连接
  git branch -M main  # 修改分支名称
  ```

- 配置 Hexo 部署
  - 安装 Gitlab Pages 部署插件 npm install hexo-deployer-git -D (hexo deploy 命令用到该插件)
  - 修改  _config.yml  文件中的部署配置

  ```yaml
  deploy:
    type: git
    repository: git@gitlab.com:xxx.gitlab.io.git
    branch: main
  ```

- 创建 .gitlab-ci.yml （GitLab 内置功能 CI/CD 的配置文件：代码部署上线全自动化）
  ![](/images/Hexo搭建个人博客-Gitlab/gitlab-ci-yml.png)

- 推送本地代码到远程
  - 可以新增 `.gitignore` 文件，忽略 node_modules 等代码提交
  - 取消仓库 main 分支保护 Settings → Repository → Protected branches (如果代码推送失败，取消分支保护重新推送)
  - 生成静态文件并部署代码到仓库：hexo clean; hexo generate; hexo deploy
    ```bash
      hexo clean   # 清除缓存文件和已生成的静态文件
      hexo generate  # 生成静态文件(编译)
      hexo deploy   # 用于将本地生成的静态文件自动部署(上传)到远程服务器或代码托管平台(如 GitHub/GitLab/Gitee等) 。通过该命令，你可以快速将博客更新推送到线上，无需手动操作
      hexo server   # 本地预览效果
    ```
  - 推送到远程仓库 【每次推送代码会自动触发管道 CI/CD】
    ```bash
      git add .
      git commit -m "first commit"
      git push -u origin main
    ```
- 访问博客链接：Deploy → Pages → 可以找到博客链接 https://xxx.gitlab.io/ (等待 1-5 分钟就可以打开了)

## 【注意】

- 如果在 Gitlab 没有找到 Pages，检查一下`仓库`以及`仓库所在项目组`的权限是否是最高权限且公开(Public)的

- 第一次推送代码到远程，我构建失败了(在 Build → Pipelines 下可以查看构建状态)
  - 找到构建失败的原因(我是因为需要进行账号或者身份认证认证)，解决之后重新推送代码即可
    ![](/images/Hexo搭建个人博客-Gitlab/gitRuning0.png)
- 新增一篇博客内容
  - 执行 "hexo new post 文章标题 xxx" 创建一篇新博客
    ![](/images/Hexo搭建个人博客-Gitlab/firstBlog.png)
  - 本地预览效果：`hexo clean; hexo g; hexo d; hexo s`
  - 推送到远程【每次推送代码会自动触发管道 CI/CI】
    - 当状态 Runing → Passed，即构建成功，刷新线上博客即可看到
      ![](/images/Hexo搭建个人博客-Gitlab/gitRuning.png)

## 更换博客主题 butterfly

- hexo 有很多开源免费的主题：`https://hexo.io/themes`
  - 使用 npm 方式下载主题依赖，如 butterfly 主题
    - [butterfly 主题官网](https://butterfly.js.org/)、[参考官网文档](https://butterfly.js.org/posts/21cfbf15/)
      ![](/images/Hexo搭建个人博客-Gitlab/butterfly.png)

    - 在 Hexo 项目根目录下执行： `npm install hexo-theme-butterfly -D`
    - 安装这个主题需要的插件：`npm install hexo-renderer-pug hexo-renderer-stylus -D`
    - 修改 Hexo 根目录下的  `_config.yml`  文件 **theme: butterfly**
    - 创建主题配置文件 `_config.butterfly.yml`，从 `node_modules/hexo-theme-butterfly/_config.yml` 复制默认配置到 `_config.butterfly.yml` 文件
    - 重启查看效果：`hexo clean; hexo g; hexo s` (如下：主题修改成功)
      ![](/images/Hexo搭建个人博客-Gitlab/hexo_themes.png)
    - 将代码推送到远程，等构建完成(1-5 分钟)，线上博客链接的主题也完成了更换

## 增加看板娘（Live2D 动态人物）

- 安装依赖，根据喜好从[Live2D 模型开源仓库](https://github.com/imuncle/live2d)选择模型
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
- 重新预览，刷新即可看到看板娘

  ```bash
    # 清理缓存 → 生成静态文件 → 本地预览
    hexo clean ; hexo g ; hexo s -p 5000
  ```

- **看板娘，增加关闭功能**（关闭状态不被记忆，刷新恢复显示）
  - 在 `source` 文件夹下，新建 `js/live2d-toggle.js` 文件

    ```javascript
    // source/js/live2d-toggle.js
    // 看板娘由 L2Dwidget.init() 异步创建，需等容器出现后再绑定关闭按钮

    function getLive2dContainer() {
      return (
        document.getElementById("live2d-widget") ||
        document.querySelector(".live2d-widget-container") ||
        document.querySelector('[class*="live2d"]')
      );
    }

    function initLive2dToggle() {
      const live2dContainer = getLive2dContainer();
      if (!live2dContainer) return false;

      // 避免重复初始化（例如 pjax 或多次调用）
      if (document.getElementById("live2d-close-btn")) return true;

      let isShowLive2d = true;

      const closeBtn = document.createElement("div");
      closeBtn.id = "live2d-close-btn";
      closeBtn.innerHTML = "×";
      closeBtn.style.cssText = `
              position: fixed;
              bottom: 280px;
              left: 60px;
              width: 24px;
              height: 24px;
              background: #ffffff;
              border-radius: 50%;
              box-shadow: 0 0 6px rgba(0,0,0,0.2);
              text-align: center;
              line-height: 22px;
              font-size: 16px;
              color: #666;
              cursor: pointer;
              z-index: 99999;
              user-select: none;
          `;
      document.body.appendChild(closeBtn);

      live2dContainer.style.display = "block";

      closeBtn.addEventListener("click", function () {
        const container = getLive2dContainer();
        if (!container) return;
        if (container.style.display === "none") {
          container.style.display = "block";
          isShowLive2d = true;
          closeBtn.style.background = "#fff";
          closeBtn.style.color = "#666";
        } else {
          container.style.display = "none";
          isShowLive2d = false;
          closeBtn.style.background = "#f44336";
          closeBtn.style.color = "#fff";

          // 隐藏关闭按钮，若不隐藏，则是切换看板娘是否展示
          closeBtn.style.display = "none";
        }
      });

      closeBtn.addEventListener("mouseover", function () {
        if (isShowLive2d) {
          this.style.background = "#f44336";
          this.style.color = "#fff";
        }
      });
      closeBtn.addEventListener("mouseout", function () {
        if (isShowLive2d) {
          this.style.background = "#fff";
          this.style.color = "#666";
        }
      });

      return true;
    }

    // 等待看板娘容器出现后再初始化（L2Dwidget 异步创建 DOM）
    function waitAndInit() {
      if (initLive2dToggle()) return;
      var attempts = 0;
      var maxAttempts = 100; // 约 10 秒
      var timer = setInterval(function () {
        if (initLive2dToggle() || ++attempts >= maxAttempts) {
          clearInterval(timer);
        }
      }, 100);
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", waitAndInit);
    } else {
      waitAndInit();
    }
    ```

  - 在 `_config.butterfly.yml` 主题配置文件找到 `inject` 或 `custom_js`相关配置，添加上述脚本引用

    ```bash
    # 以 Butterfly 主题为例
    inject:
      head:
        # 其他自定义代码...
      bottom:
        # 引入看板娘关闭脚本
        - <script src="/js/live2d-toggle.js"></script>

    # 以 Next 主题为例
    custom_js:
      # 引入看板娘关闭脚本
      - /js/live2d-toggle.js
    ```

  - 重新预览，刷新即可看到效果
    ```bash
      # 清理缓存 → 生成静态文件 → 本地预览
      hexo clean ; hexo g ; hexo s -p 5000
    ```
    ![](/images/Hexo搭建个人博客-Gitlab/close_live2d.png)

## 增加搜索功能

前提条件：我用的是butterfly主题

- 安装插件：`npm install hexo-generator-searchdb -D`
- 在 Hexo 的全局配置文件 `_config.yml` 中添加以下配置：
  ![](/images/Hexo搭建个人博客-Gitlab/search1.png)

- 在 Butterfly 主题的配置文件 `_config.butterfly.yml` 中启用搜索功能：
  ![](/images/Hexo搭建个人博客-Gitlab/search2.png)

- `hexo celan; hexo g; hexo d; hexo s` 查看预览效果
  ![](/images/Hexo搭建个人博客-Gitlab/search3.png)

- git push 推送到线上仓库，线上博客链接也更新正常可使用搜索功能

## 自定义全局样式文件

- 自定义创建独立的样式文件：`source/css/custom.css`
  ![](/images/Hexo搭建个人博客-Gitlab/style1.png)

- `_config.butterfly.yml` 配置：
  ![](/images/Hexo搭建个人博客-Gitlab/style2.png)

- 使用，在 markdown 文件中 (需要设置"类名"的使用html的写法)
  ![](/images/Hexo搭建个人博客-Gitlab/style3.png)

- `hexo clean; hexo g; hexo d; hexo s` 重新运行查看效果，样式设置成功

## hexo(博客)项目开启评论功能

Hexo是一个静态博客框架，添加评论系统需要借助第三方服务(Valine/Gitalk/Disqus/Waline/Utterances/Giscus 评论系统)。以下是几种主流评论系统的集成方案：
![](/images/Hexo搭建个人博客-Gitlab/comments1.png)

### 使用 Waline 评论系统

#### **📚 LeanCloud设置(数据库)**

- 登录或者注册 [LeanCloud国际版](https://console.leancloud.app/apps) 控制台，然后创建一个应用（应用名字自定义即可），比如：`lqh-gitlab-blog-comment`
  ![](/images/Hexo搭建个人博客-Gitlab/comments2.png)

- 进入应用：有 `AppID`、`AppKey`、`MasterKey`（LeanCloud 相关变量，**主要的连接🔗参数**）
  ![](/images/Hexo搭建个人博客-Gitlab/comments3.png)

#### **🚀 部署Waline服务端**

- 可部署到：（部署步骤详细可以参考[Waline官方文档](https://waline.js.org/)）
  - Vercel（官方最常见）
  - Netlify
  - Docker
  - 自己的服务器（Node.js/PM2等

- 将程序部署到 **Vercel**:
  ![](/images/Hexo搭建个人博客-Gitlab/comments4.png)

- 如果未登录(如下界面)，可以选择一种方式登录：
  如：github 快捷登录 [ install Vercel (会在github上下载该插件) → github账号登录 → 邮箱验证 → 手机号码验证 ]
  ![](/images/Hexo搭建个人博客-Gitlab/comments5.png)

- Vercel 登陆成功之后：(我又连接了gitlab，个人头像 → Account Settings → 点对应平台的Content按钮去注册/登录即可)
  ![](/images/Hexo搭建个人博客-Gitlab/comments6.png)

- 再点击第一步的按钮[Deploy]，然后就可以创建项目了(选择一种方式，比如：我可以选github或gitlab)
  https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fwalinejs%2Fwaline%2Ftree%2Fmain%2Fexample&teamSlug=13875736963s-projects
  ![](/images/Hexo搭建个人博客-Gitlab/comments7.png)

- 选择 gitlab：(点击create之后，发现要填卡号，要收钱)
  ![](/images/Hexo搭建个人博客-Gitlab/comments8.png)

- 选择 github，输入仓库名lqh-blog-comments，点击 create：等待半分钟，成功了
  ![](/images/Hexo搭建个人博客-Gitlab/comments9.png)

- 成功之后，点击"下一步"就会进入[项目/应用控制台](https://vercel.com/13875736963s-projects/lqh-blog-comments)：
  ![](/images/Hexo搭建个人博客-Gitlab/comments10.png)

- 在应用控制台配置三个环境变量：
  - 点击 `Settings` → `Environment Variables` → 进入环境变量配置页
  - 配置三个环境变量 `LEAN_ID`, `LEAN_KEY` 和 `LEAN_MASTER_KEY`，值分别对应上一步在 LeanCloud 中获得的 `APP ID`, `APP KEY`, `Master Key`
    【注】如果你使用 LeanCloud 国内版，请额外配置 `LEAN_SERVER` 环境变量，值为你绑定好的域名
    ![](/images/Hexo搭建个人博客-Gitlab/comments11.png)

- 环境变量配置完成之后，点击顶部的 `Deployments`，点击最新的一次部署右侧的 **Redeploy** 按钮进行重新部署。该步骤是为了让刚才设置的环境变量生效。
  ![](/images/Hexo搭建个人博客-Gitlab/comments12.png)

- 此时会跳转到 Overview 界面开始部署，等待片刻后 STATUS 会变成 Ready。**此时请点击 Visit ，即可跳转到部署好的网站地址，此地址即为你的Vercel服务端地址**。
  ![](/images/Hexo搭建个人博客-Gitlab/comments13.png)

- 打开服务端地址 https://xxx.vercel.app (评论前先登录)
  我的Vercel服务端地址：https://lqh-blog-comments.vercel.app/ (需要开VPN才可以打开，所以添加到项目中也需要开VPN)
  ![](/images/Hexo搭建个人博客-Gitlab/comments14.png)

- 注册管理员，第一个注册用户为管理员(上述弹窗 → 用户注册)
  ![](/images/Hexo搭建个人博客-Gitlab/comments15.png)

- 之后就可以发表评论了：
  ![](/images/Hexo搭建个人博客-Gitlab/comments16.png)

- 访问你的 Waline 评论管理后台：[https://lqh-blog-comments.vercel.app/ui](https://lqh-blog-comments.vercel.app/ui)
  ![](/images/Hexo搭建个人博客-Gitlab/comments17.png)

#### **🧩 项目中引入Waline评论 (上述两个步骤就已经完成服务端的搭建)**

- 方式1：HTML项目，使用CDN 引入评论，详细步骤见文档 https://waline.js.org/guide/get-started/
- 方式2：vue项目，通过npm 下载依赖 @waline/client
- 方式3：hexo博客项目中引入评论：(hexo部分主题内置Waline评论支持)
  - 如果当前hexo主题内置支持Waline则不需要安装依赖，否则手动安装Waline：npm install @waline/client

- 【注意事项】
  （1）国内推荐Valine或Waline，国际推荐Disqus或Gitalk
  （2）部分主题可能需要额外配置，请参考主题文档
  （3）隐私合规：根据地区添加GDPR/CCPA合规声明
  （4）备份评论数据，特别是使用第三方服务时
  三方评论插件/方案有很多很多，可自行寻找下载配置

### butterfly 主题，配置waline评论

- `_config.butterfly.yml` 配置评论系统（**开启 waline 评论 + waline 服务端地址**）

  ```bash
  # 启用评论系统
  comments:
    use: waline  # 指定使用 Waline

  # ...

  # Waline 专属评论配置
  waline:
    enable: true
    serverURL: "https://lqh-blog-comments.vercel.app" # 替换为你的实际地址
    locale:
      placeholder: "欢迎留言..." # 评论框提示文字
    commentCount: true # 显示评论数
    pageview: true # 显示阅读量
    emoji:
      - https://unpkg.com/@waline/emojis@1.1.0/weibo
      - https://unpkg.com/@waline/emojis@1.1.0/alus
    meta: ["nick", "mail", "link"] # 评论者信息
    requiredFields: ["nick", "mail"] # 必填项（评论者信息：昵称、邮箱email、网址link）
    login: "enable" # 登录方式
    wordLimit: 0 # 评论字数限制
    visitor: true # 启用访问量统计
    pageSize: 10 # 每页评论数
  ```

- 重新运行，本地预览即可看到效果：`hexo clean; hexo g; hexo s`
  ![](/images/Hexo搭建个人博客-Gitlab/comments18.png)
- 推送到远程 `git push`

## 添加顶部menu导航栏

- `_config.butterfly.yml` 中配置

  ```bash
    menu:
      首页: / || fas fa-home
      页面 || fas fa-book:
        归档: /archives/ || fas fa-archive
        标签: /tags/ || fas fa-tags
        分类: /categories/ || fas fa-folder-open
      链接: /link || fas fa-link
      关于: /about || fas fa-heart
  ```

- 新建categories、tags、link、about页面：`Hexo new page link`
  - 归档: /archives 默认已存在
- 修改/source/link/index.md文件中type属性 (type属性就是配置menu的路由)
  ![](/images/Hexo搭建个人博客-Gitlab/hexo-link.png)
- 重新加载 `hexo clean; hexo g; hexo d; hexo s`，预览效果
  ![](/images/Hexo搭建个人博客-Gitlab/hexo-menu.png)

## 更换 waline 评论系统的数据库(2026.08.03)

由于 **LeanCloud** 即将停止对外服务
![](/images/Hexo搭建个人博客-Gitlab/comments_db.png)

- 迁移到 **TiDB Cloud**（★★★★★ 推荐），这是 Waline 官方目前最推荐的数据库
  - ✅ Waline 原生支持
  - ✅ 免费额度（个人博客基本够用）
  - ✅ 不需要改 Hexo 配置
  - ✅ 评论数据可以迁移
  - ✅ 以后维护成本最低

因为我的项目重新部署遇到一个问题 [lqh-blog-comments](https://github.com/lqh1003/lqh-blog-comments)

- Waline 部署方式是Waline v2 时代官方模板的写法，比较老（vercel.json）
- 依赖文件有比较新（package.json），容易出现很多依赖报错
  所以我直接重新走了一遍 waline 服务器端部署，正常情况下跳过 [创建新的 Waline 仓库](#创建新的-Waline-仓库) 这一步就行

### 开始迁移 (基本步骤)

- [Github 仓库 lqh-blog-comments](https://github.com/lqh1003/lqh-blog-comments)
- [LeanCloud 数据库面板](https://console.leancloud.app/apps/FVivwfUE5o0znjkiyLOi1omM-MdYXbMMI/) —— 旧
- [TiDB Cloud 数据库面板](https://tidbcloud.com/tidbs?orgId=1372813089209349280) —— 新
- [Vercel 服务端地址](https://lqh-blog-comments.vercel.app/)
- [Waline 评论管理后台](https://lqh-blog-comments.vercel.app/ui)
- [Vercel 服务控制台](https://vercel.com/13875736963s-projects/lqh-blog-comments)

#### 备份评论数据

[Waline 评论管理后台](https://lqh-blog-comments.vercel.app/ui)，直接导出 JSON（新版 Waline 支持导出 JSON）
![](/images/Hexo搭建个人博客-Gitlab/comments_db2.png)

#### TiDB Cloud（数据库）

- 打开 [TiDB Cloud 官网](https://tidbcloud.com)，注册账号，建议直接 `Sign in with GitHub`
  ![](/images/Hexo搭建个人博客-Gitlab/comments_db3.png)

- 创建 TiDB Cloud 实例
  - 点击 `Create Resource`
  - 选择套餐
    - 一般可以这样选：
      - 学习、开发、测试、小型网站 **Starter**
      - 自动扩缩容的正式业务 **Essential**
      - 更高可用性、网络和企业需求 **Dedicated/Premium**

    初次使用建议选择 Starter

  - 填写实例名称，例如：lqh-hexo-comments (名字随意，重要的是数据库连接信息)
  - 选择云服务商，通常选择 AWS
    - 不需要自己注册 AWS 账户
    - TiDB Cloud 会负责底层云资源

  - 选择 Region（区域）
  - 选择原则：
    - 尽量靠近你的应用服务器；
    - Cloudflare Worker 是全球运行的，可以选择靠近主要用户或其他后端服务的区域；
    - 普通中国业务接入海外数据库时，可考虑东京、新加坡等亚洲区域；
    - 实例创建后，区域通常不适合随意变更，所以需要提前确定；
    - 主要用户、服务器或开发团队位于中国大陆，建议这样选：
      - Singapore（新加坡）：优先推荐，通常适合中国大陆、东南亚业务，也较适合作为亚洲范围的通用节点。
      - Tokyo（东京）：也可以，适合日本用户，部分中国地区访问延迟可能比新加坡低，最好实测。
      - Frankfurt：欧洲业务。
      - Oregon：美国西部业务。
      - São Paulo：南美业务。
  - 如果页面显示 **Monthly Spending Limit**：测试使用可以设置为 0；
    - 设置为 0 时保持在免费额度内，不产生超额消费；
    - 需要超出免费额度时，再绑定付款方式并提高限额

  - 点击 Create
    - Starter 实例一般几十秒即可创建，官方目前说明每个组织默认最多可以创建五个免费 Starter 实例，每个实例包含一定的免费存储和 RU 配额

- **创建 Waline 数据库 + 表**
  - 进入刚创建的实例 lqh-hexo-comments
  - 左侧导航栏 SQL Editor（官方提供了一份 SQL），执行：
    - 没有 `wl_Users`...，需要导入 Waline 专用的 [waline.tidb](https://github.com/walinejs/waline/blob/main/assets/waline.tidb) 初始化脚本

      ```bash
        CREATE DATABASE `waline`;  # 新建数据库

        USE waline;  # 使用数据库
        
        CREATE TABLE `wl_Comment` (
          `id` int unsigned NOT NULL AUTO_INCREMENT,
          `user_id` int DEFAULT NULL,
          `comment` text,
          `insertedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
          `ip` varchar(100) DEFAULT '',
          `link` varchar(255) DEFAULT NULL,
          `mail` varchar(255) DEFAULT NULL,
          `nick` varchar(255) DEFAULT NULL,
          `pid` int DEFAULT NULL,
          `rid` int DEFAULT NULL,
          `sticky` boolean DEFAULT NULL,
          `status` varchar(50) NOT NULL DEFAULT '',
          `like` int DEFAULT NULL,
          `ua` text,
          `url` varchar(255) DEFAULT NULL,
          `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
          `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (`id`)
        ) CHARSET=utf8mb4;

        CREATE TABLE `wl_Counter` (
          `id` int unsigned NOT NULL AUTO_INCREMENT,
          `time` int DEFAULT NULL,
          `reaction0` int DEFAULT NULL,
          `reaction1` int DEFAULT NULL,
          `reaction2` int DEFAULT NULL,
          `reaction3` int DEFAULT NULL,
          `reaction4` int DEFAULT NULL,
          `reaction5` int DEFAULT NULL,
          `reaction6` int DEFAULT NULL,
          `reaction7` int DEFAULT NULL,
          `reaction8` int DEFAULT NULL,
          `url` varchar(255) NOT NULL DEFAULT '',
          `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
          `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (`id`)
        ) CHARSET=utf8mb4;

        CREATE TABLE `wl_Users` (
          `id` int unsigned NOT NULL AUTO_INCREMENT,
          `display_name` varchar(255) NOT NULL DEFAULT '',
          `email` varchar(255) NOT NULL DEFAULT '',
          `password` varchar(255) NOT NULL DEFAULT '',
          `type` varchar(50) NOT NULL DEFAULT '',
          `label` varchar(255) DEFAULT NULL,
          `url` varchar(255) DEFAULT NULL,
          `avatar` varchar(255) DEFAULT NULL,
          `github` varchar(255) DEFAULT NULL,
          `twitter` varchar(255) DEFAULT NULL,
          `facebook` varchar(255) DEFAULT NULL,
          `google` varchar(255) DEFAULT NULL,
          `weibo` varchar(255) DEFAULT NULL,
          `qq` varchar(255) DEFAULT NULL,
          `oidc` varchar(255) DEFAULT NULL,
          `2fa` varchar(32) DEFAULT NULL,
          `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
          `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (`id`)
        ) CHARSET=utf8mb4;
      ```

      ![](/images/Hexo搭建个人博客-Gitlab/comments_db6.png)

- **获取数据库连接信息**
  - 回到实例详情页，点击右上角 `Connect`
    ![](/images/Hexo搭建个人博客-Gitlab/comments_db4.png)
  - 选择连接方式，第一次连接时点击 **Generate Password**（立即保存生成的密码），然后连接窗口如下【**记住这些信息，稍后要填**】：
    ![](/images/Hexo搭建个人博客-Gitlab/comments_db5.png)

#### 创建新的 Waline 仓库

- 前提条件是：
  - ❌ 删除 GitHub 之前的 lqh-blog-comments 仓库
  - ❌ 删除之前的 [Vercel](https://vercel.com) 的 lqh-blog-comments 项目

> 最新版 Waline 官方推荐的是使用官方模板仓库（Template）创建自己的仓库（不需要手动新建一个空仓库 xxx，再自己写代码）

- 第一步：[打开 Waline 官方仓库](https://github.com/walinejs/waline)，这是 Waline 的源码仓库

- 第二步：打开 Waline/Vercel 官方部署页面（推荐）
  - Waline 官方提供了**一键部署按钮**，建议直接使用，而不是自己新建空仓库
  - [Waline 官方部署文档](https://waline.js.org/guide/get-started/)
    - 在部署文档页面中可以看到 **Deploy with Vercel** 按钮
    - 点击它，输入仓库名称 lqh-blog-comments，提交 `Create`
      ![](/images/Hexo搭建个人博客-Gitlab/comments_db7.png)
    - 等待第一次部署完成，就有链接了 `https://xxxx.vercel.app`
      - GitHub 会自动生成 lqh-blog-comments 仓库
      - Vercel 会**自动导入这个仓库** (不需要手动操作第三步，除非其他情况你手动删除了项目，想自己手动导入)
        ![](/images/Hexo搭建个人博客-Gitlab/comments_db8.png)
        ![](/images/Hexo搭建个人博客-Gitlab/comments_db9.png)

- 第三步：导入到 Vercel
  - 登录 [Vercel](https://vercel.com)
  - Add New Project → Github → 选择 lqh-blog-comments 导入
  - 等待完成就可以看到项目了，效果图如上

#### 设置 Waline 环境变量

- 修改 Waline 环境变量，进入[服务控制台](https://vercel.com/13875736963s-projects/lqh-blog-comments)
  - 点击 `Settings` → `Environment Variables` → 进入环境变量配置页
    - ❌删除 LeanCloud 相关变量（迁移就删除残留变量，新建就跳过这一步）
      - LEAN_ID
      - LEAN_KEY
      - LEAN_MASTER_KEY

    - 新增：
      - TIDB_HOST=<TiDB Cloud Connect 页面显示的 Host>
      - TIDB_PORT=4000
      - TIDB_USER=<完整用户名>
      - TIDB_PASSWORD=<数据库密码>
      - TIDB_DB=waline (值是上面创建的数据库名称)
        - 【注意】sys 是 MySQL 自带的系统数据库，不是 Waline 的业务数据库，不能填 sys
      - TIDB_PREFIX=wl_

  - 重新部署，等待完成，就可以成功打开了
    - 环境变量修改后不会一例生效，需要重新部署一次 Deployments → ... → Redeploy
      ![](/images/Hexo搭建个人博客-Gitlab/comments_db10.png)

#### 导入评论

- 回到 [Waline 评论管理后台](https://lqh-blog-comments.vercel.app/ui) 直接上传 josn 文件
  ![](/images/Hexo搭建个人博客-Gitlab/comments_db11.png)
  ![](/images/Hexo搭建个人博客-Gitlab/comments_db12.png)
