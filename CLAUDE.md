# Fox Spring Tea 网站项目约定

## 目的
为 `www.fox-spring-tea.xyz` 域名准备一个轻量静态网站，主要功能是提供 Excel 文件下载链接。

## 目录结构

```
fox-spring-tea-website/
├── .gitignore         # 忽略 OS/编辑器生成的文件
├── CLAUDE.md          # 本文件：项目约定
├── index.html         # 下载列表页（含 admin.html 入口链接）
├── admin.html         # 模拟生意参谋数据后台（测试站）：登录 + 日期选择 + SheetJS 导出 .xls
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

## admin.html 说明

- 用途：配合「景卓腾达数据库MVP」的 `scripts/auto_export_import.py` 做自动化导出→入库测试。
- 登录账密写死在前端（admin / fox2026），仅作演示，不是真实安全机制。
- 导出的 .xls 为 SheetJS biff8 真二进制格式，前 4 行空、第 5 行表头，结构与生意参谋「商品-全部」导出一致。
- 页面数据由「商品ID+日期」伪随机生成；商品ID 使用 9000000000xx 号段，与真实数据不会冲突。切勿把该站数据导入生产数据库。

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
