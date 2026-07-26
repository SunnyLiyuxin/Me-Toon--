# Me-Toon · 这集，我也看过

> 欢迎回来，2005年的小朋友。
>
> 有些动画，你以为你忘了。
> 但某个下午，你路过电视机前，画面闪过三秒——
> 你就全都想起来了。

---

## 这是什么？

**Me-Toon** 是一个为00后打造的交互式动画回忆平台。

在这里，你不是在“浏览”一个网站。你是回到了一台 Windows XP 电脑前，打开了桌面上的“星际扭蛋机”，用一枚硬币，从记忆深处扭出一个你曾经以为已经忘记的动画片。

你可以走进动画的档案室，听导演对你说说当年的事；你可以走进人物的客厅，和那个小时候最喜欢的角色聊聊天；你还可以给他贴上心情标签，用织布机编织一段回忆，或者给未来的自己寄一封信。

然后，把这一切，贴进你的童年收藏册里。

---

## 为什么是 "Me-Toon"？

**Me-Toon** 是一个三关语：

- **Me** = 我——这是我的动画，我私人的记忆
- **Toon** = 动画——那个陪伴我长大的卡通片
- **Me too** = 我也是——当你说“这集我看过”时，另一个人眼睛亮起来的那一秒

而中文名 **《这集，我也看过》**，就是那句你最想听到的话。

---

## 你可以在这里做什么？

🎮 **转动星际扭蛋机**——投一枚硬币，扭一个记忆星球，解锁一部童年动画

📁 **走进档案室**——读导演写给你的信，听他讲讲这部动画背后的故事

🏠 **逛逛人物客厅**——走进动画的场景里，点一点每个角色，听听他们会说什么

💝 **和角色记忆共振**——
- 贴上心情瓶标签：TA是我的榜样？还是小时候有点怕TA？
- 用记忆织布机：写下“TA教会我的第一件事”
- 寄一封未来信：给十年后的这个角色，或者十年前的自己

📻 **打开记忆电台**——调到一个频率，听一首混杂着蝉鸣和夏日风声的主题曲

📒 **翻看记忆抽屉**——所有你解锁的动画、写下的锦缎、寄出的明信片，都变成贴纸收藏在这里

🏰 **溜达动画城**——在联机广场遇见其他也在回忆的人，轻轻戳一下，说一句“好巧，你也看过这集！”

---

## 它长什么样？

Windows XP 桌面。蓝天白云绿草地。熟悉的银色任务栏。右下角时间定格在某个夏天的下午。

像素风。千禧年。扭蛋机。收音机。贴纸收藏册。

每一个像素都在对你说：**欢迎回来。**

- 桌面壁纸复刻经典 XP “Bliss” 蓝天绿地，左上角是 Win98/2000 风格的像素立体图标（我的电脑 / 回收站 / 网络邻居）。
- 中央“我的乐园”窗口用蓝色渐变标题栏 + 2×2 入口卡片，点击即可进入对应场景。
- 扭蛋机严格还原真实造型：**透明玻璃球罩 + 红色底座**，球罩里塞满 24 颗五光斑斓的梦核扭蛋，错综复杂地堆叠着。
- 全屏覆盖 CRT 扫描线、像素噪点和柔光叠加层，模拟老式显像管显示器的质感。

---

## 给开发者的快速开始

本项目基于 **React 19 + Vite 8**，使用 `vite-plugin-singlefile` 将所有资源内联为单个 HTML 文件，可双击离线打开。

```bash
# 克隆仓库
git clone https://github.com/SunnyLiyuxin/Me-Toon--.git

# 进入项目
cd Me-Toon--

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本（输出单个 dist/index.html）
npm run build

# 本地预览构建产物
npm run preview
```

---

## 页面路由

使用 `react-router-dom` 的 HashRouter，确保单文件部署时路由可用：

```
/                    - 首页桌面（XP Bliss + 像素图标 + 我的乐园窗口 + 任务栏）
/#/gacha             - 星际扭蛋机（透明玻璃罩 + 红色底座 + 24 颗梦核扭蛋）
/#/detail            - 动画详情页
  #archive           - 档案室（导演来信 + 木质相框）
  #livingroom        - 人物客厅（角色档案 + 对话）
  #resonance         - 记忆共振（心情瓶 + 织布机 + 未来信）
/#/collection        - 我的记忆抽屉（收藏册）
/#/radio             - 记忆回响电台（频率调谐 + 8-bit 主题曲）
/#/lobby             - 联机大厅（动画城）
```

> 本地双击打开 `dist/index.html` 时，URL 末尾需带 `#/` 才能正确进入路由，例如 `file:///.../index.html#/gacha`。

---

## 技术栈

| 层 | 技术 |
|----|------|
| 框架 | React 19 + Vite 8 |
| 路由 | react-router-dom 7（HashRouter） |
| 样式 | 纯 CSS（`image-rendering: pixelated` + 多层径向渐变 + `backdrop-filter`） |
| 图标 | 自定义 SVG 图标组件 + CSS 纯手工绘制像素图标 |
| 数据 | 本地 JSON 数据源 + localStorage 持久化（收藏 / 访问记录） |
| 音效 | 8-bit 风格 Web Audio API（Python 脚本预生成 WAV/MP3） |
| 构建 | vite-plugin-singlefile（单 HTML 内联部署） |

### 关键实现

- **像素图标**：左上角三个桌面图标（我的电脑 / 回收站 / 网络邻居）全部用 CSS `box-shadow` + `border` + `radial-gradient` 手工绘制，无图片资源。
- **扭蛋机**：透明玻璃球罩用 5 层 `radial-gradient` 实现五光斑斓梦核光晕 + `backdrop-filter: blur+saturate` 增强玻璃质感；24 颗扭蛋通过 `EGG_POSITIONS` 常量定义错综复杂的绝对定位（5 层 z-index + 散落点缀），12 种鲜艳渐变配色循环使用。
- **CRT 质感**：扫描线 `repeating-linear-gradient` + SVG `feTurbulence` 噪点 + 柔光叠加层，三层 `mix-blend-mode` 混合。
- **8-bit 音效**：投币、扭动、出货、打字机等音效通过 Python 脚本（`scripts/gen_audio.py`）用方波 / 三角波合成 WAV，主题曲为预生成 MP3。
- **隐藏彩蛋**：从 QQ 消息彩蛋进入扭蛋机，或第 5 次扭蛋时，会解锁隐藏动画《大风车》。

---

## 一个动画数据库长这样

```json
{
  "id": "tutu",
  "name": "大耳朵图图",
  "year": 2004,
  "episodes": 104,
  "tagline": "一个机灵淘气、爱胡思乱想的三岁小孩，用他的大耳朵听懂了世间最单纯的快乐与烦恼。",
  "studio": "上海美术电影制片厂",
  "airDate": "2004年6月1日",
  "director": "速达",
  "themeSong": "tutu-theme.mp3",
  "images": {
    "portrait": "./assets/images/detail/cartoons/tutu/portrait.png",
    "firstFrame": "./assets/images/detail/cartoons/tutu/first-frame.png"
  },
  "characters": [
    { "id": "hututu", "name": "胡图图", "role": "小男孩", "classicLine": "我是用爱和时间换来的宝贝" }
  ]
}
```

---

## 项目结构

```
me-toon/
├── public/assets/              # 静态资源（图片 / 音频）
│   ├── images/detail/cartoons/tutu/characters/   # 角色档案图
│   └── audio/                  # 8-bit 音效 + 主题曲
├── scripts/                    # 素材生成脚本
│   ├── gen_pixel_art.py        # 像素素材生成
│   └── gen_audio.py            # 8-bit 音频合成
└── src/
    ├── components/             # 通用组件（XpWindow / SvgIcon / Viewport ...）
    ├── data/cartoons.json      # 动画数据库
    ├── hooks/useMedia.js       # 音频播放 + 打字机效果
    └── pages/
        ├── Desktop.jsx         # 首页 XP 桌面
        ├── Gacha.jsx           # 星际扭蛋机
        ├── Detail.jsx          # 详情页框架
        ├── detail/             # 档案室 / 客厅 / 共振
        ├── Collection.jsx      # 记忆抽屉
        ├── Radio.jsx           # 记忆电台
        └── Lobby.jsx           # 动画城
```

---

## 项目状态

🚧 Vibe Coding 中 —— 用情感驱动开发，用像素重建童年。

---

## 一起扭动记忆？

如果你也有想找回的动画，想分享的回忆，欢迎来动画城走走。

或者，打开扭蛋机，投一枚硬币。

你永远不知道，下一个从星球里裂开的，会是哪一部。

---

> "它们没有消失。
> 它们只是藏起来了。"
>
> —— Me-Toon
