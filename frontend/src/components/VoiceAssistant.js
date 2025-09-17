import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const VoiceAssistantContainer = styled.div`
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
  
  @media (max-width: 768px) {
    bottom: 20px;
    right: 20px;
  }
`;

const AssistantButton = styled.button`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  font-size: 2em;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 12px 35px rgba(76, 175, 80, 0.6);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &.listening {
    background: linear-gradient(135deg, #f44336, #d32f2f);
    animation: pulse 1.5s infinite;
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
  
  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
    font-size: 1.5em;
  }
`;

const AssistantPopup = styled.div`
  position: absolute;
  bottom: 100px;
  right: 0;
  width: 300px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.95));
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.2);
  border: 1px solid rgba(76, 175, 80, 0.3);
  backdrop-filter: blur(15px);
  transform: ${props => props.isOpen ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)'};
  opacity: ${props => props.isOpen ? 1 : 0};
  transition: all 0.3s ease;
  pointer-events: ${props => props.isOpen ? 'auto' : 'none'};
  
  @media (max-width: 768px) {
    width: 250px;
    right: -50px;
  }
`;

const AssistantHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(76, 175, 80, 0.2);
`;

const AssistantAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4CAF50, #45a049);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2em;
  font-weight: bold;
`;

const AssistantName = styled.div`
  font-weight: 600;
  color: #2E8B57;
  font-size: 1.1em;
`;

const AssistantMessage = styled.div`
  color: #555;
  line-height: 1.6;
  margin-bottom: 15px;
  font-size: 0.95em;
`;

const AssistantControls = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const ControlButton = styled.button`
  background: ${props => props.primary ? 'linear-gradient(135deg, #4CAF50, #45a049)' : 'transparent'};
  color: ${props => props.primary ? 'white' : '#4CAF50'};
  border: 2px solid #4CAF50;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9em;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.primary ? 'linear-gradient(135deg, #45a049, #4CAF50)' : '#4CAF50'};
    color: white;
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.8em;
  color: #666;
  
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.status === 'listening' ? '#f44336' : props.status === 'speaking' ? '#ff9800' : '#4CAF50'};
    animation: ${props => props.status === 'listening' ? 'pulse 1s infinite' : 'none'};
  }
`;

const VoiceAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [message, setMessage] = useState("Hi I'm your carbon footprint assistant! Click the speaker icon to hear me speak.");
  const [status, setStatus] = useState('ready');
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  useEffect(() => {
    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setStatus('listening');
        setMessage("I'm listening... Please speak now.");
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMessage(`You said: "${transcript}"`);
        handleVoiceCommand(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setMessage("Sorry, I didn't catch that. Please try again.");
        setIsListening(false);
        setStatus('ready');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        setStatus('ready');
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleVoiceCommand = (command) => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('calculate') || lowerCommand.includes('footprint')) {
      setMessage("Great! Let's calculate your carbon footprint. I'll take you to the calculator.");
      speak("Great! Let's calculate your carbon footprint. I'll take you to the calculator.");
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } else if (lowerCommand.includes('results') || lowerCommand.includes('view results')) {
      setMessage("I'll show you your carbon footprint results.");
      speak("I'll show you your carbon footprint results.");
      setTimeout(() => {
        window.location.href = '/results';
      }, 2000);
    } else if (lowerCommand.includes('digital twin') || lowerCommand.includes('twin')) {
      setMessage("Let me show you your digital twin dashboard.");
      speak("Let me show you your digital twin dashboard.");
      setTimeout(() => {
        window.location.href = '/digital-twin';
      }, 2000);
    } else if (lowerCommand.includes('help') || lowerCommand.includes('what can you do')) {
      setMessage("I can help you calculate your carbon footprint, view results, explore your digital twin, and provide recommendations. Just ask me!");
      speak("I can help you calculate your carbon footprint, view results, explore your digital twin, and provide recommendations. Just ask me!");
    } else {
      setMessage("I understand you said: '" + command + "'. I can help with carbon footprint calculations, results, and digital twin features. Try saying 'calculate footprint' or 'view results'.");
      speak("I understand you said: '" + command + "'. I can help with carbon footprint calculations, results, and digital twin features. Try saying 'calculate footprint' or 'view results'.");
    }
  };

  const speak = (text) => {
    if (synthRef.current) {
      setIsSpeaking(true);
      setStatus('speaking');
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      
      // Try to use American accent
      const voices = synthRef.current.getVoices();
      const americanVoice = voices.find(voice => 
        voice.lang.includes('en-US') && 
        (voice.name.includes('American') || voice.name.includes('US'))
      );
      
      if (americanVoice) {
        utterance.voice = americanVoice;
      }
      
      utterance.onend = () => {
        setIsSpeaking(false);
        setStatus('ready');
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
        setStatus('ready');
      };
      
      synthRef.current.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const handleSpeak = () => {
    if (!isSpeaking) {
      speak(message);
    } else {
      synthRef.current.cancel();
      setIsSpeaking(false);
      setStatus('ready');
    }
  };

  return (
    <VoiceAssistantContainer>
      <AssistantButton
        onClick={() => setIsOpen(!isOpen)}
        className={isListening ? 'listening' : ''}
        title="Carbon Footprint Assistant"
      >
        🌱
      </AssistantButton>
      
      <AssistantPopup isOpen={isOpen}>
        <AssistantHeader>
          <AssistantAvatar>🌱</AssistantAvatar>
          <AssistantName>Carbon Assistant</AssistantName>
        </AssistantHeader>
        
        <AssistantMessage>
          {message}
        </AssistantMessage>
        
        <AssistantControls>
          <ControlButton
            onClick={handleSpeak}
            disabled={isListening || isSpeaking}
            primary
          >
            {isSpeaking ? '🔇 Stop' : '🔊 Speak'}
          </ControlButton>
          
          <ControlButton
            onClick={isListening ? stopListening : startListening}
            disabled={isSpeaking}
          >
            {isListening ? '🛑 Stop' : '🎤 Listen'}
          </ControlButton>
        </AssistantControls>
        
        <StatusIndicator status={status}>
          <div className="status-dot"></div>
          {status === 'listening' ? 'Listening...' : 
           status === 'speaking' ? 'Speaking...' : 'Ready'}
        </StatusIndicator>
      </AssistantPopup>
    </VoiceAssistantContainer>
  );
};

export default VoiceAssistant;
