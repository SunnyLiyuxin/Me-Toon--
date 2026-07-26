import { useState, useEffect, useRef } from 'react'
import SvgIcon from '../../components/SvgIcon.jsx'
import { useSound } from '../../hooks/useMedia.js'
import './TimeEcho.css'

/**
 * 时光回响 · 大手机弹窗（TimeEchoPhone）
 *
 * 修订版：不再是小尺寸局部元素，而是占据页面视觉中心的完整手机界面。
 * - 全屏深色半透明遮罩
 * - 中央 500×700 像素风全面屏手机
 * - 屏幕内完整呈现：状态栏 / 标题 / 起源帖子 / 过渡文案 / 6 张羊设卡片网格 / 底部提示
 * - 点击卡片 → 翻转 → 羊设认证卡 → 存入记忆抽屉 → 手机缩小消失
 * - 跨 20 年 Call Back 彩蛋
 */
export default function TimeEcho({ cartoon, onClose }) {
  const playSfx = useSound()
  const timeEcho = cartoon.resonance?.timeEcho
  const sheepTypes = timeEcho?.sheepTypes || []

  // phase: 'vortex' | 'phone' | 'flip' | 'cert' | 'closing'
  const [phase, setPhase] = useState('vortex')
  const [selectedIdx, setSelectedIdx] = useState(null) // 选中的卡片索引
  const [flipped, setFlipped] = useState(false)
  const [certified, setCertified] = useState(null)
  const [showCallback, setShowCallback] = useState(false)
  const [saved, setSaved] = useState(false)
  const [toast, setToast] = useState('')
  const [closing, setClosing] = useState(false)

  // 漩涡 → 手机弹出
  useEffect(() => {
    if (phase !== 'vortex') return
    const t = setTimeout(() => {
      try { playSfx('ding') } catch (e) {}
      setPhase('phone')
    }, 1800)
    return () => clearTimeout(t)
  }, [phase])

  // 跨 20 年 Call Back 检测：用户曾给该角色贴过情绪标签 / 写过织布机寄语
  const checkCallback = (sheepType) => {
    try {
      const looms = JSON.parse(localStorage.getItem('me-toon-looms') || '[]')
      return looms.some(l => l.characterId === sheepType.characterId && l.cartoonId === cartoon.id)
    } catch (e) {
      return false
    }
  }

  // 点击羊设卡片
  const handleCardClick = (sheep, idx) => {
    try { playSfx('click') } catch (e) {}
    setSelectedIdx(idx)
    setCertified(sheep)
    setPhase('flip')
    // 0.5s 翻转后进入认证阶段
    setTimeout(() => {
      setFlipped(true)
      setPhase('cert')
      if (checkCallback(sheep)) {
        setTimeout(() => setShowCallback(true), 800)
      }
    }, 500)
  }

  // 存入记忆抽屉
  const handleSaveToCollection = () => {
    try { playSfx('dispense') } catch (e) {}
    const list = JSON.parse(localStorage.getItem('me-toon-collected') || '[]')
    list.push({
      type: 'timeEcho',
      stickerType: 'timeEcho',
      cartoonId: cartoon.id,
      cartoonName: cartoon.name,
      sheepId: certified.id,
      sheepTitle: certified.title,
      sheepEmoji: certified.emoji,
      sheepMotto: certified.motto,
      characterId: certified.characterId,
      savedAt: new Date().toISOString(),
      year: 2025,
    })
    localStorage.setItem('me-toon-collected', JSON.stringify(list))
    setSaved(true)
    setToast('🐑 羊设认证卡已存入记忆抽屉！')
    // 1.5s 后手机整体缩小消失
    setTimeout(() => {
      setClosing(true)
      setTimeout(() => onClose(), 400)
    }, 1500)
  }

  // 关闭（X / 遮罩）
  const handleClose = () => {
    if (phase === 'vortex') return
    setClosing(true)
    setTimeout(() => onClose(), 400)
  }

  if (!timeEcho?.enabled) return null

  return (
    <div className="time-echo-overlay" onClick={handleClose}>
      {/* 阶段 1：时间漩涡（手机出现前） */}
      {phase === 'vortex' && (
        <div className="time-vortex-center" onClick={(e) => e.stopPropagation()}>
          <div className="vortex-ring vortex-ring-outer" />
          <div className="vortex-ring vortex-ring-inner" />
          <div className="vortex-core">
            <span className="vortex-year vortex-year-2005">2005</span>
            <span className="vortex-sand" />
            <span className="vortex-year vortex-year-2025">2025</span>
          </div>
          <p className="vortex-hint">时间正在回流……</p>
        </div>
      )}

      {/* 阶段 2~5：大手机弹窗 */}
      {phase !== 'vortex' && (
        <div
          className={`time-echo-phone ${phase === 'phone' ? 'phone-pop-in' : ''} ${closing ? 'phone-pop-out' : ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 关闭按钮（手机右上角外侧） */}
          <button className="phone-close-btn" onClick={handleClose} title="关闭">✕</button>

          {/* 像素侧边键 */}
          <div className="phone-side-keys">
            <span className="phone-key phone-key-vol-up" />
            <span className="phone-key phone-key-vol-down" />
            <span className="phone-key phone-key-power" />
          </div>

          {/* 顶部听筒 */}
          <div className="phone-earpiece" />

          {/* 屏幕 */}
          <div className="phone-screen-large">
            {/* 状态栏 */}
            <div className="phone-statusbar-large">
              <span className="phone-status-time">9:41</span>
              <span className="phone-status-icons">
                <span className="phone-signal-bars">▮▮▮▮</span>
                <span className="phone-wifi">📶</span>
                <span className="phone-battery">🔋</span>
              </span>
            </div>
            <div className="phone-statusbar-divider" />

            {/* 内容滚动区（实际不需要滚动，内容已完整适配） */}
            <div className="phone-content-large">
              {/* 标题区 */}
              <div className="phone-title-area">
                <div className="phone-title-main">📱 2025年的互联网上...</div>
                <div className="phone-title-sub">最近有一个词突然火了</div>
              </div>

              {/* 起源帖子卡片 */}
              <div className="phone-post-card">
                <div className="post-header">
                  <span className="post-avatar">👤</span>
                  <div className="post-meta">
                    <div className="post-author">网友 @勇敢小羊</div>
                    <div className="post-info">2025年1月 · 来自iPhone客户端</div>
                  </div>
                </div>
                <div className="post-body">
                  最近工作压力好大，<br />
                  感觉自己像灰太狼，<br />
                  天天被打飞，<br />
                  但第二天还得爬起来。<br />
                  后来我想通了——<br />
                  我不要做灰太狼了，<br />
                  我要做喜羊羊。<br />
                  我是一只勇敢的小羊，<br />
                  咩咩咩！🐑
                </div>
                <div className="post-stats">
                  <span>❤️ 12.3万</span>
                  <span>💬 8.9万</span>
                  <span>🔄 5.6万</span>
                </div>
              </div>

              {/* 过渡文案 */}
              <div className="phone-transition">
                这条帖子发出后，评论区炸了。<br />
                大家纷纷开始认领自己的"羊设"——
              </div>

              {/* 羊设认领卡片区（2×3 网格） OR 翻转后的认证卡 */}
              {phase !== 'cert' && (
                <div className="sheep-grid">
                  {sheepTypes.map((sheep, i) => (
                    <div
                      key={sheep.id}
                      className={`sheep-grid-card ${selectedIdx === i ? 'is-selected' : ''} ${selectedIdx !== null && selectedIdx !== i ? 'is-dimmed' : ''}`}
                      onClick={() => handleCardClick(sheep, i)}
                    >
                      <div className="sheep-grid-emoji">{sheep.emoji}</div>
                      <div className="sheep-grid-title">{sheep.title}</div>
                      <div className="sheep-grid-desc">{getCardDesc(sheep.id)}</div>
                      <div className="sheep-grid-btn">[ 认领此羊设 ]</div>
                    </div>
                  ))}
                </div>
              )}

              {phase === 'cert' && certified && (
                <div className="cert-flip-stage">
                  <div className={`cert-card-large ${flipped ? 'is-flipped' : ''}`}>
                    <div className="cert-card-face cert-card-front">
                      <div className="cert-card-emoji">{certified.emoji}</div>
                      <div className="cert-card-title">🐑 羊设认证卡</div>
                    </div>
                    <div className="cert-card-face cert-card-back">
                      <div className="cert-card-emoji-small">{certified.emoji}</div>
                      <div className="cert-card-title-small">🐑 羊设认证卡</div>
                      <div className="cert-card-row">
                        <span>认证人:</span>
                        <span className="cert-card-name">[你]</span>
                      </div>
                      <div className="cert-card-row">
                        <span>认证日期:</span>
                        <span>{new Date().toISOString().slice(0, 10)}</span>
                      </div>
                      <div className="cert-card-row cert-card-motto-row">
                        <span>我正式认领:</span>
                        <span className="cert-card-motto-text">"{certified.motto}"</span>
                      </div>
                      <div className="cert-card-from">
                        从今天起，我就是这只羊了。<br />咩咩咩！🖖
                      </div>
                      <div className="cert-card-source">—— 来自2005年的动画<br />在2025年依然陪着我</div>
                      <button
                        className="cert-card-save"
                        onClick={handleSaveToCollection}
                        disabled={saved}
                      >
                        {saved ? '✓ 已存入记忆抽屉' : '[ 存入记忆抽屉 ]'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 底部提示 */}
              {phase !== 'cert' && (
                <div className="phone-bottom-hint">👆 点击任意一张卡片，认领你的2025羊设</div>
              )}
            </div>

            {/* Toast 提示 */}
            {toast && (
              <div className="phone-toast">{toast}</div>
            )}
          </div>

          {/* 跨 20 年 Call Back 彩蛋 */}
          {showCallback && (
            <div className="callback-egg-large" onClick={(e) => e.stopPropagation()}>
              <div className="callback-egg-inner">
                <div className="callback-egg-header">
                  <SvgIcon name="sparkle" size={20} color="#FFD700" />
                  <span>🌟 跨越20年的Call Back</span>
                  <SvgIcon name="sparkle" size={20} color="#FFD700" />
                </div>
                <p>你小时候喜欢的那个角色，</p>
                <p>长大后，你变成了TA的样子。</p>
                <p>2005年，你坐在电视机前</p>
                <p>看着{cartoon.name}。</p>
                <p>2025年，你把自己活成了</p>
                <p>{certified?.title}。</p>
                <p>这就是最好的Call Back。</p>
                <p className="callback-welcome-large">欢迎回来，{certified?.title}。🐑</p>
                <button
                  className="callback-egg-btn"
                  onClick={() => setShowCallback(false)}
                >
                  好暖，收下
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// 羊设卡片描述（按设计文档）
function getCardDesc(id) {
  const map = {
    brave:   '像喜羊羊一样，用智慧和勇气面对困难',
    chill:   '像懒羊羊一样，该吃吃该睡睡，保持自己的节奏',
    fitness: '像沸羊羊一样，自律且充满力量',
    beauty:  '像美羊羊一样，认真对待自己，热爱生活',
    slow:    '像村长一样，专注耐心，慢工出细活',
    wolf:    "像灰太狼一样，每次被打飞都喊'我一定会回来的'",
  }
  return map[id] || ''
}
