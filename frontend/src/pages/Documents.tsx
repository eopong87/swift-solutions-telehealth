import React, { useState } from 'react';
import { User } from '../App';

interface DocumentsProps {
  user: User;
  onBack: () => void;
}

interface Document {
  id: number;
  file_name: string;
  file_type: string;
  uploaded_at: string;
}

const Documents: React.FC<DocumentsProps> = ({ user, onBack }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('word')) return '📝';
    return '📎';
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      // Simulate upload for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newDoc: Document = {
        id: documents.length + 1,
        file_name: file.name,
        file_type: file.type,
        uploaded_at: new Date().toISOString()
      };
      setDocuments([...documents, newDoc]);
    } catch (err) {
      console.error('Error uploading file:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

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
        <h2 style={{ margin: 0, color: '#1a1a2e' }}>My Documents</h2>
      </div>

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        style={{
          background: dragOver ? '#e8f0fe' : 'white',
          border: `2px dashed ${dragOver ? '#0066cc' : '#e2e8f0'}`,
          borderRadius: '12px',
          padding: '48px',
          textAlign: 'center',
          marginBottom: '24px',
          transition: 'all 0.2s',
          cursor: 'pointer'
        }}
        onClick={() => document.getElementById('fileInput')?.click()}
      >
        <input
          id="fileInput"
          type="file"
          style={{ display: 'none' }}
          onChange={handleFileInput}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        />
        {uploading ? (
          <div>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
            <p style={{ color: '#0066cc', fontWeight: '600' }}>Uploading...</p>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📤</div>
            <h3 style={{ color: '#1a1a2e', marginBottom: '8px' }}>Upload Document</h3>
            <p style={{ color: '#666', marginBottom: '8px' }}>
              Drag and drop a file here or click to browse
            </p>
            <p style={{ color: '#888', fontSize: '13px' }}>
              Supported formats: PDF, DOC, DOCX, JPG, PNG
            </p>
          </div>
        )}
      </div>

      {/* Documents List */}
      {documents.length === 0 ? (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '48px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
          <h3 style={{ color: '#1a1a2e', marginBottom: '8px' }}>No Documents Yet</h3>
          <p style={{ color: '#666' }}>Upload your medical documents, lab results, or insurance cards above.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ color: '#1a1a2e', margin: '0 0 8px' }}>Uploaded Documents</h3>
          {documents.map(doc => (
            <div
              key={doc.id}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '16px 20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderLeft: '4px solid #0099cc'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '32px' }}>{getFileIcon(doc.file_type)}</span>
                <div>
                  <p style={{ margin: '0 0 4px', fontWeight: '600', color: '#1a1a2e' }}>
                    {doc.file_name}
                  </p>
                  <p style={{ margin: 0, color: '#888', fontSize: '13px' }}>
                    Uploaded {new Date(doc.uploaded_at).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <button
                style={{
                  background: '#f0f4f8',
                  color: '#0066cc',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600'
                }}
              >
                Download
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Documents;