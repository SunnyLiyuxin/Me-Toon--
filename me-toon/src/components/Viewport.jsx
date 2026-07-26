import { useNavigate } from 'react-router-dom'
import './Viewport.css'

/**
 * 1280×960 视口锁定容器
 * 所有页面都被这个容器包裹，保证固定分辨率体验
 */
export default function Viewport({ children, className = '' }) {
  return (
    <div className={`viewport ${className}`}>
      {children}
    </div>
  )
}

/**
 * 返回桌面按钮（XP 风格，固定在左上角）
 */
export function BackToDesktopButton() {
  const navigate = useNavigate()
  return (
    <button
      className="back-to-desktop xp-button"
      onClick={() => navigate('/')}
    >
      ← 返回桌面
    </button>
  )
}
