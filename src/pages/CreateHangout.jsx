import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1.5rem',
  width: '320px',
  background: '#f8fafc',
  padding: '2rem',
  borderRadius: '8px'
};

const fieldStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%'
};

const labelStyle = {
  fontWeight: 'bold',
  marginRight: '1rem',
  minWidth: '70px',
  color: '#1a202c'
};

const inputStyle = {
  flex: 1,
  padding: '0.5rem',
  fontSize: '1rem',
  border: '1px solid #94a3b8',
  borderRadius: '4px',
  background: '#fff',
  color: '#1a202c'
};

const buttonStyle = {
  padding: '0.75rem 1.5rem',
  fontSize: '1rem',
  fontWeight: 'bold',
  backgroundColor: '#3b82f6',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  transition: 'background-color 0.2s'
};

const disabledButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#94a3b8',
  cursor: 'not-allowed'
};

const urlBoxStyle = {
  marginTop: '2rem',
  padding: '1rem 2rem',
  background: '#f8fafc',
  border: '1px solid #1a202c',
  borderRadius: '8px',
  fontSize: '1.1rem',
  color: '#1a202c',
  textAlign: 'center',
  wordBreak: 'break-all',
  maxWidth: '90vw'
};

const CreateHangout = () => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [shareUrl, setShareUrl] = useState('');

  const handleSubmit = async () => {
    if (name.trim() && title.trim() && location.trim()) {
      // Generate a random URL
      const randomId = Math.random().toString(36).substring(2, 10);
      setShareUrl(`${window.location.origin}/hang/${randomId}`);
      
      // Save to Supabase with error logging
      const { error } = await supabase.from('hangouts').insert([
        { id: randomId, title, location, name }
      ]);
      if (error) {
        console.error('Supabase insert error:', error);
      } else {
        console.log('Supabase insert successful:', { id: randomId, title, location, name });
      }
      // Fetch for debugging
      const { data, error: fetchError } = await supabase
        .from('hangouts')
        .select('title, location, name')
        .eq('id', randomId)
        .single();
      if (fetchError) {
        console.error('Supabase fetch error:', fetchError);
      } else {
        console.log('Supabase fetch result:', data);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && name.trim() && title.trim() && location.trim()) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isFormComplete = name.trim() && title.trim() && location.trim();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', width: '100vw' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#1a202c', marginTop: '25vh', marginBottom: '2rem' }}>Create a Hang</h1>
      <form style={formStyle} onSubmit={e => e.preventDefault()}>
        <div style={fieldStyle}>
          <label htmlFor="hang-name" style={labelStyle}>Name</label>
          <input
            id="hang-name"
            name="hang-name"
            type="text"
            style={inputStyle}
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </div>
        
        <div style={fieldStyle}>
          <label htmlFor="hang-title" style={labelStyle}>What</label>
          <input
            id="hang-title"
            name="hang-title"
            type="text"
            style={inputStyle}
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        
        <div style={fieldStyle}>
          <label htmlFor="hang-location" style={labelStyle}>Where</label>
          <input
            id="hang-location"
            name="hang-location"
            type="text"
            style={inputStyle}
            value={location}
            onChange={e => setLocation(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        
        {isFormComplete && (
          <button
            type="button"
            style={buttonStyle}
            onClick={handleSubmit}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
          >
            Create Hang
          </button>
        )}
      </form>
      
      {shareUrl && (
        <div style={urlBoxStyle}>
          <div>Share this link with your friends:</div>
          <div><a href={shareUrl} target="_blank" rel="noopener noreferrer">{shareUrl}</a></div>
        </div>
      )}
    </div>
  );
};

export default CreateHangout; 