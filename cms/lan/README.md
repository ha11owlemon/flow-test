# 局域网测试入口

本机当前以太网地址为 `192.168.0.171`。Caddy 提供统一 HTTPS 入口，内部服务保持监听 `127.0.0.1`：

| 用途 | 局域网地址 | 内部服务 |
| --- | --- | --- |
| 独立 CMS | `https://192.168.0.171:8443/` | `127.0.0.1:3004` |
| 中文文档 | `https://192.168.0.171:8443/flow-test/` | `127.0.0.1:3005` |
| 英文文档 | `https://192.168.0.171:8443/flow-test/en/` | 同上 |
| OAuth 回调 | `https://192.168.0.171:8443/callback` | `127.0.0.1:8787` |

## GitHub OAuth App

保留现有 Client ID 和 Client Secret，修改 App 设置：

- **Homepage URL**：`https://192.168.0.171:8443/`
- **Authorization callback URL / 第一个 Redirect URI**：`https://192.168.0.171:8443/callback`

把原来的 `http://127.0.0.1:8787/callback` 替换为以上地址。当前官方认证器发起 GitHub 授权时没有传 `redirect_uri`，GitHub 使用 App 的首个回调地址；仅增加一个排在后面的地址不能完成切换。Homepage URL 是应用介绍/访问入口，回调地址实际接收 GitHub 授权 code。回调由编辑人员的浏览器访问，内网部署无需公网 IP。

启动脚本会把认证服务 `.local-services/sveltia-cms-auth/.dev.vars` 的 `ALLOWED_DOMAINS` 设为 `127.0.0.1,192.168.0.171`，保留凭据并将构建后 CMS 的 `backend.base_url` 设为 `https://192.168.0.171:8443`。这些运行数据被 Git 忽略。切换后本机也通过 HTTPS 局域网入口登录，避免两个地址之间的 OAuth Cookie 不一致。

每位编辑人员使用自己的 GitHub 账号；账号需获得目标仓库写权限，组织仓库还需满足组织的 OAuth/SSO 授权要求。浏览器需能访问 GitHub 登录与 API，认证服务需能向 GitHub 交换令牌。

## 证书信任与防火墙

Caddy `tls internal` 为内网 IP 签发证书，无需公网域名。认证器的 CSRF Cookie 使用 `Secure`，因此局域网入口使用 HTTPS。

启动后公开根证书位于 `.local-services/lan/caddy-root.crt`。将**这个文件**复制给测试电脑，Windows 可在该电脑 PowerShell 执行：

```powershell
Import-Certificate -FilePath .\caddy-root.crt -CertStoreLocation Cert:\CurrentUser\Root
```

安装到当前用户的“受信任的根证书颁发机构”，重新打开浏览器后再访问以上 HTTPS 地址。受公司管理的电脑按公司证书策略安装。不要分发 Caddy `data/` 目录，里面有 CA 私钥。

服务电脑需允许同一网段入站 TCP 8443。以下是配置命令，需要管理员 PowerShell；不修改网络类型或关闭防火墙：

```powershell
New-NetFirewallRule -Name 'FlowTest-Caddy-LAN-8443' -DisplayName 'FlowTest Caddy HTTPS LAN' -Direction Inbound -Action Allow -Protocol TCP -LocalAddress 192.168.0.171 -LocalPort 8443 -RemoteAddress 192.168.0.0/24 -Profile Private,Domain
```

也可在仓库根目录的管理员 PowerShell 运行 `.\cms\lan\Enable-LanFirewall.ps1`，可重复执行以更新这条测试规则。

测试电脑应处于可路由到 `192.168.0.171` 的局域网，且此电脑不休眠。

## 启动与停止

前提：根项目和 `cms/` 依赖已安装，官方认证器依赖和 `.dev.vars` 已准备，Caddy 可执行文件放在 `.local-services/caddy/caddy.exe`。本机使用 Caddy 2.11.7，下载包按官方 SHA512 校验。

在仓库根目录运行：

```powershell
npm.cmd run build
.\cms\lan\Start-Lan.ps1
```

脚本构建 CMS、验证 Caddy 配置，然后在后台启动 CMS、文档预览、OAuth 和 Caddy。进程记录、日志及证书保存在 `.local-services/lan/`。停止已记录服务：

```powershell
.\cms\lan\Stop-Lan.ps1
```

IP 变化时先停止，再执行 `.\cms\lan\Start-Lan.ps1 -LanHost 新IP`，同步更新 OAuth Homepage/首个回调、防火墙地址。建议通过 DHCP 保留地址维持稳定入口。

CMS 两个文档集合分别编辑远程 `docs/` 和 `i18n/en/docusaurus-plugin-content-docs/current/`，两种语言共用远程 `static/images/`。CMS 保存到 GitHub 后，线上 Pages 由工作流更新；局域网文档预览使用本机 `build/` 快照，需要先同步远程、重新执行 `npm.cmd run build` 才会更新。CMS 的文章预览链接继续指向 GitHub Pages。

仅上传、替换或删除 `static/images/` 内资源会跳过工作流，随后修改中文或英文文档时会构建并一并发布当前图片；需要立即发布图片时可手动运行工作流。

参考：[Caddy 内网 HTTPS](https://caddyserver.com/docs/automatic-https#local-https)、[GitHub OAuth 回调规则](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#redirect-urls)。
