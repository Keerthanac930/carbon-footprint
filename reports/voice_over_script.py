#!/usr/bin/env python3
"""
Voice-Over Script Generator for Carbon Footprint Video
Creates a compelling, emotional voice-over script with call to action
"""

import json
from datetime import datetime
from typing import Dict, List, Any

class VoiceOverScriptGenerator:
    """Generate comprehensive voice-over script for the carbon footprint video"""
    
    def __init__(self):
        self.script_data = {}
        self.timing_data = {}
        
    def create_voice_over_script(self) -> Dict[str, Any]:
        """Create the complete voice-over script with timing and emotional cues"""
        
        script = {
            "project_info": {
                "title": "From Industry to Green: A Journey of Environmental Transformation",
                "total_duration": "8 minutes 30 seconds",
                "voice_artist_notes": "Soft, energetic, and happy tone with American accent",
                "opening_greeting": "Hi, I'm your carbon footprint assistant"
            },
            
            "scenes": [
                {
                    "scene_number": 1,
                    "title": "The Industrial Reality",
                    "duration": "90 seconds",
                    "timing": {
                        "start": "0:00",
                        "end": "1:30"
                    },
                    "voice_over": {
                        "tone": "Somber, urgent, but not hopeless",
                        "pace": "Moderate with emphasis on statistics",
                        "volume": "Medium",
                        "script": [
                            {
                                "time": "0:00-0:15",
                                "text": "Our world stands at a critical crossroads. For decades, industrial progress has powered our civilization, but at what cost?",
                                "emphasis": "critical crossroads",
                                "pause_after": 2
                            },
                            {
                                "time": "0:17-0:35",
                                "text": "Every second, one thousand tons of carbon dioxide enters our atmosphere. Thirty-six point eight billion tons annually. The numbers are staggering.",
                                "emphasis": "one thousand tons",
                                "pause_after": 3
                            },
                            {
                                "time": "0:38-0:55",
                                "text": "Smokestacks belch dark clouds into once-clear skies. Cities choke under the weight of our own progress. Seven million lives lost each year to air pollution.",
                                "emphasis": "seven million lives",
                                "pause_after": 2
                            },
                            {
                                "time": "0:57-1:15",
                                "text": "The harsh reality: our industrial achievements have come at a devastating cost to the very planet that sustains us. But what if I told you that technology itself could be the solution?",
                                "emphasis": "technology itself could be the solution",
                                "pause_after": 3
                            },
                            {
                                "time": "1:18-1:30",
                                "text": "What if the same innovation that created these challenges could help us overcome them?",
                                "emphasis": "overcome them",
                                "pause_after": 2
                            }
                        ]
                    },
                    "background_music": "Somber, industrial ambient with subtle hope undertones",
                    "sound_effects": ["Industrial machinery", "Distant traffic", "Wind through smokestacks"]
                },
                
                {
                    "scene_number": 2,
                    "title": "The Awakening",
                    "duration": "60 seconds",
                    "timing": {
                        "start": "1:30",
                        "end": "2:30"
                    },
                    "voice_over": {
                        "tone": "Building hope, determined",
                        "pace": "Slightly faster, more energetic",
                        "volume": "Medium",
                        "script": [
                            {
                                "time": "1:30-1:45",
                                "text": "In the darkness, a light begins to shine. Scientists and engineers around the world are working tirelessly, not to create more problems, but to solve them.",
                                "emphasis": "light begins to shine",
                                "pause_after": 2
                            },
                            {
                                "time": "1:47-2:05",
                                "text": "Data flows through networks, revealing hidden patterns. Machine learning algorithms process millions of data points, finding solutions we never knew existed.",
                                "emphasis": "solutions we never knew existed",
                                "pause_after": 2
                            },
                            {
                                "time": "2:07-2:25",
                                "text": "The birth of intelligent environmental monitoring. Technology becoming our ally in the fight for sustainability. Enter the Carbon Footprint Calculator.",
                                "emphasis": "our ally in the fight",
                                "pause_after": 2
                            }
                        ]
                    },
                    "background_music": "Building, hopeful orchestral with electronic elements",
                    "sound_effects": ["Data processing sounds", "Gentle keyboard typing", "Soft electronic beeps"]
                },
                
                {
                    "scene_number": 3,
                    "title": "The Solution Emerges",
                    "duration": "120 seconds",
                    "timing": {
                        "start": "2:30",
                        "end": "4:30"
                    },
                    "voice_over": {
                        "tone": "Excited, confident, proud",
                        "pace": "Energetic and clear",
                        "volume": "Medium-high",
                        "script": [
                            {
                                "time": "2:30-2:45",
                                "text": "Meet the future of environmental consciousness. A sleek, intuitive interface that puts the power of change directly in your hands.",
                                "emphasis": "power of change directly in your hands",
                                "pause_after": 2
                            },
                            {
                                "time": "2:47-3:05",
                                "text": "Six comprehensive categories capture every aspect of your lifestyle. From the energy that powers your home to the food on your table, from how you travel to how you live.",
                                "emphasis": "every aspect of your lifestyle",
                                "pause_after": 2
                            },
                            {
                                "time": "3:07-3:25",
                                "text": "Advanced machine learning processes your data in real-time. Eighty-five percent accuracy. Sub-two-second response time. Fifty-plus input features analyzed automatically.",
                                "emphasis": "eighty-five percent accuracy",
                                "pause_after": 2
                            },
                            {
                                "time": "3:27-3:45",
                                "text": "Watch as your personal carbon footprint appears before your eyes. Interactive charts break down your impact across transportation, energy, waste, and lifestyle choices.",
                                "emphasis": "appears before your eyes",
                                "pause_after": 2
                            },
                            {
                                "time": "3:47-4:05",
                                "text": "But here's where the magic happens. Personalized recommendations tailored specifically to you. Not generic advice, but actionable steps designed for your unique situation.",
                                "emphasis": "magic happens",
                                "pause_after": 2
                            },
                            {
                                "time": "4:07-4:25",
                                "text": "Every calculation is a step toward a greener future. Every recommendation is a pathway to change. Every user is a champion for our planet.",
                                "emphasis": "champion for our planet",
                                "pause_after": 2
                            }
                        ]
                    },
                    "background_music": "Uplifting, technological electronic with inspiring melodies",
                    "sound_effects": ["Interface sounds", "Data processing", "Success chimes"]
                },
                
                {
                    "scene_number": 4,
                    "title": "The Transformation",
                    "duration": "90 seconds",
                    "timing": {
                        "start": "4:30",
                        "end": "6:00"
                    },
                    "voice_over": {
                        "tone": "Triumphant, inspiring, emotional",
                        "pace": "Building excitement",
                        "volume": "High",
                        "script": [
                            {
                                "time": "4:30-4:45",
                                "text": "Watch as awareness transforms into action. Sarah reduced her carbon footprint by forty percent in just six months. The Johnson family saved twenty-four hundred dollars annually on energy bills.",
                                "emphasis": "forty percent in just six months",
                                "pause_after": 2
                            },
                            {
                                "time": "4:47-5:05",
                                "text": "TechCorp reduced office emissions by sixty percent using our recommendations. The Green City initiative achieved twenty-five percent emission reduction city-wide. Real people, real results, real change.",
                                "emphasis": "real people, real results, real change",
                                "pause_after": 2
                            },
                            {
                                "time": "5:07-5:25",
                                "text": "One million tons of CO2 prevented annually. Five hundred thousand trees saved through reduced paper usage. Two million gallons of water conserved. Ten thousand homes powered by renewable energy.",
                                "emphasis": "one million tons of CO2 prevented",
                                "pause_after": 2
                            },
                            {
                                "time": "5:27-5:45",
                                "text": "The transformation is visible everywhere. Clean air fills once-polluted lungs. Children play in restored green spaces. Wildlife thrives in habitats we thought were lost forever.",
                                "emphasis": "children play in restored green spaces",
                                "pause_after": 2
                            },
                            {
                                "time": "5:47-6:00",
                                "text": "From industry to green, from problem to solution, from despair to hope. The future is not just possible—it's happening right now.",
                                "emphasis": "happening right now",
                                "pause_after": 2
                            }
                        ]
                    },
                    "background_music": "Triumphant orchestral with environmental sounds",
                    "sound_effects": ["Nature sounds", "Children laughing", "Birds singing", "Wind through trees"]
                },
                
                {
                    "scene_number": 5,
                    "title": "The Ripple Effect",
                    "duration": "60 seconds",
                    "timing": {
                        "start": "6:00",
                        "end": "7:00"
                    },
                    "voice_over": {
                        "tone": "Inspiring, global, connected",
                        "pace": "Steady and expansive",
                        "volume": "Medium-high",
                        "script": [
                            {
                                "time": "6:00-6:15",
                                "text": "One person's action creates a ripple that becomes a wave. Individual choices multiplying across communities, cities implementing carbon reduction policies, nations committing to net-zero emissions.",
                                "emphasis": "ripple that becomes a wave",
                                "pause_after": 2
                            },
                            {
                                "time": "6:17-6:35",
                                "text": "One hundred countries using carbon footprint technology. One billion people with access to environmental tools. Fifty percent reduction in global carbon emissions by twenty-thirty. Net-zero emissions achieved by twenty-fifty.",
                                "emphasis": "one billion people with access",
                                "pause_after": 2
                            },
                            {
                                "time": "6:37-6:55",
                                "text": "Clean energy powering every home. Electric vehicles dominating transportation. A circular economy eliminating waste. Nature and technology in perfect harmony.",
                                "emphasis": "perfect harmony",
                                "pause_after": 2
                            }
                        ]
                    },
                    "background_music": "Inspiring global world music with orchestral elements",
                    "sound_effects": ["Global crowd sounds", "Diverse languages", "International music instruments"]
                },
                
                {
                    "scene_number": 6,
                    "title": "The Call to Action",
                    "duration": "90 seconds",
                    "timing": {
                        "start": "7:00",
                        "end": "8:30"
                    },
                    "voice_over": {
                        "tone": "Urgent, empowering, hopeful",
                        "pace": "Building to climax",
                        "volume": "High",
                        "script": [
                            {
                                "time": "7:00-7:15",
                                "text": "The future is in your hands. Every individual has the power to make a difference. Technology provides the tools, but action requires you. Join millions who are already making a change.",
                                "emphasis": "power to make a difference",
                                "pause_after": 2
                            },
                            {
                                "time": "7:17-7:35",
                                "text": "Calculate your carbon footprint today. Share your results with friends and family. Implement the personalized recommendations. Track your progress over time. Become an environmental champion.",
                                "emphasis": "become an environmental champion",
                                "pause_after": 2
                            },
                            {
                                "time": "7:37-7:55",
                                "text": "Visit our website. Download the mobile app. Start your environmental journey. Make every day Earth Day. The transformation starts with you.",
                                "emphasis": "starts with you",
                                "pause_after": 2
                            },
                            {
                                "time": "7:57-8:15",
                                "text": "From industry to green, from problem to solution, from today to tomorrow. Together, we can transform our world. The time for action is now.",
                                "emphasis": "time for action is now",
                                "pause_after": 2
                            },
                            {
                                "time": "8:17-8:30",
                                "text": "Hi, I'm your carbon footprint assistant, and I believe in a greener future. Will you join me?",
                                "emphasis": "will you join me",
                                "pause_after": 3
                            }
                        ]
                    },
                    "background_music": "Motivational, energetic pop with inspiring crescendo",
                    "sound_effects": ["Applause", "Success sounds", "Motivational beats"]
                }
            ],
            
            "voice_artist_instructions": {
                "overall_tone": "Soft, energetic, and happy with American accent",
                "opening_greeting": "Always start with 'Hi, I'm your carbon footprint assistant'",
                "speaking_style": "Conversational yet authoritative, inspiring but not preachy",
                "pacing_notes": "Vary pace based on content - slower for statistics, faster for action items",
                "emphasis_guidelines": "Use emphasis on key phrases and statistics, pause after important points",
                "emotional_range": "Somber → Hopeful → Excited → Triumphant → Inspiring → Urgent",
                "pronunciation_notes": {
                    "CO2": "C-O-2",
                    "percent": "per-cent",
                    "billion": "bil-lion",
                    "million": "mil-lion"
                }
            },
            
            "technical_requirements": {
                "audio_format": "WAV, 48kHz, 16-bit",
                "recording_environment": "Professional studio with minimal background noise",
                "microphone": "High-quality condenser microphone",
                "processing": "Light compression and EQ, no heavy effects",
                "delivery": "Separate audio files for each scene, plus full mix"
            },
            
            "music_and_sound_notes": {
                "music_style": "Environmental, technological, inspiring",
                "volume_levels": "Music at -12dB, voice at -6dB",
                "fade_requirements": "Fade in/out between scenes, no abrupt cuts",
                "sound_effects": "Subtle, supportive, not distracting from voice",
                "final_mix": "Professional mastering for broadcast quality"
            }
        }
        
        return script
    
    def create_timing_breakdown(self) -> Dict[str, Any]:
        """Create detailed timing breakdown for production"""
        
        timing = {
            "total_duration": "8:30",
            "scene_breakdown": [
                {"scene": 1, "duration": "1:30", "cumulative": "1:30"},
                {"scene": 2, "duration": "1:00", "cumulative": "2:30"},
                {"scene": 3, "duration": "2:00", "cumulative": "4:30"},
                {"scene": 4, "duration": "1:30", "cumulative": "6:00"},
                {"scene": 5, "duration": "1:00", "cumulative": "7:00"},
                {"scene": 6, "duration": "1:30", "cumulative": "8:30"}
            ],
            "recording_schedule": {
                "day_1": "Scenes 1-3 (Industrial to Solution)",
                "day_2": "Scenes 4-6 (Transformation to Call to Action)",
                "pickup_sessions": "Any retakes or adjustments needed"
            },
            "rehearsal_notes": [
                "Practice emotional transitions between scenes",
                "Work on emphasis and pacing variations",
                "Ensure consistent American accent throughout",
                "Practice the opening greeting multiple times"
            ]
        }
        
        return timing
    
    def generate_voice_over_assets(self) -> None:
        """Generate all voice-over related assets"""
        
        print("Creating Voice-Over Script and Assets...")
        
        # Create main script
        script = self.create_voice_over_script()
        with open("voice_over_script.json", "w", encoding="utf-8") as f:
            json.dump(script, f, indent=2, ensure_ascii=False)
        
        # Create timing breakdown
        timing = self.create_timing_breakdown()
        with open("voice_over_timing.json", "w", encoding="utf-8") as f:
            json.dump(timing, f, indent=2, ensure_ascii=False)
        
        # Create plain text script for easy reading
        self.create_plain_text_script(script)
        
        print("Voice-over assets created successfully!")
        print("Generated files:")
        print("  - voice_over_script.json")
        print("  - voice_over_timing.json")
        print("  - voice_over_script.txt")
    
    def create_plain_text_script(self, script: Dict[str, Any]) -> None:
        """Create a plain text version of the script for easy reading"""
        
        with open("voice_over_script.txt", "w", encoding="utf-8") as f:
            f.write(f"VOICE-OVER SCRIPT: {script['project_info']['title']}\n")
            f.write("=" * 60 + "\n\n")
            f.write(f"Total Duration: {script['project_info']['total_duration']}\n")
            f.write(f"Voice Artist Notes: {script['project_info']['voice_artist_notes']}\n")
            f.write(f"Opening Greeting: {script['project_info']['opening_greeting']}\n\n")
            
            for scene in script['scenes']:
                f.write(f"\nSCENE {scene['scene_number']}: {scene['title']}\n")
                f.write("-" * 40 + "\n")
                f.write(f"Duration: {scene['duration']}\n")
                f.write(f"Tone: {scene['voice_over']['tone']}\n")
                f.write(f"Pace: {scene['voice_over']['pace']}\n\n")
                
                for segment in scene['voice_over']['script']:
                    f.write(f"[{segment['time']}] {segment['text']}\n")
                    if 'emphasis' in segment:
                        f.write(f"    Emphasis: {segment['emphasis']}\n")
                    f.write("\n")
                
                f.write(f"Background Music: {scene['background_music']}\n")
                f.write(f"Sound Effects: {', '.join(scene['sound_effects'])}\n\n")
            
            f.write("\nVOICE ARTIST INSTRUCTIONS\n")
            f.write("=" * 30 + "\n")
            for key, value in script['voice_artist_instructions'].items():
                if isinstance(value, dict):
                    f.write(f"{key.replace('_', ' ').title()}:\n")
                    for sub_key, sub_value in value.items():
                        f.write(f"  {sub_key}: {sub_value}\n")
                else:
                    f.write(f"{key.replace('_', ' ').title()}: {value}\n")

def main():
    """Main function to generate voice-over assets"""
    print("Carbon Footprint Video - Voice-Over Script Generator")
    print("=" * 60)
    
    generator = VoiceOverScriptGenerator()
    generator.generate_voice_over_assets()
    
    print("\nVoice-Over Script Ready!")
    print("Open 'voice_over_script.txt' for easy reading")
    print("Use JSON files for production planning")
    print("Your environmental story awaits its voice!")

if __name__ == "__main__":
    main()
