---
title: Hexo + GitHub Pages搭建个人静态博客
date: 2025-12-30 21:11:08
categories: [项目]
tags: [静态博客]
---

## 引言

基于 **Hexo + GitHub Pages + Fluid主题 + GitHub Actions** 技术栈，搭建了一个个人静态博客。

本文详细记录从环境搭建到自动化部署的完整流程，梳理了遇到的典型问题、核心技术点与解决方案。

## 一、整体流程概览

整个博客搭建过程分为5个核心阶段：

暂时无法在豆包文档外展示此内容

- 核心目标：项目可视化、简历安全、学习轨迹清晰
    
- 技术栈：Hexo 6.x + Node.js 18.x + Git 2.43.x + Fluid 1.9.x + GitHub Actions
    
- 最终效果：密码保护简历、分类学习记录、Google Analytics流量统计、自动化部署
    

## 二、分阶段详细流程与技术解析

### 阶段一：环境搭建与Hexo初始化（基础准备）

#### 核心目标

搭建本地开发环境，生成Hexo博客基础架构，实现本地预览。

#### 关键步骤

1. **依赖安装**
    
    1. 安装Node.js（LTS版本）：提供Hexo运行环境，npm用于管理依赖
        
    2. 安装Git：用于版本控制与GitHub Pages部署
        
    3. 验证命令：`node -v`、`npm -v`、`git --version`
        
2. **Hexo初始化**
    
    ```Bash
    # 全局安装Hexo CLI
    npm install -g hexo-cli
    # 初始化博客目录
    hexo init my-blog
    cd my-blog
    # 安装依赖
    npm install
    # 本地启动预览
    hexo server
    ```
    
      访问 `http://localhost:4000` 即可看到默认博客页面。
    

#### 遇到的问题与解决方案


| 问题现象                     | 根本原因               | 解决方案                                                                        |
| ------------------------ | ------------------ | --------------------------------------------------------------------------- |
| 执行`hexo server`报错“找不到命令” | 还没有执行hexo c和g      | Hexo clean<br><br>Hexo generate                                             |
| Git克隆主题速度极慢（22KiB/s）     | Git未走代理，GitHub访问受限 | 配置Git代理：`git config --global http.proxy socks5://127.0.0.1:7897`(后面这里出现问题了) |

#### 核心技术点

- **Hexo核心原理**：静态网站生成器（SSG），本地编译Markdown为HTML，部署时仅需推送静态文件
    
- **npm与Maven对标**：npm是Node.js的包管理器，类似Java的Maven，通过`package.json`管理依赖
    
- **Git基础操作**：`git clone`（克隆仓库）、`git config`（配置代理）、`git --version`（验证安装）
    

### 阶段二：个性化配置（就业导向优化）

#### 核心目标

重构博客结构，适配个人需求：项目卡片化、简历加密、学习分类。

#### 关键步骤

1. **主题更换（Fluid）**
    
    1. 下载主题：`git clone https://github.com/fluid-dev/hexo-theme-fluid.git themes/fluid`
        
    2. 启用主题：修改根目录`_config.yml`，设置`theme: fluid`
        
    3. 配置语言：`language: zh-CN`（实现中文界面）
        
2. **菜单重构（三大核心模块）**
    

为避免直接修改主题内置配置文件（升级主题时易被覆盖），需在博客根目录手动新建`_config.fluid.yml`文件，所有主题相关的自定义配置均在此文件中进行，实现对Fluid主题默认配置的覆盖式修改。

1. 修改根目录`_config.fluid.yml`，配置菜单：
    
    ```YAML
    navbar:
      menu:
        - { key: "首页", link: "/", icon: "fas fa-home" }
        - key: "学习"
          link: "/categories/"
          icon: "fas fa-book"
          submenu:
            - { key: "科研记录", link: "/categories/科研/", icon: "fas fa-microscope" }
            - { key: "后端开发", link: "/categories/后端/", icon: "fas fa-server" }
        - { key: "项目", link: "/categories/项目", icon: "fas fa-project-diagram" }
        - { key: "简历", link: "/resume/", icon: "fas fa-file-alt" }
        - { key: "关于", link: "/about/", icon: "fas fa-user" }
    ```

这里对link部分我分了两种情况，对于前面三个，使用`/categories/`,与菜单栏匹配到一起，对建立和关于部分，不需要关注这个问题，我与文件夹做了关联。

2. **项目页卡片化（Links布局魔改）**
    
    1. 创建项目页面：`hexo new page projects`
        
    2. 配置布局：修改`source/projects/index.md`，添加`layout: links`
        
    3. 配置项目数据：创建`source/_data/links.yml`，按分类配置项目卡片：
        
        ```YAML
        - class_name: BIM/数字化建设
          class_desc: Revit二次开发与IFC标准工具
          link_list:
            - name: 结构智能配筋插件
              link: "/2026/01/01/revit-autopipe-detail/"
              icon: fas fa-building
              intro: 基于C#开发，自动化生成钢筋模型，效率提升50%
        - class_name: Java全栈开发
          class_desc: 微服务架构与高并发应用
          link_list:
            - name: 校园二手交易平台
              link: "https://github.com/zhushuohaiya/xxx"
              icon: fas fa-code
              intro: Spring Cloud Alibaba + Nacos 微服务治理
        ```
        
3. **简历加密（防爬保护）**
    
    1. 安装插件：`npm install hexo-blog-encrypt --save`
        
    2. 创建简历页面：`hexo new page resume`
        
    3. 配置加密：修改`source/resume/index.md`：
        
        ```yaml
        ---
        title: 个人简历（密码保护）
        date: 2025-12-16
        type: "resume"
        password: "HR-Access-2026" # 自定义密码
        abstract: "请输入密码查看详细简历"
        message: "联系我获取访问权限"
        ---
        # 个人信息
        - 姓名：XXX
        - 方向：BIM+Java+AI全栈开发
        # 核心技能
        - 后端：Java、Spring Boot/Cloud、MyBatis-Plus
        - BIM：Revit二次开发、IFC标准、BIM模型轻量化
        ```
        
4. **学习记录分类**
    
    1. 创建分类页面：`hexo new page categories`、`hexo new page tags`
        
    2. 文章分类配置：新建学习记录时，在Front-matter中指定分类：
        
        ```YAML
        ---
        title: Spring Boot启动流程分析
        date: 2025-12-16
        categories: [后端] # 对应菜单“后端开发”
        tags: [Java, Spring Boot]
        ---
        ```
        

#### 遇到的问题与解决方案

| 问题现象                 | 根本原因             | 解决方案                                      |
| -------------------- | ---------------- | ----------------------------------------- |
| 主题更换后页面无变化           | YAML格式错误（冒号后无空格） | 检查`_config.yml`，确保`theme: fluid`（冒号后有空格）  |
| 项目页显示默认数据（Fluid示例卡片） | 未清空主题默认链接配置      | 在`_config.fluid.yml`中添加`links: items: []` |
| 学习子菜单打开空白            | 无对应分类的文章         | 发布至少一篇指定分类的文章（`categories: [科研]`）         |
| 简历加密不生效              | 未安装插件或配置错误       | 1. 确认插件安装成功；2. 确保`type: "resume"`配置正确     |

#### 核心技术点

- **Fluid主题覆盖配置**：通过根目录`_config.fluid.yml`覆盖主题默认配置，避免升级主题丢失自定义设置
    
- **YAML语法规范**：键值对需`key: value`（冒号后必须有空格），缩进统一用空格
    
- **Hexo页面类型**：`layout: links`（卡片布局）、`type: "resume"`（加密页面）、`categories`（分类页面）
    
- **Markdown Front-matter**：文章元数据配置，用于分类、标签、日期等识别
    

### 阶段三：部署到GitHub Pages（公网访问）

#### 核心目标

将本地博客部署到GitHub Pages，实现公网访问。

#### 关键步骤

1. **创建GitHub仓库**
    
    1. 仓库命名规则：`用户名.github.io`
        
    2. 权限设置：设为Public（公开访问）
        
2. **配置Hexo部署**
    
    1. 安装部署插件：`npm install hexo-deployer-git --save`
        
    2. 修改根目录`_config.yml`：
        
        ```YAML
        deploy:
          type: git
          repo: https://github.com/zhushuohaiya/zhushuohaiya.github.io.git
          branch: main # 部署分支
        ```
        
3. **执行部署**
    
    ```Bash
    hexo clean && hexo generate && hexo deploy
    ```
    
    2. 认证：首次部署需输入GitHub用户名和Personal Access Token（PAT）
        
    3. 验证：部署成功后访问`https://用户名.github.io`
        

#### 遇到的问题与解决方案

|                    |                          |                                                                                     |
| ------------------ | ------------------------ | ----------------------------------------------------------------------------------- |
| 问题现象               | 根本原因                     | 解决方案                                                                                |
| 部署报错“Spawn failed” |                          |                                                                                     |
| 部署成功但网站未更新         | 浏览器缓存或GitHub Pages生效延迟   | 1. 强制刷新（Ctrl+F5）；2. 等待1-2分钟；3. 清除DNS缓存                                              |
| GitHub认证失败（密码登录被拒） | GitHub停用密码登录，需用PAT       | 生成PAT：GitHub -> Settings -> Developer settings -> Personal access tokens，勾选`repo`权限 |
| 国内访问速度慢/无法访问       | GitHub Pages服务器在海外，DNS污染 | 1. 购买自定义域名（阿里云/腾讯云）；2. 配置Cloudflare CDN加速（免费版足够）                                    |

#### 核心技术点

- **GitHub Pages规则**：仓库名必须为`用户名.github.io`，自动部署main分支的静态文件
    
- **PAT生成与使用**：Personal Access Token用于Git认证，需勾选`repo`权限，生成后仅显示一次
    
- **Hexo部署流程**：`hexo clean`（清理缓存）→ `hexo generate`（编译静态文件）→ `hexo deploy`（推送至GitHub）
    
- **静态网站优势**：无后端、无数据库，访问速度快、安全性高，适合展示型博客
    

### 阶段四：功能增强

#### 核心目标

添加技术博客必备功能。

#### 关键功能配置

1. **流量统计（Google Analytics 4）**
    
    1. 注册GA4账号，获取Measurement ID（如`G-DH7L4X91MB`）
        
    2. 配置`_config.fluid.yml`：
        
        ```YAML
        web_analytics:
          enable: true
          google:
            measurement_id: ******
        ```
        
2. **站内搜索**
    
    1. 安装插件：`npm install hexo-generator-search --save`
        
    2. 配置`_config.fluid.yml`：
        
        ```YAML
        search:
          enable: true
          path: /local-search.xml
          field: post
          content: true
        ```
        
3. **代码块优化**
    

4. 配置`_config.fluid.yml`，添加复制按钮、行号：
    
    ```YAML
    code:
      copy_btn: true # 复制按钮
      highlight:
        enable: true
        line_number: true # 显示行号
    ```
    

4. **打字机动画**
    
    ```YAML
    fun_features:
      typing:
        enable: true
        typeSpeed: 70
        cursorChar: "|"
        loop: true
    ```
    

#### 核心技术点

- **第三方工具集成**：GA4流量统计、站内搜索插件，均通过Hexo插件生态实现
    
- **Fluid主题功能扩展**：无需修改源码，通过配置文件即可启用大部分增强功能
    
- **前端优化**：代码块复制、打字机动画，提升用户体验，凸显技术细节关注
    

### 阶段五：自动化部署（GitHub Actions）

#### 核心目标

实现“推送源码即部署”，摆脱本地环境依赖，降低维护成本。

#### 关键步骤

1. **分支分工**
    
    1. `source`分支：存放Hexo源码（Markdown、配置文件）
        
    2. `main`分支：存放编译后的静态文件（由Actions自动生成）
        
2. **创建Actions工作流文件**
    路径：/.github/workflows/deploy.yml

3. 创建`/.github/workflows/deploy.yml`：
    
    ```YAML
    name: Hexo CI/CD Deployment
    on:
      push:
        branches:
          - source # 监听源码分支推送
    jobs:
      build-and-deploy:
        runs-on: ubuntu-latest
        steps:
          - name: Checkout Source
            uses: actions/checkout@v4
            with:
              submodules: true
          - name: Set up Node.js
            uses: actions/setup-node@v4
            with:
              node-version: '20'
          - name: Install Dependencies
            run: 
              npm install
              npm install hexo-cli -g
        
          - name: Generate Static Files
              run: 
                hexo clean
                hexo generate
                
          - name: Deploy to GitHub Pages
            uses: peaceiris/actions-gh-pages@v4
            with:
              deploy_key: ${{ secrets.HEXO_DEPLOY_KEY }}
              publish_branch: main # 部署到目标分支
              publish_dir: ./public
              commit_message: "Auto Deploy: ${{ github.event.head_commit.message }}"
    ```
    

4. **测试自动化部署**
    
    ```Bash
    # 提交源码到master分支
    git add .
    git commit -m "测试自动化部署"
    git push origin source
    ```

推送后Github Actions会自动执行工作流：拉取代码→编译→部署到 GitHub Pages

验证：GitHub→Actions标签页，查看工作流是否成功运行（绿色对勾）

#### 核心技术点

- **CI/CD核心原理**：通过GitHub Actions在云端服务器完成“安装依赖→编译→部署”，摆脱本地环境依赖
    
- **SSH密钥认证**：Deploy keys用于仓库写入权限，Secrets存储私钥，保证安全
    
- **GitHub Actions工作流**：`on`（触发条件）→ `jobs`（执行任务）→ `steps`（步骤），基于YAML配置
    
- **分支管理**：源码与部署产物分离，`source`维护源码，`main`存放静态文件，便于版本控制
    

## 三、核心技术点汇总

### 1. Hexo核心技术

|   |   |
|---|---|
|技术点|关键知识点|
|静态网站生成|本地编译Markdown为HTML，部署仅需推送静态文件|
|配置文件|根目录`_config.yml`（全局配置）、`_config.fluid.yml`（主题覆盖配置）|
|页面类型|文章（`source/_posts`）、独立页面（`hexo new page`）、分类/标签页|
|插件生态|`hexo-deployer-git`（部署）、`hexo-blog-encrypt`（加密）、`hexo-generator-search`（搜索）|

### 2. Git与GitHub技术

|   |   |
|---|---|
|技术点|关键知识点|
|基础操作|`git add`/`git commit`/`git push`（提交推送）、`git branch`（分支管理）|
|远程仓库|`git remote add`（关联仓库）、PAT认证（替代密码登录）|
|分支冲突|`git pull --allow-unrelated-histories`（合并不相关历史）|
|GitHub Pages|仓库命名规则、静态文件部署、自定义域名绑定|

### 3. 自动化部署（CI/CD）

|   |   |
|---|---|
|技术点|关键知识点|
|GitHub Actions|工作流配置、触发条件、云端执行环境|
|SSH密钥|公钥（Deploy keys）、私钥（Secrets）、权限配置|
|自动化流程|监听源码分支→安装依赖→编译→部署到目标分支|

    

