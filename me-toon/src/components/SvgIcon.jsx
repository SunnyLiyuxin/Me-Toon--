import './SvgIcon.css'

/**
 * SVG 简笔画图标库
 * 统一风格：1.8px 描边、圆头线帽、XP 调色板
 * 替换项目里所有 emoji
 *
 * 用法：<SvgIcon name="tv" size={20} color="#0054E3" />
 */
export default function SvgIcon({ name, size = 20, color = 'currentColor', className = '', strokeWidth = 1.8 }) {
  const paths = ICON_PATHS[name]
  if (!paths) {
    console.warn(`SvgIcon: 未找到图标 "${name}"`)
    return null
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`svg-icon svg-icon-${name} ${className}`}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths}
    </svg>
  )
}

/**
 * 所有简笔画 path 定义
 * 风格：单线条简笔画，类似手绘草稿
 */
const ICON_PATHS = {
  // ========== 桌面图标 ==========
  tv: (
    <>
      <rect x="3" y="6" width="18" height="13" rx="1" />
      <path d="M8 3l4 3 4-3" />
      <path d="M6 22h12" />
      <path d="M9 22v-3M15 22v-3" />
    </>
  ),
  diary: (
    <>
      <path d="M5 4h12a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
      <path d="M5 4v18" />
      <path d="M9 4v18" />
      <circle cx="15" cy="12" r="1.2" />
      <path d="M14 11l-2 -1" />
    </>
  ),
  mp3: (
    <>
      <rect x="6" y="3" width="12" height="18" rx="2" />
      <rect x="9" y="6" width="6" height="4" />
      <circle cx="10" cy="15" r="1" />
      <circle cx="14" cy="15" r="1" />
      <path d="M10 15v-2h4v2" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="11" r="7" />
      <path d="M5 11h14" />
      <path d="M12 4v14" />
      <path d="M8 7c2 2 6 2 8 0" />
      <path d="M8 15c2-2 6-2 8 0" />
      <path d="M9 18l-1 3h8l-1-3" />
    </>
  ),

  // ========== 开始菜单 ==========
  flag: (
    <>
      <path d="M5 3v18" />
      <path d="M5 4l10 2-2 4 2 4-10-2" />
    </>
  ),
  folder: (
    <>
      <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
    </>
  ),
  house: (
    <>
      <path d="M3 12L12 4l9 8" />
      <path d="M5 11v9h14v-9" />
      <path d="M10 20v-5h4v5" />
    </>
  ),
  heart: (
    <>
      <path d="M12 20s-7-4.5-9-9c-1-2 0-5 3-5 2 0 3 1 4 2 1-1 2-2 4-2 3 0 4 3 3 5-2 4.5-9 9-9 9z" />
    </>
  ),
  doc: (
    <>
      <path d="M5 3h10l4 4v14H5z" />
      <path d="M15 3v4h4" />
      <path d="M8 11h8M8 14h8M8 17h5" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M16 16l5 5" />
    </>
  ),
  power: (
    <>
      <path d="M12 4v8" />
      <path d="M7 7a8 8 0 1010 0" />
    </>
  ),

  // ========== 欢迎弹窗 ==========
  alien: (
    <>
      <path d="M12 3c-5 0-8 4-8 9 0 4 3 7 8 7s8-3 8-7c0-5-3-9-8-9z" />
      <circle cx="9" cy="11" r="1.5" fill="currentColor" />
      <circle cx="15" cy="11" r="1.5" fill="currentColor" />
      <path d="M9 15c1 1 5 1 6 0" />
      <path d="M6 8L3 6M18 8l3-2" />
    </>
  ),

  // ========== 大风车 ==========
  windmill: (
    <>
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <path d="M12 12L8 4" />
      <path d="M12 12l8-4" />
      <path d="M12 12l4 8" />
      <path d="M12 12l-8-4" />
      <path d="M8 4l3 1M16 4l-3 1M16 20l-3-1M8 20l3-1" />
    </>
  ),

  // ========== 扭蛋机 ==========
  game: (
    <>
      <rect x="3" y="7" width="18" height="11" rx="3" />
      <path d="M3 11h18" />
      <circle cx="8" cy="13" r="0.8" fill="currentColor" />
      <circle cx="10" cy="13" r="0.8" fill="currentColor" />
      <path d="M15 12l1 2-1 2M17 12l-1 2 1 2" />
    </>
  ),
  hourglass: (
    <>
      <path d="M5 3h14M5 21h14" />
      <path d="M6 3c0 5 6 6 6 9 0 3-6 4-6 9" />
      <path d="M18 3c0 5-6 6-6 9 0 3 6 4 6 9" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3l2 7 7 2-7 2-2 7-2-7-7-2 7-2z" />
    </>
  ),
  swirl: (
    <>
      <path d="M12 3a9 9 0 11-9 9 7 7 0 0114 0 5 5 0 11-10 0 3 3 0 016 0" />
    </>
  ),
  box: (
    <>
      <path d="M3 7l9-4 9 4v10l-9 4-9-4z" />
      <path d="M3 7l9 4 9-4M12 11v10" />
    </>
  ),
  clapperboard: (
    <>
      <rect x="3" y="9" width="18" height="12" />
      <path d="M3 9l3-4 3 4M9 9l3-4 3 4M15 9l3-4 3 4" />
    </>
  ),
  star: (
    <>
      <path d="M12 3l2.5 6 6.5.5-5 4.5 1.5 6.5L12 17l-5.5 3.5 1.5-6.5-5-4.5 6.5-.5z" />
    </>
  ),
  check: (
    <>
      <path d="M4 12l5 5L20 6" />
    </>
  ),
  coin: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7v10M10 9h3a2 2 0 010 4h-3M10 13h4" />
    </>
  ),

  // ========== 详情页 ==========
  calendar: (
    <>
      <rect x="4" y="5" width="16" height="16" rx="1" />
      <path d="M4 9h16M8 3v4M16 3v4" />
      <circle cx="9" cy="13" r="0.5" fill="currentColor" />
      <circle cx="12" cy="13" r="0.5" fill="currentColor" />
      <circle cx="15" cy="13" r="0.5" fill="currentColor" />
      <circle cx="9" cy="16" r="0.5" fill="currentColor" />
      <circle cx="12" cy="16" r="0.5" fill="currentColor" />
    </>
  ),
  building: (
    <>
      <rect x="5" y="3" width="14" height="18" />
      <path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2" />
      <path d="M10 21v-3h4v3" />
    </>
  ),
  film: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="1" />
      <path d="M3 8h18M3 16h18M7 4v16M17 4v16" />
    </>
  ),
  music: (
    <>
      <path d="M9 18V5l10-2v13" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="16" r="2" />
    </>
  ),
  arrowRight: (
    <>
      <path d="M4 12h16M14 6l6 6-6 6" />
    </>
  ),
  arrowLeft: (
    <>
      <path d="M20 12H4M10 6l-6 6 6 6" />
    </>
  ),
  arrowUp: (
    <>
      <path d="M12 20V4M6 10l6-6 6 6" />
    </>
  ),

  // ========== 记忆共振 ==========
  tag: (
    <>
      <path d="M3 12l9-9 9 9-9 9z" />
      <circle cx="9" cy="9" r="1" fill="currentColor" />
    </>
  ),
  thread: (
    <>
      <circle cx="6" cy="8" r="3" />
      <circle cx="18" cy="8" r="3" />
      <circle cx="12" cy="18" r="3" />
      <path d="M9 8h6M9 16l3-7M15 16l-3-7" />
    </>
  ),
  mailbox: (
    <>
      <path d="M4 12a4 4 0 014-4h8a4 4 0 014 4v8H4z" />
      <path d="M4 12h16" />
      <path d="M9 8V4h6" />
      <path d="M9 20v2M15 20v2" />
      <path d="M11 12h2" />
    </>
  ),

  // ========== 心情瓶（情绪标签）==========
  heartGold: (
    <>
      <path d="M12 20s-7-4.5-9-9c-1-2 0-5 3-5 2 0 3 1 4 2 1-1 2-2 4-2 3 0 4 3 3 5-2 4.5-9 9-9 9z" />
    </>
  ),
  bottleGold: (
    <>
      <path d="M10 3h4v2l1 1v13a2 2 0 01-2 2h-2a2 2 0 01-2-2V6l1-1z" />
      <path d="M9 11h6" />
    </>
  ),
  bottlePink: (
    <>
      <path d="M10 3h4v2l1 1v13a2 2 0 01-2 2h-2a2 2 0 01-2-2V6l1-1z" />
      <path d="M9 11h6" />
    </>
  ),
  bottleBlue: (
    <>
      <path d="M10 3h4v2l1 1v13a2 2 0 01-2 2h-2a2 2 0 01-2-2V6l1-1z" />
      <path d="M9 11h6" />
    </>
  ),
  bottlePurple: (
    <>
      <path d="M10 3h4v2l1 1v13a2 2 0 01-2 2h-2a2 2 0 01-2-2V6l1-1z" />
      <path d="M9 11h6" />
    </>
  ),
  bottleDark: (
    <>
      <path d="M10 3h4v2l1 1v13a2 2 0 01-2 2h-2a2 2 0 01-2-2V6l1-1z" />
      <path d="M9 11h6" />
    </>
  ),

  // ========== 通用 ==========
  bell: (
    <>
      <path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9z" />
      <path d="M10 21a2 2 0 004 0" />
    </>
  ),
  pencil: (
    <>
      <path d="M5 19l-2 2 4-1 13-13-3-3L4 17z" />
      <path d="M14 6l3 3" />
    </>
  ),
  close: (
    <>
      <path d="M5 5l14 14M19 5L5 19" />
    </>
  ),
  volume: (
    <>
      <path d="M5 9h4l5-4v14l-5-4H5z" />
      <path d="M16 9a3 3 0 010 6" />
    </>
  ),
  network: (
    <>
      <rect x="3" y="5" width="8" height="6" />
      <rect x="13" y="5" width="8" height="6" />
      <path d="M7 11v3h10v-3" />
      <rect x="9" y="14" width="6" height="5" />
    </>
  ),
  qq: (
    <>
      <ellipse cx="12" cy="13" rx="6" ry="7" />
      <circle cx="10" cy="11" r="0.5" fill="currentColor" />
      <circle cx="14" cy="11" r="0.5" fill="currentColor" />
      <path d="M11 13h2" />
      <path d="M6 11l-2-1M18 11l2-1" />
      <path d="M7 19l-1 2M17 19l1 2" />
    </>
  ),

  // ========== 人物客厅 ==========
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-5 4-7 8-7s8 2 8 7" />
    </>
  ),
  chat: (
    <>
      <path d="M21 12a8 8 0 11-3-6l3-1-1 3a8 8 0 011 4z" />
      <path d="M8 11h8M8 14h5" />
    </>
  ),
  back: (
    <>
      <path d="M9 6L3 12l6 6M3 12h18" />
    </>
  ),
}
