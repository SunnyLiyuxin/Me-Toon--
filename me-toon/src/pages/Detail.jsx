import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Viewport, { BackToDesktopButton } from '../components/Viewport.jsx'
import SvgIcon from '../components/SvgIcon.jsx'
import cartoonsData from '../data/cartoons.json'
import ArchiveRoom from './detail/ArchiveRoom.jsx'
import LivingRoom from './detail/LivingRoom.jsx'
import Resonance from './detail/Resonance.jsx'
import './Detail.css'

/**
 * 动画详情页
 * 左侧导航 + 右侧内容（三个子页面切换）
 * 第一阶段只实现 ArchiveRoom，其余占位
 */
export default function Detail() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState('archive')

  // 当前动画（默认取第一部，将来从 URL/searchParams 取）
  const cartoonId = searchParams.get('id') || cartoonsData.cartoons[0].id
  const cartoon = cartoonsData.cartoons.find(c => c.id === cartoonId) || cartoonsData.cartoons[0]

  return (
    <Viewport className="page-detail">
      <BackToDesktopButton />

      {/* 左侧导航栏 */}
      <aside className="detail-sidebar">
        <div className="sidebar-header">
          <img
            src={`./assets/images/detail/cartoons/${cartoon.id}/portrait.png`}
            alt={cartoon.name}
            className="sidebar-cartoon-icon"
          />
          <div className="sidebar-cartoon-name">{cartoon.name}</div>
          <div className="sidebar-cartoon-meta">{cartoon.year} · 共{cartoon.episodes}集</div>
        </div>

        <nav className="sidebar-nav">
          <div
            className={`sidebar-nav-item ${activeTab === 'archive' ? 'active' : ''}`}
            onClick={() => setActiveTab('archive')}
          >
            <span className="sidebar-nav-icon">
              <SvgIcon name="folder" size={20} color={activeTab === 'archive' ? '#FFFFFF' : '#0054E3'} />
            </span>
            <span className="sidebar-nav-text">档案室</span>
          </div>
          <div
            className={`sidebar-nav-item ${activeTab === 'livingroom' ? 'active' : ''}`}
            onClick={() => setActiveTab('livingroom')}
          >
            <span className="sidebar-nav-icon">
              <SvgIcon name="house" size={20} color={activeTab === 'livingroom' ? '#FFFFFF' : '#0054E3'} />
            </span>
            <span className="sidebar-nav-text">人物客厅</span>
          </div>
          <div
            className={`sidebar-nav-item ${activeTab === 'resonance' ? 'active' : ''}`}
            onClick={() => setActiveTab('resonance')}
          >
            <span className="sidebar-nav-icon">
              <SvgIcon name="heart" size={20} color={activeTab === 'resonance' ? '#FFFFFF' : '#FF6699'} />
            </span>
            <span className="sidebar-nav-text">记忆共振</span>
          </div>
        </nav>

        <div className="sidebar-footer">
          <button
            className="xp-button sidebar-back-btn"
            onClick={() => navigate('/gacha')}
          >
            ← 返回扭蛋机
          </button>
        </div>
      </aside>

      {/* 右侧内容区 */}
      <main className="detail-content">
        {activeTab === 'archive' && <ArchiveRoom cartoon={cartoon} />}
        {activeTab === 'livingroom' && <LivingRoom cartoon={cartoon} />}
        {activeTab === 'resonance' && <Resonance cartoon={cartoon} />}
      </main>
    </Viewport>
  )
}
