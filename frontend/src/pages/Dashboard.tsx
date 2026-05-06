import React, { useState } from 'react';
import { User } from '../App';
import Appointments from './Appointments';
import Messages from './Messages';

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
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0066cc, #00a8e8)',
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          onClick={() => setActivePage(null)}
        >
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
              border: '1px solid rgba(255,255,255,0.4)',
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Page Content */}
      {activePage === 'appointments' && (
        <Appointments user={user} onBack={() => setActivePage(null)} />
      )}
      {activePage === 'messages' && (
  <Messages user={user} onBack={() => setActivePage(null)} />
)}
      

      {/* Main Dashboard */}
      {!activePage && (
        <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ color: '#1a1a2e', marginBottom: '24px' }}>
            {user.role === 'staff' ? 'Staff Dashboard' : 'Patient Dashboard'}
          </h2>

          {/* Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            marginBottom: '32px'
          }}>
            {cards.map((card, i) => (
              <div
                key={i}
                onClick={() => setActivePage(card.page)}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  cursor: 'pointer',
                  borderTop: `4px solid ${card.color}`,
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                }}
              >
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>{card.icon}</div>
                <h3 style={{ margin: '0 0 8px', color: '#1a1a2e' }}>{card.title}</h3>
                <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>{card.desc}</p>
              </div>
            ))}
          </div>

          {/* Quick Info */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ margin: '0 0 16px', color: '#1a1a2e' }}>Your Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <p style={{ margin: '0 0 4px', color: '#666', fontSize: '12px' }}>FULL NAME</p>
                <p style={{ margin: 0, color: '#1a1a2e', fontWeight: '600' }}>
                  {user.first_name} {user.last_name}
                </p>
              </div>
              <div>
                <p style={{ margin: '0 0 4px', color: '#666', fontSize: '12px' }}>EMAIL</p>
                <p style={{ margin: 0, color: '#1a1a2e', fontWeight: '600' }}>{user.email}</p>
              </div>
              <div>
                <p style={{ margin: '0 0 4px', color: '#666', fontSize: '12px' }}>ROLE</p>
                <p style={{ margin: 0, color: '#1a1a2e', fontWeight: '600' }}>
                  {user.role === 'staff' ? 'Medical Staff' : 'Patient'}
                </p>
              </div>
              <div>
                <p style={{ margin: '0 0 4px', color: '#666', fontSize: '12px' }}>STATUS</p>
                <p style={{ margin: 0, color: '#00a854', fontWeight: '600' }}>Active</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;