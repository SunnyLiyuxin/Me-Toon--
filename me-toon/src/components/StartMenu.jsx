import { useNavigate } from 'react-router-dom'
import SvgIcon from './SvgIcon.jsx'
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
            <SvgIcon name="tv" size={20} className="start-menu-icon-svg" />
            <span className="start-menu-text">动画放映厅</span>
          </div>
          <div className="start-menu-item" onClick={() => handleNavigate('/collection')}>
            <SvgIcon name="diary" size={20} className="start-menu-icon-svg" />
            <span className="start-menu-text">记忆抽屉</span>
          </div>
          <div className="start-menu-item" onClick={() => handleNavigate('/radio')}>
            <SvgIcon name="mp3" size={20} className="start-menu-icon-svg" />
            <span className="start-menu-text">时光点歌台</span>
          </div>
          <div className="start-menu-item" onClick={() => handleNavigate('/lobby')}>
            <SvgIcon name="globe" size={20} className="start-menu-icon-svg" />
            <span className="start-menu-text">数据流漫游</span>
          </div>
          <div className="start-menu-divider" />
          <div className="start-menu-item disabled">
            <SvgIcon name="doc" size={20} className="start-menu-icon-svg" />
            <span className="start-menu-text">文档</span>
          </div>
          <div className="start-menu-item disabled">
            <SvgIcon name="gear" size={20} className="start-menu-icon-svg" />
            <span className="start-menu-text">设置</span>
          </div>
          <div className="start-menu-item disabled">
            <SvgIcon name="search" size={20} className="start-menu-icon-svg" />
            <span className="start-menu-text">搜索</span>
          </div>
          <div className="start-menu-divider" />
          <div className="start-menu-item shutdown" onClick={() => window.location.reload()}>
            <SvgIcon name="power" size={20} className="start-menu-icon-svg" />
            <span className="start-menu-text">关机</span>
          </div>
        </div>
      </div>
    </>
  )
}
