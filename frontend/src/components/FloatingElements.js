import React from 'react';
import styled from 'styled-components';

const FloatingContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
`;

const FloatingLeaf = styled.div`
  position: absolute;
  color: rgba(46, 139, 87, 0.3);
  font-size: 20px;
  animation: float 6s ease-in-out infinite;
  
  &:nth-child(1) { 
    top: 10%; 
    left: 10%; 
    animation-delay: 0s; 
  }
  &:nth-child(2) { 
    top: 20%; 
    left: 80%; 
    animation-delay: 2s; 
  }
  &:nth-child(3) { 
    top: 60%; 
    left: 15%; 
    animation-delay: 4s; 
  }
  &:nth-child(4) { 
    top: 80%; 
    left: 70%; 
    animation-delay: 1s; 
  }
  &:nth-child(5) { 
    top: 40%; 
    left: 90%; 
    animation-delay: 3s; 
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }
`;

const FloatingElements = () => {
  return (
    <FloatingContainer>
      <FloatingLeaf>🌱</FloatingLeaf>
      <FloatingLeaf>🍃</FloatingLeaf>
      <FloatingLeaf>🌿</FloatingLeaf>
      <FloatingLeaf>🌱</FloatingLeaf>
      <FloatingLeaf>🍃</FloatingLeaf>
    </FloatingContainer>
  );
};

export default FloatingElements;
