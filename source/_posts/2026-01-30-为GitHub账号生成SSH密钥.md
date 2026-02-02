---
title: 为GitHub账号生成SSH密钥
date: 2026-01-30 10:16:18
tags:
    - github
    - SSH
categories: Github
cover: /images/为GitHub账号生成SSH密钥/cover.png # 封面图
---


## 设置和查看全局用户名和邮箱 （commit 提交记录时会显示用户名）
- 修改「全局」user.name/user.email（所有仓库通用）
    ```bash
        # 修改全局用户名（填新GitHub账号用户名：lqh1003）
        git config --global user.name "lqh1003"
        # 修改全局邮箱（填新GitHub账号绑定的邮箱，必须是已验证的）
        git config --global user.email "你的新GitHub绑定邮箱@xxx.com"
    ```
- 验证全局配置
    ```bash
        git config --global user.name
        git config --global user.email
    ```


## 为 GitHub 账号生成 SSH 密钥（Windows/macOS/Linux通用行）
- 打开 Git Bash /终端（Windows/macOS/Linux）
- 确认 GitHub 账号已绑定并验证邮箱（生成密钥需用该邮箱，后续绑定到 GitHub）
- 创建/进入.ssh 目录（密钥默认存放目录）
    ```bash
        mkdir -p ~/.ssh && cd ~/.ssh  # 创建并进入.ssh目录，所有系统通用
    ```
- 生成 SSH 密钥（核心命令）
    - 执行以下命令，替换为你的 GitHub 绑定邮箱，全程按回车（无需设置密码，免密使用，设置密码会导致每次推送都要输入）
    ```bash
        # 生成 ed25519 类型密钥(安全度更高)，-C 是备注(填GitHub绑定邮箱)，秘钥名称自定义：id_ed25519_person
        ssh-keygen -t ed25519 -C "你的GitHub绑定邮箱@xxx.com" -f id_ed25519_person
    ```
- 成功之后，`.ssh` 目录会出现 2 个文件
    - `id_ed25519_person`：私钥（核心，不可泄露、不可上传、不可修改）；
    - `id_ed25519_person.pub`：公钥（后续需要复制到 GitHub 账号中）

- 将公钥添加到 GitHub 账号（网页端操作）
    - 完整复制公钥内容
    - 登录 GitHub 账号 → 右上角头像 → Settings（设置） → 左侧菜单栏找到SSH and GPG keys → 右上角 New SSH key；
    - 配置项（按要求填，无需改其他）：
        - Title：填备注（如「本地电脑 - 新账号密钥」，方便识别）；
        - Key type：选择Authentication key **（认证密钥，用于仓库推送 / 拉取）**；
        - Key：直接粘贴完整公钥内容，不要换行；
    - 点击 Add SSH key → 输入 GitHub 账号密码验证，添加成功。

    ![](/images/为GitHub账号生成SSH密钥/ssh.png)

## 验证 SSH 连接（关键，确认密钥生效）
- 先查看 `.ssh` 目录下是否有一个 `config` 文件(没有.txt后缀，不要修改它的格式)
    ```bash
        # 生成密钥时，config 会默认生成下面这一段配置
        Host github.com  # Host秘钥别名默认：github.com 
            HostName github.com
            User git
            IdentityFile C:\Users\\Administrator\.ssh\id_ed25519_person  # 密钥私钥路径
            IdentitiesOnly yes  # 强制Git只使用指定密钥
        
        # 当多个github账号时，可以生成不同名称的秘钥，在这里配置多个Host别名（更换Host别名和秘钥路径即可）
        Host github.com-new
            User git
            IdentityFile C:\Users\\Administrator\.ssh\id_ed25519_new  # 密钥私钥路径
            IdentitiesOnly yes  # 强制Git只使用指定密钥
    ```

- 验证 GitHub SSH 连接，固定命令，无需修改
    ```bash
        # git@xxx 这个名字是 config 中 Host 后面配置的名字，用哪个名字就代表使用哪个秘钥
        ssh -T git@github.com
        
        # 用新账号别名，验证是否匹配新密钥
        ssh -T git@github.com-new
    ```
    - ✅ 成功输出：Hi 你的新账号用户名! You've successfully authenticated, but GitHub does not provide shell access.

- 查看当前远程地址
    ```bash
        # 查看连接远程地址
        git remote -v

        # ✅输出会显示：`git@Host别名:用户名/仓库名.git`，Host别名对应秘钥，如果config中秘钥别名对应的秘钥和github账号对应的秘钥不一致，则无法成功推送代码
        origin  git@github.com:新用户名/仓库名.git (fetch)
        origin  git@github.com:新用户名/仓库名.git (push)

        # 或者删除旧远程关联，添加新的（适配新账号）
        # 1. 删除旧的远程origin
        git remote remove origin
        # 2. 添加新远程地址（替换为：Host别名+用户名+仓库名）
        git remote add origin git@github-new:用户名/仓库名.git
        # 示例：git remote add origin git@github-new:zhangsan/zhangsan.github.io.git
    ```
- 我的做法：我两个github账号， 在 .ssh 文件夹下生成两个不同的秘钥
    - 由于我两个 github 账号下的仓库， `git remote -v` 得到的Host别名都是 git@github.com
    - 而我也不想去修改仓库对应的远程地址，所以我选择修改 config 中对应的秘钥路径来实现暂时的切换
    - 注意：
        - 生成秘钥 → 秘钥名称 → config 里Host别名和对应的秘钥路径 → github账号添加 SSH 秘钥 → 检查仓库远程连接的Host别名和congfig中的配置别名和秘钥路径是否一致...

    ![](/images/为GitHub账号生成SSH密钥/id_ssh_key.png)


## 双账号切换 + 验证
- 操作新账号（github用户名2，Host别名 github.com-person）
    ```bash
    eval "$(ssh-agent -s)"  # 启动SSH代理
    ssh-add -D               # 清空旧密钥，避免冲突
    ssh-add ~/.ssh/id_ed25519_person  # 加载新账号密钥
    ssh-add -l               # 验证：仅显示新账号密钥指纹
    ssh -T git@github.com-person  # 验证SSH连接
    ```
- 操作旧账号（github用户名1，Host别名 github.com）
    ```bash
    eval "$(ssh-agent -s)"  # 启动SSH代理
    ssh-add -D               # 清空新密钥
    ssh-add ~/.ssh/id_ed25519  # 加载旧账号密钥
    ssh-add -l               # 验证：仅显示旧账号密钥指纹
    ssh -T git@github.com    # 验证SSH连接
    ```