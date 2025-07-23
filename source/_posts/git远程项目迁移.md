---
title: git远程项目迁移
date: 2025-07-11 18:22:52
tags: git
---

#### 1、克隆待迁移的 git 项目到本地

```bash
git clone --mirror https://xxx/xxx/oldProject.git
```

#### 2、进入本地克隆的 git 项目 cd oldProject.git

#### 3、在 gitlib 上创建对应的空项目，https://xxx/xxx/newProject.git

#### 4、在 oldProject.git 命令窗口下

- 执行下方命令修改 git 地址为新项目地址：

```bash
git remote set-url origin https://xxx/xxx/newProject.git
```

- 推送已修改 git 到新地址，完成迁移

```bash
git push -f origin --mirror
```

#### 5、可以删除旧项目和 oldProject.git
