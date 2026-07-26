import { useState, useEffect } from 'react'
import XpWindow from './XpWindow.jsx'
import SvgIcon from './SvgIcon.jsx'
import { resolveAsset } from '../assets/manifest.js'
import './CartoonResultModal.css'

/**
 * 弹窗展示图映射表
 * 用户上传的图片遵循 [动画简称]_popup.{png|jpg} 命名规范
 * 缺失时回退到动画首帧占位图
 */
const POPUP_MAP = {
  '喜羊羊与灰太狼': './assets/images/popup/xyy_popup.jpg',
  '大耳朵图图':     './assets/images/popup/tutu_popup.jpg',
}

/**
 * 根据动画名称获取弹窗展示图
 * @param {string} cartoonName - 动画名称
 * @param {string} fallback - 占位图路径（首帧图）
 * @returns {string} 解析后的资源 URL
 */
function getPopupImage(cartoonName, fallback) {
  const uploaded = POPUP_MAP[cartoonName]
  if (uploaded) return resolveAsset(uploaded)
  return resolveAsset(fallback)
}

/**
 * 动画发现结果弹窗 — Gacha 与 Tv 共用
 * @param {object} cartoon - 动画数据对象
 * @param {boolean} isEasterEgg - 是否为隐藏彩蛋动画
 * @param {string} theme - 视觉主题：'gacha'（星球裂开）| 'tv'（信号接通）
 * @param {function} onWatch - "进入观看"回调
 * @param {function} onRetry - "再抽一次/换个台"回调
 * @param {function} onClose - 关闭回调
 * @param {string} retryLabel - 重试按钮文案，默认"再抽一次"
 */
export default function CartoonResultModal({
  cartoon,
  isEasterEgg = false,
  theme = 'gacha',
  onWatch,
  onRetry,
  onClose,
  retryLabel = '再抽一次',
}) {
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

  // 主题相关的视觉表现
  const isTvTheme = theme === 'tv'
  const animClass = isTvTheme ? 'tv-signal' : 'planet'

  return (
    <XpWindow
      title={isTvTheme ? '信号接通！' : '记忆觉醒！'}
      centered
      onClose={onClose}
      style={{ width: 380 }}
    >
      <div className="cartoon-result-modal">
        <div className="result-title-row">
          <SvgIcon name={isTvTheme ? 'tv' : 'clapperboard'} size={24} color="#0054E3" />
          <span className="result-title-text">{isTvTheme ? '信号接通' : '记忆觉醒'}</span>
        </div>

        {phase !== 'shown' && (
          <div className={`result-${animClass} ${phase === 'cracking' ? 'cracking' : 'broken'}`}>
            {isTvTheme ? (
              <>
                {/* 电视信号接通：雪花屏 → 清晰 */}
                <div className="tv-static" />
                {phase === 'revealing' && <div className="tv-signal-burst" />}
              </>
            ) : (
              <>
                <div className="planet-crack crack-1" />
                <div className="planet-crack crack-2" />
                <div className="planet-crack crack-3" />
                {phase === 'revealing' && <div className="planet-glow-burst" />}
              </>
            )}
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
                  <img
                    src={getPopupImage(cartoon.name, cartoon.images.firstFrame)}
                    alt={cartoon.name}
                    style={{
                      imageRendering: 'pixelated',
                      border: '2px solid #FFFFFF',
                      boxSizing: 'border-box',
                    }}
                  />
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
                {retryLabel}
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
