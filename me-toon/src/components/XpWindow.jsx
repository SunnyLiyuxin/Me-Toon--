import { useState } from 'react'
import './XpWindow.css'

/**
 * XP 经典窗口组件
 * @param {string} title - 标题栏文字
 * @param {boolean} closable - 是否显示关闭按钮
 * @param {function} onClose - 关闭回调
 * @param {object} style - 自定义样式（位置、尺寸）
 * @param {boolean} autoClose - 关闭时是否播放缩小动画
 */
export default function XpWindow({
  title = '窗口',
  closable = true,
  onClose,
  children,
  style = {},
  className = '',
  centered = false,
}) {
  const [closing, setClosing] = useState(false)

  const handleClose = () => {
    if (!onClose) return
    setClosing(true)
    setTimeout(() => {
      onClose()
      setClosing(false)
    }, 200)
  }

  const windowClass = [
    'xp-window',
    'xp-window-box',
    centered ? 'xp-window-centered' : '',
    closing ? 'anim-popup-out' : 'anim-popup-in',
    className,
  ].filter(Boolean).join(' ')

  return (
    <div className={windowClass} style={style}>
      <div className="xp-titlebar">
        <span className="xp-titlebar-text">{title}</span>
        {closable && (
          <button
            className="xp-titlebar-close"
            onClick={handleClose}
            aria-label="关闭"
          >
            ✕
          </button>
        )}
      </div>
      <div className="xp-window-content">
        {children}
      </div>
    </div>
  )
}
