import './DesktopIcon.css'

/**
 * 桌面图标
 * @param {string} type - 图标类型：tv | diary | mp3 | globe
 * @param {string} label - 图标下方文字
 * @param {function} onClick - 单击回调
 * @param {function} onDoubleClick - 双击回调
 * @param {object} style - 自定义定位
 */
export default function DesktopIcon({ type, label, onClick, onDoubleClick, style }) {
  return (
    <div
      className="desktop-icon"
      style={style}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      tabIndex={0}
    >
      <div className={`desktop-icon-img desktop-icon-${type}`}>
        <PixelIcon type={type} />
      </div>
      <div className="desktop-icon-label">{label}</div>
    </div>
  )
}

/**
 * 纯 CSS 绘制的像素图标（占位用，有图片后可替换为 <img>）
 */
function PixelIcon({ type }) {
  switch (type) {
    case 'tv':
      return <TvIcon />
    case 'diary':
      return <DiaryIcon />
    case 'mp3':
      return <Mp3Icon />
    case 'globe':
      return <GlobeIcon />
    default:
      return null
  }
}

function TvIcon() {
  return (
    <div className="pi pi-tv">
      <div className="pi-tv-screen" />
      <div className="pi-tv-antenna-l" />
      <div className="pi-tv-antenna-r" />
      <div className="pi-tv-stand-l" />
      <div className="pi-tv-stand-r" />
    </div>
  )
}

function DiaryIcon() {
  return (
    <div className="pi pi-diary">
      <div className="pi-diary-cover" />
      <div className="pi-diary-binding" />
      <div className="pi-diary-lock" />
    </div>
  )
}

function Mp3Icon() {
  return (
    <div className="pi pi-mp3">
      <div className="pi-mp3-body" />
      <div className="pi-mp3-screen" />
      <div className="pi-mp3-btn-1" />
      <div className="pi-mp3-btn-2" />
    </div>
  )
}

function GlobeIcon() {
  return (
    <div className="pi pi-globe">
      <div className="pi-globe-body" />
      <div className="pi-globe-meridian" />
      <div className="pi-globe-parallel" />
      <div className="pi-globe-stand" />
    </div>
  )
}
