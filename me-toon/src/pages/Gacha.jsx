import Viewport, { BackToDesktopButton } from '../components/Viewport.jsx'

export default function Gacha() {
  return (
    <Viewport className="page-gacha">
      <BackToDesktopButton />
      <div style={{ padding: 40, color: '#fff' }}>
        <h1>🎮 星际扭蛋机</h1>
        <p>（第二阶段实现）</p>
      </div>
    </Viewport>
  )
}
