export default function Page() {
  return (
    <div style={{
      backgroundColor: 'black',
      color: '#00ff00',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'monospace',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '20px', border: '2px solid #00ff00', padding: '20px' }}>
        SYSTEM ACTIVATED
      </h1>
      <p style={{ fontSize: '1.2rem', color: '#888' }}>
        Mind-Lens 实验室已绕过所有错误，成功上线。
      </p>
    </div>
  );
}
