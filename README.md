# Docusaurus 文档与独立 Sveltia CMS 链路测试

文档站使用 Docusaurus 3.10.2，独立 CMS 使用 Sveltia CMS 0.235.1。完整流程：

```text
独立 CMS → GitHub 文档仓库 main 分支 → GitHub Actions → GitHub Pages
```

## 迁入的首页与文章

首页布局摘取自本机 FYSETC Docusaurus 参考项目，保留类别卡片、产品目录、使用指南、类别筛选和资源入口。迁入五篇完整文章及 39 张配图，原有两篇测试文档继续保留。

| 文档 | 仓库位置 | 页面 |
| --- | --- | --- |
| Cheetah v2.0 | `docs/controllers/Cheetah_Board_V20.md` | `/docs/Cheetah_Board_V20/` |
| Silent2209 | `docs/drivers/Silent2209.md` | `/docs/Silent2209/` |
| HV5160 | `docs/drivers/HV5160.md` | `/docs/HV5160/` |
| Mini12864 | `docs/displays/Mini12864_Panel.md` | `/docs/Mini12864_Panel/` |
| UCAN | `docs/modules/UCAN.md` | `/docs/UCAN/` |
| 内容编辑测试 | `docs/edit-content-test.md` | `/docs/edit-content-test/` |
| 发布验证测试 | `docs/publish-verification-test.md` | `/docs/publish-verification-test/` |

FYSETC 文章保留原稿语言。图片统一位于 `static/images/`，正文引用为 `/images/文件名`。Docusaurus 会把 Markdown 和原始 HTML 图片地址适配为 `/flow-test/images/...`；原文驱动计算器保留为 React 组件。

参考项目：`C:/Users/kg/Documents/Codex/2026-10-12/mkdcos-docusaurus-wiki/outputs/fysetc-docusaurus`。文章与图片来源为 [FYSETC Wiki 源仓库](https://github.com/FYSETC/wiki.fysetc)，各篇末尾保留原文链接；原仓库 Apache 2.0 许可证备份位于 `third-party/FYSETC-APACHE-LICENSE.txt`。本仓库用于链路测试。

## 文档站本地运行

需要 Node.js 20 或更高版本：

```powershell
npm.cmd ci
npm.cmd start -- --host 127.0.0.1 --port 3003 --no-open
```

首页：<http://127.0.0.1:3003/flow-test/>。打包预览：

```powershell
npm.cmd run build
npm.cmd run serve -- --host 127.0.0.1 --port 3005 --no-open
```

预览：<http://127.0.0.1:3005/flow-test/>。输出位于 `build/`，不包含 CMS。

## 独立 CMS

`cms/` 有独立依赖、静态构建和服务器，可整个复制到其他目录或服务器。运行时不需要 Docusaurus 或文档仓库的本地 checkout；源码保存在本仓库只是便于复现。

```powershell
npm.cmd --prefix cms ci
npm.cmd run cms:start
```

管理端：<http://127.0.0.1:3004/>。选择 **使用 GitHub 登录**，读取和保存远程 `ha11owlemon/flow-test` 的 `main` 分支。**使用本地仓库**是另一条手工 Git 工作流，不用于本次远程链路。

配置在 `cms/public/config.yml`。目录树读取 `docs/`，每篇普通 Markdown 文件是一条文档。新建时填写唯一 ID 和固定页面地址，例如 `/My_New_Document`，发布地址就是 `/flow-test/docs/My_New_Document/`。已有 ID 和页面地址应保持不变。目录分类由 `_category_.json` 定义，文档顺序用 `sidebar_position`。

正文采用 Markdown 源码模式，保留 HTML 表格等内容。通用预览不能完整渲染 Docusaurus 自定义组件，实际效果以前台构建页面为准。

普通 Markdown 文档可通过正文工具栏切换到可视化模式，再用图片按钮从资源库选择或上传并插入图片。源码模式的图片按钮只插入 Markdown 占位符，需填入资源库复制的公开路径。含原始 HTML 表格、驱动计算器等自定义组件的文档建议使用源码模式，避免可视化转换改变格式。

### 图片上传

CMS 顶层、文档集合和资产库都显式配置：

```yaml
media_folder: /static/images
public_folder: /images
```

上传会提交到 **远程文档仓库的 `static/images/`**，正文插入 `/images/文件名`；不会上传到 CMS 服务器本地，也不会随文章子目录改变。Pages 图片公开地址为 `https://ha11owlemon.github.io/flow-test/images/文件名`。

### 本机 OAuth 凭据

GitHub OAuth App 的 Homepage URL 可填 `http://127.0.0.1:3004/` 或公开仓库 URL；Authorization callback URL 填 `http://127.0.0.1:8787/callback`。

采用官方 [Sveltia CMS Authenticator](https://github.com/sveltia/sveltia-cms-auth)。首次下载：

```powershell
git clone --depth 1 https://github.com/sveltia/sveltia-cms-auth.git .local-services/sveltia-cms-auth
Set-Location .local-services/sveltia-cms-auth
pnpm install --frozen-lockfile
```

在认证服务目录创建被 Git 忽略的 `.dev.vars`：

```dotenv
GITHUB_CLIENT_ID=你的OAuthAppClientID
GITHUB_CLIENT_SECRET=你的OAuthAppClientSecret
ALLOWED_DOMAINS=127.0.0.1
```

启动认证服务（凭据变更后重启）：

```powershell
.\node_modules\.bin\wrangler.cmd dev --local --ip 127.0.0.1 --port 8787 --show-interactive-dev-session=false
```

CMS 的 `backend.base_url` 指向 `http://127.0.0.1:8787`。OAuth App 若显示自动过期令牌选项，本机演练先使用不自动过期的设置，当前认证器没有刷新令牌逻辑。Secret 只留在认证服务，不提交、不写入 CMS 静态文件。

## 公司服务器独立部署

先部署可访问 GitHub 的 OAuth 客户端，再构建独立 CMS：

```powershell
$env:CMS_AUTH_URL = 'https://auth.company.example'
npm.cmd run cms:build
```

将 `cms/dist/` 部署到管理域名站点根目录，例如 `https://cms.company.example/`。无需复制进文档站。可选 Docker/Nginx 入口：

```text
docker build --build-arg CMS_AUTH_URL=https://auth.company.example -t flow-test-cms ./cms
docker run --rm -p 8080:80 flow-test-cms
```

HTTPS 由公司反向代理提供。将 OAuth App 回调改为 `https://auth.company.example/callback`，认证器 `ALLOWED_DOMAINS` 改为 CMS 主机名（不含协议、端口或路径）。GitHub 权限仍由登录用户对仓库的写入权限决定。

CMS 和认证服务可以位于内网，无需公网 IP：GitHub 让编辑人员的浏览器跳转到回调地址，浏览器能访问它即可。浏览器需要访问 GitHub 登录与 API，认证服务器需要向 GitHub 发出 HTTPS 请求以交换令牌。

## GitHub Actions 与 Pages

工作流 `.github/workflows/build.yml` 在推送到 `main`、更新面向 `main` 的 PR 或手动运行时触发，使用 Node.js 24 与 `npm ci` 构建。主分支部署到 Pages，PR 只构建；Settings → Pages → Source 应为 **GitHub Actions**。

同一工作流、同一分支使用 `concurrency` 与 `cancel-in-progress: true`。连续保存会产生多个运行记录，新运行取消未完成的旧运行，保留最新构建。文档工作流不打包 CMS。

文档站：<https://ha11owlemon.github.io/flow-test/>。

## 官方资料

- [Sveltia CMS 介绍](https://sveltiacms.app/en/docs/intro)
- [GitHub 后端与认证](https://sveltiacms.app/en/docs/backends/github)
- [目录树集合](https://sveltiacms.app/en/docs/collections/entries/nested)
- [图片存储路径](https://sveltiacms.app/en/docs/media/internal)
- [Docusaurus](https://docusaurus.io/docs)
