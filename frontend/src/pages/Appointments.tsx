import React, { useState, useEffect } from 'react';
import { User } from '../App';

interface AppointmentsProps {
  user: User;
  onBack: () => void;
}

interface Appointment {
  id: number;
  patient_id: number;
  provider_id: number;
  appointment_date: string;
  appointment_type: string;
  status: string;
  notes: string;
}

const Appointments: React.FC<AppointmentsProps> = ({ user, onBack }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newAppt, setNewAppt] = useState({
    appointment_date: '',
    appointment_type: 'video',
    notes: ''
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`http://54.80.229.179:8000/appointments/${user.id}`);
      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const createAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://54.80.229.179:8000/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: user.id,
          provider_id: 2,
          appointment_date: newAppt.appointment_date,
          appointment_type: newAppt.appointment_type,
          notes: newAppt.notes
        })
      });
      if (response.ok) {
        setShowForm(false);
        fetchAppointments();
      }
    } catch (err) {
      console.error('Error creating appointment:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return '#0066cc';
      case 'completed': return '#00a854';
      case 'cancelled': return '#cc0000';
      default: return '#666';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return '🎥';
      case 'in-person': return '🏥';
      case 'phone': return '📞';
      default: return '📅';
    }
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '20px',
              color: '#0066cc'
            }}
          >
            ← 
          </button>
          <h2 style={{ margin: 0, color: '#1a1a2e' }}>My Appointments</h2>
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
          + Book Appointment
        </button>
      </div>

      {/* Booking Form */}
      {showForm && (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          borderTop: '4px solid #0066cc'
        }}>
          <h3 style={{ margin: '0 0 20px', color: '#1a1a2e' }}>Book New Appointment</h3>
          <form onSubmit={createAppointment}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '600', fontSize: '14px' }}>
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={newAppt.appointment_date}
                  onChange={e => setNewAppt({...newAppt, appointment_date: e.target.value})}
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
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '600', fontSize: '14px' }}>
                  Appointment Type
                </label>
                <select
                  value={newAppt.appointment_type}
                  onChange={e => setNewAppt({...newAppt, appointment_type: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="video">Video Call</option>
                  <option value="in-person">In Person</option>
                  <option value="phone">Phone Call</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '600', fontSize: '14px' }}>
                Notes (optional)
              </label>
              <textarea
                value={newAppt.notes}
                onChange={e => setNewAppt({...newAppt, notes: e.target.value})}
                placeholder="Describe your symptoms or reason for visit..."
                rows={3}
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
                Book Appointment
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

      {/* Appointments List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#666' }}>
          Loading appointments...
        </div>
      ) : appointments.length === 0 ? (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '48px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
          <h3 style={{ color: '#1a1a2e', marginBottom: '8px' }}>No Appointments Yet</h3>
          <p style={{ color: '#666' }}>Click "Book Appointment" to schedule your first visit.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {appointments.map(appt => (
            <div
              key={appt.id}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px 24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderLeft: `4px solid ${getStatusColor(appt.status)}`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '32px' }}>{getTypeIcon(appt.appointment_type)}</span>
                <div>
                  <p style={{ margin: '0 0 4px', fontWeight: '600', color: '#1a1a2e' }}>
                    {appt.appointment_type.charAt(0).toUpperCase() + appt.appointment_type.slice(1)} Consultation
                  </p>
                  <p style={{ margin: '0 0 4px', color: '#666', fontSize: '14px' }}>
                    {new Date(appt.appointment_date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  {appt.notes && (
                    <p style={{ margin: 0, color: '#888', fontSize: '13px' }}>{appt.notes}</p>
                  )}
                </div>
              </div>
              <span style={{
                background: `${getStatusColor(appt.status)}20`,
                color: getStatusColor(appt.status),
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: '600'
              }}>
                {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Appointments;