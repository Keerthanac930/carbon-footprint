import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import CarbonFootprintAPI from '../services/api';

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px;
  background: transparent;
  min-height: 100vh;
  position: relative;
  
  @media (max-width: 768px) {
    margin: 10px;
    padding: 20px;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
  padding: 30px 0;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(69, 160, 73, 0.2));
  border-radius: 20px;
  border: 1px solid rgba(76, 175, 80, 0.3);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(15px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.2);
`;

const Title = styled.h1`
  font-size: 3em;
  margin-bottom: 20px;
  color: white;
  text-shadow: 0 4px 8px rgba(0,0,0,0.5);
  font-weight: 700;
  letter-spacing: -0.5px;
  
  @media (max-width: 768px) {
    font-size: 2.2em;
  }
`;

const Subtitle = styled.p`
  font-size: 1.3em;
  color: white;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.7;
  font-weight: 400;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
  
  @media (max-width: 768px) {
    font-size: 1.1em;
  }
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const ResultCard = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.9));
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  border: 1px solid rgba(76, 175, 80, 0.2);
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0,0,0,0.15);
  }
`;

const CardTitle = styled.h3`
  font-size: 1.5em;
  margin-bottom: 20px;
  color: #2E8B57;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const MetricValue = styled.div`
  font-size: 2.5em;
  font-weight: 700;
  color: #1B5E20;
  margin-bottom: 10px;
`;

const MetricUnit = styled.div`
  font-size: 1.1em;
  color: #666;
  margin-bottom: 20px;
`;

const BreakdownList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const BreakdownItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 10px;
  border-left: 4px solid #4CAF50;
`;

const CategoryName = styled.span`
  font-weight: 600;
  color: #2E8B57;
  text-transform: capitalize;
`;

const CategoryValue = styled.span`
  font-weight: 700;
  color: #1B5E20;
`;

const RecommendationsSection = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.9));
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  border: 1px solid rgba(76, 175, 80, 0.2);
  backdrop-filter: blur(10px);
  margin-bottom: 30px;
`;

const RecommendationsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const RecommendationCard = styled.div`
  background: linear-gradient(135deg, #E8F5E8, #F0F8F0);
  border-radius: 15px;
  padding: 20px;
  border-left: 5px solid #4CAF50;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
  }
`;

const RecommendationTitle = styled.h4`
  color: #2E8B57;
  margin-bottom: 10px;
  font-size: 1.1em;
`;

const RecommendationText = styled.p`
  color: #555;
  line-height: 1.6;
  margin: 0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 30px;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  padding: 15px 30px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
  position: relative;
  overflow: hidden;
  min-width: 200px;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4);
    background: linear-gradient(135deg, #45a049, #4CAF50);
  }
  
  &.secondary {
    background: linear-gradient(135deg, #6c757d, #5a6268);
    box-shadow: 0 4px 15px rgba(108, 117, 125, 0.3);
    
    &:hover {
      background: linear-gradient(135deg, #5a6268, #6c757d);
      box-shadow: 0 8px 25px rgba(108, 117, 125, 0.4);
    }
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2em;
  color: #4CAF50;
`;

const ErrorMessage = styled.div`
  background: linear-gradient(135deg, #ffebee, #ffcdd2);
  border: 2px solid #f44336;
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
  color: #c62828;
  text-align: center;
`;

const Results = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [twinData, setTwinData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      setLoading(true);
      
      // Get results from localStorage
      const savedResults = localStorage.getItem('carbonFootprintResults');
      const userId = localStorage.getItem('userId');
      
      if (!savedResults) {
        setError('No results found. Please calculate your carbon footprint first.');
        setLoading(false);
        return;
      }

      const parsedResults = JSON.parse(savedResults);
      setResults(parsedResults);

      // Load digital twin data if available
      if (userId) {
        const api = new CarbonFootprintAPI();
        try {
          const twinResult = await api.calculateTwinFootprint(userId, 'individual');
          setTwinData(twinResult);
          
          const recs = await api.getTwinRecommendations(userId, 'individual');
          setRecommendations(recs.recommendations || []);
        } catch (twinError) {
          console.warn('Could not load digital twin data:', twinError);
        }
      }
      
      setLoading(false);
    } catch (err) {
      setError('Error loading results: ' + err.message);
      setLoading(false);
    }
  };

  const handleNewCalculation = () => {
    navigate('/');
  };

  const handleViewDigitalTwin = () => {
    navigate('/digital-twin');
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>
          <div>Loading your carbon footprint results...</div>
        </LoadingSpinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage>
          <h3>⚠️ Error</h3>
          <p>{error}</p>
          <ActionButton onClick={handleNewCalculation}>
            Calculate Carbon Footprint
          </ActionButton>
        </ErrorMessage>
      </Container>
    );
  }

  if (!results) {
    return (
      <Container>
        <ErrorMessage>
          <h3>⚠️ No Results Found</h3>
          <p>Please calculate your carbon footprint first.</p>
          <ActionButton onClick={handleNewCalculation}>
            Calculate Carbon Footprint
          </ActionButton>
        </ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>🌱 Your Carbon Footprint Results</Title>
        <Subtitle>
          Here's your personalized carbon footprint analysis with actionable recommendations to help you reduce your environmental impact.
        </Subtitle>
      </Header>

      <ResultsGrid>
        <ResultCard>
          <CardTitle>
            📊 Monthly Carbon Footprint
          </CardTitle>
          <MetricValue>{results.total_monthly}</MetricValue>
          <MetricUnit>kg CO2e per month</MetricUnit>
          <BreakdownList>
            {Object.entries(results.breakdown).map(([category, value]) => (
              <BreakdownItem key={category}>
                <CategoryName>{category}</CategoryName>
                <CategoryValue>{value.toFixed(2)} kg</CategoryValue>
              </BreakdownItem>
            ))}
          </BreakdownList>
        </ResultCard>

        <ResultCard>
          <CardTitle>
            📈 Annual Carbon Footprint
          </CardTitle>
          <MetricValue>{results.total_annual}</MetricValue>
          <MetricUnit>kg CO2e per year</MetricUnit>
          <div style={{ marginTop: '20px', fontSize: '1.1em', color: '#666' }}>
            <p>This is equivalent to:</p>
            <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
              <li>🌳 {Math.round(results.total_annual / 22)} trees planted</li>
              <li>🚗 {Math.round(results.total_annual / 2.3)} km driven</li>
              <li>✈️ {Math.round(results.total_annual / 285)} short flights</li>
            </ul>
          </div>
        </ResultCard>
      </ResultsGrid>

      {twinData && (
        <ResultCard style={{ gridColumn: '1 / -1', marginBottom: '30px' }}>
          <CardTitle>
            🔮 Digital Twin Comparison
          </CardTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <h4 style={{ color: '#2E8B57', marginBottom: '10px' }}>Current Footprint</h4>
              <div style={{ fontSize: '2em', fontWeight: '700', color: '#1B5E20' }}>
                {twinData.current_twin?.footprint?.toFixed(2) || 'N/A'} kg CO2e
              </div>
            </div>
            <div>
              <h4 style={{ color: '#2E8B57', marginBottom: '10px' }}>Optimized Future</h4>
              <div style={{ fontSize: '2em', fontWeight: '700', color: '#4CAF50' }}>
                {twinData.future_twin?.footprint?.toFixed(2) || 'N/A'} kg CO2e
              </div>
              <div style={{ color: '#666', marginTop: '5px' }}>
                Potential savings: {twinData.current_twin && twinData.future_twin ? 
                  ((twinData.current_twin.footprint - twinData.future_twin.footprint) / twinData.current_twin.footprint * 100).toFixed(1) : 0}%
              </div>
            </div>
          </div>
        </ResultCard>
      )}

      <RecommendationsSection>
        <CardTitle>
          💡 Personalized Recommendations
        </CardTitle>
        <RecommendationsList>
          {recommendations.length > 0 ? (
            recommendations.map((rec, index) => (
              <RecommendationCard key={index}>
                <RecommendationTitle>{rec.title}</RecommendationTitle>
                <RecommendationText>{rec.description}</RecommendationText>
                {rec.savings && (
                  <div style={{ marginTop: '10px', color: '#4CAF50', fontWeight: '600' }}>
                    Potential savings: {rec.savings.toFixed(1)} kg CO2e/month
                  </div>
                )}
              </RecommendationCard>
            ))
          ) : (
            results.recommendations?.map((rec, index) => (
              <RecommendationCard key={index}>
                <RecommendationTitle>Recommendation {index + 1}</RecommendationTitle>
                <RecommendationText>{rec}</RecommendationText>
              </RecommendationCard>
            )) || []
          )}
        </RecommendationsList>
      </RecommendationsSection>

      <ActionButtons>
        <ActionButton onClick={handleNewCalculation}>
          🔄 Calculate Again
        </ActionButton>
        <ActionButton className="secondary" onClick={handleViewDigitalTwin}>
          🔮 View Digital Twin
        </ActionButton>
      </ActionButtons>
    </Container>
  );
};

export default Results;