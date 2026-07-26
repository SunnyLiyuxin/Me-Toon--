import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Viewport from '../components/Viewport.jsx'
import StartMenu from '../components/StartMenu.jsx'
import WelcomePopup from '../components/WelcomePopup.jsx'
import QqMessage from '../components/QqMessage.jsx'
import XpWindow from '../components/XpWindow.jsx'
import SvgIcon from '../components/SvgIcon.jsx'
import './Desktop.css'

/**
 * 千禧桌面 · 梦核像素 — Win98 风格主页面
 * - 蓝天 + 绿坡 + 白云（纯 CSS 像素风）
 * - 左上角桌面图标
 * - 中央窗口（蓝色标题栏 + 2x2 入口卡片）
 * - 底部任务栏（开始按钮 + 窗口标签 + 时间/音量）
 * - 像素噪点 + 扫描线 + 柔光叠加
 */
export default function Desktop() {
  const navigate = useNavigate()
  const [startOpen, setStartOpen] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const [showChooser, setShowChooser] = useState(false)
  const [time, setTime] = useState(getTime())

  // 实时时间
  useEffect(() => {
    const timer = setInterval(() => setTime(getTime()), 1000)
    return () => clearInterval(timer)
  }, [])

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

  const handleEntryClick = (type) => {
    switch (type) {
      case 'theater':
        setShowChooser(true)
        break
      case 'jukebox':
        navigate('/radio')
        break
      case 'drawer':
        navigate('/collection')
        break
      case 'stream':
        navigate('/lobby')
        break
    }
  }

  const handleDesktopIconClick = (type) => {
    switch (type) {
      case 'computer':
        setShowChooser(true)
        break
      case 'trash':
        navigate('/collection')
        break
      case 'network':
        navigate('/lobby')
        break
    }
  }

  const handleChooserClose = (choice) => {
    setShowChooser(false)
    if (choice === 'gacha') navigate('/gacha')
  }

  // 左上角桌面图标
  const desktopIcons = [
    { type: 'computer', icon: 'tv',       label: '我的电脑' },
    { type: 'trash',    icon: 'box',      label: '回收站' },
    { type: 'network',  icon: 'network',  label: '网络邻居' },
  ]

  // 中央窗口 4 个入口
  const entries = [
    { type: 'theater', icon: 'clapperboard', name: '动画放映厅',   desc: '点击打开' },
    { type: 'jukebox', icon: 'music',        name: '时光点歌台',   desc: '点击打开' },
    { type: 'drawer',  icon: 'diary',        name: '我的记忆抽屉', desc: '点击打开' },
    { type: 'stream',  icon: 'globe',        name: '数据流漫游',   desc: '点击打开' },
  ]

  return (
    <Viewport className="page-desktop">
      {/* ===== 显示器外框 ===== */}
      <div className="win98-monitor">
        <div className="win98-screen">

          {/* ===== 桌面背景：蓝天 + 绿坡 + 白云 ===== */}
          <div className="desktop-bg">
            <div className="sun" />
            <div className="cloud cloud-1" />
            <div className="cloud cloud-2" />
            <div className="cloud cloud-3" />
            <div className="hill hill-1" />
            <div className="hill hill-2" />
            <div className="hill hill-3" />
            <div className="grass" />
          </div>

          {/* ===== 左上角桌面图标 ===== */}
          <div className="desktop-icons">
            {desktopIcons.map(d => (
              <div
                key={d.type}
                className="desktop-icon"
                onClick={() => handleDesktopIconClick(d.type)}
                onDoubleClick={() => handleDesktopIconClick(d.type)}
                tabIndex={0}
              >
                <SvgIcon name={d.icon} size={36} color="#FFFFFF" strokeWidth={1.6} className="desktop-icon-svg" />
                <span className="label">{d.label}</span>
              </div>
            ))}
          </div>

          {/* ===== 中央主窗口 ===== */}
          <div className="main-window">
            <div className="window-titlebar">
              <span className="title">
                <SvgIcon name="folder" size={16} color="#FFFFFF" />
                <span>我的乐园</span>
              </span>
              <div className="window-controls">
                <button className="win-ctrl" title="最小化">—</button>
                <button className="win-ctrl" title="最大化">□</button>
                <button className="win-ctrl close" title="关闭">✕</button>
              </div>
            </div>
            <div className="window-body">
              {entries.map(e => (
                <div
                  key={e.type}
                  className="entry-card"
                  onClick={() => handleEntryClick(e.type)}
                  onDoubleClick={() => handleEntryClick(e.type)}
                  tabIndex={0}
                >
                  <SvgIcon name={e.icon} size={32} color="#000080" strokeWidth={1.8} className="entry-card-icon" />
                  <span className="name">{e.name}</span>
                  <span className="desc">{e.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ===== 底部任务栏 ===== */}
          <div className="taskbar">
            <button
              className={`start-btn ${startOpen ? 'active' : ''}`}
              onClick={() => setStartOpen(!startOpen)}
            >
              <SvgIcon name="flag" size={16} color="#000080" />
              <span>开始</span>
            </button>
            <div className="task-items">
              <div className="task-item active">
                <SvgIcon name="folder" size={14} color="#000080" />
                <span>我的乐园</span>
              </div>
            </div>
            <div className="task-right">
              <SvgIcon name="volume" size={14} color="#000" />
              <span>{time}</span>
            </div>
          </div>

          {/* ===== 叠加层 ===== */}
          <div className="glow-overlay" />
          <div className="noise-overlay" />
          <div className="scanline" />

        </div>
      </div>

      {/* 欢迎弹窗 */}
      {showWelcome && <WelcomePopup onClose={handleWelcomeClose} />}

      {/* 选择寻找方式弹窗 */}
      {showChooser && <ChooserPopup onClose={handleChooserClose} />}

      {/* QQ 消息彩蛋 */}
      <QqMessage />

      {/* 开始菜单 */}
      <StartMenu open={startOpen} onClose={() => setStartOpen(false)} />
    </Viewport>
  )
}

function getTime() {
  const d = new Date()
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

/**
 * 选择寻找方式弹窗
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
