import React from 'react';
import styled from 'styled-components';

const ProgressContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: #e0e0e0;
  z-index: 1000;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #45a049);
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const ProgressBar = ({ progress }) => {
  return (
    <ProgressContainer>
      <ProgressBarFill progress={progress} />
    </ProgressContainer>
  );
};

export default ProgressBar;
