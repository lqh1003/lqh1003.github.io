---
title: git远程项目迁移
date: 2025-07-11 18:22:52
tags: git
---

#### 1、克隆待迁移的git项目到本地
``` bash
git clone --mirror https://xxx/xxx/oldProject.git
```

#### 2、进入本地克隆的git项目  cd oldProject.git


#### 3、在gitlib上创建对应的空项目，https://xxx/xxx/newProject.git

#### 4、在oldProject.git 命令窗口下
+ 执行下方命令修改git地址为新项目地址：
```
git remote set-url origin https://xxx/xxx/newProject.git
```
+ 推送已修改git到新地址，完成迁移
```
git push -f origin --mirror
```

#### 5、可以删除旧项目和oldProject.git