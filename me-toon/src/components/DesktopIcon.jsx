import './DesktopIcon.css'

const ICON_MAP = {
  tv: './assets/images/desktop/icon-tv.png',
  diary: './assets/images/desktop/icon-diary.png',
  mp3: './assets/images/desktop/icon-mp3.png',
  globe: './assets/images/desktop/icon-globe.png',
}

/**
 * 桌面图标
 * @param {string} type - 图标类型：tv | diary | mp3 | globe
 * @param {string} label - 图标下方文字
 * @param {function} onClick - 单击回调
 * @param {function} onDoubleClick - 双击回调
 * @param {object} style - 自定义定位
 */
export default function DesktopIcon({ type, label, onClick, onDoubleClick, style }) {
  const iconSrc = ICON_MAP[type]
  return (
    <div
      className="desktop-icon"
      style={style}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      tabIndex={0}
    >
      <div className="desktop-icon-img">
        {iconSrc ? (
          <img src={iconSrc} alt={label} width={48} height={48} />
        ) : (
          <div className="desktop-icon-fallback">{label}</div>
        )}
      </div>
      <div className="desktop-icon-label">{label}</div>
    </div>
  )
}
