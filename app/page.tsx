"use client";
import React, { useState } from 'react';

export default function MindLensLab() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([{ role: 'ai', content: 'SYSTEM READY. 核心逻辑已接入 DeepSeek。请输入对方的言论...' }]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // 这里的逻辑会调用你刚才设置的变量
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: '连接超时，请检查 API 配置。' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... 这里的样式保持你现在看到的黑色赛博风格 ...
    <div style={{ backgroundColor: '#0a0a0a', color: '#00ff41', minHeight: '100vh', padding: '20px', fontFamily: 'monospace' }}>
      {/* 保持之前的界面代码即可 */}
      <h1 style={{ borderBottom: '1px solid #00ff41' }}>MIND-LENS-LAB_v1.0</h1>
      <div style={{ margin: '20px 0', height: '70vh', overflowY: 'auto' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: '15px', color: msg.role === 'user' ? '#008cff' : '#00ff41' }}>
            [{msg.role === 'user' ? 'USER' : 'AI'}]: {msg.content}
          </div>
        ))}
        {loading && <div className="animate-pulse">正在深度分析语义...</div>}
      </div>
      <div style={{ display: 'flex' }}>
        <input 
          style={{ flex: 1, bg: '#1a1a1a', border: '1px solid #00ff41', color: '#00ff41', padding: '10px' }}
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend} style={{ background: '#00ff41', color: '#000', padding: '10px' }}>
          {loading ? '...' : '解码'}
        </button>
      </div>
    </div>
  );
}
