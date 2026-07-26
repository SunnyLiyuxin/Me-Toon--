import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Viewport, { BackToDesktopButton } from '../components/Viewport.jsx'
import XpWindow from '../components/XpWindow.jsx'
import SvgIcon from '../components/SvgIcon.jsx'
import cartoonsData from '../data/cartoons.json'
import './Gacha.css'

/**
 * 扭蛋机页面
 * 4 个交互状态：待机 → 投币 → 扭动旋钮 → 出货
 * 包含结果展示弹窗 + 大风车彩蛋
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
    // 2s 后进入可扭动状态
    setTimeout(() => {
      setState('ready')
      setCoinAnimation(false)
    }, 2000)
  }

  // 扭动旋钮
  const handleTurnKnob = () => {
    if (state !== 'ready') return
    setState('turning')
    // 1.5s 旋转后出货
    setTimeout(() => {
      setState('dispensing')
      // 1.2s 出货动画后展示结果
      setTimeout(() => {
        // 决定结果
        const newSpinCount = spinCount + 1
        setSpinCount(newSpinCount)
        // 第5次扭蛋触发大风车彩蛋
        if (isEasterEgg || newSpinCount === 5) {
          setIsEasterEgg(true)
        }
        // 随机选择一部动画
        const cartoon = cartoonsData.cartoons[
          Math.floor(Math.random() * cartoonsData.cartoons.length)
        ]
        setResultCartoon(cartoon)
        setShowResult(true)
      }, 1200)
    }, 1500)
  }

  // 关闭结果弹窗
  const handleCloseResult = () => {
    setShowResult(false)
    setResultCartoon(null)
    setState('idle')
  }

  // 进入观看
  const handleWatch = () => {
    setShowResult(false)
    navigate('/detail')
  }

  // 再抽一次
  const handleRetry = () => {
    setShowResult(false)
    setResultCartoon(null)
    setState('idle')
  }

  return (
    <Viewport className="page-gacha">
      {/* 星空背景 */}
      <div className="gacha-bg" />
      {/* 地板 */}
      <div className="gacha-floor" />
      {/* 小卖部霓虹招牌 */}
      <div className="neon-sign anim-breath">星际小卖部</div>

      <BackToDesktopButton />

      {/* 标题提示 */}
      <div className="gacha-hint">
        {state === 'idle' && (
          <>
            <SvgIcon name="game" size={18} color="#FFCC00" />
            <span>点击投币口开始</span>
          </>
        )}
        {state === 'inserting' && (
          <>
            <SvgIcon name="hourglass" size={18} color="#FFCC00" />
            <span>投币中...</span>
          </>
        )}
        {state === 'ready' && (
          <>
            <SvgIcon name="sparkle" size={18} color="#FFCC00" />
            <span>旋钮已就绪，扭动它！</span>
          </>
        )}
        {state === 'turning' && (
          <>
            <SvgIcon name="swirl" size={18} color="#FFCC00" />
            <span>扭动中...</span>
          </>
        )}
        {state === 'dispensing' && (
          <>
            <SvgIcon name="box" size={18} color="#FFCC00" />
            <span>出货中...</span>
          </>
        )}
      </div>

      {/* 扭蛋机主体 */}
      <div className={`gacha-machine anim-float ${state === 'turning' ? 'shaking' : ''}`}>
        <img src="./assets/images/gacha/gacha-machine.png" alt="扭蛋机" />

        {/* 投币口（点击区域） */}
        <button
          className={`click-zone coin-slot ${state === 'ready' ? 'glowing' : ''}`}
          onClick={handleInsertCoin}
          disabled={state !== 'idle'}
          title="投币口"
        />

        {/* 旋钮（点击区域） */}
        <button
          className={`click-zone knob ${state === 'ready' ? 'glowing pulsing' : ''} ${state === 'turning' ? 'spinning' : ''}`}
          onClick={handleTurnKnob}
          disabled={state !== 'ready'}
          title="扭动旋钮"
        />

        {/* 球仓内星球（漂浮动画） */}
        <div className={`planet-container ${state === 'turning' ? 'fast-spin' : ''}`}>
          <FloatingPlanets />
        </div>

        {/* 出货口（出货时高亮） */}
        <div className={`click-zone dispensing-slot ${state === 'dispensing' ? 'flashing' : ''}`} />

        {/* 投币动画 */}
        {coinAnimation && <CoinDrop />}
      </div>

      {/* 出货特效 */}
      {state === 'dispensing' && <DispenseEffect />}

      {/* 扭动时的彩色粒子 */}
      {state === 'turning' && <ParticleExplosion />}

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
 * 漂浮的记忆星球（球仓内）
 */
function FloatingPlanets() {
  const planets = [
    { color: '#FF6699', top: '10%', left: '20%', delay: '0s' },
    { color: '#0054E3', top: '20%', left: '60%', delay: '0.5s' },
    { color: '#FFCC00', top: '40%', left: '30%', delay: '1s' },
    { color: '#33FF33', top: '35%', left: '70%', delay: '1.5s' },
    { color: '#CC66FF', top: '55%', left: '50%', delay: '0.3s' },
    { color: '#FF6699', top: '60%', left: '20%', delay: '0.8s' },
    { color: '#FFCC00', top: '15%', left: '45%', delay: '1.3s' },
  ]
  return (
    <>
      {planets.map((p, i) => (
        <div
          key={i}
          className="floating-planet"
          style={{
            background: p.color,
            top: p.top,
            left: p.left,
            animationDelay: p.delay,
          }}
        />
      ))}
    </>
  )
}

/**
 * 投币动画 - 像素硬币从上方掉落
 */
function CoinDrop() {
  return (
    <div className="coin-drop">
      <div className="coin-svg">
        <SvgIcon name="coin" size={28} color="#FFCC00" />
      </div>
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
    color: ['#FF6699', '#FFCC00', '#0054E3', '#33FF33'][i % 4],
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
    // 记录到 localStorage
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
        {/* 标题图标 */}
        <div className="result-title-row">
          <SvgIcon name="clapperboard" size={24} color="#0054E3" />
          <span className="result-title-text">记忆觉醒</span>
        </div>

        {/* 星球裂开动画 */}
        {phase !== 'shown' && (
          <div className={`result-planet ${phase === 'cracking' ? 'cracking' : 'broken'}`}>
            <div className="planet-crack crack-1" />
            <div className="planet-crack crack-2" />
            <div className="planet-crack crack-3" />
            {phase === 'revealing' && <div className="planet-glow-burst" />}
          </div>
        )}

        {/* 展示区域 */}
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
