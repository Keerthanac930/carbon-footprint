#!/usr/bin/env python3
"""
Background Video Generator for Carbon Footprint Theme
Converts HTML5 canvas animation to video format
"""

import os
import json
import subprocess
import time
from datetime import datetime
from typing import Dict, List, Any

class BackgroundVideoGenerator:
    """Generate seamless looping background video with carbon footprint theme"""
    
    def __init__(self):
        self.output_dir = "background_video_assets"
        self.duration = 30  # seconds for seamless loop
        self.fps = 30
        self.resolution = "1920x1080"
        
    def create_video_specification(self) -> Dict[str, Any]:
        """Create detailed video specification"""
        
        spec = {
            "title": "Carbon Footprint Background Video",
            "description": "Seamless looping background video with carbon footprint theme",
            "duration": f"{self.duration} seconds",
            "fps": self.fps,
            "resolution": self.resolution,
            "format": "MP4 (H.264)",
            "loop": "Seamless",
            
            "visual_elements": {
                "carbon_footprint_icons": {
                    "count": 8,
                    "animation": "Glowing pulse effect",
                    "colors": ["#32CD32", "#228B22", "#90EE90"],
                    "opacity_range": [0.1, 0.5],
                    "size_range": [20, 60]
                },
                
                "world_map_emissions": {
                    "continents": 6,
                    "animation": "Pulsing emission glow",
                    "colors": ["#FF6600", "#FF0000", "#32CD32"],
                    "opacity": 0.3,
                    "pulse_speed": "Slow, synchronized"
                },
                
                "green_energy_motifs": {
                    "wind_turbines": {
                        "count": 6,
                        "animation": "Rotating blades",
                        "color": "#32CD32",
                        "opacity": 0.8
                    },
                    "solar_panels": {
                        "count": 8,
                        "animation": "Glowing intensity",
                        "color": "#FFFF00",
                        "opacity": 0.6
                    }
                },
                
                "co2_particles": {
                    "count": 150,
                    "animation": "Rising motion",
                    "types": ["CO2 molecules", "Dust particles"],
                    "colors": ["#32CD32", "#888888"],
                    "speed": "Gentle, varied"
                },
                
                "pollution_vs_sustainability": {
                    "animation": "Fading contrast",
                    "pollution_color": "#8B0000",
                    "sustainability_color": "#008B00",
                    "transition": "Smooth, 30-second cycle"
                }
            },
            
            "color_palette": {
                "primary_green": "#32CD32",
                "dark_green": "#228B22",
                "light_green": "#90EE90",
                "energy_blue": "#0066CC",
                "solar_yellow": "#FFFF00",
                "pollution_red": "#8B0000",
                "background_dark": "#0a0a0a",
                "background_blue": "#1a1a2e",
                "background_deep": "#16213e"
            },
            
            "animation_timing": {
                "particle_rise": "2-4 seconds per cycle",
                "icon_pulse": "5-8 seconds per cycle",
                "wind_turbine_rotation": "10-15 seconds per cycle",
                "solar_panel_glow": "3-6 seconds per cycle",
                "world_map_pulse": "8-12 seconds per cycle",
                "contrast_transition": "30 seconds full cycle"
            },
            
            "technical_requirements": {
                "seamless_loop": True,
                "smooth_transitions": True,
                "non_distracting": True,
                "text_overlay_compatible": True,
                "professional_quality": True,
                "subtle_effects": True
            }
        }
        
        return spec
    
    def create_ffmpeg_script(self) -> str:
        """Create FFmpeg script for video generation"""
        
        script = f"""#!/bin/bash
# Carbon Footprint Background Video Generation Script
# Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

# Create output directory
mkdir -p {self.output_dir}

# Set video parameters
DURATION={self.duration}
FPS={self.fps}
RESOLUTION={self.resolution}
OUTPUT_FILE="{self.output_dir}/carbon_footprint_background.mp4"

echo "Generating Carbon Footprint Background Video..."
echo "Duration: $DURATION seconds"
echo "FPS: $FPS"
echo "Resolution: $RESOLUTION"

# Method 1: Using HTML5 canvas recording (requires browser automation)
echo "Method 1: HTML5 Canvas Recording"
echo "1. Open carbon_footprint_background.html in Chrome/Chromium"
echo "2. Use browser developer tools to record canvas"
echo "3. Export as MP4 with the following settings:"
echo "   - Duration: $DURATION seconds"
echo "   - FPS: $FPS"
echo "   - Resolution: $RESOLUTION"
echo "   - Codec: H.264"
echo "   - Quality: High"

# Method 2: Using FFmpeg with generated frames
echo ""
echo "Method 2: Frame Generation + FFmpeg"
echo "1. Generate frames using Python script"
echo "2. Combine frames with FFmpeg:"
echo "ffmpeg -framerate $FPS -i frame_%04d.png -c:v libx264 -pix_fmt yuv420p -crf 18 $OUTPUT_FILE"

# Method 3: Using OBS Studio
echo ""
echo "Method 3: OBS Studio Recording"
echo "1. Open OBS Studio"
echo "2. Add Browser Source pointing to carbon_footprint_background.html"
echo "3. Set canvas resolution to $RESOLUTION"
echo "4. Record for $DURATION seconds"
echo "5. Export as MP4"

echo ""
echo "Video generation complete!"
echo "Output file: $OUTPUT_FILE"
"""
        
        return script
    
    def create_python_frame_generator(self) -> str:
        """Create Python script to generate individual frames"""
        
        script = f'''#!/usr/bin/env python3
"""
Frame Generator for Carbon Footprint Background Video
Generates individual frames that can be combined into video
"""

import math
import random
from PIL import Image, ImageDraw, ImageFont
import os

class FrameGenerator:
    def __init__(self, width=1920, height=1080, fps=30, duration=30):
        self.width = width
        self.height = height
        self.fps = fps
        self.duration = duration
        self.total_frames = fps * duration
        
        # Initialize particles and elements
        self.particles = self.init_particles()
        self.icons = self.init_icons()
        self.world_map = self.init_world_map()
        self.energy_motifs = self.init_energy_motifs()
        
    def init_particles(self):
        particles = []
        for i in range(150):
            particles.append({{
                'x': random.uniform(0, self.width),
                'y': random.uniform(self.height, self.height + 200),
                'vx': random.uniform(-0.5, 0.5),
                'vy': random.uniform(-2, -1),
                'size': random.uniform(1, 4),
                'opacity': random.uniform(0.2, 0.8),
                'type': 'co2' if random.random() > 0.7 else 'dust'
            }})
        return particles
        
    def init_icons(self):
        icons = []
        for i in range(8):
            icons.append({{
                'x': random.uniform(0, self.width),
                'y': random.uniform(0, self.height),
                'size': random.uniform(20, 60),
                'pulse': random.uniform(0, math.pi * 2),
                'opacity': random.uniform(0.1, 0.5),
                'type': 'footprint' if random.random() > 0.5 else 'leaf'
            }})
        return icons
        
    def init_world_map(self):
        return {{
            'points': [
                {{'x': 0.2, 'y': 0.3, 'name': 'North America'}},
                {{'x': 0.5, 'y': 0.25, 'name': 'Europe'}},
                {{'x': 0.7, 'y': 0.3, 'name': 'Asia'}},
                {{'x': 0.5, 'y': 0.5, 'name': 'Africa'}},
                {{'x': 0.3, 'y': 0.7, 'name': 'South America'}},
                {{'x': 0.8, 'y': 0.7, 'name': 'Australia'}}
            ],
            'emissions': [0.8, 0.9, 0.7, 0.6, 0.5, 0.4]
        }}
        
    def init_energy_motifs(self):
        return {{
            'wind_turbines': [
                {{'x': random.uniform(0, self.width), 'y': random.uniform(0.1, 0.4) * self.height, 
                  'rotation': random.uniform(0, math.pi * 2), 'size': random.uniform(20, 50)}} 
                for _ in range(6)
            ],
            'solar_panels': [
                {{'x': random.uniform(0, self.width), 'y': random.uniform(0.1, 0.5) * self.height,
                  'size': random.uniform(15, 40), 'glow': random.uniform(0, math.pi * 2),
                  'intensity': random.uniform(0.3, 0.8)}} 
                for _ in range(8)
            ]
        }}
    
    def generate_frame(self, frame_number):
        """Generate a single frame"""
        time = frame_number / self.fps
        
        # Create image with gradient background
        img = Image.new('RGB', (self.width, self.height), (10, 10, 10))
        draw = ImageDraw.Draw(img)
        
        # Draw gradient background
        for y in range(self.height):
            ratio = y / self.height
            r = int(10 + (26 - 10) * ratio)
            g = int(10 + (30 - 10) * ratio)
            b = int(10 + (46 - 10) * ratio)
            draw.line([(0, y), (self.width, y)], fill=(r, g, b))
        
        # Update and draw particles
        self.update_particles(time)
        self.draw_particles(draw)
        
        # Update and draw icons
        self.update_icons(time)
        self.draw_icons(draw)
        
        # Draw world map
        self.draw_world_map(draw, time)
        
        # Draw energy motifs
        self.draw_energy_motifs(draw, time)
        
        # Draw contrast effect
        self.draw_contrast(draw, time)
        
        return img
    
    def update_particles(self, time):
        for particle in self.particles:
            particle['x'] += particle['vx']
            particle['y'] += particle['vy']
            
            if particle['y'] < -50:
                particle['y'] = self.height + 50
                particle['x'] = random.uniform(0, self.width)
            if particle['x'] < -50 or particle['x'] > self.width + 50:
                particle['x'] = random.uniform(0, self.width)
    
    def update_icons(self, time):
        for icon in self.icons:
            icon['pulse'] += 0.02
    
    def draw_particles(self, draw):
        for particle in self.particles:
            x, y = int(particle['x']), int(particle['y'])
            size = int(particle['size'])
            opacity = int(particle['opacity'] * 255)
            
            if particle['type'] == 'co2':
                color = (50, 205, 50, opacity)
                draw.ellipse([x-size, y-size, x+size, y+size], fill=color)
            else:
                color = (136, 136, 136, opacity)
                draw.ellipse([x-size//2, y-size//2, x+size//2, y+size//2], fill=color)
    
    def draw_icons(self, draw):
        for icon in self.icons:
            x, y = int(icon['x']), int(icon['y'])
            size = int(icon['size'] * (math.sin(icon['pulse']) * 0.3 + 0.7))
            opacity = int(icon['opacity'] * 255)
            
            if icon['type'] == 'footprint':
                self.draw_carbon_footprint(draw, x, y, size, opacity)
            else:
                self.draw_leaf(draw, x, y, size, opacity)
    
    def draw_carbon_footprint(self, draw, x, y, size, opacity):
        color = (50, 205, 50, opacity)
        draw.ellipse([x-size*0.6, y-size*0.4, x+size*0.6, y+size*0.4], outline=color, width=3)
    
    def draw_leaf(self, draw, x, y, size, opacity):
        color = (50, 205, 50, opacity)
        draw.ellipse([x-size*0.4, y-size*0.6, x+size*0.4, y+size*0.6], fill=color)
    
    def draw_world_map(self, draw, time):
        for i, point in enumerate(self.world_map['points']):
            x = int(point['x'] * self.width)
            y = int(point['y'] * self.height)
            emission = self.world_map['emissions'][i]
            
            # Draw emission glow
            glow_size = int(50 * (math.sin(time * 0.5) * 0.3 + 0.7))
            color = (255, int(100 + emission * 155), 0, int(emission * 76))
            draw.ellipse([x-glow_size, y-glow_size, x+glow_size, y+glow_size], fill=color)
    
    def draw_energy_motifs(self, draw, time):
        # Draw wind turbines
        for turbine in self.energy_motifs['wind_turbines']:
            x, y = int(turbine['x']), int(turbine['y'])
            size = int(turbine['size'])
            rotation = turbine['rotation'] + time * 0.01
            
            # Draw turbine tower
            draw.line([(x, y), (x, y-size)], fill=(200, 200, 200, 153), width=3)
            
            # Draw blades (simplified)
            for i in range(3):
                angle = rotation + i * math.pi * 2 / 3
                end_x = int(x + math.cos(angle) * size * 0.3)
                end_y = int(y - size + math.sin(angle) * size * 0.3)
                draw.line([(x, y-size), (end_x, end_y)], fill=(50, 205, 50, 204), width=2)
        
        # Draw solar panels
        for panel in self.energy_motifs['solar_panels']:
            x, y = int(panel['x']), int(panel['y'])
            size = int(panel['size'])
            glow_intensity = math.sin(panel['glow'] + time * 0.03) * 0.3 + 0.7
            
            # Draw solar panel
            color = (0, 100, 200, int(204 * panel['intensity'] * glow_intensity))
            draw.rectangle([x-size*0.8, y-size*0.4, x+size*0.8, y+size*0.4], fill=color)
    
    def draw_contrast(self, draw, time):
        contrast = math.sin(time * 0.1) * 0.5 + 0.5
        
        # Pollution side (left)
        pollution_opacity = int(contrast * 76)
        for x in range(0, self.width // 2, 10):
            draw.line([(x, 0), (x, self.height)], fill=(139, 0, 0, pollution_opacity))
        
        # Sustainability side (right)
        sustainability_opacity = int((1 - contrast) * 76)
        for x in range(self.width // 2, self.width, 10):
            draw.line([(x, 0), (x, self.height)], fill=(0, 139, 0, sustainability_opacity))
    
    def generate_all_frames(self):
        """Generate all frames for the video"""
        os.makedirs('frames', exist_ok=True)
        
        print(f"Generating {{self.total_frames}} frames...")
        for frame in range(self.total_frames):
            img = self.generate_frame(frame)
            img.save(f'frames/frame_{{frame:04d}}.png')
            
            if frame % 30 == 0:
                print(f"Generated frame {{frame}}/{{self.total_frames}}")
        
        print("Frame generation complete!")

if __name__ == "__main__":
    generator = FrameGenerator()
    generator.generate_all_frames()
'''
        
        return script
    
    def create_instructions(self) -> str:
        """Create comprehensive instructions for video generation"""
        
        instructions = f"""
# Carbon Footprint Background Video Generation Instructions

## Overview
This guide will help you create a seamless looping background video with a carbon footprint theme. The video features modern, minimal, and eco-conscious visuals perfect for presentations, websites, or video backgrounds.

## Video Specifications
- **Duration**: {self.duration} seconds (seamless loop)
- **Resolution**: {self.resolution}
- **Frame Rate**: {self.fps} FPS
- **Format**: MP4 (H.264)
- **File Size**: Approximately 50-100MB

## Visual Elements
1. **Glowing Carbon Footprint Icons**: 8 animated icons with pulse effects
2. **World Map Emissions**: 6 continents with pulsing emission glows
3. **Green Energy Motifs**: Wind turbines and solar panels
4. **CO₂ Particle Effects**: 150 rising particles representing emissions
5. **Pollution vs Sustainability**: Contrasting visual themes
6. **Smooth Gradients**: Green, blue, and earthy tones

## Generation Methods

### Method 1: HTML5 Canvas Recording (Recommended)
1. Open `carbon_footprint_background.html` in Chrome/Chromium
2. Use browser developer tools or screen recording software
3. Record the canvas for {self.duration} seconds
4. Export as MP4 with H.264 codec

### Method 2: Python Frame Generation
1. Install required packages:
   ```bash
   pip install Pillow
   ```
2. Run the frame generator:
   ```bash
   python generate_frames.py
   ```
3. Combine frames with FFmpeg:
   ```bash
   ffmpeg -framerate {self.fps} -i frames/frame_%04d.png -c:v libx264 -pix_fmt yuv420p -crf 18 carbon_footprint_background.mp4
   ```

### Method 3: OBS Studio Recording
1. Open OBS Studio
2. Add Browser Source pointing to `carbon_footprint_background.html`
3. Set canvas resolution to {self.resolution}
4. Record for {self.duration} seconds
5. Export as MP4

## Customization Options

### Color Palette
- Primary Green: #32CD32
- Dark Green: #228B22
- Light Green: #90EE90
- Energy Blue: #0066CC
- Solar Yellow: #FFFF00
- Pollution Red: #8B0000

### Animation Speed
- Particle Rise: 2-4 seconds per cycle
- Icon Pulse: 5-8 seconds per cycle
- Wind Turbine Rotation: 10-15 seconds per cycle
- Solar Panel Glow: 3-6 seconds per cycle

### Resolution Options
- 1920x1080 (Full HD)
- 1280x720 (HD)
- 3840x2160 (4K)
- 2560x1440 (2K)

## Quality Settings
- **High Quality**: CRF 18, 30 FPS
- **Medium Quality**: CRF 23, 24 FPS
- **Low Quality**: CRF 28, 15 FPS

## Usage Guidelines
- Perfect for presentation backgrounds
- Compatible with text overlays
- Non-distracting design
- Professional appearance
- Seamless looping

## Troubleshooting
1. **Browser Issues**: Use Chrome/Chromium for best performance
2. **Performance**: Reduce particle count for slower devices
3. **File Size**: Adjust CRF value for smaller files
4. **Quality**: Increase resolution for better quality

## Output Files
- `carbon_footprint_background.mp4` - Main video file
- `carbon_footprint_background_loop.mp4` - Optimized for looping
- `carbon_footprint_background_4k.mp4` - 4K version
- `carbon_footprint_background_720p.mp4` - 720p version

Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
"""
        
        return instructions
    
    def generate_all_assets(self):
        """Generate all assets for background video creation"""
        
        print("Creating Carbon Footprint Background Video Assets...")
        
        # Create output directory
        os.makedirs(self.output_dir, exist_ok=True)
        
        # Generate video specification
        spec = self.create_video_specification()
        with open(f"{self.output_dir}/video_specification.json", "w", encoding="utf-8") as f:
            json.dump(spec, f, indent=2, ensure_ascii=False)
        
        # Generate FFmpeg script
        ffmpeg_script = self.create_ffmpeg_script()
        with open(f"{self.output_dir}/generate_video.sh", "w", encoding="utf-8") as f:
            f.write(ffmpeg_script)
        
        # Generate Python frame generator
        python_script = self.create_python_frame_generator()
        with open(f"{self.output_dir}/generate_frames.py", "w", encoding="utf-8") as f:
            f.write(python_script)
        
        # Generate instructions
        instructions = self.create_instructions()
        with open(f"{self.output_dir}/README.md", "w", encoding="utf-8") as f:
            f.write(instructions)
        
        print("Background video assets created successfully!")
        print(f"Generated files in '{self.output_dir}':")
        print("  - video_specification.json")
        print("  - generate_video.sh")
        print("  - generate_frames.py")
        print("  - README.md")
        print("  - carbon_footprint_background.html (main animation)")

def main():
    """Main function to generate background video assets"""
    print("Carbon Footprint Background Video Generator")
    print("=" * 50)
    
    generator = BackgroundVideoGenerator()
    generator.generate_all_assets()
    
    print("\nBackground Video Assets Ready!")
    print("Open 'carbon_footprint_background.html' to preview the animation")
    print("Follow the instructions in the README.md to create the video")

if __name__ == "__main__":
    main()









