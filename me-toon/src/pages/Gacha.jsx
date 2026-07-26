import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Viewport, { BackToDesktopButton } from '../components/Viewport.jsx'
import XpWindow from '../components/XpWindow.jsx'
import SvgIcon from '../components/SvgIcon.jsx'
import cartoonsData from '../data/cartoons.json'
import './Gacha.css'

/**
 * 扭蛋机页面 — 千禧梦幻形态
 * 4 个交互状态：待机 → 投币 → 扭动旋钮 → 出货
 * 视觉：粉色梦幻背景 + 透明穹顶扭蛋机 + 滚动扭蛋 + 底座
 */
export default function Gacha() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [state, setState] = useState('idle') // idle | inserting | ready | turning | dispensing
  const [showResult, setShowResult] = useState(false)
  const [resultCartoon, setResultCartoon] = useState(null)
  const [isEasterEgg, setIsEasterEgg] = useState(false)
  const [spinCount, setSpinCount] = useState(0)
  const [coinAnimation, setCoinAnimation] = useState(false)

  // 检测是否从 QQ 彩蛋进入
  useEffect(() => {
    if (searchParams.get('easter') === 'dachentou') {
      setIsEasterEgg(true)
    }
  }, [searchParams])

  // 投币
  const handleInsertCoin = () => {
    if (state !== 'idle') return
    setState('inserting')
    setCoinAnimation(true)
    setTimeout(() => {
      setState('ready')
      setCoinAnimation(false)
    }, 2000)
  }

  // 扭动旋钮
  const handleTurnKnob = () => {
    if (state !== 'ready') return
    setState('turning')
    setTimeout(() => {
      setState('dispensing')
      setTimeout(() => {
        const newSpinCount = spinCount + 1
        setSpinCount(newSpinCount)
        if (isEasterEgg || newSpinCount === 5) {
          setIsEasterEgg(true)
        }
        const cartoon = cartoonsData.cartoons[
          Math.floor(Math.random() * cartoonsData.cartoons.length)
        ]
        setResultCartoon(cartoon)
        setShowResult(true)
      }, 1200)
    }, 1500)
  }

  const handleCloseResult = () => {
    setShowResult(false)
    setResultCartoon(null)
    setState('idle')
  }

  const handleWatch = () => {
    setShowResult(false)
    navigate('/detail')
  }

  const handleRetry = () => {
    setShowResult(false)
    setResultCartoon(null)
    setState('idle')
  }

  return (
    <Viewport className="page-gacha">
      {/* ===== 千禧梦幻背景层 ===== */}
      <div className="gacha-dream-frame">
        <div className="gacha-dream-base" />
        <div className="gacha-dream-glow-1" />
        <div className="gacha-dream-glow-2" />
        <div className="gacha-dream-noise" />
        <div className="gacha-dream-scanline" />
        <div className="gacha-dream-flicker" />
      </div>

      <BackToDesktopButton />

      {/* 顶部标题提示 */}
      <div className="gacha-hint">
        {state === 'idle' && (
          <>
            <SvgIcon name="game" size={18} color="#FFB6C9" />
            <span>点击投币口开始</span>
          </>
        )}
        {state === 'inserting' && (
          <>
            <SvgIcon name="hourglass" size={18} color="#FFB6C9" />
            <span>投币中...</span>
          </>
        )}
        {state === 'ready' && (
          <>
            <SvgIcon name="sparkle" size={18} color="#FFB6C9" />
            <span>旋钮已就绪，扭动它！</span>
          </>
        )}
        {state === 'turning' && (
          <>
            <SvgIcon name="swirl" size={18} color="#FFB6C9" />
            <span>扭动中...</span>
          </>
        )}
        {state === 'dispensing' && (
          <>
            <SvgIcon name="box" size={18} color="#FFB6C9" />
            <span>出货中...</span>
          </>
        )}
      </div>

      {/* ===== 扭蛋机主体（CSS 绘制） ===== */}
      <div className={`gacha-machine ${state === 'turning' ? 'shaking' : ''}`}>
        {/* 透明穹顶 + 滚动扭蛋 */}
        <div className="dome">
          <div className={`egg-container ${state === 'turning' ? 'fast-roll' : ''}`}>
            <div className="egg egg-1" />
            <div className="egg egg-2" />
            <div className="egg egg-3" />
            <div className="egg egg-4" />
            <div className="egg egg-5" />
            <div className="egg egg-6" />
            <div className="egg egg-7" />
            <div className="egg egg-8" />
            <div className="egg egg-9" />
            <div className="egg egg-10" />
          </div>
          {/* 穹顶高光 */}
          <div className="dome-shine" />
        </div>

        {/* 中部控制面板：投币口 + 旋钮 */}
        <div className="control-panel">
          <button
            className={`coin-slot ${state === 'ready' ? 'glowing' : ''}`}
            onClick={handleInsertCoin}
            disabled={state !== 'idle'}
            title="投币口"
          >
            <SvgIcon name="coin" size={22} color="#8a4a60" />
            <span className="coin-slot-label">投币</span>
          </button>

          <button
            className={`knob ${state === 'ready' ? 'glowing pulsing' : ''} ${state === 'turning' ? 'spinning' : ''}`}
            onClick={handleTurnKnob}
            disabled={state !== 'ready'}
            title="扭动旋钮"
          >
            <span className="knob-inner" />
          </button>
        </div>

        {/* 底座 + 出货口 */}
        <div className="base">
          <div className={`dispensing-slot ${state === 'dispensing' ? 'flashing' : ''}`} />
          <span className="base-deco">✦</span>
        </div>

        {/* 投币动画 */}
        {coinAnimation && <CoinDrop />}
      </div>

      {/* 出货特效 */}
      {state === 'dispensing' && <DispenseEffect />}

      {/* 扭动时的彩色粒子 */}
      {state === 'turning' && <ParticleExplosion />}

      {/* 水印 */}
      <div className="gacha-watermark">✦ 千禧扭蛋 · 像素幻境 ✦</div>

      {/* 结果展示弹窗 */}
      {showResult && (
        <GachaResult
          cartoon={resultCartoon}
          isEasterEgg={isEasterEgg}
          onWatch={handleWatch}
          onRetry={handleRetry}
          onClose={handleCloseResult}
        />
      )}
    </Viewport>
  )
}

/**
 * 投币动画
 */
function CoinDrop() {
  return (
    <div className="coin-drop">
      <SvgIcon name="coin" size={28} color="#FFCC00" />
    </div>
  )
}

/**
 * 出货特效
 */
function DispenseEffect() {
  return (
    <>
      <div className="dispense-flash" />
      <div className="rainbow-flash" />
    </>
  )
}

/**
 * 彩色粒子爆炸
 */
function ParticleExplosion() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    color: ['#FFB6C9', '#FFCC00', '#FFD0E0', '#FFA5B9', '#FFE2EC'][i % 5],
    angle: (i / 20) * 360,
    distance: 100 + (i % 5) * 20,
    delay: (i % 5) * 0.1,
  }))
  return (
    <div className="particle-container">
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            background: p.color,
            '--angle': `${p.angle}deg`,
            '--distance': `${p.distance}px`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

/**
 * 扭蛋结果展示弹窗
 */
function GachaResult({ cartoon, isEasterEgg, onWatch, onRetry, onClose }) {
  const [phase, setPhase] = useState('cracking') // cracking | revealing | shown
  const [collected, setCollected] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('revealing'), 500)
    const t2 = setTimeout(() => setPhase('shown'), 1200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const handleCollect = () => {
    setCollected(true)
    const collectedList = JSON.parse(localStorage.getItem('me-toon-collected') || '[]')
    if (!collectedList.find(c => c.id === cartoon.id)) {
      collectedList.push({
        id: cartoon.id,
        name: cartoon.name,
        collectedAt: new Date().toISOString(),
      })
      localStorage.setItem('me-toon-collected', JSON.stringify(collectedList))
    }
  }

  return (
    <XpWindow
      title="记忆觉醒！"
      centered
      onClose={onClose}
      style={{ width: 380 }}
    >
      <div className="gacha-result">
        <div className="result-title-row">
          <SvgIcon name="clapperboard" size={24} color="#0054E3" />
          <span className="result-title-text">记忆觉醒</span>
        </div>

        {phase !== 'shown' && (
          <div className={`result-planet ${phase === 'cracking' ? 'cracking' : 'broken'}`}>
            <div className="planet-crack crack-1" />
            <div className="planet-crack crack-2" />
            <div className="planet-crack crack-3" />
            {phase === 'revealing' && <div className="planet-glow-burst" />}
          </div>
        )}

        {phase === 'shown' && (
          <>
            {isEasterEgg ? (
              <div className="easter-egg-show">
                <div className="easter-windmill anim-spin">
                  <SvgIcon name="windmill" size={100} color="#FFCC00" />
                </div>
                <p className="easter-lyric">大风车吱呀吱悠悠地转~</p>
                <p className="easter-tag">
                  <SvgIcon name="sparkle" size={18} color="#FFCC00" />
                  隐藏动画已解锁：《大风车》
                </p>
              </div>
            ) : (
              <>
                <div className="result-cartoon-name">{cartoon.name}</div>
                <div className="result-image-frame">
                  <img src={`.${cartoon.images.firstFrame}`} alt={cartoon.name} />
                </div>
                <div className="result-info-list">
                  <div className="result-info-row">
                    <span className="info-label">动画名称：</span>
                    <span className="info-value">《{cartoon.name}》</span>
                  </div>
                  <div className="result-info-row">
                    <span className="info-label">播出年份：</span>
                    <span className="info-value">{cartoon.year}年</span>
                  </div>
                  <div className="result-info-row">
                    <span className="info-label">集数：</span>
                    <span className="info-value">共{cartoon.episodes}集</span>
                  </div>
                  <div className="result-info-row">
                    <span className="info-label">简介：</span>
                    <span className="info-value info-tagline">{cartoon.tagline}</span>
                  </div>
                </div>
              </>
            )}

            <div className="result-actions">
              <button className="xp-button-primary" onClick={onWatch}>
                进入观看
              </button>
              <button className="xp-button" onClick={onRetry}>
                再抽一次
              </button>
              <button
                className={`xp-button ${collected ? 'collected' : ''}`}
                onClick={handleCollect}
                disabled={collected}
              >
                {collected ? (
                  <>
                    <SvgIcon name="check" size={16} color="#FFFFFF" />
                    <span>已收藏</span>
                  </>
                ) : (
                  <>
                    <SvgIcon name="star" size={16} color="#003C74" />
                    <span>收藏起来</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </XpWindow>
  )
}
