import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import CarbonFootprintAPI from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;
`;

const BackgroundVideo = styled.iframe`
  position: fixed;
  top: 50%;
  left: 50%;
  width: 100vw;
  height: 100vh;
  min-width: 100vw;
  min-height: 100vh;
  z-index: -3;
  object-fit: cover;
  opacity: 0.8;
  filter: brightness(1.2) saturate(1.6) contrast(1.3) hue-rotate(15deg);
  transform: translate(-50%, -50%) scale(1.1);
  pointer-events: none;
  border: none;
  outline: none;
`;

const DashboardCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 30px;
  margin: 20px auto;
  max-width: 1200px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e1e8ed;
`;

const Title = styled.h1`
  color: #2c3e50;
  font-size: 2.5em;
  margin: 0;
  font-weight: 700;
`;

const UserInfo = styled.div`
  text-align: right;
  
  h3 {
    color: #2c3e50;
    margin: 0 0 5px 0;
    font-size: 1.3em;
  }
  
  p {
    color: #7f8c8d;
    margin: 0;
    font-size: 0.9em;
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: 10px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(76, 175, 80, 0.3);
  }
  
  &.secondary {
    background: linear-gradient(135deg, #6c757d, #5a6268);
    
    &:hover {
      box-shadow: 0 8px 16px rgba(108, 117, 125, 0.3);
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  padding: 20px;
  border-radius: 15px;
  text-align: center;
  border-left: 4px solid #4CAF50;
  
  h3 {
    color: #2c3e50;
    margin: 0 0 10px 0;
    font-size: 2em;
    font-weight: 700;
  }
  
  p {
    color: #7f8c8d;
    margin: 0;
    font-size: 1em;
  }
`;

const Section = styled.div`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  color: #2c3e50;
  font-size: 1.8em;
  margin-bottom: 20px;
  font-weight: 600;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.th`
  background: #4CAF50;
  color: white;
  padding: 15px;
  text-align: left;
  font-weight: 600;
`;

const TableCell = styled.td`
  padding: 15px;
  border-bottom: 1px solid #e1e8ed;
  
  &:first-child {
    font-weight: 600;
    color: #2c3e50;
  }
`;

const TableRow = styled.tr`
  &:hover {
    background: #f8f9fa;
  }
  
  &:last-child td {
    border-bottom: none;
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(76, 175, 80, 0.3);
  border-radius: 50%;
  border-top-color: #4CAF50;
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  background: #ffebee;
  color: #c62828;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #f44336;
  margin-bottom: 20px;
`;

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [loginHistory, setLoginHistory] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }
    
    loadUserData();
  }, [navigate, isAuthenticated]);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const api = new CarbonFootprintAPI();
      
      // Load login history (carbon footprint calculations)
      const history = await api.getCarbonFootprintHistory();
      setLoginHistory(history || []);
      
      // Load active sessions
      const userSessions = await api.getUserSessions();
      setSessions(userSessions || []);
      
    } catch (error) {
      console.error('Error loading user data:', error);
      setError('Failed to load user data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/signin');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (isLoading) {
    return (
      <Container>
        <DashboardCard>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <LoadingSpinner />
            <p style={{ marginTop: '20px', color: '#7f8c8d' }}>Loading dashboard...</p>
          </div>
        </DashboardCard>
      </Container>
    );
  }

  return (
    <Container>
      <BackgroundVideo
        src="https://www.youtube.com/embed/NSAOrGb9orM?autoplay=1&mute=1&loop=1&playlist=NSAOrGb9orM&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&fs=1&disablekb=1&start=0&end=0"
        title="Climate Change Background Video"
        frameBorder="0"
        allow="autoplay; encrypted-media; fullscreen"
        allowFullScreen
      />
      
      <DashboardCard>
        <Header>
          <Title>🌱 User Dashboard</Title>
          <UserInfo>
            {user && (
              <>
                <h3>Welcome, {user.name}</h3>
                <p>{user.email}</p>
                <p>Member since: {formatDate(user.created_at)}</p>
              </>
            )}
            <div>
              <Button onClick={() => navigate('/calculator')}>
                Calculate Footprint
              </Button>
              <Button className="secondary" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </UserInfo>
        </Header>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <StatsGrid>
          <StatCard>
            <h3>{loginHistory.length}</h3>
            <p>Total Calculations</p>
          </StatCard>
          <StatCard>
            <h3>{sessions.length}</h3>
            <p>Active Sessions</p>
          </StatCard>
          <StatCard>
            <h3>{user ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</h3>
            <p>Joined Date</p>
          </StatCard>
          <StatCard>
            <h3>{localStorage.getItem('login_time') ? formatDate(localStorage.getItem('login_time')) : 'N/A'}</h3>
            <p>Last Login</p>
          </StatCard>
        </StatsGrid>

        <Section>
          <SectionTitle>📊 Carbon Footprint History</SectionTitle>
          {loginHistory.length > 0 ? (
            <Table>
              <thead>
                <tr>
                  <TableHeader>Date</TableHeader>
                  <TableHeader>Total Emissions</TableHeader>
                  <TableHeader>Confidence</TableHeader>
                  <TableHeader>Model Used</TableHeader>
                </tr>
              </thead>
              <tbody>
                {loginHistory.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell>{formatDate(entry.calculation_date)}</TableCell>
                    <TableCell>{entry.total_emissions} kg CO₂</TableCell>
                    <TableCell>{(entry.confidence_score * 100).toFixed(1)}%</TableCell>
                    <TableCell>{entry.model_name}</TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          ) : (
            <p style={{ color: '#7f8c8d', textAlign: 'center', padding: '20px' }}>
              No calculations yet. <Button onClick={() => navigate('/calculator')}>Start calculating your carbon footprint!</Button>
            </p>
          )}
        </Section>

        <Section>
          <SectionTitle>🔐 Active Sessions</SectionTitle>
          {sessions.length > 0 ? (
            <Table>
              <thead>
                <tr>
                  <TableHeader>Session ID</TableHeader>
                  <TableHeader>Created</TableHeader>
                  <TableHeader>Expires</TableHeader>
                  <TableHeader>Status</TableHeader>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session, index) => (
                  <TableRow key={index}>
                    <TableCell>{session.session_token.substring(0, 20)}...</TableCell>
                    <TableCell>{formatDate(session.created_at)}</TableCell>
                    <TableCell>{formatDate(session.expires_at)}</TableCell>
                    <TableCell>
                      <span style={{ 
                        color: new Date(session.expires_at) > new Date() ? '#4CAF50' : '#f44336',
                        fontWeight: '600'
                      }}>
                        {new Date(session.expires_at) > new Date() ? 'Active' : 'Expired'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          ) : (
            <p style={{ color: '#7f8c8d', textAlign: 'center', padding: '20px' }}>
              No active sessions found.
            </p>
          )}
        </Section>
      </DashboardCard>
    </Container>
  );
};

export default UserDashboard;
