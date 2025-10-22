@echo off
echo ========================================
echo Carbon Footprint Project Presentation
echo ========================================
echo.

echo Installing required packages...
pip install python-pptx

echo.
echo Generating PowerPoint presentation...
python create_presentation.py

echo.
echo ========================================
echo Presentation generation complete!
echo Check for: Carbon_Footprint_Project_Presentation.pptx
echo ========================================
pause

