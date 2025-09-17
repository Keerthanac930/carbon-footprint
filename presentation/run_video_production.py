#!/usr/bin/env python3
"""
Complete Video Production Runner
Generates all assets for the carbon footprint video presentation
"""

import os
import sys
import subprocess
from datetime import datetime

def run_script(script_name, description):
    """Run a Python script and handle errors"""
    print(f"\n{description}...")
    try:
        result = subprocess.run([sys.executable, script_name], 
                              capture_output=True, text=True, cwd=os.path.dirname(__file__))
        if result.returncode == 0:
            print(f"SUCCESS: {description} completed successfully!")
            if result.stdout:
                print(result.stdout)
        else:
            print(f"ERROR in {description}:")
            print(result.stderr)
            return False
    except Exception as e:
        print(f"FAILED to run {description}: {e}")
        return False
    return True

def main():
    """Main function to run all video production scripts"""
    print("CARBON FOOTPRINT VIDEO PRODUCTION SUITE")
    print("=" * 60)
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("Creating comprehensive video presentation assets...")
    
    # List of scripts to run
    scripts = [
        ("create_video_presentation.py", "Video Script & Storyboard Generator"),
        ("create_visual_assets.py", "Visual Assets & Data Visualizations"),
        ("voice_over_script.py", "Voice-Over Script Generator")
    ]
    
    success_count = 0
    total_scripts = len(scripts)
    
    # Run each script
    for script_name, description in scripts:
        if run_script(script_name, description):
            success_count += 1
        else:
            print(f"WARNING: Continuing with other scripts...")
    
    # Summary
    print("\n" + "=" * 60)
    print("VIDEO PRODUCTION SUMMARY")
    print("=" * 60)
    print(f"Scripts completed: {success_count}/{total_scripts}")
    
    if success_count == total_scripts:
        print("ALL ASSETS GENERATED SUCCESSFULLY!")
        print("\nGenerated Files:")
        print("  Video Script & Planning:")
        print("    - video_script.json")
        print("    - storyboard.json")
        print("    - production_notes.json")
        print("    - video_preview.html")
        print("\n  Visual Assets:")
        print("    - carbon_emissions_animation.png")
        print("    - solution_impact_chart.png")
        print("    - technology_visualization.png")
        print("    - transformation_timeline.png")
        print("    - global_impact_map.png")
        print("    - visual_assets_manifest.json")
        print("\n  Voice-Over Assets:")
        print("    - voice_over_script.json")
        print("    - voice_over_timing.json")
        print("    - voice_over_script.txt")
        
        print("\nNEXT STEPS:")
        print("1. Review the video_preview.html for complete overview")
        print("2. Use the JSON files for production planning")
        print("3. Generate visual assets by running: python create_visual_assets.py")
        print("4. Begin video production with professional team")
        print("5. Share your environmental impact story!")
        
        print("\nYour video will showcase the journey from industrial pollution")
        print("   to green, healthy, life-saving environmental solutions!")
        
    else:
        print("Some scripts failed. Check error messages above.")
        print("Make sure all required packages are installed:")
        print("   pip install matplotlib seaborn numpy")
    
    print(f"\nCompleted at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

if __name__ == "__main__":
    main()
