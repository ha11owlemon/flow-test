# Docusaurus 文档链路测试

基于 Docusaurus 3.10.2 的本地测试项目，使用 JavaScript classic 模板和中文界面。文档使用普通 `.md` 格式及 YAML frontmatter，便于后续通过 Sveltia CMS 编辑。

## 本地运行

需要 Node.js 20 或更高版本，以及 npm。

```powershell
npm ci
npm start
```

打开 <http://localhost:3000/flow-test/>，首页会跳转到第一篇测试文档。首次初始化时已安装依赖，当前机器可直接运行 `npm start`。

如果默认的 3000 端口被占用，可在 Windows PowerShell 中使用以下命令（本次预览使用此端口），打开 <http://127.0.0.1:3001/flow-test/>：

```powershell
npm.cmd start -- --host 127.0.0.1 --port 3001 --no-open
```

## 测试文档

| 文件 | 内容 | 预览路径 |
| --- | --- | --- |
| `docs/edit-content-test.md` | 标题、正文、列表、引用及代码块的编辑测试 | `/flow-test/docs/edit-content-test/` |
| `docs/publish-verification-test.md` | 测试标记和 GitHub / Actions 验证记录 | `/flow-test/docs/publish-verification-test/` |

每篇文档包含 `id`、`title`、`sidebar_position`、`description` 字段；正文位于 frontmatter 后。测试时可修改 `title`、`description` 和正文，保留 `id` 以维持页面地址。

## 构建与预览

```powershell
npm run build
npm run serve
```

静态产物输出到 `build/`。`node_modules/`、`build/` 和 `.docusaurus/` 已被 `.gitignore` 排除；后续上传源代码时应保留 `package-lock.json`。

## GitHub Actions 构建与部署

工作流文件：`.github/workflows/build.yml`，在推送到 `main`、向 `main` 提交或更新 Pull Request，以及手动运行时触发。

工作流使用 Node.js 24，通过 `npm ci` 安装锁定的依赖，再执行 `npm run build`。成功后将 `build/` 上传为 `docusaurus-static-site` 构建产物，保留 7 天，可在 GitHub Actions 对应运行页面的 Artifacts 区域下载。

推送到 `main` 或手动运行 `main` 分支的工作流时，会额外上传 GitHub Pages 专用产物，再由 `deploy` 任务将 `build/` 的内容部署到 Pages。Pull Request 只构建和上传可下载产物。

首次使用需要在仓库 **Settings → Pages → Build and deployment → Source** 中选择 **GitHub Actions**。不要将源码的 `main` 分支或 `docs/` 文件夹作为 Pages 发布来源：这里保存的是 Docusaurus 源码，真正可发布的静态 HTML 在构建后的 `build/` 中。

提交并推送修改后，在仓库 Actions 页面查看 **Build and deploy Docusaurus** 工作流，等待 `build` 和 `deploy` 成功，再打开 <https://ha11owlemon.github.io/flow-test/>。也可使用 `Run workflow` 手动触发。

使用的官方 Actions：[checkout](https://github.com/actions/checkout)、[setup-node](https://github.com/actions/setup-node)、[upload-artifact](https://github.com/actions/upload-artifact)、[GitHub Pages 部署说明](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。

## 后续链路接入

当前已准备本地站点、两篇测试文档和 GitHub Actions 构建及 Pages 部署工作流。Sveltia CMS 尚待配置。

接入 CMS 时，文档集合目录使用 `docs`，文件扩展名使用 `md`，正文对应 `body` 字段。`docusaurus.config.js` 已配置 GitHub Pages 的 `url` 和 `/flow-test/` 路径；若更换仓库名称或使用自定义域名，需同步调整这两项。

官方初始化说明：<https://docusaurus.io/docs/installation>。
