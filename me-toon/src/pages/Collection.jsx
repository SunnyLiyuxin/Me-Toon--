import Viewport, { BackToDesktopButton } from '../components/Viewport.jsx'

export default function Collection() {
  return (
    <Viewport className="page-collection">
      <BackToDesktopButton />
      <div style={{ padding: 40 }}>
        <h1>📔 我的记忆抽屉</h1>
        <p>（第二阶段实现）</p>
      </div>
    </Viewport>
  )
}
