import React, { useState, useEffect, useRef } from 'react';
import { User } from '../App';

interface VideoCallProps {
  user: User;
  onBack: () => void;
}

const VideoCall: React.FC<VideoCallProps> = ({ user, onBack }) => {
  const [inCall, setInCall] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roomUrl, setRoomUrl] = useState('');
  const [error, setError] = useState('');
  const callFrameRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const DAILY_API_KEY = 'a13ddbe42ca732f5e293ee07f9b0d34eb3ba6e1806893a55313e1a667e4eae88';

  const createRoom = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://api.daily.co/v1/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DAILY_API_KEY}`
        },
        body: JSON.stringify({
          name: `swift-solutions-${user.id}-${Date.now()}`,
          properties: {
            exp: Math.floor(Date.now() / 1000) + 3600,
            enable_chat: true,
            enable_screenshare: true,
          }
        })
      });

      const data = await response.json();

      if (data.url) {
        setRoomUrl(data.url);
        joinCall(data.url);
      } else {
        setError('Failed to create room. Please try again.');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const joinCall = async (url: string) => {
    const DailyIframe = (await import('@daily-co/daily-js')).default;

    if (containerRef.current) {
      callFrameRef.current = DailyIframe.createFrame(containerRef.current, {
        showLeaveButton: true,
        showFullscreenButton: true,
        iframeStyle: {
          width: '100%',
          height: '100%',
          border: 'none',
          borderRadius: '12px'
        }
      });

      callFrameRef.current.on('left-meeting', () => {
        setInCall(false);
        callFrameRef.current?.destroy();
      });

      await callFrameRef.current.join({
        url,
        userName: `${user.first_name} ${user.last_name}`
      });

      setInCall(true);
    }
  };

  useEffect(() => {
    return () => {
      callFrameRef.current?.destroy();
    };
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1a1a2e',
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0066cc, #00a8e8)',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ← Back
        </button>
        <div style={{ fontSize: '24px' }}>🎥</div>
        <div>
          <h2 style={{ color: 'white', margin: 0, fontSize: '18px' }}>Video Consultation</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '13px' }}>
            Swift Solutions Medical Center
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {!inCall ? (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '48px',
            maxWidth: '500px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '24px' }}>🎥</div>
            <h2 style={{ color: '#1a1a2e', marginBottom: '12px' }}>Start Video Consultation</h2>
            <p style={{ color: '#666', marginBottom: '32px', fontSize: '14px', lineHeight: '1.6' }}>
              Connect with your healthcare provider through a secure video call. 
              Make sure your camera and microphone are enabled.
            </p>

            {error && (
              <div style={{
                background: '#fff5f5',
                border: '1px solid #fc8181',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '20px',
                color: '#c53030',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            <div style={{
              background: '#f7fafc',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px',
              textAlign: 'left'
            }}>
              <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#666', fontWeight: '600' }}>
                Before joining:
              </p>
              <p style={{ margin: '4px 0', fontSize: '13px', color: '#666' }}>✅ Check your camera is working</p>
              <p style={{ margin: '4px 0', fontSize: '13px', color: '#666' }}>✅ Check your microphone is working</p>
              <p style={{ margin: '4px 0', fontSize: '13px', color: '#666' }}>✅ Find a quiet, private space</p>
              <p style={{ margin: '4px 0', fontSize: '13px', color: '#666' }}>✅ Have your questions ready</p>
            </div>

            <button
              onClick={createRoom}
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                background: loading ? '#a0aec0' : 'linear-gradient(135deg, #0066cc, #00a8e8)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Setting up your room...' : '🎥 Start Video Call'}
            </button>

            <p style={{ marginTop: '16px', color: '#999', fontSize: '12px' }}>
              Powered by Daily.co — HIPAA compliant video
            </p>
          </div>
        ) : (
          <div
            ref={containerRef}
            style={{
              width: '100%',
              height: '600px',
              borderRadius: '12px',
              overflow: 'hidden'
            }}
          />
        )}
      </div>
    </div>
  );
};

export default VideoCall;
