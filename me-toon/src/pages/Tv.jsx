import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Viewport from '../components/Viewport.jsx'
import SvgIcon from '../components/SvgIcon.jsx'
import CartoonResultModal from '../components/CartoonResultModal.jsx'
import { resolveAsset } from '../assets/manifest.js'
import cartoonsData from '../data/cartoons.json'
import './Tv.css'

/**
 * 电视台调频页面 — 第二种动画发现方式
 * - 顶部：电视机状态栏（搜索频道 / 信号强度）
 * - 中部：频道网格（每个卡片是一台小 CRT 电视，播放像素预告）
 * - 底部：调频滑块（少儿 ↔ 卡通，装饰性辅助交互）
 * - 点击卡片：复用 CartoonResultModal 弹窗（tv 主题：信号接通）
 */
export default function Tv() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null) // 选中的动画
  const [staticMode, setStaticMode] = useState(false) // 全屏雪花反馈
  const [activeChannel, setActiveChannel] = useState(null) // 当前调频高亮的频道
  const sliderRef = useRef(null)

  // 频道列表（来自已解锁 + 全部预设动画）
  const channels = cartoonsData.cartoons

  const handleChannelClick = (cartoon) => {
    // 1. 所有卡片同时出现雪花屏
    setStaticMode(true)
    setActiveChannel(cartoon.id)
    // 2. 短暂雪花后，弹出结果
    setTimeout(() => {
      setStaticMode(false)
      setSelected(cartoon)
    }, 500)
  }

  const handleWatch = () => {
    const id = selected?.id
    setSelected(null)
    navigate(id ? `/detail?id=${id}` : '/detail')
  }

  const handleRetry = () => {
    setSelected(null)
    setActiveChannel(null)
  }

  const handleClose = () => {
    setSelected(null)
  }

  // 调频滑块：根据位置高亮不同频道
  const handleSliderChange = (e) => {
    const val = Number(e.target.value)
    const idx = Math.floor((val / 100) * channels.length)
    setActiveChannel(channels[Math.min(idx, channels.length - 1)].id)
  }

  return (
    <Viewport className="page-tv">
      {/* ===== 显示器外框 ===== */}
      <div className="win98-monitor">
        <div className="win98-screen">

          {/* ===== 深夜看电视氛围背景 ===== */}
          <div className="tv-room-bg">
            <div className="tv-lamp" />
            <div className="tv-lamp-glow" />
          </div>

          {/* ===== 左上角桌面图标 ===== */}
          <div className="desktop-icons">
            <div className="desktop-icon" onClick={() => navigate('/')}>
              <SvgIcon name="tv" size={32} color="#FFFFFF" strokeWidth={1.6} />
              <span className="label">返回桌面</span>
            </div>
            <div className="desktop-icon" onClick={() => navigate('/gacha')}>
              <SvgIcon name="game" size={32} color="#FFFFFF" strokeWidth={1.6} />
              <span className="label">扭蛋机</span>
            </div>
          </div>

          {/* ===== 返回桌面按钮 ===== */}
          <button className="back-btn" onClick={() => navigate('/')}>
            <SvgIcon name="back" size={14} color="#000080" />
            <span>返回桌面</span>
          </button>

          {/* ===== 顶部电视机状态栏 ===== */}
          <div className="tv-statusbar">
            <div className="tv-statusbar-left">
              <SvgIcon name="tv" size={18} color="#00FF00" />
              <span className="tv-statusbar-text">正在搜索频道...</span>
            </div>
            <div className="tv-statusbar-right">
              <span className="signal-dot" />
              <span className="signal-text">信号强度:</span>
              <span className="signal-bars">▂▃▄▅▆</span>
            </div>
          </div>

          {/* ===== 中部：频道网格 ===== */}
          <div className="tv-main">
            <div className="channel-grid">
              {channels.map((c, idx) => (
                <div
                  key={c.id}
                  className={`channel-card ${staticMode ? 'static' : ''} ${activeChannel === c.id ? 'active' : ''}`}
                  onClick={() => handleChannelClick(c)}
                  onMouseEnter={() => setActiveChannel(c.id)}
                  onMouseLeave={() => !staticMode && setActiveChannel(null)}
                >
                  {/* 像素小 CRT 电视窗口 */}
                  <div className="channel-screen">
                    {/* 预告画面（首帧图） */}
                    <img
                      src={resolveAsset(c.images.firstFrame)}
                      alt={c.name}
                      className="channel-preview"
                    />
                    {/* 雪花屏覆盖层（鼠标悬停/点击时显示） */}
                    <div className="channel-static" />
                    {/* 扫描线 */}
                    <div className="channel-scanline" />
                    {/* 台标（右上角） */}
                    <div
                      className="channel-logo"
                      style={{ background: c.planetColor }}
                      title={c.name}
                    >
                      <span className="channel-logo-num">{idx + 1}</span>
                    </div>
                  </div>
                  {/* 半透明底栏：动画名 + 简介 */}
                  <div className="channel-info">
                    <div className="channel-name">CH{String(idx + 1).padStart(2, '0')} · {c.name}</div>
                    <div className="channel-desc">{c.tagline}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ===== 底部：调频滑块 ===== */}
          <div className="tv-tuner">
            <span className="tuner-label tuner-label-left">📺 少儿</span>
            <div className="tuner-track-wrap">
              <input
                ref={sliderRef}
                type="range"
                min="0"
                max="100"
                defaultValue="50"
                className="tuner-slider"
                onChange={handleSliderChange}
              />
              <div className="tuner-ticks">
                {[0, 25, 50, 75, 100].map(t => (
                  <span key={t} className="tuner-tick" style={{ left: `${t}%` }} />
                ))}
              </div>
            </div>
            <span className="tuner-label tuner-label-right">🎬 卡通</span>
          </div>

          {/* ===== 叠加层 ===== */}
          <div className="glow-overlay" />
          <div className="scanline" />

        </div>
      </div>

      {/* 结果展示弹窗（复用共享组件，tv 主题） */}
      {selected && (
        <CartoonResultModal
          cartoon={selected}
          theme="tv"
          onWatch={handleWatch}
          onRetry={handleRetry}
          onClose={handleClose}
          retryLabel="换个台"
        />
      )}
    </Viewport>
  )
}
