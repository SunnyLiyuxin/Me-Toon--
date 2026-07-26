import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Viewport from '../components/Viewport.jsx'
import Taskbar from '../components/Taskbar.jsx'
import StartMenu from '../components/StartMenu.jsx'
import WelcomePopup from '../components/WelcomePopup.jsx'
import QqMessage from '../components/QqMessage.jsx'
import XpWindow from '../components/XpWindow.jsx'
import SvgIcon from '../components/SvgIcon.jsx'
import './Desktop.css'

export default function Desktop() {
  const navigate = useNavigate()
  const [startOpen, setStartOpen] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const [showChooser, setShowChooser] = useState(false)

  // 首次访问检测
  useEffect(() => {
    const visited = localStorage.getItem('me-toon-visited')
    if (!visited) {
      setShowWelcome(true)
    }
  }, [])

  const handleWelcomeClose = (choice) => {
    setShowWelcome(false)
    if (choice === 'gacha') {
      navigate('/gacha')
    } else {
      setShowChooser(true)
    }
  }

  const handleCardClick = (type) => {
    switch (type) {
      case 'tv':
        setShowChooser(true)
        break
      case 'diary':
        navigate('/collection')
        break
      case 'mp3':
        navigate('/radio')
        break
      case 'globe':
        navigate('/lobby')
        break
    }
  }

  const handleCardDoubleClick = (type) => {
    if (type === 'tv') navigate('/gacha')
  }

  const handleChooserClose = (choice) => {
    setShowChooser(false)
    if (choice === 'gacha') navigate('/gacha')
  }

  // 4 张卡片配置（对应原 4 个桌面图标入口）
  const cards = [
    { type: 'tv',    icon: 'tv',    label: '动画放映厅',   sub: 'Animation Theater' },
    { type: 'mp3',   icon: 'music', label: '时光点歌台',   sub: 'Time Jukebox' },
    { type: 'diary', icon: 'diary', label: '我的记忆抽屉', sub: 'Memory Drawer' },
    { type: 'globe', icon: 'globe', label: '数据流漫游',   sub: 'Data Stream' },
  ]

  return (
    <Viewport className="page-desktop">
      {/* ===== 千禧幻境背景层 ===== */}
      <div className="dream-frame">
        {/* 粉色径向渐变基底 */}
        <div className="dream-base" />
        {/* 光晕 + 漏光层 */}
        <div className="dream-glow-1" />
        <div className="dream-glow-2" />
        {/* 噪点雪花 */}
        <div className="dream-noise" />
        {/* 扫描线 */}
        <div className="dream-scanline" />
        {/* 闪烁干扰 */}
        <div className="dream-flicker" />

        {/* 顶部品牌标 */}
        <div className="dream-brand">
          <span className="dream-brand-title">✦ Me-Toon</span>
          <span className="dream-brand-sub">这集，我也看过</span>
        </div>

        {/* ===== 2x2 卡片网格 ===== */}
        <div className="dream-grid">
          {cards.map((c, idx) => (
            <div
              key={c.type}
              className={`dream-card dream-card-${idx + 1}`}
              onClick={() => handleCardClick(c.type)}
              onDoubleClick={() => handleCardDoubleClick(c.type)}
              tabIndex={0}
            >
              <div className="dream-card-icon">
                <SvgIcon name={c.icon} size={36} color="#FFFFFF" strokeWidth={1.6} />
              </div>
              <div className="dream-card-text">
                <span className="dream-card-label">✦ {c.label}</span>
                <span className="dream-card-sub">{c.sub}</span>
              </div>
              <span className="dream-card-dot" />
            </div>
          ))}
        </div>

        {/* 极淡装饰水印 */}
        <div className="dream-watermark">✦ 千禧幻境 · 低像素光晕 ✦</div>
      </div>

      {/* 欢迎弹窗 */}
      {showWelcome && <WelcomePopup onClose={handleWelcomeClose} />}

      {/* 选择寻找方式弹窗 */}
      {showChooser && (
        <ChooserPopup onClose={handleChooserClose} />
      )}

      {/* QQ 消息彩蛋 */}
      <QqMessage />

      {/* 开始菜单 */}
      <StartMenu open={startOpen} onClose={() => setStartOpen(false)} />

      {/* 任务栏（融入底部） */}
      <Taskbar
        onStartClick={() => setStartOpen(!startOpen)}
        isStartOpen={startOpen}
      />
    </Viewport>
  )
}

/**
 * 选择寻找方式弹窗（点击电视卡片后弹出）
 */
function ChooserPopup({ onClose }) {
  const navigate = useNavigate()
  return (
    <ChooserWindow onClose={onClose} navigate={navigate} />
  )
}

function ChooserWindow({ onClose, navigate }) {
  const handleChoose = (choice) => {
    onClose(choice)
  }
  return (
    <XpWindow
      title="选择你的寻找方式"
      centered
      onClose={() => handleChoose(null)}
      style={{ width: 360 }}
    >
      <div className="desktop-chooser">
        <p className="desktop-chooser-title">选择你的寻找方式</p>
        <div className="desktop-chooser-options">
          <button
            className="xp-button-primary desktop-chooser-btn"
            onClick={() => handleChoose('gacha')}
          >
            <SvgIcon name="game" size={20} color="#003C74" />
            <span>星际扭蛋机</span>
          </button>
          <button
            className="xp-button desktop-chooser-btn"
            onClick={() => handleChoose(null)}
          >
            <SvgIcon name="tv" size={20} color="#0054E3" />
            <span>电视台调频</span>
          </button>
        </div>
      </div>
    </XpWindow>
  )
}
