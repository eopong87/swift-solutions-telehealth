import React, { useState, useEffect } from 'react';
import { User } from '../App';

interface MessagesProps {
  user: User;
  onBack: () => void;
}

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  subject: string;
  body: string;
  is_read: boolean;
  created_at: string;
}

const Messages: React.FC<MessagesProps> = ({ user, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [newMessage, setNewMessage] = useState({
    subject: '',
    body: '',
    receiver_id: 2
  });

  useEffect(() => {
    fetchMessages();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`http://swift-solutions-alb-1492420054.us-east-1.elb.amazonaws.com/messages/${user.id}`);
      const data = await response.json();
      setMessages(data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://swift-solutions-alb-1492420054.us-east-1.elb.amazonaws.com/messages?sender_id=${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMessage)
      });
      if (response.ok) {
        setShowForm(false);
        setNewMessage({ subject: '', body: '', receiver_id: 2 });
        fetchMessages();
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const markAsRead = async (messageId: number) => {
    try {
      await fetch(`http://swift-solutions-alb-1492420054.us-east-1.elb.amazonaws.com/messages/${messageId}/read`, {
        method: 'PUT'
      });
      fetchMessages();
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onBack}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#0066cc' }}
          >
            ←
          </button>
          <h2 style={{ margin: 0, color: '#1a1a2e' }}>Messages</h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            background: 'linear-gradient(135deg, #0066cc, #00a8e8)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 20px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          + New Message
        </button>
      </div>

      {/* New Message Form */}
      {showForm && (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          borderTop: '4px solid #0066cc'
        }}>
          <h3 style={{ margin: '0 0 20px', color: '#1a1a2e' }}>New Message to Care Team</h3>
          <form onSubmit={sendMessage}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '600', fontSize: '14px' }}>
                Subject
              </label>
              <input
                type="text"
                value={newMessage.subject}
                onChange={e => setNewMessage({...newMessage, subject: e.target.value})}
                placeholder="Message subject..."
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '600', fontSize: '14px' }}>
                Message
              </label>
              <textarea
                value={newMessage.body}
                onChange={e => setNewMessage({...newMessage, body: e.target.value})}
                placeholder="Write your message here..."
                rows={5}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  resize: 'vertical'
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #0066cc, #00a8e8)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 24px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Send Message
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{
                  background: '#f0f4f8',
                  color: '#666',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 24px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Message Detail View */}
      {selectedMessage && (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, color: '#1a1a2e' }}>{selectedMessage.subject}</h3>
            <button
              onClick={() => setSelectedMessage(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', fontSize: '20px' }}
            >
              ×
            </button>
          </div>
          <p style={{ color: '#666', fontSize: '13px', marginBottom: '16px' }}>
            {new Date(selectedMessage.created_at).toLocaleDateString('en-US', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
              hour: '2-digit', minute: '2-digit'
            })}
          </p>
          <p style={{ color: '#333', lineHeight: '1.6' }}>{selectedMessage.body}</p>
        </div>
      )}

      {/* Messages List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#666' }}>
          Loading messages...
        </div>
      ) : messages.length === 0 ? (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '48px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
          <h3 style={{ color: '#1a1a2e', marginBottom: '8px' }}>No Messages Yet</h3>
          <p style={{ color: '#666' }}>Click "New Message" to contact your care team.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {messages.map(msg => (
            <div
              key={msg.id}
              onClick={() => {
                setSelectedMessage(msg);
                if (!msg.is_read) markAsRead(msg.id);
              }}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '16px 20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderLeft: `4px solid ${msg.is_read ? '#e2e8f0' : '#0066cc'}`,
                opacity: msg.is_read ? 0.8 : 1
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>
                  {msg.sender_id === user.id ? '📤' : '📥'}
                </span>
                <div>
                  <p style={{ margin: '0 0 4px', fontWeight: msg.is_read ? 'normal' : '600', color: '#1a1a2e' }}>
                    {msg.subject || 'No Subject'}
                  </p>
                  <p style={{ margin: 0, color: '#666', fontSize: '13px' }}>
                    {msg.body.substring(0, 60)}...
                  </p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: '0 0 4px', color: '#888', fontSize: '12px' }}>
                  {new Date(msg.created_at).toLocaleDateString()}
                </p>
                {!msg.is_read && msg.receiver_id === user.id && (
                  <span style={{
                    background: '#0066cc',
                    color: 'white',
                    borderRadius: '20px',
                    padding: '2px 8px',
                    fontSize: '11px'
                  }}>
                    New
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Messages;