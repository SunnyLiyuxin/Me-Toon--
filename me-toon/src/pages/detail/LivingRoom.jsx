import { useState } from 'react'
import SvgIcon from '../../components/SvgIcon.jsx'
import { useSound } from '../../hooks/useMedia.js'
import './LivingRoom.css'

/**
 * 人物客厅子页面
 * - 顶部：地点描述
 * - 主体：角色列表，每个角色有 立绘 + 档案框
 *   左侧人物图片（占位）
 *   右侧档案框：姓名 / 身份 / 待机动作 / 经典台词 / 标签
 * - 点击对话气泡可见完整台词
 */
export default function LivingRoom({ cartoon }) {
  const [activeChar, setActiveChar] = useState(cartoon.characters[0]?.id)
  const [showDialogue, setShowDialogue] = useState(false)
  const playSfx = useSound()

  const active = cartoon.characters.find(c => c.id === activeChar) || cartoon.characters[0]

  const handleSelect = (charId) => {
    playSfx('click')
    setActiveChar(charId)
    setShowDialogue(false)
  }

  const handleTalk = () => {
    playSfx('click')
    setShowDialogue(v => !v)
  }

  return (
    <div className="living-room">
      {/* 暖色客厅背景 */}
      <div className="living-bg" />

      <div className="living-content">
        {/* 顶部：地点 */}
        <header className="living-header">
          <SvgIcon name="house" size={24} color="#FFE6B0" />
          <div>
            <h2 className="living-title">人物客厅</h2>
            <p className="living-location">地点：{cartoon.livingroom.location}</p>
          </div>
        </header>

        {/* 主体：左侧角色列表 + 右侧档案框 */}
        <div className="living-main">
          {/* 左侧：角色头像选择列表 */}
          <aside className="char-list">
            {cartoon.characters.map(c => (
              <button
                key={c.id}
                className={`char-thumb ${c.id === activeChar ? 'active' : ''}`}
                onClick={() => handleSelect(c.id)}
                title={c.name}
              >
                <img
                  src={`./assets/images/detail/cartoons/tutu/characters/${c.id}.png`}
                  alt={c.name}
                  className="char-thumb-img"
                />
                <span className="char-thumb-name">{c.name}</span>
              </button>
            ))}
          </aside>

          {/* 右侧：当前角色的 档案框 */}
          <section className="char-archive">
            {/* 上半部分：人物立绘 + 基础档案 */}
            <div className="char-archive-top">
              {/* 人物立绘 */}
              <div className="char-portrait">
                <img
                  src={`./assets/images/detail/cartoons/tutu/characters/${active.id}.png`}
                  alt={active.name}
                  className="char-portrait-img"
                />
                <div className="char-portrait-stand" />
              </div>

              {/* 档案框 */}
              <div className="char-dossier">
                <div className="char-dossier-titlebar">
                  <SvgIcon name="user" size={16} color="#FFFFFF" />
                  <span>角色档案 · {active.name}</span>
                </div>
                <div className="char-dossier-body">
                  <div className="dossier-row">
                    <span className="dossier-label">姓名</span>
                    <span className="dossier-value">{active.name}</span>
                  </div>
                  <div className="dossier-row">
                    <span className="dossier-label">身份</span>
                    <span className="dossier-value">{active.role}</span>
                  </div>
                  <div className="dossier-row">
                    <span className="dossier-label">位置</span>
                    <span className="dossier-value">{active.position}</span>
                  </div>
                  <div className="dossier-row">
                    <span className="dossier-label">待机</span>
                    <span className="dossier-value">{active.idleAction}</span>
                  </div>
                  <div className="dossier-row dossier-tags-row">
                    <span className="dossier-label">标签</span>
                    <span className="dossier-tags">
                      {active.tags.map(t => (
                        <span key={t} className="dossier-tag">#{t}</span>
                      ))}
                    </span>
                  </div>
                  <div className="dossier-classic">
                    <SvgIcon name="chat" size={16} color="#FF6699" />
                    <span>“{active.classicLine}”</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 下半部分：对话按钮 + 对话气泡 */}
            <div className="char-talk">
              <button
                className="xp-button-primary talk-btn"
                onClick={handleTalk}
              >
                <SvgIcon name="chat" size={18} color="#003C74" />
                <span>{showDialogue ? '收起对话' : '点击对话'}</span>
              </button>

              {showDialogue && (
                <div className="char-dialogue anim-popup-in">
                  <pre className="char-dialogue-text">{active.dialogue}</pre>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* 底部：场景元素提示 */}
        <footer className="living-footer">
          <SvgIcon name="sparkle" size={16} color="#FFCC00" />
          <span>场景元素：{cartoon.livingroom.elements.join(' · ')}</span>
          <SvgIcon name="sparkle" size={16} color="#FFCC00" />
        </footer>
      </div>
    </div>
  )
}
