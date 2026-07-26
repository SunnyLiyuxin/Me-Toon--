import { useState, useEffect } from 'react'
import SvgIcon from '../../components/SvgIcon.jsx'
import { useSound } from '../../hooks/useMedia.js'
import './TimeEcho.css'

/**
 * 时光回响 · 大手机弹窗（TimeEchoPhone）— 修订版
 *
 * 新增功能：
 * - 认证卡页面左上角【← 返回选择】按钮，可翻回选择页
 * - 存入记忆抽屉后自动返回选择页（不再关闭手机弹窗）
 * - 支持多选（最多6张，每种1次），已认领卡片显示 ✓
 * - 手机屏幕底部新增【完成选择，关闭 ✕】按钮
 * - 认领2张以上时显示【查看我的所有羊设 →】入口
 * - 重复认领时提示"你已经认领过这只羊啦！"
 */
export default function TimeEcho({ cartoon, onClose }) {
  const playSfx = useSound()
  const timeEcho = cartoon.resonance?.timeEcho
  const sheepTypes = timeEcho?.sheepTypes || []

  // phase: 'vortex' | 'select' | 'cert' | 'closing'
  const [phase, setPhase] = useState('vortex')
  const [selectedIdx, setSelectedIdx] = useState(null)    // 当前查看的卡片索引
  const [flipped, setFlipped] = useState(false)
  const [certified, setCertified] = useState(null)        // 当前查看的羊设对象
  const [claimedList, setClaimedList] = useState([])      // 已认领的羊设列表
  const [showCallback, setShowCallback] = useState(false) // 跨时空彩蛋
  const [toast, setToast] = useState('')
  const [showMySheep, setShowMySheep] = useState(false)   // "我的羊设们"列表
  const [closing, setClosing] = useState(false)

  // 初始化：从 localStorage 读取已认领列表
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('me-toon-time-echo-claimed') || '[]')
      if (Array.isArray(stored) && stored.length > 0) {
        setClaimedList(stored)
      }
    } catch (e) {}
  }, [])

  // 漩涡 → 选择页
  useEffect(() => {
    if (phase !== 'vortex') return
    const t = setTimeout(() => {
      try { playSfx('ding') } catch (e) {}
      setPhase('select')
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

  // 判断某羊设是否已认领
  const isClaimed = (sheepId) => claimedList.some(c => c.sheepId === sheepId)

  // 点击羊设卡片（无论已认领还是未认领，都翻转查看认证卡）
  const handleCardClick = (sheep, idx) => {
    try { playSfx('click') } catch (e) {}
    setSelectedIdx(idx)
    setCertified(sheep)
    setFlipped(false)
    setPhase('cert')
    // 0.5s 翻转
    setTimeout(() => setFlipped(true), 50)
  }

  // 存入记忆抽屉
  const handleSaveToCollection = () => {
    if (!certified) return

    // 重复认领检测
    if (isClaimed(certified.id)) {
      try { playSfx('click') } catch (e) {}
      setToast('你已经认领过这只羊啦！查看其他小羊吧~')
      setTimeout(() => setToast(''), 2000)
      return
    }

    try { playSfx('dispense') } catch (e) {}

    // 写入收藏册
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

    // 更新已认领列表
    const newClaim = {
      sheepId: certified.id,
      sheepTitle: certified.title,
      sheepEmoji: certified.emoji,
      sheepMotto: certified.motto,
      characterId: certified.characterId,
      claimedAt: new Date().toISOString(),
    }
    const newList = [...claimedList, newClaim]
    setClaimedList(prev => [...prev, newClaim])
    localStorage.setItem('me-toon-time-echo-claimed', JSON.stringify(newList))

    setToast('🐑 羊设认证卡已存入记忆抽屉！')

    // 跨时空彩蛋（仅首次存入时触发）
    if (checkCallback(certified)) {
      setTimeout(() => setShowCallback(true), 800)
    }

    // 1.5s 后自动翻回选择页（不再关闭手机弹窗）
    setTimeout(() => {
      setFlipped(false)
      setToast('')
      setTimeout(() => {
        setPhase('select')
        setCertified(null)
        setSelectedIdx(null)
      }, 400)
    }, 1500)
  }

  // 返回选择页（不存入）
  const handleBackToSelect = () => {
    try { playSfx('click') } catch (e) {}
    setFlipped(false)
    setTimeout(() => {
      setPhase('select')
      setCertified(null)
      setSelectedIdx(null)
    }, 400)
  }

  // 关闭（X / 遮罩 / 底部完成按钮）
  const handleClose = () => {
    if (phase === 'vortex') return
    try { playSfx('click') } catch (e) {}
    setClosing(true)
    setTimeout(() => onClose(), 400)
  }

  // 删除某个已认领的羊设
  const handleDeleteClaimed = (sheepId) => {
    try { playSfx('click') } catch (e) {}
    const newList = claimedList.filter(c => c.sheepId !== sheepId)
    setClaimedList(newList)
    localStorage.setItem('me-toon-time-echo-claimed', JSON.stringify(newList))
    // 同步从收藏册移除
    try {
      const collected = JSON.parse(localStorage.getItem('me-toon-collected') || '[]')
      const filtered = collected.filter(c => !(c.type === 'timeEcho' && c.sheepId === sheepId))
      localStorage.setItem('me-toon-collected', JSON.stringify(filtered))
    } catch (e) {}
    setToast('已移除该羊设认证')
    setTimeout(() => setToast(''), 1500)
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

      {/* 阶段 2~4：大手机弹窗 */}
      {phase !== 'vortex' && (
        <div
          className={`time-echo-phone ${phase === 'select' && !closing ? 'phone-pop-in' : ''} ${closing ? 'phone-pop-out' : ''}`}
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

            {/* 内容区 */}
            <div className="phone-content-large">
              {/* ===== 选择页 ===== */}
              {phase === 'select' && (
                <>
                  {/* 标题区 */}
                  <div className="phone-title-area">
                    <div className="phone-title-main">📱 2025年的互联网上...</div>
                    <div className="phone-title-sub">
                      最近有一个词突然火了
                      {claimedList.length > 0 && (
                        <span className="phone-claimed-count"> · 已认领 {claimedList.length} 只</span>
                      )}
                    </div>
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
                    大家纷纷开始认领自己的"羊设"——
                  </div>

                  {/* 羊设认领卡片区（2×3 网格） */}
                  <div className="sheep-grid">
                    {sheepTypes.map((sheep, i) => {
                      const claimed = isClaimed(sheep.id)
                      return (
                        <div
                          key={sheep.id}
                          className={`sheep-grid-card ${claimed ? 'is-claimed' : ''}`}
                          onClick={() => handleCardClick(sheep, i)}
                        >
                          <div className="sheep-grid-emoji">{sheep.emoji}</div>
                          <div className="sheep-grid-title">{sheep.title}</div>
                          <div className="sheep-grid-desc">{getCardDesc(sheep.id)}</div>
                          <div className="sheep-grid-btn">
                            {claimed ? '✓ 查看认证卡' : '[ 认领此羊设 ]'}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* 底部提示 */}
                  <div className="phone-bottom-hint">
                    {claimedList.length === 0
                      ? '👆 点击任意一张卡片，认领你的2025羊设'
                      : `✓ 已认领 ${claimedList.length} 只 · 可继续选择，或下方完成`
                    }
                  </div>

                  {/* 底部完成按钮 */}
                  <button className="phone-finish-btn" onClick={handleClose}>
                    完成选择，关闭 ✕
                  </button>
                </>
              )}

              {/* ===== 认证卡页面 ===== */}
              {phase === 'cert' && certified && (
                <div className="cert-flip-stage">
                  {/* 左上角返回按钮 */}
                  <button className="cert-back-btn" onClick={handleBackToSelect}>
                    ← 返回选择
                  </button>

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
                        disabled={isClaimed(certified.id)}
                      >
                        {isClaimed(certified.id) ? '✓ 已存入记忆抽屉' : '[ 存入记忆抽屉 ]'}
                      </button>

                      {/* 已认领2张以上时显示入口 */}
                      {claimedList.length >= 2 && (
                        <button
                          className="cert-view-all-btn"
                          onClick={() => { setFlipped(false); setTimeout(() => setShowMySheep(true), 300) }}
                        >
                          查看我的所有羊设 ({claimedList.length}) →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
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

          {/* 我的羊设们 列表 */}
          {showMySheep && (
            <div className="my-sheep-list" onClick={(e) => e.stopPropagation()}>
              <div className="my-sheep-header">
                <span>我的羊设们</span>
                <button className="my-sheep-close" onClick={() => setShowMySheep(false)}>×</button>
              </div>
              <div className="my-sheep-body">
                {claimedList.map((c) => {
                  const sheep = sheepTypes.find(s => s.id === c.sheepId)
                  return (
                    <div key={c.sheepId} className="my-sheep-item">
                      <div className="my-sheep-emoji">{c.sheepEmoji}</div>
                      <div className="my-sheep-info">
                        <div className="my-sheep-title">{c.sheepTitle} ✓</div>
                        <div className="my-sheep-date">认领于 {c.claimedAt.slice(0, 10)}</div>
                      </div>
                      <div className="my-sheep-actions">
                        <button
                          className="my-sheep-view"
                          onClick={() => {
                            setShowMySheep(false)
                            handleCardClick(sheep, sheepTypes.findIndex(s => s.id === c.sheepId))
                          }}
                        >
                          查看认证卡
                        </button>
                        <button
                          className="my-sheep-delete"
                          onClick={() => handleDeleteClaimed(c.sheepId)}
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  )
                })}
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
