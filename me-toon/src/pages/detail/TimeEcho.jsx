import { useState, useEffect, useRef } from 'react'
import SvgIcon from '../../components/SvgIcon.jsx'
import { useSound } from '../../hooks/useMedia.js'
import './TimeEcho.css'

/**
 * 时光回响模块 — 2025 羊设认领
 *
 * 流程：
 * 1. 时间漩涡动画（200×200，双层光环反向旋转 + 融合）
 * 2. 像素手机屏幕对话框：介绍 2025 年"我是一只××的小羊"现象
 * 3. 点击"查看大家的羊设" → 羊设认领卡片（左右滑动浏览 6 张）
 * 4. 点击"我也是这只羊" → 卡片 Y 轴翻转 → 显示羊设认证卡
 * 5. 点击"存入记忆抽屉" → 缩成贴纸飞入收藏册（写入 me-toon-collected）
 * 6. 跨越20年 call back 彩蛋：若用户曾给对应角色贴过"我的榜样"金色情绪标签，
 *    弹出特殊提示
 *
 * 数据来源：cartoon.resonance.timeEcho
 */

export default function TimeEcho({ cartoon, onClose }) {
  const playSfx = useSound()
  const timeEcho = cartoon.resonance?.timeEcho
  const sheepTypes = timeEcho?.sheepTypes || []

  const [phase, setPhase] = useState('vortex') // 'vortex' | 'intro' | 'cards' | 'cert'
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [certified, setCertified] = useState(null) // 已认证的羊设对象
  const [showCallback, setShowCallback] = useState(false)
  const [saved, setSaved] = useState(false)

  // 漩涡动画 → intro
  useEffect(() => {
    if (phase !== 'vortex') return
    const t = setTimeout(() => {
      try { playSfx('ding') } catch (e) {}
      setPhase('intro')
    }, 1800)
    return () => clearTimeout(t)
  }, [phase])

  // 检测跨20年 call back 彩蛋
  const checkCallback = (sheepType) => {
    const looms = JSON.parse(localStorage.getItem('me-toon-looms') || '[]')
    // 简化检测：若用户曾为该角色写过错过织布机寄语，则触发彩蛋
    const hasLoom = looms.some(l => l.characterId === sheepType.characterId && l.cartoonId === cartoon.id)
    return hasLoom
  }

  const handleChoose = (sheepType) => {
    try { playSfx('ding') } catch (e) {}
    setCertified(sheepType)
    setPhase('cert')
    if (checkCallback(sheepType)) {
      setTimeout(() => setShowCallback(true), 800)
    }
  }

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
    setTimeout(() => onClose(), 1500)
  }

  if (!timeEcho?.enabled) return null

  return (
    <div className="time-echo-panel">
      <div className="resonance-panel-header">
        <SvgIcon name="hourglass" size={20} color="#C29BFF" />
        <h3>时光回响</h3>
        <button className="resonance-panel-close" onClick={onClose}>×</button>
      </div>

      {/* 阶段 1：时间漩涡 */}
      {phase === 'vortex' && (
        <div className="time-vortex">
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

      {/* 阶段 2：介绍对话框（像素手机屏幕） */}
      {phase === 'intro' && (
        <div className="echo-phone">
          <div className="phone-screen">
            <div className="phone-statusbar">
              <span>2025</span>
              <span className="phone-signal">📶</span>
              <span className="phone-battery">🔋</span>
            </div>
            <div className="phone-content">
              <p className="echo-title">📱 2025年的互联网上...</p>
              <p>最近有一个词突然火了，大家都在说——</p>
              <p className="echo-quote">"我是一只_____的小羊"</p>
              <p className="echo-source">这其实是《{cartoon.name}》在 2025 年的意外文艺复兴。</p>
              <p className="echo-story">{timeEcho.story}</p>
              <button
                className="echo-view-btn"
                onClick={() => { try { playSfx('click') } catch (e) {} setPhase('cards') }}
              >
                [ 查看大家的羊设 ]
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 阶段 3：羊设认领卡片（左右滑动） */}
      {phase === 'cards' && (
        <div className="sheep-cards-stage">
          <div className="sheep-cards-track">
            {sheepTypes.map((sheep, i) => {
              const offset = (i - selectedIdx) * 100
              const isVisible = i === selectedIdx
              return (
                <div
                  key={sheep.id}
                  className={`sheep-card ${isVisible ? 'is-current' : ''}`}
                  style={{
                    transform: `translateX(${offset}%)`,
                    opacity: isVisible ? 1 : 0,
                    pointerEvents: isVisible ? 'auto' : 'none',
                    zIndex: isVisible ? 2 : 1,
                  }}
                  onClick={() => { try { playSfx('click') } catch (e) {} setSelectedIdx(i) }}
                >
                  <div className="sheep-card-emoji">{sheep.emoji}</div>
                  <div className="sheep-card-motto">"{sheep.motto}"</div>
                  <div className="sheep-card-meta">
                    <span>出处: {sheep.origin}</span>
                    <span>时间: {sheep.time}</span>
                  </div>
                  <div className="sheep-card-meaning">{sheep.meaning}</div>
                  <div className="sheep-card-usage">经典用法: "{sheep.usage}"</div>
                  {isVisible && (
                    <button
                      className="sheep-card-choose"
                      onClick={(e) => { e.stopPropagation(); handleChoose(sheep) }}
                    >
                      我也是这只羊 →
                    </button>
                  )}
                </div>
              )
            })}
          </div>
          <div className="sheep-cards-nav">
            <button
              onClick={() => setSelectedIdx(Math.max(0, selectedIdx - 1))}
              disabled={selectedIdx === 0}
            >← 上一只</button>
            <span className="sheep-cards-counter">{selectedIdx + 1} / {sheepTypes.length}</span>
            <button
              onClick={() => setSelectedIdx(Math.min(sheepTypes.length - 1, selectedIdx + 1))}
              disabled={selectedIdx === sheepTypes.length - 1}
            >下一只 →</button>
          </div>
        </div>
      )}

      {/* 阶段 4：羊设认证卡（卡片翻转后） */}
      {phase === 'cert' && certified && (
        <div className="cert-stage">
          <div className={`cert-card ${showCallback ? 'has-callback' : ''}`}>
            <div className="cert-card-emoji">{certified.emoji}</div>
            <div className="cert-card-title">🐑 羊设认证卡</div>
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
              从今天起，我就是这只羊了。<br />咩咩咩！
            </div>
            <div className="cert-card-source">—— 来自2005年的动画，在2025年依然陪着我</div>
            <button
              className="cert-card-save"
              onClick={handleSaveToCollection}
              disabled={saved}
            >
              {saved ? '✓ 已存入记忆抽屉' : '[ 存入记忆抽屉 ]'}
            </button>
          </div>

          {/* 跨20年 call back 彩蛋 */}
          {showCallback && (
            <div className="callback-egg">
              <SvgIcon name="sparkle" size={24} color="#FFD700" />
              <p>🌟 你小时候喜欢的那个角色，</p>
              <p>长大后，你变成了TA的样子。</p>
              <p>这就是最好的 call back。</p>
              <p className="callback-welcome">欢迎回来，{certified.title}。</p>
              <SvgIcon name="sparkle" size={24} color="#FFD700" />
            </div>
          )}
        </div>
      )}

      {/* 结尾文案 */}
      {phase === 'cert' && !showCallback && saved && (
        <div className="echo-ending">
          {timeEcho.ending.split('\n').map((line, i) => (
            <p key={i}>{line || '\u00A0'}</p>
          ))}
          <p className="echo-ending-sign">—— Me-Toon · 时光回响</p>
        </div>
      )}
    </div>
  )
}
