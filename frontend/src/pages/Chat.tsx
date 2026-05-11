import React, { useState, useRef, useEffect } from 'react';
import { User } from '../App';

interface ChatProps {
  user: User;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Chat: React.FC<ChatProps> = ({ user }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hi ${user.first_name}! I'm your Swift Solutions medical assistant. I can help you with general health questions, help you prepare for appointments, explain medical terms, or provide health tips. How can I help you today?`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);

    try {
      const response = await fetch('http://swift-solutions-alb-1492420054.us-east-1.elb.amazonaws.com/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          user_name: user.first_name
        })
      });

      const data = await response.json();
      setMessages([...newMessages, { role: 'assistant', content: data.response }]);
    } catch (err) {
      setMessages([...newMessages, {
        role: 'assistant',
        content: 'Sorry, I am having trouble connecting right now. Please try again.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: '#f7fafc',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0066cc, #00a8e8)',
        padding: '20px 24px',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '44px',
          height: '44px',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px'
        }}>
          🤖
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>AI Medical Assistant</h2>
          <p style={{ margin: 0, fontSize: '13px', opacity: 0.8 }}>Powered by Claude AI</p>
        </div>
        <div style={{
          marginLeft: 'auto',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '20px',
          padding: '4px 12px',
          fontSize: '12px'
        }}>
          🟢 Online
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {messages.map((msg, index) => (
          <div key={index} style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            gap: '12px',
            alignItems: 'flex-start'
          }}>
            {msg.role === 'assistant' && (
              <div style={{
                width: '36px',
                height: '36px',
                background: 'linear-gradient(135deg, #0066cc, #00a8e8)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                flexShrink: 0
              }}>
                🤖
              </div>
            )}
            <div style={{
              maxWidth: '70%',
              padding: '12px 16px',
              borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: msg.role === 'user' ? 'linear-gradient(135deg, #0066cc, #00a8e8)' : 'white',
              color: msg.role === 'user' ? 'white' : '#1a1a2e',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              fontSize: '14px',
              lineHeight: '1.6'
            }}>
              {msg.content}
            </div>
            {msg.role === 'user' && (
              <div style={{
                width: '36px',
                height: '36px',
                background: 'linear-gradient(135deg, #0066cc, #00a8e8)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '14px',
                flexShrink: 0
              }}>
                {user.first_name[0].toUpperCase()}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{
              width: '36px',
              height: '36px',
              background: 'linear-gradient(135deg, #0066cc, #00a8e8)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}>
              🤖
            </div>
            <div style={{
              padding: '12px 16px',
              background: 'white',
              borderRadius: '18px 18px 18px 4px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              color: '#666',
              fontSize: '14px'
            }}>
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '16px 24px',
        background: 'white',
        borderTop: '1px solid #e2e8f0',
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-end'
      }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me anything about your health..."
          rows={1}
          style={{
            flex: 1,
            padding: '12px 16px',
            border: '2px solid #e2e8f0',
            borderRadius: '12px',
            fontSize: '14px',
            outline: 'none',
            resize: 'none',
            fontFamily: 'Arial, sans-serif'
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{
            padding: '12px 20px',
            background: loading || !input.trim() ? '#a0aec0' : 'linear-gradient(135deg, #0066cc, #00a8e8)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '20px',
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer'
          }}
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default Chat;
