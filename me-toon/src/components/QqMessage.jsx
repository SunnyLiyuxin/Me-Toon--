import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import XpWindow from './XpWindow.jsx'
import './QqMessage.css'

/**
 * QQ 消息彩蛋
 * 页面加载后 15 秒，任务栏右侧闪烁黄色 QQ 图标
 * 点击后弹出经典 XP 对话框
 */
export default function QqMessage() {
  const navigate = useNavigate()
  const [blinking, setBlinking] = useState(false)
  const [showDialog, setShowDialog] = useState(false)

  useEffect(() => {
    const blinkTimer = setTimeout(() => {
      setBlinking(true)
      // 给任务栏的 QQ 图标加闪烁 class
      const qqIcon = document.getElementById('tray-qq')
      if (qqIcon) qqIcon.classList.add('blinking')
    }, 15000)

    return () => {
      clearTimeout(blinkTimer)
      const qqIcon = document.getElementById('tray-qq')
      if (qqIcon) qqIcon.classList.remove('blinking')
    }
  }, [])

  // 监听任务栏 QQ 图标的点击
  useEffect(() => {
    if (!blinking) return
    const qqIcon = document.getElementById('tray-qq')
    if (!qqIcon) return
    const handleClick = () => {
      setShowDialog(true)
      setBlinking(false)
      qqIcon.classList.remove('blinking')
    }
    qqIcon.addEventListener('click', handleClick)
    return () => qqIcon.removeEventListener('click', handleClick)
  }, [blinking])

  const handleYes = () => {
    setShowDialog(false)
    // 跳转扭蛋机并触发大风车彩蛋
    navigate('/gacha?easter=dachentou')
  }

  const handleThink = () => {
    setShowDialog(false)
  }

  if (!showDialog) return null

  return (
    <XpWindow
      title="QQ消息"
      centered
      onClose={handleThink}
      style={{ width: 320 }}
    >
      <div className="qq-message">
        <div className="qq-message-header">
          <div className="qq-message-avatar">
            <div className="qq-avatar-img">🎡</div>
          </div>
          <div className="qq-message-info">
            <div className="qq-message-nickname">大风车</div>
            <div className="qq-message-status">在线</div>
          </div>
        </div>
        <div className="qq-message-bubble">
          <p>在吗？这部你一定也看过 👾</p>
          <p className="qq-message-sub">点击看看，是不是那一集？</p>
        </div>
        <div className="qq-message-actions">
          <button className="xp-button-primary" onClick={handleYes}>
            我也看过！
          </button>
          <button className="xp-button" onClick={handleThink}>
            让我想想...
          </button>
        </div>
      </div>
    </XpWindow>
  )
}
