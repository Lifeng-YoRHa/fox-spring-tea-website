# Fox Spring Tea 网站

为 `www.fox-spring-tea.xyz` 准备的轻量静态网站，提供 Excel 文件下载。

## 本地预览

直接用浏览器打开 `index.html` 即可。

```
fox-spring-tea-website/
├── index.html
├── assets/
│   └── style.css
└── files/
    ├── sample-data-01.xlsx
    └── sample-data-02.xlsx
```

## 添加新的 Excel 文件

1. 把 `.xlsx` 或 `.xls` 文件放入 `files/`。
2. 编辑 `index.html`，在 `<ul class="file-list">` 中新增一行：
   ```html
   <li>
     <a href="files/你的文件名.xlsx" download>显示名称</a>
     <span class="file-meta">备注信息</span>
   </li>
   ```
3. 保存后刷新浏览器检查链接是否能正常下载。

## 部署到 GitHub Pages

1. 在 GitHub 新建仓库，例如 `fox-spring-tea-website`。
2. 初始化本地仓库并推送：
   ```bash
   cd fox-spring-tea-website
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/你的用户名/fox-spring-tea-website.git
   git push -u origin main
   ```
3. 进入 GitHub 仓库 → Settings → Pages。
4. Source 选择 "Deploy from a branch"，Branch 选择 `main`，文件夹选择 `/ (root)`，保存。
5. 等待几分钟后，访问 `https://你的用户名.github.io/fox-spring-tea-website/`。

## 绑定自定义域名（可选）

若要把 `www.fox-spring-tea.xyz` 绑定到 GitHub Pages：

1. 在仓库根目录创建文件 `CNAME`，内容一行：
   ```
   www.fox-spring-tea.xyz
   ```
2. 在域名服务商的 DNS 管理页面添加一条 CNAME 记录：
   - 主机记录：`www`
   - 记录类型：`CNAME`
   - 记录值：`你的用户名.github.io`
3. 等待 DNS 生效（通常几分钟到几小时），访问 `https://www.fox-spring-tea.xyz`。

> 注意：如果后续决定不绑定域名，可删除仓库中的 `CNAME` 文件。

## 项目约定

详见 `CLAUDE.md`。
