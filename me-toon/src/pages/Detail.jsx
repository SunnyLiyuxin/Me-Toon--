import Viewport, { BackToDesktopButton } from '../components/Viewport.jsx'

export default function Detail() {
  return (
    <Viewport className="page-detail">
      <BackToDesktopButton />
      <div style={{ padding: 40 }}>
        <h1>📺 动画详情页</h1>
        <p>（第二阶段实现）</p>
      </div>
    </Viewport>
  )
}
