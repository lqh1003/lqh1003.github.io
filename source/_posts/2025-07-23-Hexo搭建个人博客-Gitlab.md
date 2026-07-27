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

### 搭建开发环境(安装 node.js)

```bash
npm - v
node - v # 检查是否安装完成
```

### 安装博客框架 hexo 脚手架

```bash
npm install -g hexo-cli
```

### 切换到国内镜像源

```bash
npm config set https://registry.npmmirror.com  # 淘宝镜像源(安装更快)
```

### 搭建博客项目

```bash
hexo init my-blog
cd my-blog
npm i
hexo server   # 本地预览博客，默认端口 4000，简写 hexo s
```

![](/images/Hexo搭建个人博客-Gitlab/hexo_init.png)

### 代码托管到 gitlab

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

### 【注意】

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

### 更换博客主题 butterfly

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

### 增加看板娘（Live2D 动态人物）

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

### 增加搜索功能

前提条件：我用的是butterfly主题

- 安装插件：`npm install hexo-generator-searchdb -D`
- 在 Hexo 的全局配置文件 `_config.yml` 中添加以下配置：
  ![](/images/Hexo搭建个人博客-Gitlab/search1.png)

- 在 Butterfly 主题的配置文件 `_config.butterfly.yml` 中启用搜索功能：
  ![](/images/Hexo搭建个人博客-Gitlab/search2.png)

- `hexo celan; hexo g; hexo d; hexo s` 查看预览效果
  ![](/images/Hexo搭建个人博客-Gitlab/search3.png)

- git push 推送到线上仓库，线上博客链接也更新正常可使用搜索功能

### 自定义全局样式文件

- 自定义创建独立的样式文件：`source/css/custom.css`
  ![](/images/Hexo搭建个人博客-Gitlab/style1.png)

- `_config.butterfly.yml` 配置：
  ![](/images/Hexo搭建个人博客-Gitlab/style2.png)

- 使用，在 markdown 文件中 (需要设置"类名"的使用html的写法)
  ![](/images/Hexo搭建个人博客-Gitlab/style3.png)

- `hexo clean; hexo g; hexo d; hexo s` 重新运行查看效果，样式设置成功

### hexo(博客)项目开启评论功能

Hexo是一个静态博客框架，添加评论系统需要借助第三方服务(Valine/Gitalk/Disqus/Waline/utterances 评论系统)。以下是几种主流评论系统的集成方案：
![](/images/Hexo搭建个人博客-Gitlab/comments1.png)

#### 使用 Waline 评论系统

**一、LeanCloud设置(数据库)**

- 登录或者注册 [LeanCloud国际版](https://console.leancloud.app/apps)，然后创建一个应用，比如：`lqh-gitlab-blog-comment`
  ![](/images/Hexo搭建个人博客-Gitlab/comments2.png)

- 进入应用：有 AppID、AppKey、MasterKey
  ![](/images/Hexo搭建个人博客-Gitlab/comments3.png)

**二、部署Waline服务端**
可部署到Vercel/LeanCloud/Docker等，部署步骤详细可以参考[Waline官方文档](https://waline.js.org/)

- 将程序部署到 **Vercel**:
  ![](/images/Hexo搭建个人博客-Gitlab/comments4.png)

- 如果未登录(如下界面)，可以选择一种方式登录：
  如：github 快捷登录 [ install Vercel (会在github上下载该插件) -> github账号登录 -> 邮箱验证 -> 手机号码验证 ]
  ![](/images/Hexo搭建个人博客-Gitlab/comments5.png)

- Vercel 登陆成功之后：(我又连接了gitlab，个人头像 -> Account Settings -> 点对应平台的Content按钮去注册/登录即可)
  ![](/images/Hexo搭建个人博客-Gitlab/comments6.png)

- 再点击第一步的按钮[Deploy]，然后就可以创建项目了(选择一种方式，比如：我可以选github或gitlab)
  https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fwalinejs%2Fwaline%2Ftree%2Fmain%2Fexample&teamSlug=13875736963s-projects
  ![](/images/Hexo搭建个人博客-Gitlab/comments7.png)

- 选择 gitlab：(点击create之后，发现要填卡号，要收钱)
  ![](/images/Hexo搭建个人博客-Gitlab/comments8.png)

- 选择 github，输入仓库名lqh-blog-comments，点击 create：等待半分钟，成功了
  ![](/images/Hexo搭建个人博客-Gitlab/comments9.png)

- 成功之后，点击"下一步"进入应用控制台：
  ![](/images/Hexo搭建个人博客-Gitlab/comments10.png)

  项目控制台：https://vercel.com/13875736963s-projects/lqh-blog-comments

- 点击Settings -> Environment Variables -> 进入环境变量配置页，并配置三个环境变量 LEAN_ID, LEAN_KEY 和 LEAN_MASTER_KEY 。它们的值分别对应上一步在 LeanCloud 中获得的 APP ID, APP KEY, Master Key。
  【注】如果你使用 LeanCloud 国内版，请额外配置 LEAN_SERVER 环境变量，值为你绑定好的域名。
  ![](/images/Hexo搭建个人博客-Gitlab/comments11.png)

- 环境变量配置完成之后，点击顶部的 Deployments，点击最新的一次部署右侧的 Redeploy 按钮进行重新部署。该步骤是为了让刚才设置的环境变量生效。
  ![](/images/Hexo搭建个人博客-Gitlab/comments12.png)

- 此时会跳转到 Overview 界面开始部署，等待片刻后 STATUS 会变成 Ready。**此时请点击 Visit ，即可跳转到部署好的网站地址，此地址即为你的Vercel服务端地址**。
  ![](/images/Hexo搭建个人博客-Gitlab/comments13.png)

- 打开服务端地址 https://xxx.vercel.app (评论前先登录)
  我的Vercel服务端地址：https://lqh-blog-comments.vercel.app/ (需要开VPN才可以打开，所以添加到项目中也需要开VPN)
  ![](/images/Hexo搭建个人博客-Gitlab/comments14.png)

- 注册管理员，第一个注册用户为管理员(上述弹窗-> 用户注册)
  ![](/images/Hexo搭建个人博客-Gitlab/comments15.png)

- 之后就可以发表评论了：
  ![](/images/Hexo搭建个人博客-Gitlab/comments16.png)

- 访问你的 Waline 管理界面：`https://lqh-blog-comments.vercel.app/ui`
  ![](/images/Hexo搭建个人博客-Gitlab/comments17.png)

**三、项目中引入Waline评论 (上述两个步骤就已经完成服务端的搭建)**

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

#### butterfly 主题，配置waline评论

- `_config.butterfly.yml` 配置评论系统

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

### 添加顶部menu导航栏

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
