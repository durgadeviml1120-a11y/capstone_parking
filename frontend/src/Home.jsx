import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #f0f9ff, #ffffff, #e0e7ff)' }}>
      {/* Navigation */}
      <nav style={{ background: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '2rem' }}>🅿️</span>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>SmartPark</h1>
          </div>
          <button 
            onClick={() => navigate('/dashboard')}
            style={{ background: '#2563eb', color: 'white', padding: '0.5rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Dashboard
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: '80rem', margin: '0 auto', padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '3.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1.5rem' }}>
          Find Your Spot.<br />
          <span style={{ color: '#2563eb' }}>Park Smarter.</span>
        </h2>
        <p style={{ fontSize: '1.25rem', color: '#4b5563', marginBottom: '2rem', maxWidth: '48rem', margin: '0 auto 2rem' }}>
          Smart parking for every destination. Find available parking spaces and reserve your slot before you arrive.
        </p>
        <button 
          onClick={() => navigate('/dashboard')}
          style={{ background: '#2563eb', color: 'white', padding: '1rem 2.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '1.125rem', fontWeight: 'bold' }}
        >
          Get Started →
        </button>
      </section>

      {/* Features */}
      <section style={{ background: 'white', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <h3 style={{ fontSize: '2.25rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '4rem', color: '#111827' }}>
            Why SmartPark?
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {/* Feature 1 */}
            <div style={{ background: 'linear-gradient(to bottom right, #f0f9ff, #e0f2fe)', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>📍</div>
              <h4 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.75rem', color: '#111827' }}>Find Nearby Parking</h4>
              <p style={{ color: '#374151' }}>Discover available parking locations near your destination in real-time.</p>
            </div>

            {/* Feature 2 */}
            <div style={{ background: 'linear-gradient(to bottom right, #f0fdf4, #dcfce7)', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>⏱️</div>
              <h4 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.75rem', color: '#111827' }}>Save Your Time</h4>
              <p style={{ color: '#374151' }}>Check availability and reserve your slot before you arrive.</p>
            </div>

            {/* Feature 3 */}
            <div style={{ background: 'linear-gradient(to bottom right, #faf5ff, #f3e8ff)', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🔒</div>
              <h4 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.75rem', color: '#111827' }}>Secure Booking</h4>
              <p style={{ color: '#374151' }}>Your parking reservation is securely managed by SmartPark.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ background: 'linear-gradient(to right, #2563eb, #4f46e5)', color: 'white', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <h3 style={{ fontSize: '2.25rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '4rem' }}>How It Works</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {[1, 2, 3].map((step) => (
              <div key={step} style={{ textAlign: 'center' }}>
                <div style={{ background: 'white', color: '#2563eb', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '2rem', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                  {step}
                </div>
                <h4 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>
                  {step === 1 ? 'Find' : step === 2 ? 'Reserve' : 'Park'}
                </h4>
                <p style={{ color: '#e0e7ff' }}>
                  {step === 1 && 'Choose a parking location near your destination.'}
                  {step === 2 && 'Select an available slot and confirm your booking.'}
                  {step === 3 && 'Arrive at your reserved slot and park with confidence.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#f9fafb', padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
          <h3 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#111827' }}>Ready to park smarter?</h3>
          <p style={{ fontSize: '1.25rem', color: '#4b5563', marginBottom: '2rem' }}>Find and reserve your parking space today.</p>
          <button 
            onClick={() => navigate('/dashboard')}
            style={{ background: '#2563eb', color: 'white', padding: '1rem 2.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '1.125rem', fontWeight: 'bold' }}
          >
            Get Started Now →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#111827', color: 'white', padding: '3rem 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <p style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>SmartPark</p>
          <p style={{ color: '#9ca3af' }}>© 2026 SmartPark. All rights reserved.</p>
          <p style={{ color: '#9ca3af', marginTop: '0.5rem' }}>Smart parking for smarter journeys.</p>
        </div>
      </footer>
    </div>
  );
}