import { useEffect, useState } from 'react'
import SvgIcon from './SvgIcon.jsx'
import './Taskbar.css'

/**
 * XP 风格任务栏
 * - 左侧：开始按钮（点击展开菜单）
 * - 右侧：系统托盘（小喇叭、网络、时间）
 */
export default function Taskbar({ onStartClick, isStartOpen }) {
  const [time, setTime] = useState(getTime())

  useEffect(() => {
    const timer = setInterval(() => setTime(getTime()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="taskbar">
      <div className="taskbar-left">
        <button
          className={`start-button ${isStartOpen ? 'active' : ''}`}
          onClick={onStartClick}
        >
          <SvgIcon name="flag" size={18} color="#FFFFFF" className="start-flag-svg" />
          <span className="start-text">开始</span>
        </button>
      </div>

      <div className="taskbar-middle" />

      <div className="taskbar-tray">
        <div className="tray-icon tray-qq" title="QQ" id="tray-qq">
          <img src="./assets/images/desktop/qq-penguin.png" alt="QQ" width={16} height={16} />
        </div>
        <div className="tray-icon tray-speaker" title="音量">
          <SvgIcon name="volume" size={16} color="#FFFFFF" />
        </div>
        <div className="tray-icon tray-network" title="网络连接">
          <SvgIcon name="network" size={16} color="#FFFFFF" />
        </div>
        <div className="tray-time">{time}</div>
      </div>
    </div>
  )
}

function getTime() {
  const d = new Date()
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}
