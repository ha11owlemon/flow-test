# Docusaurus 文档链路测试

基于 Docusaurus 3.10.2 的本地测试项目，使用 JavaScript classic 模板和中文界面。文档使用普通 `.md` 格式及 YAML frontmatter，便于后续通过 Sveltia CMS 编辑。

## 本地运行

需要 Node.js 20 或更高版本，以及 npm。

```powershell
npm ci
npm start
```

打开 <http://localhost:3000>，首页会跳转到第一篇测试文档。首次初始化时已安装依赖，当前机器可直接运行 `npm start`。

如果默认的 3000 端口被占用，可在 Windows PowerShell 中使用以下命令（本次预览使用此端口），打开 <http://127.0.0.1:3001>：

```powershell
npm.cmd start -- --host 127.0.0.1 --port 3001 --no-open
```

## 测试文档

| 文件 | 内容 | 预览路径 |
| --- | --- | --- |
| `docs/edit-content-test.md` | 标题、正文、列表、引用及代码块的编辑测试 | `/docs/edit-content-test` |
| `docs/publish-verification-test.md` | 测试标记和 GitHub / Actions 验证记录 | `/docs/publish-verification-test` |

每篇文档包含 `id`、`title`、`sidebar_position`、`description` 字段；正文位于 frontmatter 后。测试时可修改 `title`、`description` 和正文，保留 `id` 以维持页面地址。

## 构建与预览

```powershell
npm run build
npm run serve
```

静态产物输出到 `build/`。`node_modules/`、`build/` 和 `.docusaurus/` 已被 `.gitignore` 排除；后续上传源代码时应保留 `package-lock.json`。

## 后续链路接入

当前已准备本地站点和两篇测试文档。Sveltia CMS、GitHub 仓库连接及 GitHub Actions 工作流尚待配置。

接入 CMS 时，文档集合目录使用 `docs`，文件扩展名使用 `md`，正文对应 `body` 字段。部署时需将 `docusaurus.config.js` 中的 `url` 和 `baseUrl` 调整为实际站点地址和路径。

官方初始化说明：<https://docusaurus.io/docs/installation>。
