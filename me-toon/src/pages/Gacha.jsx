import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Viewport from '../components/Viewport.jsx'
import XpWindow from '../components/XpWindow.jsx'
import SvgIcon from '../components/SvgIcon.jsx'
import { resolveAsset } from '../assets/manifest.js'
import cartoonsData from '../data/cartoons.json'
import './Gacha.css'

/**
 * 扭蛋机页面 — Win98 梦核像素桌面 + 老式游戏厅立体扭蛋机
 *
 * 视觉：
 * - 桌面：柔和蓝天 + 云 + 绿坡 + 太阳 + 小树（梦核像素风）
 * - 框架：Win98 窗口（蓝色标题栏 + 控制按钮）+ 任务栏
 * - 扭蛋机本体：米黄塑料机身 + 立体透视 + 金属穹顶 + 10 颗鲜艳扭蛋
 *              + 控制面板（投币口指示灯/装饰灯/旋钮）+ 底座出货口（彩虹闪光）+ 装饰脚
 *
 * 交互：待机 → 投币 → 旋钮扭动 → 出货（彩虹闪光+随机扭蛋放大）→ 结果弹窗
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
  const [knobAngle, setKnobAngle] = useState(0)
  const [highlightEgg, setHighlightEgg] = useState(null) // 出货时随机放大的扭蛋
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
    }, 1500)
  }

  // 扭动旋钮
  const handleTurnKnob = () => {
    if (state !== 'ready') return
    setState('turning')
    setKnobAngle(a => a + 45)
    setTimeout(() => {
      setState('dispensing')
      // 随机放大一颗扭蛋（模拟掉落）— 共 24 颗
      setHighlightEgg(Math.floor(Math.random() * 24))
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
        setHighlightEgg(null)
      }, 1500)
    }, 1500)
  }

  const handleCloseResult = () => {
    setShowResult(false)
    setResultCartoon(null)
    setState('idle')
  }

  const handleWatch = () => {
    const id = resultCartoon?.id
    setShowResult(false)
    navigate(id ? `/detail?id=${id}` : '/detail')
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

          {/* ===== 桌面背景：梦核像素风 ===== */}
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
              {/* ===== 扭蛋机本体 — 真实造型：透明玻璃球罩 + 红色底座 ===== */}
              <div className={`gacha-machine ${state === 'turning' ? 'shaking' : ''}`}>

                {/* 透明玻璃球罩 + 错综复杂塞满的彩色扭蛋 */}
                <div className="glass-dome">
                  {/* 玻璃罩反光高光 */}
                  <div className="dome-shine" />
                  <div className="dome-shine-2" />

                  {/* 扭蛋容器 — 24 颗错综复杂排列 */}
                  <div className={`egg-cluster ${state === 'turning' ? 'fast-roll' : ''}`}>
                    {EGG_POSITIONS.map((pos, i) => (
                      <div
                        key={i}
                        className={`egg egg-color-${(i % 12) + 1} ${highlightEgg === i ? 'highlighted' : ''}`}
                        style={{
                          left: pos.x,
                          top: pos.y,
                          width: pos.s,
                          height: pos.s,
                          transform: `rotate(${pos.r}deg)`,
                          '--rot': `${pos.r}deg`,
                          animationDelay: `${pos.d}s`,
                          zIndex: pos.z,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* 红色底座 */}
                <div className="red-base">
                  {/* 顶部金属环 */}
                  <div className="metal-ring" />

                  {/* 控制面板 */}
                  <div className="control-panel">
                    {/* 投币口 */}
                    <button
                      className={`coin-slot ${state === 'ready' ? 'glowing' : ''}`}
                      onClick={handleInsertCoin}
                      disabled={state !== 'idle'}
                      title="投币口"
                    >
                      <span className="slot-hole" />
                      <span className={`slot-light ${state === 'idle' ? 'blink' : ''} ${state === 'ready' ? 'ready-glow' : ''}`} />
                      <span className="slot-label">投币</span>
                    </button>

                    {/* 装饰灯 */}
                    <div className="panel-lights">
                      <span className="light light-1" />
                      <span className="light light-2" />
                      <span className="light light-3" />
                    </div>

                    {/* 旋钮 */}
                    <button
                      className={`knob ${state === 'ready' ? 'glowing pulsing' : ''}`}
                      onClick={handleTurnKnob}
                      disabled={state !== 'ready'}
                      title="扭动旋钮"
                    >
                      <span
                        className="knob-body"
                        style={{ transform: `rotate(${knobAngle}deg)` }}
                      />
                      <span className="knob-label">旋转</span>
                    </button>
                  </div>

                  {/* 出货口 */}
                  <div className="dispenser">
                    <div className={`rainbow-flash ${state === 'dispensing' ? 'active' : ''}`} />
                    <div className="dispenser-inner" />
                    <span className="dispenser-label">▼ 出货口</span>
                  </div>

                  {/* 底座装饰脚 */}
                  <div className="feet">
                    <span className="foot" />
                    <span className="foot" />
                  </div>

                  {/* 品牌标签 */}
                  <div className="brand-label">GACHA</div>
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

      {/* 结果展示弹窗（保留原逻辑） */}
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
 * 24 颗扭蛋的错综复杂位置 — 模拟玻璃罩被塞满的感觉
 * x/y 为百分比定位，s 为尺寸，r 为旋转，d 为动画延迟，z 为层级
 */
const EGG_POSITIONS = [
  // 顶层（z=1）
  { x: '15%', y: '8%',  s: '28px', r: 12,  d: 0.0, z: 1 },
  { x: '42%', y: '6%',  s: '26px', r: -8,  d: 0.3, z: 1 },
  { x: '68%', y: '10%', s: '30px', r: 20,  d: 0.6, z: 1 },
  // 第二层（z=2）
  { x: '5%',  y: '28%', s: '32px', r: -15, d: 0.1, z: 2 },
  { x: '28%', y: '24%', s: '30px', r: 6,   d: 0.4, z: 2 },
  { x: '55%', y: '26%', s: '28px', r: -22, d: 0.7, z: 2 },
  { x: '78%', y: '30%', s: '30px', r: 18,  d: 0.2, z: 2 },
  // 第三层（z=3）
  { x: '12%', y: '46%', s: '34px', r: -5,  d: 0.5, z: 3 },
  { x: '38%', y: '44%', s: '32px', r: 25,  d: 0.8, z: 3 },
  { x: '62%', y: '46%', s: '30px', r: -12, d: 0.0, z: 3 },
  { x: '85%', y: '48%', s: '28px', r: 14,  d: 0.3, z: 3 },
  // 第四层（z=4）
  { x: '0%',  y: '64%', s: '32px', r: -18, d: 0.6, z: 4 },
  { x: '22%', y: '62%', s: '34px', r: 8,   d: 0.9, z: 4 },
  { x: '48%', y: '64%', s: '30px', r: -25, d: 0.2, z: 4 },
  { x: '72%', y: '66%', s: '32px', r: 16,  d: 0.5, z: 4 },
  // 第五层（z=5）
  { x: '8%',  y: '80%', s: '28px', r: -10, d: 0.7, z: 5 },
  { x: '32%', y: '82%', s: '30px', r: 22,  d: 0.1, z: 5 },
  { x: '58%', y: '80%', s: '32px', r: -15, d: 0.4, z: 5 },
  { x: '82%', y: '82%', s: '28px', r: 5,   d: 0.8, z: 5 },
  // 散落点缀（z=2-4 之间）
  { x: '50%', y: '14%', s: '22px', r: -30, d: 0.9, z: 2 },
  { x: '88%', y: '20%', s: '20px', r: 35,  d: 0.2, z: 2 },
  { x: '20%', y: '52%', s: '22px', r: -40, d: 0.6, z: 4 },
  { x: '92%', y: '60%', s: '20px', r: 28,  d: 0.3, z: 4 },
  { x: '45%', y: '88%', s: '24px', r: -8,  d: 0.5, z: 5 },
]

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
      <div className="rainbow-burst" />
    </>
  )
}

/**
 * 彩色粒子爆炸
 */
function ParticleExplosion() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    color: ['#ff6b6b', '#ffd93d', '#6bcb77', '#4fc3f7', '#a29bfe'][i % 5],
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
 * 扭蛋结果展示弹窗 — 保留原逻辑不变
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
                  <img src={resolveAsset(cartoon.images.firstFrame)} alt={cartoon.name} />
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
