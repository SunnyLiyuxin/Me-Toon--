import { useState } from 'react'
import SvgIcon from '../../components/SvgIcon.jsx'
import { useSound } from '../../hooks/useMedia.js'
import { resolveAsset } from '../../assets/manifest.js'
import './LivingRoom.css'

/**
 * 角色头像映射表
 * 用户上传的图片遵循 [动画简称]_avatar_[角色名].{png|jpg} 命名规范
 * 缺失图片（如慢羊羊、tutu 全部）会回退到原占位像素图
 */
const AVATAR_MAP = {
  // 喜羊羊与灰太狼
  'xiyangyang/characters/xiyangyang':  './assets/images/avatar/xyy_avatar_xiyangyang.jpg',
  'xiyangyang/characters/meiyangyang': './assets/images/avatar/xyy_avatar_meiyangyang.jpg',
  'xiyangyang/characters/lanyangyang': './assets/images/avatar/xyy_avatar_lanyangyang.jpg',
  'xiyangyang/characters/feiyangyang': './assets/images/avatar/xyy_avatar_feiyangyang.jpg',
  'xiyangyang/characters/nuanyangyang':'./assets/images/avatar/xyy_avatar_nuanyangyang.jpg',
  'xiyangyang/characters/huitailang':  './assets/images/avatar/xyy_avatar_huitailang.jpg',
  'xiyangyang/characters/hongtailang': './assets/images/avatar/xyy_avatar_hongtailang.jpg',
  'xiyangyang/characters/xiaohuihui':  './assets/images/avatar/xyy_avatar_xiaohuihui.jpg',
  // 慢羊羊、tutu 角色头像未上传，回退到原占位图
}

/**
 * 根据动画id与角色id获取头像图片路径
 * @param {string} cartoonId - 动画id（如 'xiyangyang'）
 * @param {string} charId - 角色 id（如 'xiyangyang'）
 * @returns {string} 解析后的资源 URL（用户上传图或原占位图）
 */
function getAvatarImage(cartoonId, charId) {
  const key = `${cartoonId}/characters/${charId}`
  const uploaded = AVATAR_MAP[key]
  if (uploaded) return resolveAsset(uploaded)
  // 回退：原占位像素图
  return resolveAsset(`./assets/images/detail/cartoons/${cartoonId}/characters/${charId}.png`)
}

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
                  src={getAvatarImage(cartoon.id, c.id)}
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
                  src={getAvatarImage(cartoon.id, active.id)}
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
