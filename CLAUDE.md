# Fox Spring Tea 网站项目约定

## 目的
为 `www.fox-spring-tea.xyz` 域名准备一个轻量静态网站，主要功能是提供 Excel 文件下载链接。

## 目录结构

```
fox-spring-tea-website/
├── .gitignore         # 忽略 OS/编辑器生成的文件
├── CLAUDE.md          # 本文件：项目约定
├── index.html         # 唯一页面
├── README.md          # 部署说明
├── assets/            # 样式、图片、图标
│   └── style.css
├── files/             # Excel 文件仓库
│   ├── sample-data-01.xlsx
│   └── sample-data-02.xlsx
└── scripts/           # 一次性脚本
    ├── create-samples.py
    ├── inspect-reference.py
    ├── populate-sales-data.py
    └── verify-links.py
```

## 命名规则

- 文件名：英文小写，单词间用连字符 `-` 分隔。
- Excel 文件：统一放 `files/`，禁止放根目录或其他位置。
- 新增 Excel 文件后，必须在 `index.html` 的下载列表中添加对应链接。

## 文件添加流程

1. 把 `.xlsx` 或 `.xls` 文件复制到 `files/`。
2. 编辑 `index.html`，在 `<ul class="file-list">` 中新增一行：
   ```html
   <li>
     <a href="files/你的文件名.xlsx" download>显示名称</a>
     <span class="file-meta">文件大小 / 更新日期</span>
   </li>
   ```
3. 本地用浏览器打开 `index.html` 检查链接可点击、可下载。

## 部署

使用 GitHub Pages 部署。详细步骤见 `README.md`。

## 修改红线

- 不要删除 `files/` 目录内用户未备份的文件。
- 不要把密钥、token、密码写入本仓库任何文件。
- 修改 `index.html` 前先确认本地预览正常。
