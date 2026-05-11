import React, { useState, useEffect } from 'react';
import { User } from '../App';

interface StaffDashboardProps {
  user: User;
  onLogout: () => void;
}

interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
  created_at: string;
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

const StaffDashboard: React.FC<StaffDashboardProps> = ({ user, onLogout }) => {
  const [activePage, setActivePage] = useState('overview');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://swift-solutions-alb-1492420054.us-east-1.elb.amazonaws.com';

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      const [patientsRes, appointmentsRes] = await Promise.all([
        fetch(`${API_URL}/users`),
        fetch(`${API_URL}/appointments`)
      ]);
      const patientsData = await patientsRes.json();
      const appointmentsData = await appointmentsRes.json();
      setPatients(patientsData.filter((p: Patient & {role: string}) => p.role === 'patient'));
      setAppointments(appointmentsData);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId: number, status: string) => {
    try {
      await fetch(`${API_URL}/appointments/${appointmentId}/status?status=${status}`, {
        method: 'PUT'
      });
      fetchData();
    } catch (err) {
      console.error('Error updating appointment:', err);
    }
  };

  const stats = [
    { icon: '👥', title: 'Total Patients', value: patients.length, color: '#0066cc' },
    { icon: '📅', title: 'Total Appointments', value: appointments.length, color: '#00a8e8' },
    { icon: '⏳', title: 'Pending', value: appointments.filter(a => a.status === 'scheduled').length, color: '#f6ad55' },
    { icon: '✅', title: 'Completed', value: appointments.filter(a => a.status === 'completed').length, color: '#68d391' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e, #0066cc)',
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>🏥</span>
          <div>
            <span style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
              Swift Solutions
            </span>
            <span style={{
              marginLeft: '12px',
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              padding: '2px 10px',
              borderRadius: '12px',
              fontSize: '12px'
            }}>
              Staff Portal
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: 'white', fontSize: '14px' }}>
            Dr. {user.first_name} {user.last_name}
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

      {/* Nav */}
      <div style={{
        background: 'white',
        padding: '0 32px',
        display: 'flex',
        gap: '0',
        borderBottom: '2px solid #e2e8f0'
      }}>
        {[
          { id: 'overview', label: '📊 Overview' },
          { id: 'patients', label: '👥 Patients' },
          { id: 'appointments', label: '📅 Appointments' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActivePage(tab.id)}
            style={{
              padding: '16px 24px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: activePage === tab.id ? 'bold' : 'normal',
              color: activePage === tab.id ? '#0066cc' : '#666',
              borderBottom: activePage === tab.id ? '2px solid #0066cc' : '2px solid transparent',
              marginBottom: '-2px'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: '32px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: '#666', fontSize: '18px', marginTop: '60px' }}>
            Loading...
          </div>
        ) : (
          <>
            {/* Overview */}
            {activePage === 'overview' && (
              <div>
                <h2 style={{ color: '#1a1a2e', marginBottom: '24px' }}>
                  Welcome back, Dr. {user.first_name}!
                </h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '20px',
                  marginBottom: '32px'
                }}>
                  {stats.map((stat, i) => (
                    <div key={i} style={{
                      background: 'white',
                      borderRadius: '12px',
                      padding: '24px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      borderLeft: `4px solid ${stat.color}`
                    }}>
                      <div style={{ fontSize: '32px', marginBottom: '8px' }}>{stat.icon}</div>
                      <div style={{ fontSize: '32px', fontWeight: 'bold', color: stat.color }}>
                        {stat.value}
                      </div>
                      <div style={{ color: '#666', fontSize: '14px' }}>{stat.title}</div>
                    </div>
                  ))}
                </div>

                {/* Recent Appointments */}
                <h3 style={{ color: '#1a1a2e', marginBottom: '16px' }}>Recent Appointments</h3>
                <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f7fafc' }}>
                        <th style={{ padding: '12px 16px', textAlign: 'left', color: '#666', fontSize: '13px' }}>Patient ID</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', color: '#666', fontSize: '13px' }}>Date</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', color: '#666', fontSize: '13px' }}>Type</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', color: '#666', fontSize: '13px' }}>Status</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', color: '#666', fontSize: '13px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.slice(0, 5).map((appt) => (
                        <tr key={appt.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '12px 16px', fontSize: '14px' }}>Patient #{appt.patient_id}</td>
                          <td style={{ padding: '12px 16px', fontSize: '14px' }}>
                            {new Date(appt.appointment_date).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: '14px' }}>{appt.appointment_type}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{
                              padding: '4px 10px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              background: appt.status === 'completed' ? '#c6f6d5' : appt.status === 'cancelled' ? '#fed7d7' : '#fef3c7',
                              color: appt.status === 'completed' ? '#276749' : appt.status === 'cancelled' ? '#c53030' : '#92400e'
                            }}>
                              {appt.status}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px', display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => updateAppointmentStatus(appt.id, 'completed')}
                              style={{
                                padding: '4px 10px',
                                background: '#68d391',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '12px'
                              }}
                            >
                              Complete
                            </button>
                            <button
                              onClick={() => updateAppointmentStatus(appt.id, 'cancelled')}
                              style={{
                                padding: '4px 10px',
                                background: '#fc8181',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '12px'
                              }}
                            >
                              Cancel
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Patients */}
            {activePage === 'patients' && (
              <div>
                <h2 style={{ color: '#1a1a2e', marginBottom: '24px' }}>All Patients ({patients.length})</h2>
                <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f7fafc' }}>
                        <th style={{ padding: '12px 16px', textAlign: 'left', color: '#666', fontSize: '13px' }}>Name</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', color: '#666', fontSize: '13px' }}>Email</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', color: '#666', fontSize: '13px' }}>Status</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', color: '#666', fontSize: '13px' }}>Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patients.map((patient) => (
                        <tr key={patient.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '600' }}>
                            {patient.first_name} {patient.last_name}
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: '14px', color: '#666' }}>
                            {patient.email}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{
                              padding: '4px 10px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              background: patient.is_active ? '#c6f6d5' : '#fed7d7',
                              color: patient.is_active ? '#276749' : '#c53030'
                            }}>
                              {patient.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: '14px', color: '#666' }}>
                            {new Date(patient.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Appointments */}
            {activePage === 'appointments' && (
              <div>
                <h2 style={{ color: '#1a1a2e', marginBottom: '24px' }}>All Appointments ({appointments.length})</h2>
                <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f7fafc' }}>
                        <th style={{ padding: '12px 16px', textAlign: 'left', color: '#666', fontSize: '13px' }}>ID</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', color: '#666', fontSize: '13px' }}>Patient</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', color: '#666', fontSize: '13px' }}>Date</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', color: '#666', fontSize: '13px' }}>Type</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', color: '#666', fontSize: '13px' }}>Status</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', color: '#666', fontSize: '13px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((appt) => (
                        <tr key={appt.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '12px 16px', fontSize: '14px' }}>#{appt.id}</td>
                          <td style={{ padding: '12px 16px', fontSize: '14px' }}>Patient #{appt.patient_id}</td>
                          <td style={{ padding: '12px 16px', fontSize: '14px' }}>
                            {new Date(appt.appointment_date).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: '14px' }}>{appt.appointment_type}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{
                              padding: '4px 10px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              background: appt.status === 'completed' ? '#c6f6d5' : appt.status === 'cancelled' ? '#fed7d7' : '#fef3c7',
                              color: appt.status === 'completed' ? '#276749' : appt.status === 'cancelled' ? '#c53030' : '#92400e'
                            }}>
                              {appt.status}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px', display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => updateAppointmentStatus(appt.id, 'completed')}
                              style={{
                                padding: '4px 10px',
                                background: '#68d391',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '12px'
                              }}
                            >
                              Complete
                            </button>
                            <button
                              onClick={() => updateAppointmentStatus(appt.id, 'cancelled')}
                              style={{
                                padding: '4px 10px',
                                background: '#fc8181',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '12px'
                              }}
                            >
                              Cancel
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;
