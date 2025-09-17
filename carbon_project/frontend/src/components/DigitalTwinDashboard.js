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

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const Card = styled.div`
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

const ComparisonContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 20px;
`;

const ComparisonItem = styled.div`
  text-align: center;
  padding: 20px;
  background: ${props => props.highlight ? 'linear-gradient(135deg, #E8F5E8, #F0F8F0)' : 'rgba(76, 175, 80, 0.1)'};
  border-radius: 15px;
  border: ${props => props.highlight ? '2px solid #4CAF50' : '1px solid rgba(76, 175, 80, 0.3)'};
`;

const ComparisonLabel = styled.div`
  font-weight: 600;
  color: #2E8B57;
  margin-bottom: 10px;
`;

const ComparisonValue = styled.div`
  font-size: 1.8em;
  font-weight: 700;
  color: ${props => props.highlight ? '#4CAF50' : '#1B5E20'};
`;

const TimelineContainer = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.9));
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  border: 1px solid rgba(76, 175, 80, 0.2);
  backdrop-filter: blur(10px);
  margin-bottom: 30px;
`;

const TimelineChart = styled.div`
  height: 200px;
  display: flex;
  align-items: end;
  gap: 10px;
  margin-top: 20px;
  padding: 20px;
  background: rgba(76, 175, 80, 0.05);
  border-radius: 15px;
`;

const TimelineBar = styled.div`
  flex: 1;
  background: linear-gradient(135deg, #4CAF50, #45a049);
  border-radius: 5px 5px 0 0;
  min-height: 20px;
  position: relative;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #45a049, #4CAF50);
    transform: scaleY(1.05);
  }
  
  &::after {
    content: attr(data-value);
    position: absolute;
    top: -25px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.8em;
    font-weight: 600;
    color: #2E8B57;
  }
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

const RecommendationsGrid = styled.div`
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
  margin: 0 0 15px 0;
`;

const RecommendationSavings = styled.div`
  color: #4CAF50;
  font-weight: 600;
  font-size: 0.9em;
  margin-bottom: 15px;
`;

const ApplyButton = styled.button`
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9em;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #45a049, #4CAF50);
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const ScenarioSection = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.9));
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  border: 1px solid rgba(76, 175, 80, 0.2);
  backdrop-filter: blur(10px);
  margin-bottom: 30px;
`;

const ScenarioGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const ScenarioCard = styled.div`
  background: linear-gradient(135deg, #E3F2FD, #F3E5F5);
  border-radius: 15px;
  padding: 20px;
  border-left: 5px solid #2196F3;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(33, 150, 243, 0.2);
  }
`;

const ScenarioTitle = styled.h4`
  color: #1976D2;
  margin-bottom: 10px;
  font-size: 1.1em;
`;

const ScenarioDescription = styled.p`
  color: #555;
  line-height: 1.6;
  margin: 0 0 15px 0;
  font-size: 0.9em;
`;

const ScenarioImpact = styled.div`
  color: #2196F3;
  font-weight: 600;
  font-size: 0.9em;
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

const DigitalTwinDashboard = () => {
  const navigate = useNavigate();
  const [twinData, setTwinData] = useState(null);
  const [timelineData, setTimelineData] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [simulationResults, setSimulationResults] = useState({});

  useEffect(() => {
    loadDigitalTwinData();
  }, []);

  const loadDigitalTwinData = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        setError('No user data found. Please calculate your carbon footprint first.');
        setLoading(false);
        return;
      }

      const api = new CarbonFootprintAPI();
      
      // Load twin data
      const twinResult = await api.calculateTwinFootprint(userId, 'individual');
      setTwinData(twinResult);
      
      // Load timeline data
      const timelineResult = await api.getTwinTimeline(userId, 'individual');
      setTimelineData(timelineResult.timeline || []);
      
      // Load recommendations
      const recs = await api.getTwinRecommendations(userId, 'individual');
      setRecommendations(recs.recommendations || []);
      
      setLoading(false);
    } catch (err) {
      setError('Error loading digital twin data: ' + err.message);
      setLoading(false);
    }
  };

  const handleScenarioSimulation = async (scenarioId) => {
    try {
      const userId = localStorage.getItem('userId');
      const formData = JSON.parse(localStorage.getItem('formData') || '{}');
      
      if (!userId || !formData) {
        alert('No user data found. Please calculate your carbon footprint first.');
        return;
      }

      const api = new CarbonFootprintAPI();
      
      // Transform form data to match API format
      const individualData = {
        monthly_electricity: formData.electricity_usage_kwh || 0,
        monthly_transport: (formData.vehicles?.reduce((total, vehicle) => {
          return total + (vehicle.monthly_distance_km * 0.2);
        }, 0) || 0) + (formData.walking_cycling_distance_km * 0.05),
        monthly_waste: (formData.waste_per_person * 4 * formData.household_size) || 0,
        monthly_shopping: formData.monthly_grocery_bill * 0.0005 || 0,
        diet_type: formData.meat_consumption || 'vegetarian',
        heating_type: formData.heating_energy_source || 'electric',
        monthly_heating: (formData.electricity_usage_kwh * 0.3) || 0,
        monthly_water: (formData.household_size * 100 * 0.0003) || 0
      };

      const result = await api.simulateScenario(userId, scenarioId, 'individual', individualData);
      setSimulationResults(prev => ({
        ...prev,
        [scenarioId]: result.simulation_result
      }));
    } catch (err) {
      console.error('Error simulating scenario:', err);
      alert('Error simulating scenario: ' + err.message);
    }
  };

  const handleApplyRecommendation = async (recommendationId) => {
    try {
      const userId = localStorage.getItem('userId');
      const api = new CarbonFootprintAPI();
      
      await api.applyRecommendation(userId, recommendationId, 'individual');
      alert('Recommendation applied successfully!');
      
      // Reload data
      loadDigitalTwinData();
    } catch (err) {
      console.error('Error applying recommendation:', err);
      alert('Error applying recommendation: ' + err.message);
    }
  };

  const scenarios = [
    {
      id: 'transport',
      title: '🚗 Transport Optimization',
      description: 'Switch to electric vehicles and public transport',
      impact: '40% reduction'
    },
    {
      id: 'energy',
      title: '⚡ Energy Efficiency',
      description: 'Upgrade to energy-efficient appliances and solar',
      impact: '30% reduction'
    },
    {
      id: 'diet',
      title: '🥗 Plant-Based Diet',
      description: 'Reduce meat consumption and eat locally',
      impact: '25% reduction'
    },
    {
      id: 'waste',
      title: '♻️ Zero Waste',
      description: 'Implement comprehensive recycling and composting',
      impact: '20% reduction'
    }
  ];

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>
          <div>Loading your digital twin...</div>
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
          <ActionButton onClick={() => navigate('/')}>
            Calculate Carbon Footprint
          </ActionButton>
        </ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>🔮 Digital Twin Dashboard</Title>
        <Subtitle>
          Explore your carbon footprint through different scenarios and get personalized recommendations to optimize your environmental impact.
        </Subtitle>
      </Header>

      <DashboardGrid>
        <Card>
          <CardTitle>📊 Current Footprint</CardTitle>
          <MetricValue>{twinData?.current_twin?.footprint?.toFixed(2) || 'N/A'}</MetricValue>
          <MetricUnit>kg CO2e per month</MetricUnit>
          <ComparisonContainer>
            <ComparisonItem>
              <ComparisonLabel>Current</ComparisonLabel>
              <ComparisonValue>{twinData?.current_twin?.footprint?.toFixed(2) || 'N/A'}</ComparisonValue>
            </ComparisonItem>
            <ComparisonItem highlight>
              <ComparisonLabel>Optimized</ComparisonLabel>
              <ComparisonValue>{twinData?.future_twin?.footprint?.toFixed(2) || 'N/A'}</ComparisonValue>
            </ComparisonItem>
          </ComparisonContainer>
        </Card>

        <Card>
          <CardTitle>🎯 Potential Savings</CardTitle>
          <MetricValue>
            {twinData?.current_twin && twinData?.future_twin ? 
              ((twinData.current_twin.footprint - twinData.future_twin.footprint) / twinData.current_twin.footprint * 100).toFixed(1) : 0}%
          </MetricValue>
          <MetricUnit>reduction possible</MetricUnit>
          <div style={{ marginTop: '20px', fontSize: '1.1em', color: '#666' }}>
            <p>Monthly savings: {twinData?.current_twin && twinData?.future_twin ? 
              (twinData.current_twin.footprint - twinData.future_twin.footprint).toFixed(2) : 0} kg CO2e</p>
            <p>Annual savings: {twinData?.current_twin && twinData?.future_twin ? 
              ((twinData.current_twin.footprint - twinData.future_twin.footprint) * 12).toFixed(2) : 0} kg CO2e</p>
          </div>
        </Card>
      </DashboardGrid>

      <TimelineContainer>
        <CardTitle>📈 Footprint Timeline</CardTitle>
        <TimelineChart>
          {timelineData.slice(-12).map((item, index) => (
            <TimelineBar
              key={index}
              style={{ height: `${(item.footprint / Math.max(...timelineData.map(t => t.footprint))) * 100}%` }}
              data-value={`${item.footprint.toFixed(0)}`}
              title={`${new Date(item.date).toLocaleDateString()}: ${item.footprint.toFixed(2)} kg CO2e`}
            />
          ))}
        </TimelineChart>
      </TimelineContainer>

      <RecommendationsSection>
        <CardTitle>💡 Personalized Recommendations</CardTitle>
        <RecommendationsGrid>
          {recommendations.map((rec, index) => (
            <RecommendationCard key={index}>
              <RecommendationTitle>{rec.title}</RecommendationTitle>
              <RecommendationText>{rec.description}</RecommendationText>
              {rec.savings && (
                <RecommendationSavings>
                  Potential savings: {rec.savings.toFixed(1)} kg CO2e/month
                </RecommendationSavings>
              )}
              <ApplyButton
                onClick={() => handleApplyRecommendation(rec.id)}
                disabled={rec.applied}
              >
                {rec.applied ? '✓ Applied' : 'Apply Recommendation'}
              </ApplyButton>
            </RecommendationCard>
          ))}
        </RecommendationsGrid>
      </RecommendationsSection>

      <ScenarioSection>
        <CardTitle>🎭 Scenario Simulations</CardTitle>
        <ScenarioGrid>
          {scenarios.map((scenario) => (
            <ScenarioCard
              key={scenario.id}
              onClick={() => handleScenarioSimulation(scenario.id)}
            >
              <ScenarioTitle>{scenario.title}</ScenarioTitle>
              <ScenarioDescription>{scenario.description}</ScenarioDescription>
              <ScenarioImpact>Impact: {scenario.impact}</ScenarioImpact>
              {simulationResults[scenario.id] && (
                <div style={{ marginTop: '10px', padding: '10px', background: 'rgba(33, 150, 243, 0.1)', borderRadius: '8px' }}>
                  <div style={{ fontWeight: '600', color: '#1976D2' }}>
                    Simulated Result: {simulationResults[scenario.id].footprint.toFixed(2)} kg CO2e
                  </div>
                </div>
              )}
            </ScenarioCard>
          ))}
        </ScenarioGrid>
      </ScenarioSection>

      <ActionButtons>
        <ActionButton onClick={() => navigate('/')}>
          🔄 Calculate Again
        </ActionButton>
        <ActionButton className="secondary" onClick={() => navigate('/results')}>
          📊 View Results
        </ActionButton>
      </ActionButtons>
    </Container>
  );
};

export default DigitalTwinDashboard;
