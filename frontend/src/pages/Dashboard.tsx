import React, { useState } from 'react';
import { User } from '../App';
import Appointments from './Appointments';
import Messages from './Messages';
import Documents from './Documents';
import VideoCall from './VideoCall';
import Chat from './Chat';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [activePage, setActivePage] = useState<string | null>(null);

  const cards = [
    { icon: '📅', title: 'Appointments', desc: 'View and manage appointments', color: '#0066cc', page: 'appointments' },
    { icon: '💬', title: 'Messages', desc: 'Secure messaging with your care team', color: '#00a8e8', page: 'messages' },
    { icon: '📄', title: 'Documents', desc: 'Upload and view medical documents', color: '#0099cc', page: 'documents' },
    { icon: '🎥', title: 'Video Call', desc: 'Start a video consultation', color: '#006699', page: 'video' },
    { icon: '🤖', title: 'AI Assistant', desc: 'Chat with your AI medical assistant', color: '#7c3aed', page: 'chat' },
  ];

  const renderPage = () => {
    switch (activePage) {
      case 'appointments': return <Appointments user={user} onBack={() => setActivePage(null)} />;
      case 'messages': return <Messages user={user} onBack={() => setActivePage(null)} />;
      case 'documents': return <Documents user={user} onBack={() => setActivePage(null)} />;
      case 'video': return <VideoCall user={user} onBack={() => setActivePage(null)} />;
      case 'chat': return <Chat user={user} />;
      default: return null;
    }
  };

  if (activePage) {
    return (
      <div style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: 'Arial, sans-serif' }}>
        <div style={{
          background: 'linear-gradient(135deg, #0066cc, #00a8e8)',
          padding: '16px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>🏥</span>
            <span style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
              Swift Solutions Medical Center
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ color: 'white', fontSize: '14px' }}>
              Welcome, {user.first_name} {user.last_name}
            </span>
            <button
              onClick={() => setActivePage(null)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ← Dashboard
            </button>
          </div>
        </div>
        {renderPage()}
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: 'Arial, sans-serif' }}>
      <div style={{
        background: 'linear-gradient(135deg, #0066cc, #00a8e8)',
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>🏥</span>
          <span style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
            Swift Solutions Medical Center
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: 'white', fontSize: '14px' }}>
            Welcome, {user.first_name} {user.last_name}
          </span>
          <button
            onClick={onLogout}
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{ padding: '40px 32px' }}>
        <h1 style={{ color: '#1a1a2e', marginBottom: '8px', fontSize: '28px' }}>
          Patient Dashboard
        </h1>
        <p style={{ color: '#666', marginBottom: '32px', fontSize: '16px' }}>
          Welcome back, {user.first_name}! What would you like to do today?
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {cards.map((card) => (
            <div
              key={card.page}
              onClick={() => setActivePage(card.page)}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '32px',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                borderTop: `4px solid ${card.color}`
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
              }}
            >
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>{card.icon}</div>
              <h3 style={{ margin: '0 0 8px', color: '#1a1a2e', fontSize: '18px' }}>{card.title}</h3>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
