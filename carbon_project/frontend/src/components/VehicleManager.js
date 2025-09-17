import React from 'react';
import styled from 'styled-components';

const VehicleManagerContainer = styled.div`
  background: rgba(248, 249, 250, 0.5);
  border-radius: 12px;
  padding: 20px;
  margin: 15px 0;
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

const VehicleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
`;

const VehicleCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 15px;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    border-color: #4CAF50;
    box-shadow: 0 2px 8px rgba(76, 175, 80, 0.1);
  }
`;

const VehicleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const VehicleName = styled.h4`
  margin: 0;
  color: #2c3e50;
  font-size: 16px;
  font-weight: 600;
`;

const RemoveButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.3s ease;

  &:hover {
    background: #c82333;
    transform: scale(1.1);
  }
`;

const VehicleFields = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const AddVehicleButton = styled.button`
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 10px;

  &:hover {
    background: linear-gradient(135deg, #45a049, #4CAF50);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  }
`;

const VehicleManager = ({ vehicles, onVehiclesChange }) => {
  const addVehicle = () => {
    const newVehicle = {
      id: Date.now(),
      type: 'motorcycle',
      fuel_type: 'petrol',
      monthly_distance_km: 100,
      name: `Vehicle ${vehicles.length + 1}`
    };
    onVehiclesChange([...vehicles, newVehicle]);
  };

  const removeVehicle = (vehicleId) => {
    onVehiclesChange(vehicles.filter(vehicle => vehicle.id !== vehicleId));
  };

  const updateVehicle = (vehicleId, field, value) => {
    onVehiclesChange(vehicles.map(vehicle => 
      vehicle.id === vehicleId 
        ? { ...vehicle, [field]: value }
        : vehicle
    ));
  };

  const vehicleTypeOptions = [
    { value: 'bicycle', label: 'Bicycle' },
    { value: 'motorcycle', label: 'Motorcycle' },
    { value: 'scooter', label: 'Scooter' },
    { value: 'car_small', label: 'Small Car (Hatchback)' },
    { value: 'car_medium', label: 'Medium Car (Sedan)' },
    { value: 'car_large', label: 'Large Car (SUV)' },
    { value: 'auto_rickshaw', label: 'Auto-rickshaw' },
    { value: 'bus', label: 'Bus' },
    { value: 'train', label: 'Train' },
    { value: 'metro', label: 'Metro/Subway' },
    { value: 'taxi', label: 'Taxi/Cab' },
    { value: 'walking', label: 'Walking' },
    { value: 'none', label: 'No Vehicle' }
  ];

  const fuelTypeOptions = [
    { value: 'petrol', label: 'Petrol' },
    { value: 'diesel', label: 'Diesel' },
    { value: 'cng', label: 'CNG' },
    { value: 'lpg', label: 'LPG' },
    { value: 'electric', label: 'Electric' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'biofuel', label: 'Biofuel' },
    { value: 'hydrogen', label: 'Hydrogen' },
    { value: 'human_power', label: 'Human Power' },
    { value: 'none', label: 'Not Applicable' }
  ];

  return (
    <VehicleManagerContainer>
      <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50', fontSize: '18px' }}>
        🚗 Your Vehicles
      </h3>
      
      <VehicleList>
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id}>
            <VehicleHeader>
              <VehicleName>{vehicle.name}</VehicleName>
              <RemoveButton type="button" onClick={() => removeVehicle(vehicle.id)}>
                ×
              </RemoveButton>
            </VehicleHeader>
            
            <VehicleFields>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600', 
                  color: '#2c3e50', 
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Vehicle Name
                </label>
                <input
                  type="text"
                  value={vehicle.name}
                  onChange={(e) => updateVehicle(vehicle.id, 'name', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #e9ecef',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
              
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600', 
                  color: '#2c3e50', 
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Vehicle Type
                </label>
                <select
                  value={vehicle.type}
                  onChange={(e) => updateVehicle(vehicle.id, 'type', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #e9ecef',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    cursor: 'pointer'
                  }}
                >
                  {vehicleTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600', 
                  color: '#2c3e50', 
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Fuel Type
                </label>
                <select
                  value={vehicle.fuel_type}
                  onChange={(e) => updateVehicle(vehicle.id, 'fuel_type', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #e9ecef',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    cursor: 'pointer'
                  }}
                >
                  {fuelTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600', 
                  color: '#2c3e50', 
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Monthly Distance (km)
                </label>
                <input
                  type="number"
                  min="0"
                  max="5000"
                  value={vehicle.monthly_distance_km}
                  onChange={(e) => updateVehicle(vehicle.id, 'monthly_distance_km', parseInt(e.target.value) || 0)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #e9ecef',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            </VehicleFields>
          </VehicleCard>
        ))}
      </VehicleList>
      
      <AddVehicleButton type="button" onClick={addVehicle}>
        + Add Another Vehicle
      </AddVehicleButton>
    </VehicleManagerContainer>
  );
};

export default VehicleManager;
