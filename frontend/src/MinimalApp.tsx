export function MinimalApp() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#333' }}>Leap ACP Platform</h1>
      <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h2>System Status: ✅ Working</h2>
        <ul>
          <li>React: Running</li>
          <li>Router: Ready</li>
          <li>Components: Loaded</li>
        </ul>
      </div>
      <div style={{ marginTop: '20px', color: '#666' }}>
        <p>If you see this, the application is working correctly.</p>
        <p>Next step: Full Dashboard will be loaded.</p>
      </div>
    </div>
  )
}
