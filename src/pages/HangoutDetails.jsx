import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const HangoutDetails = () => {
  const { id } = useParams();
  const [hangout, setHangout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [friendName, setFriendName] = useState('');
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [timeSlots, setTimeSlots] = useState([]);

  // Generate time slots for 24 hours starting from hangout creation time
  const generateTimeSlots = (createdAt) => {
    const slots = [];
    const startTime = new Date(createdAt);
    const now = new Date();
    
    for (let i = 0; i < 24; i++) {
      const time = new Date(startTime.getTime() + (i * 60 * 60 * 1000)); // Add i hours
      // Format time as 01:00 PM
      let hour = time.getHours();
      const ampm = hour >= 12 ? 'PM' : 'AM';
      hour = hour % 12;
      if (hour === 0) hour = 12;
      const timeString = `${hour.toString().padStart(2, '0')}:00 ${ampm}`;
      const isPast = time < now;
      
      slots.push({
        time: timeString,
        fullTime: time,
        isPast: isPast
      });
    }
    return slots;
  };

  useEffect(() => {
    const fetchHangout = async () => {
      const { data, error } = await supabase
        .from('hangouts')
        .select('title, location, name, created_at')
        .eq('id', id)
        .single();
      setHangout(data);
      if (data) {
        setTimeSlots(generateTimeSlots(data.created_at));
      }
      setLoading(false);
    };
    fetchHangout();
  }, [id]);

  const toggleTimeSlot = (time) => {
    setSelectedTimes(prev => 
      prev.includes(time) 
        ? prev.filter(t => t !== time)
        : [...prev, time]
    );
  };

  const handleSubmit = async () => {
    if (!friendName.trim() || selectedTimes.length === 0) return;
    
    const { error } = await supabase
      .from('availabilities')
      .insert([
        { 
          hangout_id: id, 
          friend_name: friendName, 
          friend_times: selectedTimes 
        }
      ]);
    
    if (error) {
      console.error('Error submitting availability:', error);
    } else {
      setSubmitted(true);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '3rem' }}>Loading...</div>;
  if (!hangout) return <div style={{ textAlign: 'center', marginTop: '3rem' }}>Hangout not found.</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', width: '100vw' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#1a202c', marginTop: '12.5vh', marginBottom: '2rem', textAlign: 'center' }}>{hangout.name} wants to hang</h1>
      <div style={{ textAlign: 'center', fontSize: '1.25rem', marginTop: '1rem' }}>
        {hangout.title} @ {hangout.location}
      </div>
      <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#1a202c', marginTop: '2.5rem', textAlign: 'center' }}>When are you free?</h1>
      
      {!submitted ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem', width: '100%', maxWidth: '600px' }}>
          <input
            type="text"
            placeholder="Your name"
            value={friendName}
            onChange={(e) => setFriendName(e.target.value)}
            style={{
              padding: '0.75rem',
              fontSize: '1rem',
              border: '1px solid #94a3b8',
              borderRadius: '4px',
              width: '300px',
              marginBottom: '2rem'
            }}
          />
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(6, 1fr)', 
            gap: '0.5rem',
            width: '100%',
            maxWidth: '600px'
          }}>
            {timeSlots.map((slot) => (
              <button
                key={slot.time}
                onClick={() => toggleTimeSlot(slot.time)}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #94a3b8',
                  borderRadius: '4px',
                  background: selectedTimes.includes(slot.time) ? '#1a202c' : '#fff',
                  color: selectedTimes.includes(slot.time) ? '#fff' : '#1a202c',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                {slot.time}
              </button>
            ))}
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={!friendName.trim() || selectedTimes.length === 0}
            style={{
              marginTop: '2rem',
              padding: '0.75rem 2rem',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              color: '#fff',
              background: (!friendName.trim() || selectedTimes.length === 0) ? '#94a3b8' : '#1a202c',
              border: 'none',
              borderRadius: '6px',
              cursor: (!friendName.trim() || selectedTimes.length === 0) ? 'not-allowed' : 'pointer'
            }}
          >
            Submit Availability
          </button>
        </div>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '1.25rem', color: '#059669' }}>
          Thanks! Your availability has been submitted.
        </div>
      )}
    </div>
  );
};

export default HangoutDetails; 