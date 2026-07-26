import { useState, useEffect, useRef } from 'react'
import SvgIcon from '../../components/SvgIcon.jsx'
import { useSound } from '../../hooks/useMedia.js'
import TimeEcho from './TimeEcho.jsx'
import './Resonance.css'

/**
 * 记忆共振子页面 — 共振台 + 4 卫星按钮
 * - 中央共振台（圆形平台）
 *   - 12点方向：🏷️ 情绪标签
 *   - 4点方向：🧵 记忆织布机
 *   - 8点方向：📮 未来邮筒
 *   - 6点方向：🔮 时光回响（仅当 cartoon.resonance.timeEcho 存在时显示）
 *
 * 每个卫星按钮可点击展开为对应功能面板。
 * 情绪标签：保留原"泡泡"形式，列出 cartoon.resonance.emotionTags
 * 记忆织布机：填空式留言
 * 未来邮筒：写信
 * 时光回响：2025 羊设认领（喜羊羊专属）
 */

const COLOR_MAP = {
  gold:   { bg: '#FFF4D0', border: '#E0A030', text: '#7A4A00', glow: '#FFD86B', icon: 'heartGold' },
  pink:   { bg: '#FFE0EC', border: '#E06090', text: '#9A2050', glow: '#FF9DC2', icon: 'heart' },
  blue:   { bg: '#D6E8FF', border: '#3060C0', text: '#143570', glow: '#7FB3FF', icon: 'heart' },
  purple: { bg: '#E8D8FF', border: '#7040C0', text: '#3A1466', glow: '#C29BFF', icon: 'heart' },
  dark:   { bg: '#3A2A4A', border: '#1A0A2A', text: '#FFE0EC', glow: '#9A6BBF', icon: 'heart' },
}

// 4 个卫星按钮配置（角度：12点=-90°, 4点=30°, 8点=150°, 6点=90°）
const SATELLITES = [
  { id: 'emotion',  icon: 'tag',      label: '情绪标签', angle: -90, color: '#FFD86B' },
  { id: 'loom',     icon: 'sparkle',  label: '记忆织布机', angle: 30,  color: '#FF9DC2' },
  { id: 'mailbox',  icon: 'mailbox',  label: '未来邮筒', angle: 150, color: '#7FB3FF' },
]

export default function Resonance({ cartoon }) {
  const playSfx = useSound()
  const hasTimeEcho = !!(cartoon.resonance?.timeEcho?.enabled)
  const satellites = hasTimeEcho
    ? [...SATELLITES, { id: 'timeEcho', icon: 'hourglass', label: '时光回响', angle: 90, color: '#C29BFF' }]
    : SATELLITES

  const [activePanel, setActivePanel] = useState(null) // 'emotion' | 'loom' | 'mailbox' | 'timeEcho'
  const [orbiting, setOrbiting] = useState(false)
  const [centerBurst, setCenterBurst] = useState(false)
  const sectionRef = useRef(null)

  // 进入页面后启动轨道旋转动画
  useEffect(() => {
    setOrbiting(false)
    const t = setTimeout(() => {
      setOrbiting(true)
      try { playSfx('ding') } catch (e) {}
    }, 300)
    return () => clearTimeout(t)
  }, [cartoon.id])

  const handleSatelliteClick = (id) => {
    try { playSfx('click') } catch (e) {}
    if (activePanel === id) {
      setActivePanel(null)
      return
    }
    // 时光回响：按钮飞入共振台 + 展开时间漩涡
    if (id === 'timeEcho') {
      setCenterBurst(true)
      setTimeout(() => setCenterBurst(false), 600)
    }
    setActivePanel(id)
  }

  return (
    <div className="resonance-room" ref={sectionRef}>
      {/* 星空背景 */}
      <div className="resonance-stars">
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={i}
            className="resonance-star"
            style={{
              left: `${(i * 137) % 100}%`,
              top: `${(i * 89) % 100}%`,
              animationDelay: `${(i % 6) * 0.4}s`,
              width: i % 3 === 0 ? 3 : 2,
              height: i % 3 === 0 ? 3 : 2,
            }}
          />
        ))}
      </div>

      {/* 顶部标题 */}
      <div className="resonance-header">
        <SvgIcon name="tag" size={28} color="#FFCCFF" />
        <h2 className="resonance-title">记忆共振</h2>
        <p className="resonance-subtitle">点击环绕的卫星，开启与这部作品的回响</p>
      </div>

      {/* 共振台 + 卫星按钮 */}
      <div className="resonance-stage">
        <div className={`resonance-orbit ${orbiting ? 'is-orbiting' : ''}`}>
          {/* 中央共振台 */}
          <div className={`resonance-core ${centerBurst ? 'is-burst' : ''}`}>
            <div className="resonance-core-inner">
              <SvgIcon name="sparkle" size={32} color="#FFCCFF" />
              <span className="resonance-core-label">共振台</span>
            </div>
            <div className="resonance-core-ring" />
            <div className="resonance-core-ring resonance-core-ring-2" />
          </div>

          {/* 卫星按钮 */}
          {satellites.map((sat) => {
            const rad = (sat.angle * Math.PI) / 180
            const R = 150 // 轨道半径
            const x = Math.cos(rad) * R
            const y = Math.sin(rad) * R
            return (
              <button
                key={sat.id}
                className={`resonance-satellite ${activePanel === sat.id ? 'is-active' : ''}`}
                style={{
                  '--sat-x': `${x}px`,
                  '--sat-y': `${y}px`,
                  '--sat-color': sat.color,
                }}
                onClick={() => handleSatelliteClick(sat.id)}
                title={sat.label}
              >
                <span className="resonance-satellite-icon">
                  <SvgIcon name={sat.icon} size={26} color="#FFFFFF" />
                </span>
                <span className="resonance-satellite-label">{sat.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 功能面板（点击卫星后展开） */}
      {activePanel === 'emotion' && (
        <EmotionPanel cartoon={cartoon} onClose={() => setActivePanel(null)} />
      )}
      {activePanel === 'loom' && (
        <LoomPanel cartoon={cartoon} onClose={() => setActivePanel(null)} />
      )}
      {activePanel === 'mailbox' && (
        <MailboxPanel cartoon={cartoon} onClose={() => setActivePanel(null)} />
      )}
      {activePanel === 'timeEcho' && (
        <TimeEcho cartoon={cartoon} onClose={() => setActivePanel(null)} />
      )}

      {/* 底部提示 */}
      <div className="resonance-footer">
        <SvgIcon name="sparkle" size={20} color="#FFCC00" />
        <span>环绕的每一颗卫星，都是与这部作品共度的回声</span>
        <SvgIcon name="sparkle" size={20} color="#FFCC00" />
      </div>
    </div>
  )
}

/* ============================================================
   情绪标签面板
   ============================================================ */
function EmotionPanel({ cartoon, onClose }) {
  const tags = cartoon.resonance.emotionTags
  const [visibleCount, setVisibleCount] = useState(0)
  const playSfx = useSound()

  useEffect(() => {
    setVisibleCount(0)
    let i = 0
    const timer = setInterval(() => {
      i += 1
      setVisibleCount(i)
      try { playSfx('ding') } catch (e) {}
      if (i >= tags.length) clearInterval(timer)
    }, 500)
    return () => clearInterval(timer)
  }, [cartoon.id])

  return (
    <div className="resonance-panel resonance-panel-emotion">
      <div className="resonance-panel-header">
        <SvgIcon name="tag" size={20} color="#FFD86B" />
        <h3>情绪标签</h3>
        <button className="resonance-panel-close" onClick={onClose}>×</button>
      </div>
      <div className="resonance-bubbles">
        {tags.map((tag, idx) => {
          const palette = COLOR_MAP[tag.color] || COLOR_MAP.gold
          const visible = idx < visibleCount
          return (
            <div
              key={idx}
              className={`resonance-bubble ${visible ? 'is-visible' : ''}`}
              style={{
                background: palette.bg,
                borderColor: palette.border,
                color: palette.text,
                ['--bubble-glow']: palette.glow,
              }}
            >
              <div className="resonance-bubble-icon">
                <SvgIcon name={palette.icon} size={32} color={palette.border} strokeWidth={2} />
              </div>
              <div className="resonance-bubble-body">
                <div className="resonance-bubble-label">{tag.label}</div>
                <div className="resonance-bubble-note">{tag.note}</div>
              </div>
              <span className="resonance-bubble-shine" />
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ============================================================
   记忆织布机面板
   ============================================================ */
function LoomPanel({ cartoon, onClose }) {
  const prompts = cartoon.resonance.loomPrompts || []
  const [answers, setAnswers] = useState({})
  const [saved, setSaved] = useState(false)
  const playSfx = useSound()

  const characterName = (id) => {
    const c = cartoon.characters.find(c => c.id === id)
    return c ? c.name : id
  }

  const handleSave = () => {
    try { playSfx('ding') } catch (e) {}
    // 存入收藏（锦缎形式）
    const list = JSON.parse(localStorage.getItem('me-toon-looms') || '[]')
    prompts.forEach((p) => {
      const ans = answers[p.characterId]?.trim()
      if (ans) {
        list.push({
          type: 'loom',
          cartoonId: cartoon.id,
          cartoonName: cartoon.name,
          characterId: p.characterId,
          characterName: characterName(p.characterId),
          prompt: p.prompt,
          answer: ans,
          createdAt: new Date().toISOString(),
        })
      }
    })
    localStorage.setItem('me-toon-looms', JSON.stringify(list))
    setSaved(true)
    setTimeout(() => onClose(), 1200)
  }

  return (
    <div className="resonance-panel resonance-panel-loom">
      <div className="resonance-panel-header">
        <SvgIcon name="sparkle" size={20} color="#FF9DC2" />
        <h3>记忆织布机</h3>
        <button className="resonance-panel-close" onClick={onClose}>×</button>
      </div>
      <div className="loom-prompts">
        {prompts.map((p, i) => (
          <div key={i} className="loom-item">
            <div className="loom-prompt">
              <span className="loom-char">{characterName(p.characterId)}</span>
              <span className="loom-text">{p.prompt}</span>
            </div>
            <input
              type="text"
              className="loom-input"
              placeholder={p.example ? `示例：${p.example}` : '写下你的回答…'}
              value={answers[p.characterId] || ''}
              onChange={(e) => setAnswers({ ...answers, [p.characterId]: e.target.value })}
            />
          </div>
        ))}
      </div>
      <button className="resonance-panel-save" onClick={handleSave} disabled={saved}>
        {saved ? '✓ 已织入记忆' : '织入记忆'}
      </button>
    </div>
  )
}

/* ============================================================
   未来邮筒面板
   ============================================================ */
function MailboxPanel({ cartoon, onClose }) {
  const mb = cartoon.resonance.mailboxPrompts
  const [target, setTarget] = useState('toCharacter') // 'toCharacter' | 'toSelf'
  const [content, setContent] = useState('')
  const [sent, setSent] = useState(false)
  const playSfx = useSound()

  const handleSend = () => {
    if (!content.trim()) return
    try { playSfx('ding') } catch (e) {}
    const list = JSON.parse(localStorage.getItem('me-toon-letters') || '[]')
    list.push({
      type: 'letter',
      cartoonId: cartoon.id,
      cartoonName: cartoon.name,
      target,
      title: target === 'toCharacter' ? mb.toCharacter : mb.toSelf,
      content: content.trim(),
      sentAt: new Date().toISOString(),
    })
    localStorage.setItem('me-toon-letters', JSON.stringify(list))
    setSent(true)
    setTimeout(() => onClose(), 1500)
  }

  return (
    <div className="resonance-panel resonance-panel-mailbox">
      <div className="resonance-panel-header">
        <SvgIcon name="mailbox" size={20} color="#7FB3FF" />
        <h3>未来邮筒</h3>
        <button className="resonance-panel-close" onClick={onClose}>×</button>
      </div>
      <div className="mailbox-tabs">
        <button
          className={`mailbox-tab ${target === 'toCharacter' ? 'is-active' : ''}`}
          onClick={() => setTarget('toCharacter')}
        >
          {mb.toCharacter}
        </button>
        <button
          className={`mailbox-tab ${target === 'toSelf' ? 'is-active' : ''}`}
          onClick={() => setTarget('toSelf')}
        >
          {mb.toSelf}
        </button>
      </div>
      <div className="mailbox-hint">
        {target === 'toCharacter' ? mb.toCharacterHint : mb.toSelfHint}
      </div>
      <textarea
        className="mailbox-textarea"
        placeholder="在这里写下你想说的话…"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={5}
      />
      <button className="resonance-panel-save" onClick={handleSend} disabled={sent || !content.trim()}>
        {sent ? '✓ 已寄出' : '投入邮筒'}
      </button>
    </div>
  )
}
