import Viewport, { BackToDesktopButton } from '../components/Viewport.jsx'

export default function Lobby() {
  return (
    <Viewport className="page-lobby">
      <BackToDesktopButton />
      <div style={{ padding: 40 }}>
        <h1>🌍 数据流漫游</h1>
        <p>（第三阶段实现）</p>
      </div>
    </Viewport>
  )
}
