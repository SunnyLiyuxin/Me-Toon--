import Viewport, { BackToDesktopButton } from '../components/Viewport.jsx'

export default function Radio() {
  return (
    <Viewport className="page-radio">
      <BackToDesktopButton />
      <div style={{ padding: 40, color: '#fff' }}>
        <h1>📻 时光点歌台</h1>
        <p>（第三阶段实现）</p>
      </div>
    </Viewport>
  )
}
