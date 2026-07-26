import { useState, useEffect, useRef } from 'react'
import SvgIcon from '../../components/SvgIcon.jsx'
import { useSound } from '../../hooks/useMedia.js'
import './Resonance.css'

/**
 * 记忆共振子页面
 * - 顶部：标题
 * - 中部：情绪标签泡泡（逐个浮起 + 浮动动画）
 *   每个 color 对应不同的简笔画瓶子图标
 * - 底部：提示文案
 */
const COLOR_MAP = {
  gold:   { bg: '#FFF4D0', border: '#E0A030', text: '#7A4A00', glow: '#FFD86B', icon: 'heartGold' },
  pink:   { bg: '#FFE0EC', border: '#E06090', text: '#9A2050', glow: '#FF9DC2', icon: 'heart' },
  blue:   { bg: '#D6E8FF', border: '#3060C0', text: '#143570', glow: '#7FB3FF', icon: 'heart' },
  purple: { bg: '#E8D8FF', border: '#7040C0', text: '#3A1466', glow: '#C29BFF', icon: 'heart' },
}

export default function Resonance({ cartoon }) {
  const tags = cartoon.resonance.emotionTags
  const [visibleCount, setVisibleCount] = useState(0)
  const [hoveredIdx, setHoveredIdx] = useState(null)
  const playSfx = useSound()
  const sectionRef = useRef(null)

  // 进入页面后逐个出现泡泡
  useEffect(() => {
    setVisibleCount(0)
    let i = 0
    const timer = setInterval(() => {
      i += 1
      setVisibleCount(i)
      try { playSfx('ding') } catch (e) {}
      if (i >= tags.length) {
        clearInterval(timer)
      }
    }, 700)
    return () => clearInterval(timer)
  }, [cartoon.id])

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
        <p className="resonance-subtitle">每一颗泡泡，都是与这部作品共度的回声</p>
      </div>

      {/* 泡泡容器 */}
      <div className="resonance-bubbles">
        {tags.map((tag, idx) => {
          const palette = COLOR_MAP[tag.color] || COLOR_MAP.gold
          const visible = idx < visibleCount
          const isHovered = hoveredIdx === idx

          return (
            <div
              key={idx}
              className={`resonance-bubble ${visible ? 'is-visible' : ''} ${isHovered ? 'is-hovered' : ''}`}
              style={{
                background: palette.bg,
                borderColor: palette.border,
                color: palette.text,
                ['--bubble-glow']: palette.glow,
                animationDelay: `${idx * 0.7 + 0.3}s`,
              }}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className="resonance-bubble-icon">
                <SvgIcon
                  name={palette.icon}
                  size={36}
                  color={palette.border}
                  strokeWidth={2}
                />
              </div>
              <div className="resonance-bubble-body">
                <div className="resonance-bubble-label">{tag.label}</div>
                <div className="resonance-bubble-note">{tag.note}</div>
              </div>
              {/* 泡泡反光 */}
              <span className="resonance-bubble-shine" />
            </div>
          )
        })}
      </div>

      {/* 底部提示 */}
      <div className="resonance-footer">
        <SvgIcon name="sparkle" size={20} color="#FFCC00" />
        <span>把鼠标放到泡泡上，听听它的回响</span>
        <SvgIcon name="sparkle" size={20} color="#FFCC00" />
      </div>
    </div>
  )
}
