/**
 * 记忆共振子页面（第二阶段实现）
 * 当前为占位
 */
export default function Resonance({ cartoon }) {
  return (
    <div style={{
      padding: 40,
      height: '100%',
      background: 'linear-gradient(180deg, #1a1a3e, #3e1a5e)',
      color: '#E0D0FF',
    }}>
      <h2 style={{ fontSize: 24, marginBottom: 16, color: '#FFCCFF' }}>💝 记忆共振</h2>
      <p style={{ fontSize: 13, lineHeight: 1.8, opacity: 0.6 }}>
        （第二阶段实现：情绪标签 + 记忆织布机 + 未来邮筒）
      </p>

      <div style={{ marginTop: 24, padding: 16, background: 'rgba(255,255,255,0.05)', borderRadius: 4 }}>
        <p style={{ fontSize: 12, color: '#FFCC00', marginBottom: 8 }}>已就绪的预设数据：</p>
        <ul style={{ fontSize: 12, lineHeight: 1.8, listStyle: 'none' }}>
          {cartoon.resonance.emotionTags.map((t, i) => (
            <li key={i}>
              <span style={{ color: '#FF99CC' }}>[{t.color}]</span>
              <span style={{ color: '#FFF', marginLeft: 8 }}>{t.label}</span>
              <span style={{ color: '#999', marginLeft: 8 }}>— {t.note}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
