# raine · 个人博客 + 流言板（阶段 1）

苹果风个人博客：首页、兴趣页、流言板、黑夜/白天模式、BGM 悬浮开关（绝区零式圆形钮）。

技术栈：Vite 6 + React 19 + React Router 6，纯手写 CSS 变量（无 UI 库、无动画库）。

## 本地运行

```bash
npm install
npm run dev        # http://127.0.0.1:5173
npm run build      # 产物 dist/index.html 是单文件，双击就能打开
npm run preview
```

### 不想开服务器？

`npm run build` 之后直接双击 `dist/index.html`，不需要服务器也不需要命令行。
构建时 JS/CSS 会内联进这个 HTML（约 316KB），图片、音频、视频仍是同级文件夹里的文件，所以 `dist/` 要整个一起带走。

## 目录

```
src/
  pages/        Home / About / Board / Placeholder
  components/   Nav / Footer / BgmPlayer / Reveal
  data/         site.js（资料、兴趣、标签） articles.js（示例文章）
  lib/store.js  留言存储、校验、限流
  styles/       global.css（全部视觉 token）
public/audio/   everything-i-am-preview.m4a
```

## 主题

`html[data-theme]` + `localStorage.theme`，刷新保持；未设置时跟随系统。改色只改 `src/styles/global.css` 顶部变量。

## BGM

- 当前文件：`public/audio/everything-i-am-preview.m4a`，是 Apple Music 提供的 30 秒官方试听（Kanye West《Everything I Am》），仅作占位，循环播放。
- **换成完整版**：购买/获取自己的音频后放进 `public/audio/`，把 `src/components/BgmPlayer.jsx` 顶部的 `TRACK` 改一行即可（支持 mp3 / m4a）。
- 行为：默认静默；点击播放，按钮出现细白呼吸环，再点暂停；切页面、切主题不中断；音量 0.35、循环。
- 按钮形态参考绝区零官网：46px 黑色半透明玻璃圆钮 + 细白描边 + 白色双音符，悬停放大并显示「播放/暂停 BGM」。
- 改音量：`BgmPlayer.jsx` 中 `audio.volume = 0.35`。

## 流言板（阶段 1：localStorage）

- 存储键：`mb.messages.v1`，首访写入 5 条示例留言。
- 接口预留：`src/lib/store.js` 中 `listMessages / addMessage / deleteMessage` 三个函数，接后端时替换实现即可（`.env` 的 `VITE_API_BASE` 已预留）。
- 校验：昵称必填 ≤24 字；内容 2–300 字；邮箱可选且不公开；同浏览器 20 秒限流；内置敏感词过滤。
- 管理员删除：点「管理员」按钮，输入密码（`VITE_ADMIN_PASSWORD`，默认 `admin`）。
  **注意：阶段 1 是纯前端密码，只能防误点，不是安全边界**；阶段 3 改成服务端接口校验。

## 环境变量

复制 `.env.example` 为 `.env`：

| 变量 | 说明 |
| --- | --- |
| `VITE_ADMIN_PASSWORD` | 删除留言密码 |
| `VITE_API_BASE` | 预留后端地址，留空用 localStorage |

## 部署（免费层）

构建命令 `npm run build`，输出目录 `dist`。

- **Vercel**：直接导入仓库，已带 `vercel.json` 回退规则。
- **Netlify**：已带 `netlify.toml`。
- **Cloudflare Pages**：构建命令同上，输出 `dist`；`public/_redirects` 已提供 SPA 回退。

部署后把 `VITE_ADMIN_PASSWORD` 配到平台环境变量里（前端可见，仍非安全方案）。

## 已知限制

- 留言只存在当前浏览器，换设备/清缓存即丢失（阶段 2 接后端）。
- 文章/归档/标签为占位页，阶段 2 实现 Markdown 与详情页。
- 头像、昵称、社交链接为占位，改 `src/data/site.js`。
