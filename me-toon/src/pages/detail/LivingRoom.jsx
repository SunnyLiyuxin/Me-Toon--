/**
 * 人物客厅子页面（第二阶段实现）
 * 当前为占位
 */
export default function LivingRoom({ cartoon }) {
  return (
    <div style={{
      padding: 40,
      height: '100%',
      background: 'linear-gradient(180deg, #3a2a1a, #2a1a0a)',
      color: '#FFE6B0',
    }}>
      <h2 style={{ fontSize: 24, marginBottom: 16 }}>🏠 人物客厅</h2>
      <p style={{ fontSize: 14, marginBottom: 16, opacity: 0.7 }}>
        地点：{cartoon.livingroom.location}
      </p>
      <p style={{ fontSize: 13, lineHeight: 1.8, opacity: 0.6 }}>
        （第二阶段实现：场景背景 + {cartoon.characters.length} 个角色立绘 + 互动对话）
      </p>

      <div style={{ marginTop: 24, padding: 16, background: 'rgba(255,255,255,0.05)', borderRadius: 4 }}>
        <p style={{ fontSize: 12, color: '#FFCC00', marginBottom: 8 }}>已就绪的角色数据：</p>
        <ul style={{ fontSize: 12, lineHeight: 1.8, listStyle: 'none' }}>
          {cartoon.characters.map(c => (
            <li key={c.id}>
              <span style={{ color: '#FF6699' }}>{c.name}</span>
              <span style={{ color: '#999' }}>（{c.role}）</span>
              <span style={{ color: '#666', fontSize: 11, marginLeft: 8 }}>{c.idleAction}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
