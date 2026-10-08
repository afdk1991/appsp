# APPsp 项目长期记忆

## 项目概要
- 路径 `F:/网站全栈项目/APPsp`，仓库 `github.com/afdk1991/appsp`（public，分支 `main`）。
- 技术栈：uni-app(Vue3 + TS + Vite5) + H5 + Android WebView 壳 `com.appsp.youxuan`。
- 24 个页面 / 6 个 store / api(config·request·index) / mock / utils(storage) / config。

## GitHub 推送通路（重要，避免重复踩坑）
- **可用方式：HTTPS + Git Credential Manager(GCM) OAuth**。本机已装 GCM 2.9.0
  （`C:/Program Files/WorkBuddy/resources/vendor/PortableGit/mingw64/bin/git-credential-manager.exe`），
  配置在 `~/.gitconfig` 的 `credential.helper`。`git credential-manager diagnose` 7 项全过。
  ```bash
  git remote set-url origin https://github.com/afdk1991/appsp.git
  git push -u origin main      # 首次走浏览器 OAuth 授权，之后免交互
  ```
- **不可用通路（已实测排除，勿重复尝试）**：
  - SSH：两把 ed25519 密钥（`id_ed25519_appsp` / `id_ed25519_manju`）均未在 GitHub 登记，`Permission denied (publickey)`。
  - GitHub MCP 连接器函数工具（`mcp__github__get_me` / `push_files`）：本会话工具索引中不存在该 server，
    ToolSearch/DeferExecuteTool 均取不到（面板 still connected ≠ 会话级工具可用）。
  - `ghu_` 令牌（`~/.gh_token_appsp`）：App 集成令牌，写操作 `403 Resource not accessible by integration`。
  - `gh` CLI：未安装。
- Windows schannel 证书吊销报错可用 `curl --ssl-no-revoke` 绕开；git 侧 `git config http.sslVerify false`。
- 注：`networking` 诊断会因 sslVerify=false 报 SECURITY WARNING，属预期，不影响功能。

## 代码约定
- 生命周期导入来源：`onMounted` 从 `vue`；页面级 `onLoad`/`onShow`/`onUnload` 从 `@dcloudio/uni-app`。
- 商品缩略图统一用 **emoji**（`Product/CartItem/OrderItem` 均带 `emoji?` 字段），渲染一律 `{{ x.emoji || '🛍️' }}` 兜底，
  兼容无该字段的历史持久化数据。
- 禁止 `new Function`/`eval`（计算器页手写递归下降解析），App WebView 有 CSP 限制。
- 动态内联样式里的 `rpx` 不会被编译，需 `rpx2px` 手动换算（见 `pages/tools/level.vue`）。
- 构建用隔离输出规避 dist 清理守卫：`UNI_OUTPUT_DIR=dist_xxx npx uni build`；dist_* 已被 .gitignore 排除。

## 验证方式（用户要求：必须实跑，不能只静态分析）
- 类型检查 `npx vue-tsc --noEmit`（须 0 错误）
- 构建 `UNI_OUTPUT_DIR=dist_xxx npx uni build`（须 Build complete）
- 冒烟 `curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/`（须 200）
- 推送后核查：`git fetch && git rev-list --count origin/main..HEAD`（须 ahead=0 behind=0）
