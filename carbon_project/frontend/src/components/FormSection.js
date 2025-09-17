import React from 'react';
import styled, { keyframes } from 'styled-components';
import FormField from './FormField';
import VehicleManager from './VehicleManager';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const SectionContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 30px;
  margin: 0;
  border-radius: 24px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.2);
  position: relative;
  overflow-y: auto;
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  max-width: 600px;
  height: 100%;
  max-height: 480px;
  display: flex;
  flex-direction: column;
  animation: ${fadeInUp} 0.8s ease-out;
  animation-delay: ${props => props.animationDelay}s;
  animation-fill-mode: both;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #4CAF50, #45a049, #2E8B57);
    border-radius: 24px 24px 0 0;
    opacity: 1;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 20px 50px rgba(0,0,0,0.3);
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(76, 175, 80, 0.3);
  }

  @media (max-width: 1000px) {
    max-height: 430px;
    padding: 25px;
    max-width: 500px;
  }

  @media (max-width: 768px) {
    max-height: 380px;
    padding: 20px;
    border-radius: 20px;
    max-width: 100%;
  }
`;

const SectionHeader = styled.h2`
  color: white;
  margin-bottom: 18px;
  font-size: 1.2em;
  display: flex;
  align-items: center;
  gap: 10px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
  padding-top: 0;
  font-weight: 700;
  border-bottom: 2px solid #f8f9fa;
  padding-bottom: 12px;
  position: relative;
  text-transform: capitalize;
  letter-spacing: -0.2px;

  &::before {
    content: '';
    width: 4px;
    height: 22px;
    background: linear-gradient(135deg, #4CAF50, #45a049, #2E8B57);
    border-radius: 3px;
    margin-right: 6px;
    box-shadow: 0 2px 6px rgba(76, 175, 80, 0.3);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 40px;
    height: 2px;
    background: linear-gradient(90deg, #4CAF50, #45a049);
    border-radius: 1px;
  }

  @media (max-width: 768px) {
    font-size: 1.1em;
    margin-bottom: 15px;
    gap: 8px;
  }
`;

const FieldsContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding-top: 5px;

  @media (max-width: 768px) {
    gap: 15px;
  }
`;

const FormSection = ({ title, icon, fields, formData, onInputChange, animationDelay, customComponent, fieldErrors = {} }) => {
  return (
    <SectionContainer animationDelay={animationDelay}>
      <SectionHeader>
        {icon} {title}
      </SectionHeader>
      <FieldsContainer>
        {fields.map((field) => (
          <FormField
            key={field.name}
            field={field}
            value={formData[field.name]}
            onChange={(value) => onInputChange(field.name, value)}
            error={fieldErrors[field.name]}
          />
        ))}
        {customComponent === 'VehicleManager' && (
          <VehicleManager
            vehicles={formData.vehicles || []}
            onVehiclesChange={(vehicles) => onInputChange('vehicles', vehicles)}
          />
        )}
      </FieldsContainer>
    </SectionContainer>
  );
};

export default FormSection;
