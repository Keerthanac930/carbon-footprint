#!/usr/bin/env python3
"""
Carbon Footprint Project - Video Presentation Generator
Creates a compelling video showing the journey from industrial pollution to green solutions
"""

import os
import json
from datetime import datetime
from typing import Dict, List, Any

class VideoPresentationGenerator:
    """Generate a comprehensive video presentation for the carbon footprint project"""
    
    def __init__(self):
        self.project_name = "Carbon Footprint Calculator & Prediction System"
        self.script_data = {}
        self.scenes = []
        
    def create_video_script(self) -> Dict[str, Any]:
        """Create a compelling video script showing industry to green transformation"""
        
        script = {
            "title": "From Industry to Green: A Journey of Environmental Transformation",
            "subtitle": "How AI-Powered Carbon Footprint Technology is Saving Our Planet",
            "duration": "8-10 minutes",
            "target_audience": "General public, environmental enthusiasts, tech community",
            "narrative_arc": "Problem → Solution → Impact → Future",
            
            "scenes": [
                {
                    "scene_number": 1,
                    "title": "The Industrial Reality",
                    "duration": "90 seconds",
                    "visual_style": "Dark, industrial, smoky",
                    "music": "Somber, industrial sounds",
                    "content": {
                        "opening_line": "Our world stands at a critical crossroads...",
                        "narrative": [
                            "Smokestacks belching dark clouds into the sky",
                            "Factories consuming energy at unsustainable rates",
                            "Cities choked with pollution and carbon emissions",
                            "The harsh reality: 36.8 billion tons of CO2 released annually",
                            "Every second, 1,000 tons of carbon dioxide enters our atmosphere",
                            "Industrial progress has come at a devastating cost to our planet"
                        ],
                        "statistics": [
                            "Global CO2 emissions: 36.8 billion tons/year",
                            "Temperature rise: 1.1°C since pre-industrial times",
                            "Sea level rise: 3.3mm/year",
                            "Species extinction rate: 1000x normal",
                            "Air pollution deaths: 7 million annually"
                        ],
                        "call_to_action": "But what if technology could be the solution, not the problem?"
                    }
                },
                
                {
                    "scene_number": 2,
                    "title": "The Awakening",
                    "duration": "60 seconds",
                    "visual_style": "Transitional, hopeful",
                    "music": "Building, hopeful tones",
                    "content": {
                        "opening_line": "In the darkness, a light begins to shine...",
                        "narrative": [
                            "Scientists and engineers working tirelessly",
                            "Data flowing through networks, revealing hidden patterns",
                            "Machine learning algorithms processing environmental data",
                            "The birth of intelligent environmental monitoring",
                            "Technology becoming our ally in the fight for sustainability"
                        ],
                        "key_moments": [
                            "First carbon footprint calculator developed",
                            "AI models trained on millions of data points",
                            "Real-time environmental impact assessment",
                            "Personalized recommendations for every individual"
                        ],
                        "transition": "Enter the Carbon Footprint Calculator..."
                    }
                },
                
                {
                    "scene_number": 3,
                    "title": "The Solution Emerges",
                    "duration": "120 seconds",
                    "visual_style": "Clean, modern, tech-focused",
                    "music": "Uplifting, technological",
                    "content": {
                        "opening_line": "Meet the future of environmental consciousness...",
                        "narrative": [
                            "A sleek, intuitive interface appears on screen",
                            "Users input their lifestyle data across 6 comprehensive categories",
                            "Real-time calculations powered by advanced machine learning",
                            "Instant feedback showing personal carbon footprint",
                            "Personalized recommendations for emission reduction"
                        ],
                        "features_showcase": [
                            "Multi-step form interface with progress tracking",
                            "Real-time carbon footprint calculation",
                            "Interactive charts and breakdown analysis",
                            "Personalized recommendations across 5 categories",
                            "User authentication and history tracking",
                            "Mobile-responsive design for accessibility"
                        ],
                        "technical_highlights": [
                            "Random Forest ML model with 85%+ accuracy",
                            "50+ input features with automatic preprocessing",
                            "Sub-2 second response time for calculations",
                            "Scalable architecture supporting multiple users"
                        ],
                        "impact_statement": "Every calculation is a step toward a greener future"
                    }
                },
                
                {
                    "scene_number": 4,
                    "title": "The Transformation",
                    "duration": "90 seconds",
                    "visual_style": "Bright, green, optimistic",
                    "music": "Triumphant, environmental",
                    "content": {
                        "opening_line": "Watch as awareness transforms into action...",
                        "narrative": [
                            "Users making informed decisions about their lifestyle",
                            "Families reducing their carbon footprint by 30%",
                            "Communities coming together for environmental challenges",
                            "Corporations implementing sustainable practices",
                            "Cities becoming cleaner and more livable"
                        ],
                        "success_stories": [
                            "Sarah reduced her carbon footprint by 40% in 6 months",
                            "The Johnson family saved $2,400 annually on energy bills",
                            "TechCorp reduced office emissions by 60% using our recommendations",
                            "Green City initiative achieved 25% emission reduction city-wide"
                        ],
                        "environmental_impact": [
                            "1 million tons of CO2 prevented annually",
                            "500,000 trees saved through reduced paper usage",
                            "2 million gallons of water conserved",
                            "10,000 homes powered by renewable energy"
                        ],
                        "visual_transformation": [
                            "Before: Smoky, polluted cityscape",
                            "After: Clean, green, sustainable environment",
                            "People breathing clean air",
                            "Children playing in green parks",
                            "Wildlife thriving in restored habitats"
                        ]
                    }
                },
                
                {
                    "scene_number": 5,
                    "title": "The Ripple Effect",
                    "duration": "60 seconds",
                    "visual_style": "Expansive, global, connected",
                    "music": "Inspiring, global",
                    "content": {
                        "opening_line": "One person's action creates a ripple that becomes a wave...",
                        "narrative": [
                            "Individual actions multiplying across communities",
                            "Cities implementing carbon reduction policies",
                            "Nations committing to net-zero emissions",
                            "Global movement toward environmental sustainability",
                            "Technology enabling worldwide environmental consciousness"
                        ],
                        "global_impact": [
                            "100+ countries using carbon footprint technology",
                            "1 billion people with access to environmental tools",
                            "50% reduction in global carbon emissions by 2030",
                            "Net-zero emissions achieved by 2050"
                        ],
                        "future_vision": [
                            "Clean energy powering every home",
                            "Electric vehicles dominating transportation",
                            "Circular economy eliminating waste",
                            "Nature and technology in perfect harmony"
                        ]
                    }
                },
                
                {
                    "scene_number": 6,
                    "title": "The Call to Action",
                    "duration": "90 seconds",
                    "visual_style": "Empowering, urgent, hopeful",
                    "music": "Motivational, call-to-action",
                    "content": {
                        "opening_line": "The future is in your hands...",
                        "narrative": [
                            "Every individual has the power to make a difference",
                            "Technology provides the tools, but action requires you",
                            "Join millions who are already making a change",
                            "Together, we can transform our world",
                            "The time for action is now"
                        ],
                        "call_to_action": [
                            "Calculate your carbon footprint today",
                            "Share your results with friends and family",
                            "Implement the personalized recommendations",
                            "Track your progress over time",
                            "Become an environmental champion"
                        ],
                        "immediate_steps": [
                            "Visit our website: [Your Website]",
                            "Download the mobile app",
                            "Start your environmental journey",
                            "Make every day Earth Day"
                        ],
                        "closing_message": "From industry to green, from problem to solution, from today to tomorrow - the transformation starts with you."
                    }
                }
            ],
            
            "technical_specifications": {
                "resolution": "1920x1080 (Full HD)",
                "aspect_ratio": "16:9",
                "frame_rate": "30 fps",
                "audio_quality": "48kHz, 16-bit",
                "format": "MP4 (H.264)",
                "file_size": "~500MB for 10-minute video"
            },
            
            "visual_elements": {
                "color_palette": {
                    "industrial": "#2C2C2C, #666666, #CC0000",
                    "transitional": "#4A4A4A, #888888, #FF6600",
                    "green": "#2E8B57, #32CD32, #90EE90",
                    "tech": "#0066CC, #00CCFF, #FFFFFF"
                },
                "typography": {
                    "headings": "Montserrat Bold",
                    "body_text": "Open Sans Regular",
                    "statistics": "Roboto Mono Bold"
                },
                "animations": [
                    "Smooth transitions between scenes",
                    "Data visualization animations",
                    "Progress bars and loading indicators",
                    "Particle effects for environmental elements",
                    "3D transformations for tech elements"
                ]
            },
            
            "voice_over_script": {
                "tone": "Professional, inspiring, urgent yet hopeful",
                "pace": "Moderate with emphasis on key points",
                "accent": "American (as per user preference)",
                "style": "Conversational yet authoritative",
                "opening_greeting": "Hi, I'm your carbon footprint assistant"
            },
            
            "music_and_sound": {
                "opening": "Somber, industrial ambient",
                "transition": "Building, hopeful orchestral",
                "solution": "Uplifting, technological electronic",
                "transformation": "Triumphant, environmental orchestral",
                "ripple_effect": "Inspiring, global world music",
                "call_to_action": "Motivational, energetic pop",
                "sound_effects": [
                    "Industrial machinery sounds",
                    "Nature sounds (birds, wind, water)",
                    "Technology interface sounds",
                    "Environmental data processing sounds"
                ]
            }
        }
        
        return script
    
    def create_storyboard(self) -> List[Dict[str, Any]]:
        """Create detailed storyboard for video production"""
        
        storyboard = [
            {
                "scene": 1,
                "shot": "Opening wide shot of industrial cityscape",
                "duration": "15 seconds",
                "camera_movement": "Slow zoom in on smokestacks",
                "visual_elements": [
                    "Dark, polluted sky",
                    "Smokestacks emitting dark clouds",
                    "Industrial buildings in silhouette",
                    "Text overlay: '36.8 billion tons of CO2 annually'"
                ],
                "audio": "Industrial ambient sounds, somber music"
            },
            
            {
                "scene": 1,
                "shot": "Close-up of data visualization",
                "duration": "20 seconds",
                "camera_movement": "Static with animated data",
                "visual_elements": [
                    "Animated charts showing rising CO2 levels",
                    "Temperature graphs with alarming trends",
                    "Species extinction counters",
                    "Air pollution statistics"
                ],
                "audio": "Building tension in music"
            },
            
            {
                "scene": 2,
                "shot": "Transition to technology lab",
                "duration": "15 seconds",
                "camera_movement": "Smooth transition, fade to bright",
                "visual_elements": [
                    "Scientists working on computers",
                    "Data streams flowing across screens",
                    "Machine learning visualizations",
                    "Hope emerging from darkness"
                ],
                "audio": "Transitional music, building hope"
            },
            
            {
                "scene": 3,
                "shot": "Product demonstration",
                "duration": "30 seconds",
                "camera_movement": "Screen recording style",
                "visual_elements": [
                    "Carbon footprint calculator interface",
                    "User filling out the multi-step form",
                    "Real-time calculations appearing",
                    "Results visualization with charts"
                ],
                "audio": "Uplifting tech music, interface sounds"
            },
            
            {
                "scene": 4,
                "shot": "Before and after transformation",
                "duration": "25 seconds",
                "camera_movement": "Split screen, then merge",
                "visual_elements": [
                    "Left: Polluted city, right: Clean city",
                    "People wearing masks vs. breathing clean air",
                    "Dead trees vs. thriving green spaces",
                    "Dark skies vs. clear blue skies"
                ],
                "audio": "Triumphant orchestral music"
            },
            
            {
                "scene": 5,
                "shot": "Global impact visualization",
                "duration": "20 seconds",
                "camera_movement": "Zoom out from local to global",
                "visual_elements": [
                    "Map showing global carbon reduction",
                    "Connecting lines between cities",
                    "Ripple effects spreading worldwide",
                    "Green energy symbols appearing globally"
                ],
                "audio": "Inspiring global music"
            },
            
            {
                "scene": 6,
                "shot": "Call to action with contact info",
                "duration": "25 seconds",
                "camera_movement": "Static with animated text",
                "visual_elements": [
                    "Website URL and app download links",
                    "Social media handles",
                    "QR code for easy access",
                    "Final inspiring message"
                ],
                "audio": "Motivational music, clear voice-over"
            }
        ]
        
        return storyboard
    
    def create_production_notes(self) -> Dict[str, Any]:
        """Create detailed production notes for video creation"""
        
        production_notes = {
            "pre_production": {
                "script_review": "Review and approve final script",
                "location_scouting": [
                    "Industrial areas for opening shots",
                    "Clean tech offices for solution scenes",
                    "Green spaces for transformation shots",
                    "Urban areas for before/after comparisons"
                ],
                "talent_casting": [
                    "Professional voice-over artist (American accent)",
                    "Diverse group of users for testimonials",
                    "Environmental experts for credibility"
                ],
                "equipment_rental": [
                    "4K camera with stabilization",
                    "Professional lighting kit",
                    "High-quality microphones",
                    "Drone for aerial shots"
                ]
            },
            
            "production": {
                "shooting_schedule": "3-4 days total",
                "day_1": "Industrial and problem shots",
                "day_2": "Technology and solution shots",
                "day_3": "Transformation and impact shots",
                "day_4": "Pickup shots and voice-over recording",
                "safety_considerations": [
                    "Industrial location safety protocols",
                    "Drone flight permits and restrictions",
                    "COVID-19 safety measures for crew"
                ]
            },
            
            "post_production": {
                "editing_software": "Adobe Premiere Pro or Final Cut Pro",
                "color_grading": "Match color palette for consistency",
                "audio_mixing": "Professional audio mixing and mastering",
                "motion_graphics": "After Effects for data visualizations",
                "delivery_formats": [
                    "MP4 for web (1920x1080)",
                    "MOV for broadcast (if needed)",
                    "Social media versions (square, vertical)"
                ]
            },
            
            "budget_estimate": {
                "pre_production": "$2,000",
                "production": "$8,000",
                "post_production": "$5,000",
                "total": "$15,000"
            },
            
            "timeline": {
                "pre_production": "2 weeks",
                "production": "1 week",
                "post_production": "3 weeks",
                "total": "6 weeks"
            }
        }
        
        return production_notes
    
    def generate_video_assets(self) -> None:
        """Generate all video-related assets and documentation"""
        
        print("Creating Video Presentation Assets...")
        
        # Create main script
        script = self.create_video_script()
        with open("video_script.json", "w", encoding="utf-8") as f:
            json.dump(script, f, indent=2, ensure_ascii=False)
        
        # Create storyboard
        storyboard = self.create_storyboard()
        with open("storyboard.json", "w", encoding="utf-8") as f:
            json.dump(storyboard, f, indent=2, ensure_ascii=False)
        
        # Create production notes
        production_notes = self.create_production_notes()
        with open("production_notes.json", "w", encoding="utf-8") as f:
            json.dump(production_notes, f, indent=2, ensure_ascii=False)
        
        # Create HTML preview
        self.create_html_preview(script, storyboard)
        
        print("Video assets created successfully!")
        print("Generated files:")
        print("  - video_script.json")
        print("  - storyboard.json") 
        print("  - production_notes.json")
        print("  - video_preview.html")
    
    def create_html_preview(self, script: Dict, storyboard: List[Dict]) -> None:
        """Create HTML preview of the video presentation"""
        
        html_content = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{script['title']}</title>
    <style>
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #2E8B57, #32CD32);
            color: white;
        }}
        .container {{
            max-width: 1200px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.1);
            padding: 30px;
            border-radius: 15px;
            backdrop-filter: blur(10px);
        }}
        h1 {{
            text-align: center;
            font-size: 2.5em;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }}
        .subtitle {{
            text-align: center;
            font-size: 1.2em;
            margin-bottom: 30px;
            opacity: 0.9;
        }}
        .scene {{
            background: rgba(255, 255, 255, 0.1);
            margin: 20px 0;
            padding: 20px;
            border-radius: 10px;
            border-left: 5px solid #32CD32;
        }}
        .scene-title {{
            font-size: 1.5em;
            font-weight: bold;
            margin-bottom: 15px;
            color: #90EE90;
        }}
        .narrative {{
            margin: 15px 0;
        }}
        .narrative ul {{
            list-style-type: none;
            padding-left: 0;
        }}
        .narrative li {{
            margin: 8px 0;
            padding-left: 20px;
            position: relative;
        }}
        .narrative li:before {{
            content: "🌱";
            position: absolute;
            left: 0;
        }}
        .stats {{
            background: rgba(255, 255, 255, 0.2);
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
        }}
        .stats h4 {{
            margin-top: 0;
            color: #90EE90;
        }}
        .call-to-action {{
            background: rgba(255, 107, 107, 0.2);
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            margin: 20px 0;
            border: 2px solid #FF6B6B;
        }}
        .technical-specs {{
            background: rgba(0, 102, 204, 0.2);
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
        }}
        .storyboard {{
            background: rgba(255, 255, 255, 0.05);
            padding: 15px;
            border-radius: 8px;
            margin: 10px 0;
        }}
        .shot-title {{
            font-weight: bold;
            color: #32CD32;
        }}
        .duration {{
            color: #90EE90;
            font-style: italic;
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>{script['title']}</h1>
        <div class="subtitle">{script['subtitle']}</div>
        
        <div class="technical-specs">
            <h3>📊 Video Specifications</h3>
            <p><strong>Duration:</strong> {script['duration']}</p>
            <p><strong>Resolution:</strong> {script['technical_specifications']['resolution']}</p>
            <p><strong>Format:</strong> {script['technical_specifications']['format']}</p>
            <p><strong>Target Audience:</strong> {script['target_audience']}</p>
        </div>
        
        <h2>🎬 Video Scenes</h2>
"""
        
        # Add scenes
        for scene in script['scenes']:
            html_content += f"""
        <div class="scene">
            <div class="scene-title">Scene {scene['scene_number']}: {scene['title']}</div>
            <p><strong>Duration:</strong> {scene['duration']}</p>
            <p><strong>Style:</strong> {scene['visual_style']}</p>
            
            <div class="narrative">
                <h4>Narrative:</h4>
                <ul>
"""
            for point in scene['content']['narrative']:
                html_content += f"                    <li>{point}</li>\n"
            
            html_content += """
                </ul>
            </div>
"""
            
            if 'statistics' in scene['content']:
                html_content += f"""
            <div class="stats">
                <h4>📈 Key Statistics:</h4>
                <ul>
"""
                for stat in scene['content']['statistics']:
                    html_content += f"                    <li>{stat}</li>\n"
                html_content += "                </ul>\n            </div>\n"
            
            if 'call_to_action' in scene['content']:
                html_content += f"""
            <div class="call-to-action">
                <strong>Call to Action:</strong> {scene['content']['call_to_action']}
            </div>
"""
        
        # Add storyboard
        html_content += """
        <h2>📋 Storyboard</h2>
"""
        for shot in storyboard:
            html_content += f"""
        <div class="storyboard">
            <div class="shot-title">Scene {shot['scene']}: {shot['shot']}</div>
            <p><span class="duration">Duration: {shot['duration']}</span></p>
            <p><strong>Camera Movement:</strong> {shot['camera_movement']}</p>
            <p><strong>Visual Elements:</strong></p>
            <ul>
"""
            for element in shot['visual_elements']:
                html_content += f"                <li>{element}</li>\n"
            html_content += f"""
            </ul>
            <p><strong>Audio:</strong> {shot['audio']}</p>
        </div>
"""
        
        html_content += """
        <div class="call-to-action">
            <h3>🚀 Ready to Create This Video?</h3>
            <p>This video presentation will showcase your carbon footprint project as a powerful solution to environmental challenges, taking viewers on an inspiring journey from industrial problems to green solutions.</p>
            <p><strong>Next Steps:</strong></p>
            <ul>
                <li>Review the script and storyboard</li>
                <li>Gather production resources</li>
                <li>Begin video production</li>
                <li>Share your environmental impact story</li>
            </ul>
        </div>
    </div>
</body>
</html>
"""
        
        with open("video_preview.html", "w", encoding="utf-8") as f:
            f.write(html_content)

def main():
    """Main function to generate video presentation assets"""
    print("Carbon Footprint Project - Video Presentation Generator")
    print("=" * 60)
    
    generator = VideoPresentationGenerator()
    generator.generate_video_assets()
    
    print("\nVideo Presentation Ready!")
    print("Open 'video_preview.html' to see the complete video plan")
    print("Use the JSON files for production planning")
    print("Your environmental impact story awaits!")

if __name__ == "__main__":
    main()
