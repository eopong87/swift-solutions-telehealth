import React, { useState } from 'react';
import { User } from '../App';

interface VideoCallProps {
  user: User;
  onBack: () => void;
}

const VideoCall: React.FC<VideoCallProps> = ({ user, onBack }) => {
  const [inCall, setInCall] = useState(false);
  const [callType, setCallType] = useState<'patient' | 'staff' | null>(null);

  const startCall = (type: 'patient' | 'staff') => {
    setCallType(type);
    setInCall(true);
  };

  const endCall = () => {
    setInCall(false);
    setCallType(null);
  };

  if (inCall) {
    return (
      <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <h2 style={{ margin: 0, color: '#1a1a2e' }}>🎥 Video Consultation</h2>
          <span style={{
            background: '#00a85420',
            color: '#00a854',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '600'
          }}>
            ● Live
          </span>
        </div>

        {/* Video Area */}
        <div style={{
          background: '#1a1a2e',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '24px',
          minHeight: '480px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          {/* Main Video */}
          <div style={{
            width: '100%',
            height: '400px',
            background: '#0f3460',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            position: 'relative'
          }}>
            <div style={{ textAlign: 'center', color: 'white' }}>
              <div style={{ fontSize: '80px', marginBottom: '16px' }}>
                {callType === 'staff' ? '👨‍⚕️' : '👤'}
              </div>
              <p style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
                {callType === 'staff' ? 'Dr. Sarah Smith' : 'John Doe'}
              </p>
              <p style={{ margin: '8px 0 0', color: '#aaa', fontSize: '14px' }}>
                Connected
              </p>
            </div>

            {/* Self View */}
            <div style={{
              position: 'absolute',
              bottom: '16px',
              right: '16px',
              width: '160px',
              height: '120px',
              background: '#16213e',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #0066cc'
            }}>
              <div style={{ textAlign: 'center', color: 'white' }}>
                <div style={{ fontSize: '32px' }}>
                  {user.role === 'staff' ? '👨‍⚕️' : '👤'}
                </div>
                <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#aaa' }}>You</p>
              </div>
            </div>
          </div>

          {/* Call Controls */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            {[
              { icon: '🎤', label: 'Mute' },
              { icon: '📷', label: 'Camera' },
              { icon: '💬', label: 'Chat' },
              { icon: '🖥️', label: 'Share' },
            ].map((btn, i) => (
              <button
                key={i}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '56px',
                  height: '56px',
                  cursor: 'pointer',
                  fontSize: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column'
                }}
                title={btn.label}
              >
                {btn.icon}
              </button>
            ))}

            <button
              onClick={endCall}
              style={{
                background: '#cc0000',
                border: 'none',
                borderRadius: '50%',
                width: '64px',
                height: '64px',
                cursor: 'pointer',
                fontSize: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '8px'
              }}
              title="End Call"
            >
              📵
            </button>
          </div>
        </div>

        {/* Call Info */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px 24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <p style={{ margin: '0 0 4px', fontWeight: '600', color: '#1a1a2e' }}>
              Video Consultation with {callType === 'staff' ? 'Dr. Sarah Smith' : 'John Doe'}
            </p>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
              Swift Solutions Medical Center
            </p>
          </div>
          <button
            onClick={endCall}
            style={{
              background: '#fff0f0',
              color: '#cc0000',
              border: '1px solid #fca5a5',
              borderRadius: '8px',
              padding: '8px 20px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px'
            }}
          >
            End Call
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#0066cc' }}
        >
          ←
        </button>
        <h2 style={{ margin: 0, color: '#1a1a2e' }}>Video Consultations</h2>
      </div>

      {/* Upcoming Video Appointments */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        borderTop: '4px solid #0066cc'
      }}>
        <h3 style={{ margin: '0 0 20px', color: '#1a1a2e' }}>Upcoming Video Appointment</h3>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px',
          background: '#f0f4f8',
          borderRadius: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '40px' }}>👨‍⚕️</span>
            <div>
              <p style={{ margin: '0 0 4px', fontWeight: '600', color: '#1a1a2e' }}>
                Dr. Sarah Smith
              </p>
              <p style={{ margin: '0 0 4px', color: '#666', fontSize: '14px' }}>
                May 15, 2026 at 10:00 AM
              </p>
              <p style={{ margin: 0, color: '#888', fontSize: '13px' }}>
                Initial Consultation — Video Call
              </p>
            </div>
          </div>
          <button
            onClick={() => startCall('patient')}
            style={{
              background: 'linear-gradient(135deg, #0066cc, #00a8e8)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            🎥 Join Call
          </button>
        </div>
      </div>

      {/* How It Works */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        marginBottom: '24px'
      }}>
        <h3 style={{ margin: '0 0 20px', color: '#1a1a2e' }}>How Video Consultations Work</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          {[
            { icon: '📅', step: '1', title: 'Book Appointment', desc: 'Schedule a video consultation through the Appointments section' },
            { icon: '🔔', step: '2', title: 'Get Reminder', desc: 'Receive a reminder before your scheduled appointment' },
            { icon: '🎥', step: '3', title: 'Join Call', desc: 'Click Join Call at appointment time to connect with your provider' },
            { icon: '📝', step: '4', title: 'Follow Up', desc: 'Receive notes and next steps after your consultation' },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #0066cc, #00a8e8)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '18px'
              }}>
                {item.step}
              </div>
              <h4 style={{ margin: '0 0 8px', color: '#1a1a2e' }}>{item.title}</h4>
              <p style={{ margin: 0, color: '#666', fontSize: '13px' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Requirements */}
      <div style={{
        background: '#f0f7ff',
        borderRadius: '12px',
        padding: '20px 24px',
        border: '1px solid #bee3f8'
      }}>
        <h4 style={{ margin: '0 0 12px', color: '#0066cc' }}>📋 Before Your Call</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {[
            '✅ Stable internet connection',
            '✅ Working camera and microphone',
            '✅ Quiet private location',
            '✅ Chrome or Safari browser',
          ].map((item, i) => (
            <p key={i} style={{ margin: 0, color: '#333', fontSize: '14px' }}>{item}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoCall;