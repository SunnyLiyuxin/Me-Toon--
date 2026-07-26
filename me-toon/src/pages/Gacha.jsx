import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Viewport, { BackToDesktopButton } from '../components/Viewport.jsx'
import XpWindow from '../components/XpWindow.jsx'
import SvgIcon from '../components/SvgIcon.jsx'
import cartoonsData from '../data/cartoons.json'
import './Gacha.css'

/**
 * 扭蛋机页面 — Win98 梦核像素桌面风格
 * - 柔和蓝天 + 低像素云 + 梦幻绿坡 + 发光太阳 + 像素小树
 * - 左上角桌面图标
 * - 中央扭蛋机窗口（蓝色标题栏 + 窗口控制按钮）
 * - 底部任务栏（开始按钮 + 窗口标签 + 时间/音量）
 * - 柔光 + 噪点 + 扫描线叠加层
 * 交互：待机 → 投币 → 扭动旋钮 → 出货
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
  const [time, setTime] = useState(getTime())

  // 实时时间
  useEffect(() => {
    const timer = setInterval(() => setTime(getTime()), 1000)
    return () => clearInterval(timer)
  }, [])

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

  // 状态文案
  const stateText = {
    idle: '点击投币口开始',
    inserting: '投币中...',
    ready: '旋钮已就绪，扭动它！',
    turning: '扭动中...',
    dispensing: '出货中...',
  }[state]

  // 状态指示图标
  const stateIcon = {
    idle: 'game',
    inserting: 'hourglass',
    ready: 'sparkle',
    turning: 'swirl',
    dispensing: 'box',
  }[state]

  return (
    <Viewport className="page-gacha">
      {/* ===== 显示器外框 ===== */}
      <div className="win98-monitor">
        <div className="win98-screen">

          {/* ===== 桌面背景：柔和蓝天 + 云 + 绿坡 + 太阳 + 小树 ===== */}
          <div className="desktop-bg">
            <div className="sun" />
            <div className="cloud cloud-1" />
            <div className="cloud cloud-2" />
            <div className="cloud cloud-3" />
            <div className="cloud cloud-4" />
            <div className="hill hill-1" />
            <div className="hill hill-2" />
            <div className="hill hill-3" />
            <div className="grass" />
            <div className="tree tree-1" />
            <div className="tree tree-2" />
          </div>

          {/* ===== 左上角桌面图标 ===== */}
          <div className="desktop-icons">
            <div className="desktop-icon" onClick={() => navigate('/')}>
              <SvgIcon name="tv" size={32} color="#FFFFFF" strokeWidth={1.6} />
              <span className="label">我的电脑</span>
            </div>
            <div className="desktop-icon" onClick={() => navigate('/collection')}>
              <SvgIcon name="box" size={32} color="#FFFFFF" strokeWidth={1.6} />
              <span className="label">回收站</span>
            </div>
          </div>

          {/* ===== 返回桌面按钮 ===== */}
          <button className="back-btn" onClick={() => navigate('/')}>
            <SvgIcon name="back" size={14} color="#000080" />
            <span>返回桌面</span>
          </button>

          {/* ===== 顶部状态提示 ===== */}
          <div className="gacha-hint">
            <SvgIcon name={stateIcon} size={16} color="#000080" />
            <span>{stateText}</span>
          </div>

          {/* ===== 扭蛋机窗口（Win98 窗口） ===== */}
          <div className="gacha-window">
            <div className="window-titlebar">
              <span className="title">
                <SvgIcon name="game" size={16} color="#FFFFFF" />
                <span>扭蛋机 · 运行中</span>
              </span>
              <div className="window-controls">
                <button className="win-ctrl" title="最小化">—</button>
                <button className="win-ctrl" title="最大化">□</button>
                <button className="win-ctrl close" title="关闭" onClick={() => navigate('/')}>✕</button>
              </div>
            </div>
            <div className="gacha-body">
              {/* 扭蛋机主体 */}
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
                    <SvgIcon name="coin" size={20} color="#8a4a60" />
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
                  <span className="base-deco">✦ 扭蛋</span>
                </div>

                {/* 投币动画 */}
                {coinAnimation && <CoinDrop />}
              </div>

              {/* 出货特效 */}
              {state === 'dispensing' && <DispenseEffect />}

              {/* 扭动时的彩色粒子 */}
              {state === 'turning' && <ParticleExplosion />}
            </div>
          </div>

          {/* ===== 底部任务栏 ===== */}
          <div className="taskbar">
            <button className="start-btn" onClick={() => navigate('/')}>
              <SvgIcon name="flag" size={16} color="#000080" />
              <span>开始</span>
            </button>
            <div className="task-items">
              <div className="task-item active">
                <SvgIcon name="game" size={14} color="#000080" />
                <span>扭蛋机 · 运行中</span>
              </div>
            </div>
            <div className="task-right">
              <SvgIcon name="volume" size={14} color="#000" />
              <span>{time}</span>
            </div>
          </div>

          {/* ===== 叠加层 ===== */}
          <div className="glow-overlay" />
          <div className="noise-overlay" />
          <div className="scanline" />

        </div>
      </div>

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

function getTime() {
  const d = new Date()
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
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
