import { useState, useEffect } from 'react'
import { useTypewriter, useMusic, useSound } from '../../hooks/useMedia.js'
import SvgIcon from '../../components/SvgIcon.jsx'
import './ArchiveRoom.css'

/**
 * 档案室子页面
 * - 泛黄信纸背景
 * - 左上：导演像素肖像（木质相框 + 眨眼动画）
 * - 右侧：导演寄语打字机效果
 * - 底部：信息卡片（播出时间 / 制作公司）
 * - 左下：像素收音机（点击播放主题曲）
 */
export default function ArchiveRoom({ cartoon }) {
  const [typingStarted, setTypingStarted] = useState(false)
  const [showInfoCards, setShowInfoCards] = useState(false)
  const [showNextBtn, setShowNextBtn] = useState(false)
  const [blinking, setBlinking] = useState(false)

  const [displayed, typingDone] = useTypewriter(cartoon.directorMessage, 80, typingStarted)
  const [musicPlaying, toggleMusic] = useMusic(`./assets/audio/songs/${cartoon.themeSong}`)
  const playSfx = useSound()

  // 进入页面后短暂延迟开始打字
  useEffect(() => {
    const t = setTimeout(() => setTypingStarted(true), 800)
    return () => clearTimeout(t)
  }, [cartoon.id])

  // 打字完成后显示信息卡片
  useEffect(() => {
    if (typingDone) {
      const t = setTimeout(() => {
        setShowInfoCards(true)
        setShowNextBtn(true)
      }, 500)
      return () => clearTimeout(t)
    }
  }, [typingDone])

  // 肖像眨眼（每 5 秒眨一次）
  useEffect(() => {
    const blink = () => {
      setBlinking(true)
      setTimeout(() => setBlinking(false), 150)
    }
    const timer = setInterval(blink, 5000)
    return () => clearInterval(timer)
  }, [])

  // 鼠标悬停肖像时也眨眼
  const handlePortraitHover = () => {
    setBlinking(true)
    setTimeout(() => setBlinking(false), 150)
  }

  const handleRadioClick = () => {
    playSfx('click')
    toggleMusic()
  }

  return (
    <div className="archive-room">
      {/* 泛黄信纸背景 */}
      <div className="archive-paper-bg" />

      {/* 内容容器 */}
      <div className="archive-content">
        {/* 左上：导演肖像 + 木质相框 */}
        <div
          className={`portrait-wrapper ${blinking ? 'blinking' : ''}`}
          onMouseEnter={handlePortraitHover}
        >
          <img
            src="./assets/images/detail/wooden-frame.png"
            alt=""
            className="portrait-frame"
          />
          <img
            src={`./assets/images/detail/cartoons/${cartoon.id}/portrait.png`}
            alt={`${cartoon.director}与${cartoon.name}`}
            className="portrait-img"
          />
          {/* 眨眼遮罩（在肖像眼睛位置覆盖一条线） */}
          {blinking && <div className="portrait-blink-overlay" />}
          {/* 眼睛发光效果 */}
          <div className="portrait-eye-glow anim-glow" />
        </div>

        {/* 右侧：导演寄语打字机 */}
        <div className="director-message-area">
          <div className="director-message-title">
            {cartoon.director}导演寄语
          </div>
          <div className="director-message-text">
            <pre className="typewriter-text">
              {displayed}
              {!typingDone && <span className="typewriter-cursor">|</span>}
            </pre>
          </div>

          {/* 下一页按钮 */}
          {showNextBtn && (
            <button
              className="next-page-btn anim-blink"
              onClick={() => playSfx('click')}
              title="提示：可点击左侧导航切换到下一页"
            >
              →
            </button>
          )}
        </div>

        {/* 底部信息卡片 */}
        {showInfoCards && (
          <div className="info-cards anim-popup-in">
            <div className="info-card">
              <div className="info-card-icon">
                <SvgIcon name="calendar" size={22} color="#0054E3" />
              </div>
              <div className="info-card-content">
                <div className="info-card-label">播出时间</div>
                <div className="info-card-value">{cartoon.airDate}</div>
              </div>
            </div>
            <div className="info-card">
              <div className="info-card-icon">
                <SvgIcon name="building" size={22} color="#0054E3" />
              </div>
              <div className="info-card-content">
                <div className="info-card-label">制作公司</div>
                <div className="info-card-value">{cartoon.studio}</div>
              </div>
            </div>
            <div className="info-card">
              <div className="info-card-icon">
                <SvgIcon name="clapperboard" size={22} color="#0054E3" />
              </div>
              <div className="info-card-content">
                <div className="info-card-label">导演</div>
                <div className="info-card-value">{cartoon.director}</div>
              </div>
            </div>
            <div className="info-card">
              <div className="info-card-icon">
                <SvgIcon name="music" size={22} color="#0054E3" />
              </div>
              <div className="info-card-content">
                <div className="info-card-label">主题曲</div>
                <div className="info-card-value">{cartoon.themeSongName}</div>
              </div>
            </div>
          </div>
        )}

        {/* 主题曲歌词（信息卡片显示后浮现） */}
        {showInfoCards && (
          <div className="theme-lyric anim-popup-in">
            <span className="lyric-quote">"</span>
            {cartoon.themeSongLyric}
            <span className="lyric-quote">"</span>
          </div>
        )}

        {/* 左下：像素收音机 */}
        <button
          className={`radio-player ${musicPlaying ? 'playing' : ''}`}
          onClick={handleRadioClick}
          title={musicPlaying ? '暂停主题曲' : '点击播放主题曲'}
        >
          <img
            src="./assets/images/detail/radio-icon.png"
            alt="收音机"
            className="radio-img"
          />
          <div className="radio-label">
            {musicPlaying ? (
              <>
                <SvgIcon name="music" size={14} color="#0054E3" />
                <span>播放中</span>
              </>
            ) : '听主题曲'}
          </div>
          {musicPlaying && (
            <>
              <div className="radio-wave wave-1" />
              <div className="radio-wave wave-2" />
              <div className="radio-wave wave-3" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
