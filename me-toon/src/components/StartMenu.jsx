import { useNavigate } from 'react-router-dom'
import './StartMenu.css'

/**
 * XP 开始菜单
 * 点击开始按钮后从下往上弹出
 */
export default function StartMenu({ open, onClose }) {
  const navigate = useNavigate()
  if (!open) return null

  const handleNavigate = (path) => {
    navigate(path)
    onClose()
  }

  return (
    <>
      {/* 点击外部关闭 */}
      <div className="start-menu-overlay" onClick={onClose} />
      <div className="start-menu anim-popup-in">
        <div className="start-menu-header">
          <span className="start-menu-brand">Me-Toon</span>
        </div>
        <div className="start-menu-body">
          <div className="start-menu-item" onClick={() => handleNavigate('/gacha')}>
            <span className="start-menu-icon">📺</span>
            <span className="start-menu-text">动画放映厅</span>
          </div>
          <div className="start-menu-item" onClick={() => handleNavigate('/collection')}>
            <span className="start-menu-icon">📔</span>
            <span className="start-menu-text">记忆抽屉</span>
          </div>
          <div className="start-menu-item" onClick={() => handleNavigate('/radio')}>
            <span className="start-menu-icon">📻</span>
            <span className="start-menu-text">时光点歌台</span>
          </div>
          <div className="start-menu-item" onClick={() => handleNavigate('/lobby')}>
            <span className="start-menu-icon">🌍</span>
            <span className="start-menu-text">数据流漫游</span>
          </div>
          <div className="start-menu-divider" />
          <div className="start-menu-item disabled">
            <span className="start-menu-icon">📄</span>
            <span className="start-menu-text">文档</span>
          </div>
          <div className="start-menu-item disabled">
            <span className="start-menu-icon">⚙️</span>
            <span className="start-menu-text">设置</span>
          </div>
          <div className="start-menu-item disabled">
            <span className="start-menu-icon">🔍</span>
            <span className="start-menu-text">搜索</span>
          </div>
          <div className="start-menu-divider" />
          <div className="start-menu-item shutdown" onClick={() => window.location.reload()}>
            <span className="start-menu-icon">⏻</span>
            <span className="start-menu-text">关机</span>
          </div>
        </div>
      </div>
    </>
  )
}
