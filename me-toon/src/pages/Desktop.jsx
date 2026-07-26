import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Viewport from '../components/Viewport.jsx'
import DesktopIcon from '../components/DesktopIcon.jsx'
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
      // 关闭后弹出选择窗口（设计文档要求）
      setShowChooser(true)
    }
  }

  const handleIconClick = (type) => {
    switch (type) {
      case 'tv':
        // 点击电视图标：弹出选择窗口
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

  const handleIconDoubleClick = (type) => {
    if (type === 'tv') navigate('/gacha')
  }

  const handleChooserClose = (choice) => {
    setShowChooser(false)
    if (choice === 'gacha') navigate('/gacha')
  }

  return (
    <Viewport className="page-desktop">
      {/* 桌面 Bliss 背景 */}
      <div className="desktop-bg" />

      {/* 品牌标志 右上角 */}
      <div className="brand-card anim-breath">
        <div className="brand-title">Me-Toon</div>
        <div className="brand-subtitle">这集，我也看过</div>
      </div>

      {/* 桌面图标 */}
      <DesktopIcon
        type="tv"
        label="动画放映厅"
        onClick={() => handleIconClick('tv')}
        onDoubleClick={() => handleIconDoubleClick('tv')}
        style={{ top: 100, left: 100 }}
      />
      <DesktopIcon
        type="diary"
        label="我的记忆抽屉"
        onClick={() => handleIconClick('diary')}
        style={{ top: 240, left: 100 }}
      />
      <DesktopIcon
        type="mp3"
        label="时光点歌台"
        onClick={() => handleIconClick('mp3')}
        style={{ top: 380, left: 100 }}
      />
      <DesktopIcon
        type="globe"
        label="数据流漫游"
        onClick={() => handleIconClick('globe')}
        style={{ top: 520, left: 100 }}
      />

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

      {/* 任务栏 */}
      <Taskbar
        onStartClick={() => setStartOpen(!startOpen)}
        isStartOpen={startOpen}
      />
    </Viewport>
  )
}

/**
 * 选择寻找方式弹窗（点击电视图标后弹出）
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
