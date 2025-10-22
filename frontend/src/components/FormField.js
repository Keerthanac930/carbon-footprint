import React from 'react';
import styled from 'styled-components';

const FieldContainer = styled.div`
  margin-bottom: 15px;
  position: relative;
  min-height: 60px;
  background: ${props => props.error ? 'rgba(255, 235, 238, 0.8)' : 'rgba(255, 255, 255, 0.9)'};
  border-radius: 10px;
  padding: 15px;
  border: 1px solid ${props => props.error ? 'rgba(244, 67, 54, 0.5)' : 'rgba(255, 255, 255, 0.3)'};
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: ${props => props.error ? 'rgba(255, 235, 238, 0.9)' : 'rgba(255, 255, 255, 0.95)'};
    border-color: ${props => props.error ? 'rgba(244, 67, 54, 0.6)' : 'rgba(76, 175, 80, 0.4)'};
    transform: translateY(-1px);
  }

  &:focus-within {
    background: ${props => props.error ? 'rgba(255, 235, 238, 0.95)' : 'rgba(255, 255, 255, 0.98)'};
    border-color: ${props => props.error ? 'rgba(244, 67, 54, 0.7)' : 'rgba(76, 175, 80, 0.5)'};
    box-shadow: 0 3px 15px ${props => props.error ? 'rgba(244, 67, 54, 0.2)' : 'rgba(76, 175, 80, 0.2)'};
  }

  @media (max-width: 768px) {
    margin-bottom: 12px;
    min-height: 55px;
    padding: 12px;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 700;
  color: #2c3e50;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  line-height: 1.3;
  position: relative;
  text-shadow: 0 1px 2px rgba(255,255,255,0.8);
  
  &::after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 0;
    width: 25px;
    height: 2px;
    background: linear-gradient(90deg, #4CAF50, #45a049);
    border-radius: 1px;
  }

  @media (max-width: 768px) {
    font-size: 11px;
    margin-bottom: 6px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  border: 2px solid ${props => props.error ? '#f44336' : '#e9ecef'};
  border-radius: 10px;
  box-sizing: border-box;
  font-size: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: ${props => props.error ? '#ffebee' : 'white'};
  font-family: inherit;
  font-weight: 500;
  color: #2c3e50;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);

  &:focus {
    outline: none;
    border-color: ${props => props.error ? '#f44336' : '#4CAF50'};
    box-shadow: 0 0 0 3px ${props => props.error ? 'rgba(244, 67, 54, 0.15)' : 'rgba(76, 175, 80, 0.15)'}, 0 3px 15px ${props => props.error ? 'rgba(244, 67, 54, 0.1)' : 'rgba(76, 175, 80, 0.1)'};
    transform: translateY(-1px);
    background: ${props => props.error ? '#ffebee' : '#fafafa'};
  }

  &:hover {
    border-color: ${props => props.error ? '#f44336' : '#4CAF50'};
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  &::placeholder {
    color: #adb5bd;
    font-weight: 400;
  }

  @media (max-width: 768px) {
    padding: 10px 12px;
    font-size: 13px;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 15px;
  border: 2px solid ${props => props.error ? '#f44336' : '#e9ecef'};
  border-radius: 10px;
  box-sizing: border-box;
  font-size: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: ${props => props.error ? '#ffebee' : 'white'};
  font-family: inherit;
  cursor: pointer;
  font-weight: 500;
  color: #2c3e50;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234CAF50' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 14px;
  padding-right: 40px;

  &:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.15), 0 3px 15px rgba(76, 175, 80, 0.1);
    transform: translateY(-1px);
    background-color: #fafafa;
  }

  &:hover {
    border-color: #4CAF50;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  option {
    padding: 8px;
    font-weight: 500;
  }

  @media (max-width: 768px) {
    padding: 10px 12px;
    font-size: 13px;
    padding-right: 35px;
  }
`;

const SliderContainer = styled.div`
  position: relative;
  margin: 10px 0 20px 0;
  padding: 15px 12px;
  background: rgba(76, 175, 80, 0.05);
  border-radius: 10px;
  border: 1px solid rgba(76, 175, 80, 0.1);
  z-index: 5;

  @media (max-width: 768px) {
    margin: 8px 0 15px 0;
    padding: 12px 10px;
  }
`;

const Slider = styled.input`
  -webkit-appearance: none;
  width: 100%;
  height: 12px;
  border-radius: 8px;
  background: linear-gradient(90deg, #E8F5E8, #C8E6C9, #A5D6A7);
  outline: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
  cursor: pointer;
  position: relative;
  z-index: 10;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2E8B57, #3CB371, #4CAF50);
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(46, 139, 87, 0.4), 0 0 0 3px rgba(255, 255, 255, 0.8);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 3px solid white;
    position: relative;
    z-index: 15;

    &:hover {
      transform: scale(1.2);
      box-shadow: 0 6px 20px rgba(46, 139, 87, 0.6), 0 0 0 4px rgba(255, 255, 255, 0.9);
    }
    
    &:active {
      transform: scale(1.1);
    }
  }

  &::-moz-range-thumb {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2E8B57, #3CB371, #4CAF50);
    cursor: pointer;
    border: 3px solid white;
    box-shadow: 0 4px 12px rgba(46, 139, 87, 0.4);
    transition: all 0.3s ease;
    position: relative;
    z-index: 15;
  }
  
  &::-moz-range-track {
    height: 12px;
    border-radius: 8px;
    background: linear-gradient(90deg, #E8F5E8, #C8E6C9, #A5D6A7);
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
  }
`;

const SliderValue = styled.div`
  position: absolute;
  top: -40px;
  right: 0;
  background: linear-gradient(135deg, #2E8B57, #3CB371, #4CAF50);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  z-index: 15;
  white-space: nowrap;
  box-shadow: 0 4px 15px rgba(46, 139, 87, 0.4);
  border: 3px solid rgba(255,255,255,0.9);
  min-width: 70px;
  text-align: center;
  letter-spacing: 0.5px;
  animation: pulse 3s infinite;

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.08); }
    100% { transform: scale(1); }
  }
`;

const Tooltip = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
  pointer-events: none;

  .tooltiptext {
    visibility: hidden;
    width: 200px;
    background-color: #333;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 8px;
    position: absolute;
    z-index: 20;
    bottom: 125%;
    left: 50%;
    margin-left: -100px;
    opacity: 0;
    transition: opacity 0.3s;
    font-size: 12px;
    white-space: nowrap;
  }

  &:hover .tooltiptext {
    visibility: visible;
    opacity: 1;
  }
`;

const ErrorMessage = styled.div`
  color: #f44336;
  font-size: 11px;
  font-weight: 600;
  margin-top: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FormField = ({ field, value, onChange, error }) => {
  const handleSliderChange = (e) => {
    const newValue = parseInt(e.target.value);
    console.log('Slider changed:', field.name, 'new value:', newValue);
    onChange(newValue);
  };


  const formatSliderValue = (value, unit) => {
    if (unit === 'people') return `${value} people`;
    if (unit === 'sq ft') return `${value.toLocaleString()} sq ft`;
    if (unit === 'kWh') return `${value} kWh`;
    if (unit === 'km') return `${value} km`;
    return value;
  };

  if (field.type === 'slider') {
    return (
      <FieldContainer error={!!error} style={{ marginBottom: '60px', minHeight: '120px' }}>
        <Label>{field.label}</Label>
        <Tooltip>
          <SliderContainer>
            <Slider
              type="range"
              min={field.min}
              max={field.max}
              value={value}
              onChange={handleSliderChange}
              style={{ pointerEvents: 'auto' }}
            />
            <SliderValue>
              {formatSliderValue(value, field.unit)}
            </SliderValue>
          </SliderContainer>
          {field.tooltip && (
            <span className="tooltiptext">{field.tooltip}</span>
          )}
        </Tooltip>
        {error && <ErrorMessage>⚠️ {error}</ErrorMessage>}
      </FieldContainer>
    );
  }

  if (field.type === 'select') {
    return (
      <FieldContainer error={!!error}>
        <Label>{field.label}</Label>
        <Select error={!!error} value={value} onChange={(e) => onChange(e.target.value)}>
          {field.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        {error && <ErrorMessage>⚠️ {error}</ErrorMessage>}
      </FieldContainer>
    );
  }

  return (
    <FieldContainer error={!!error}>
      <Label>{field.label}</Label>
      <Input
        error={!!error}
        type={field.type}
        min={field.min}
        max={field.max}
        step={field.step}
        value={value || ''}
        onChange={(e) => {
          const inputValue = e.target.value;
          if (field.type === 'number') {
            // For number fields, convert to number or empty string
            const numValue = inputValue === '' ? '' : parseFloat(inputValue);
            onChange(isNaN(numValue) ? '' : numValue);
          } else {
            onChange(inputValue);
          }
        }}
        required
      />
      {error && <ErrorMessage>⚠️ {error}</ErrorMessage>}
    </FieldContainer>
  );
};

export default FormField;
