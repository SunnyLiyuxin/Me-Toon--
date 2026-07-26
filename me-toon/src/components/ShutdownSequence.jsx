import { useState, useEffect } from 'react'
import './ShutdownSequence.css'

/**
 * 关机序列组件
 *
 * 状态机：IDLE → SHUTTING_DOWN → BLACK_SCREEN → AWAKE → IDLE
 * - SHUTTING_DOWN：桌面渐暗（1.5s）
 * - BLACK_SCREEN：黑屏 + 旋转像素小电视 + 7 行文案逐行浮现（约 10s）
 * - AWAKE：点击任意位置 → 桌面渐亮 → 欢迎文字 → 回到正常
 *
 * 关机次数记录于 localStorage 'me-toon-shutdown-count'
 * 同一天多次关机时文案会变化
 */
export default function ShutdownSequence({ onDone }) {
  // phase: 'dimming' | 'black' | 'awaking'
  const [phase, setPhase] = useState('dimming')
  const [visibleLines, setVisibleLines] = useState([])
  const [showHint, setShowHint] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)

  // 文案逐行浮现时刻表（ms）
  const messages = getShutdownMessages()

  useEffect(() => {
    // 阶段 1：桌面渐暗 1.5s
    const dimTimer = setTimeout(() => setPhase('black'), 1500)

    // 阶段 2：黑屏后开始逐行显示文案
    const lineTimers = messages.map((m, i) =>
      setTimeout(() => {
        setVisibleLines(prev => [...prev, m])
      }, m.delay)
    )

    // 第 10s 显示"点击唤醒"提示
    const hintTimer = setTimeout(() => setShowHint(true), 10000)

    // 记录关机次数
    try {
      const today = new Date().toDateString()
      const record = JSON.parse(localStorage.getItem('me-toon-shutdown-count') || '{}')
      const isSameDay = record.date === today
      const count = isSameDay ? (record.count || 0) + 1 : 1
      localStorage.setItem('me-toon-shutdown-count', JSON.stringify({ date: today, count, lastShutdown: Date.now() }))
    } catch (e) {}

    return () => {
      clearTimeout(dimTimer)
      lineTimers.forEach(clearTimeout)
      clearTimeout(hintTimer)
    }
  }, [])

  const handleWake = () => {
    if (phase !== 'black') return
    if (!showHint) return // 文案未播完前不允许唤醒
    setShowHint(false)
    setPhase('awaking')
    // 渐亮 1s 后显示欢迎文字
    setTimeout(() => setShowWelcome(true), 600)
    // 欢迎文字显示 2s 后淡出，回到桌面
    setTimeout(() => {
      setShowWelcome(false)
      setTimeout(() => onDone?.(), 600)
    }, 2600)
  }

  return (
    <div
      className={`shutdown-overlay phase-${phase}`}
      onClick={handleWake}
    >
      {phase === 'black' && (
        <div className="shutdown-center">
          {/* 像素小电视旋转 */}
          <div className="shutdown-tv">
            <div className="tv-body">
              <div className="tv-antenna tv-antenna-left" />
              <div className="tv-antenna tv-antenna-right" />
              <div className="tv-screen">
                <div className="tv-screen-flicker" />
              </div>
              <div className="tv-stand" />
            </div>
          </div>
          <div className="shutdown-loading-text">正在关机...</div>

          {/* 逐行浮现的文案 */}
          <div className="shutdown-messages">
            {visibleLines.map((m, i) => (
              <p
                key={i}
                className="shutdown-message"
                style={{
                  fontSize: m.fontSize,
                  color: m.color,
                  fontWeight: m.bold ? 800 : 500,
                  animationDelay: '0s',
                }}
              >
                {m.text}
              </p>
            ))}
          </div>

          {/* 点击唤醒提示 */}
          {showHint && (
            <div className="shutdown-hint">（点击任意位置重新唤醒）</div>
          )}
        </div>
      )}

      {phase === 'awaking' && showWelcome && (
        <div className="shutdown-welcome">欢迎回来</div>
      )}
    </div>
  )
}

// 根据当天关机次数返回不同文案
function getShutdownMessages() {
  let count = 1
  try {
    const today = new Date().toDateString()
    const record = JSON.parse(localStorage.getItem('me-toon-shutdown-count') || '{}')
    if (record.date === today) count = (record.count || 0) + 1
  } catch (e) {}

  if (count >= 3) {
    return [
      { text: "今天已经来回好几次了，小孩。", delay: 2000, fontSize: "16px", color: "#FFFFFF", bold: true },
      { text: "—— Me-Toon · 这集，我也看过", delay: 4000, fontSize: "12px", color: "#808080" },
    ]
  }

  if (count === 2) {
    return [
      { text: "又要走了？记得回来。", delay: 2000, fontSize: "16px", color: "#FFFFFF", bold: true },
      { text: "—— Me-Toon · 这集，我也看过", delay: 4000, fontSize: "12px", color: "#808080" },
    ]
  }

  // 首次关机：完整文案
  return [
    { text: "正在保存你的童年记忆...", delay: 2000, fontSize: "14px", color: "#CCCCCC" },
    { text: "所有动画已安全存档。", delay: 3200, fontSize: "14px", color: "#CCCCCC" },
    { text: "恭喜你，成功回到大人的世界。", delay: 4400, fontSize: "14px", color: "#FFFFFF" },
    { text: "但请记得——", delay: 5600, fontSize: "14px", color: "#FFFFFF" },
    { text: "那个坐在电视机前的小孩，", delay: 6800, fontSize: "18px", color: "#FFFFFF", bold: true },
    { text: "永远在这里等你回来。", delay: 8000, fontSize: "18px", color: "#FFCC00", bold: true },
    { text: "—— Me-Toon · 这集，我也看过", delay: 9200, fontSize: "12px", color: "#808080" },
  ]
}
