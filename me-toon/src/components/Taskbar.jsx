import { useEffect, useState } from 'react'
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
          <span className="start-flag">🚩</span>
          <span className="start-text">开始</span>
        </button>
      </div>

      <div className="taskbar-middle" />

      <div className="taskbar-tray">
        <div className="tray-icon tray-qq" title="QQ" id="tray-qq">
          <img src="/assets/images/desktop/qq-penguin.png" alt="QQ" width={16} height={16} />
        </div>
        <div className="tray-icon tray-speaker" title="音量">
          <SpeakerIcon />
        </div>
        <div className="tray-icon tray-network" title="网络连接">
          <NetworkIcon />
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

function QQIcon() {
  return (
    <div className="pi pi-qq">
      <div className="pi-qq-body" />
      <div className="pi-qq-scarf" />
      <div className="pi-qq-eye-l" />
      <div className="pi-qq-eye-r" />
      <div className="pi-qq-beak" />
    </div>
  )
}

function SpeakerIcon() {
  return (
    <div className="pi pi-speaker">
      <div className="pi-speaker-body" />
      <div className="pi-speaker-wave-1" />
      <div className="pi-speaker-wave-2" />
    </div>
  )
}

function NetworkIcon() {
  return (
    <div className="pi pi-network">
      <div className="pi-network-monitor-l" />
      <div className="pi-network-monitor-r" />
      <div className="pi-network-link" />
    </div>
  )
}
