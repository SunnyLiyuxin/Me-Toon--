import { useState, useEffect } from 'react'
import Viewport, { BackToDesktopButton } from '../components/Viewport.jsx'
import SvgIcon from '../components/SvgIcon.jsx'
import './Collection.css'

/**
 * 我的记忆抽屉（收藏册）
 *
 * 数据来源（localStorage）：
 * - me-toon-collected：扭蛋解锁的动画贴纸 + 时光回响羊设贴纸
 * - me-toon-looms：记忆织布机锦缎
 * - me-toon-letters：未来邮筒信件
 *
 * 贴纸分类展示：
 * - 已解锁动画（普通贴纸）
 * - 时光回响羊设认证贴纸（特殊贴纸，渐变底+年份标记）
 * - 记忆锦缎（织布机寄语）
 * - 未来信件（邮筒寄出）
 */
export default function Collection() {
  const [collected, setCollected] = useState([])
  const [looms, setLooms] = useState([])
  const [letters, setLetters] = useState([])
  const [activeTab, setActiveTab] = useState('cartoons')

  useEffect(() => {
    setCollected(JSON.parse(localStorage.getItem('me-toon-collected') || '[]'))
    setLooms(JSON.parse(localStorage.getItem('me-toon-looms') || '[]'))
    setLetters(JSON.parse(localStorage.getItem('me-toon-letters') || '[]'))
  }, [])

  // 区分：动画贴纸 vs 时光回响贴纸
  const cartoonStickers = collected.filter(c => !c.type || c.type === 'cartoon' || c.stickerType === 'cartoon')
  const timeEchoStickers = collected.filter(c => c.type === 'timeEcho' || c.stickerType === 'timeEcho')

  return (
    <Viewport className="page-collection">
      <BackToDesktopButton />
      <div className="collection-container">
        <div className="collection-header">
          <SvgIcon name="diary" size={32} color="#000080" />
          <h1 className="collection-title">我的记忆抽屉</h1>
          <p className="collection-subtitle">所有你解锁的动画、写下的锦缎、寄出的明信片，都变成贴纸收藏在这里</p>
        </div>

        <div className="collection-tabs">
          <button
            className={`collection-tab ${activeTab === 'cartoons' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('cartoons')}
          >
            📦 已解锁动画 ({cartoonStickers.length})
          </button>
          <button
            className={`collection-tab ${activeTab === 'timeEcho' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('timeEcho')}
          >
            🐑 时光回响 ({timeEchoStickers.length})
          </button>
          <button
            className={`collection-tab ${activeTab === 'looms' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('looms')}
          >
            🧵 记忆锦缎 ({looms.length})
          </button>
          <button
            className={`collection-tab ${activeTab === 'letters' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('letters')}
          >
            📮 未来信件 ({letters.length})
          </button>
        </div>

        <div className="collection-content">
          {activeTab === 'cartoons' && (
            <StickerGrid
              items={cartoonStickers}
              emptyText="还没有解锁任何动画。去扭蛋机试试运气吧！"
              renderSticker={(item) => <CartoonSticker item={item} />}
            />
          )}
          {activeTab === 'timeEcho' && (
            <StickerGrid
              items={timeEchoStickers}
              emptyText={'还没有认领羊设。去喜羊羊与灰太狼的"记忆共振 → 时光回响"认领一只吧！'}
              renderSticker={(item) => <TimeEchoSticker item={item} />}
            />
          )}
          {activeTab === 'looms' && (
            <StickerGrid
              items={looms}
              emptyText={'还没有织入记忆锦缎。去动画详情页的"记忆共振 → 记忆织布机"写一段吧！'}
              renderSticker={(item) => <LoomSticker item={item} />}
            />
          )}
          {activeTab === 'letters' && (
            <StickerGrid
              items={letters}
              emptyText={'还没有寄出信件。去动画详情页的"记忆共振 → 未来邮筒"寄一封吧！'}
              renderSticker={(item) => <LetterSticker item={item} />}
            />
          )}
        </div>
      </div>
    </Viewport>
  )
}

/* ============================================================
   贴纸网格容器
   ============================================================ */
function StickerGrid({ items, emptyText, renderSticker }) {
  if (!items.length) {
    return <div className="collection-empty">{emptyText}</div>
  }
  return (
    <div className="sticker-grid">
      {items.map((item, i) => (
        <div key={i} className="sticker-slot">
          {renderSticker(item)}
        </div>
      ))}
    </div>
  )
}

/* ============================================================
   动画贴纸
   ============================================================ */
function CartoonSticker({ item }) {
  const date = new Date(item.collectedAt).toLocaleDateString('zh-CN')
  return (
    <div className="sticker sticker-cartoon">
      <div className="sticker-image">
        <SvgIcon name="clapperboard" size={48} color="#000080" />
      </div>
      <div className="sticker-name">{item.name}</div>
      <div className="sticker-date">收藏于 {date}</div>
      <div className="sticker-shine" />
    </div>
  )
}

/* ============================================================
   时光回响羊设认证贴纸
   ============================================================ */
function TimeEchoSticker({ item }) {
  const date = new Date(item.savedAt).toLocaleDateString('zh-CN')
  return (
    <div className="sticker sticker-timeecho">
      <div className="timeecho-years">
        <span className="timeecho-year-2005">2005</span>
        <span className="timeecho-line" />
        <span className="timeecho-year-2025">2025</span>
      </div>
      <div className="timeecho-emoji">{item.sheepEmoji}</div>
      <div className="sticker-name">{item.sheepTitle}</div>
      <div className="timeecho-motto">"{item.sheepMotto}"</div>
      <div className="sticker-date">认证于 {date}</div>
      <div className="sticker-shine" />
    </div>
  )
}

/* ============================================================
   记忆锦缎贴纸
   ============================================================ */
function LoomSticker({ item }) {
  const date = new Date(item.createdAt).toLocaleDateString('zh-CN')
  return (
    <div className="sticker sticker-loom">
      <div className="sticker-image">
        <SvgIcon name="sparkle" size={36} color="#FF9DC2" />
      </div>
      <div className="loom-sticker-char">{item.characterName}</div>
      <div className="loom-sticker-prompt">{item.prompt}</div>
      <div className="loom-sticker-answer">"{item.answer}"</div>
      <div className="sticker-date">{date}</div>
      <div className="sticker-shine" />
    </div>
  )
}

/* ============================================================
   未来信件贴纸
   ============================================================ */
function LetterSticker({ item }) {
  const date = new Date(item.sentAt).toLocaleDateString('zh-CN')
  return (
    <div className="sticker sticker-letter">
      <div className="sticker-image">
        <SvgIcon name="mailbox" size={36} color="#7FB3FF" />
      </div>
      <div className="letter-sticker-title">{item.title}</div>
      <div className="letter-sticker-content">"{item.content}"</div>
      <div className="sticker-date">寄出于 {date}</div>
      <div className="sticker-shine" />
    </div>
  )
}
