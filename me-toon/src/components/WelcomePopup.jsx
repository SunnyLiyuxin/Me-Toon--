import { useState } from 'react'
import XpWindow from './XpWindow.jsx'
import './WelcomePopup.css'

/**
 * 首次访问欢迎引导弹窗
 * 检测 localStorage 无访问记录时自动弹出
 */
export default function WelcomePopup({ onClose }) {
  const [showChooser, setShowChooser] = useState(false)

  const handleStart = () => {
    setShowChooser(true)
  }

  const handleChoose = (choice) => {
    localStorage.setItem('me-toon-visited', 'true')
    onClose(choice) // 'gacha' 或 null
  }

  if (showChooser) {
    return (
      <XpWindow
        title="选择你的寻找方式"
        centered
        onClose={() => handleChoose(null)}
        style={{ width: 320 }}
      >
        <div className="welcome-chooser">
          <p className="welcome-chooser-title">选择你的寻找方式</p>
          <div className="welcome-chooser-options">
            <button
              className="xp-button-primary welcome-chooser-btn"
              onClick={() => handleChoose('gacha')}
            >
              🎮 星际扭蛋机
            </button>
            <button
              className="xp-button welcome-chooser-btn"
              onClick={() => handleChoose(null)}
            >
              📺 电视台调频
            </button>
          </div>
        </div>
      </XpWindow>
    )
  }

  return (
    <XpWindow
      title="Me-Toon · 这集，我也看过"
      centered
      onClose={() => handleChoose(null)}
      style={{ width: 400, maxHeight: 560 }}
    >
      <div className="welcome-content">
        <p className="welcome-line welcome-line-1">👾 欢迎回来，</p>
        <p className="welcome-line welcome-line-2">2005年的小朋友。</p>

        <div className="welcome-paragraph">
          <p>有些动画，</p>
          <p>你以为你忘了。</p>
        </div>

        <div className="welcome-paragraph">
          <p>但某个下午，</p>
          <p>你路过电视机前，</p>
          <p>画面闪过三秒——</p>
          <p>你就全都想起来了。</p>
        </div>

        <div className="welcome-paragraph">
          <p>那个角色，</p>
          <p>那首歌，</p>
          <p>那个跟着喊过的招式名字，</p>
          <p>那个让你第一次想哭的画面。</p>
        </div>

        <div className="welcome-paragraph welcome-highlight">
          <p>它们没有消失。</p>
          <p>它们只是藏起来了。</p>
        </div>

        <div className="welcome-paragraph">
          <p>在这里，</p>
          <p>你可以重新遇见它们。</p>
        </div>

        <p className="welcome-quote">"这集，我也看过。"</p>
        <p className="welcome-sign">—— Me-Toon</p>

        <div className="welcome-action">
          <button
            className="xp-button-primary"
            onClick={handleStart}
          >
            开始寻找
          </button>
        </div>
      </div>
    </XpWindow>
  )
}
