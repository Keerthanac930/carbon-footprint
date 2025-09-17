# Current Climate Change Video Configuration

## Current Video
The application is currently configured with the YouTube video: [https://youtu.be/NSAOrGb9orM](https://youtu.be/NSAOrGb9orM?si=Jt4e9ITPLAb8-3dO)

## Video ID
Current video ID: `NSAOrGb9orM`

## Current Configuration
In `frontend/src/App.js`, the video is configured as:
```javascript
src="https://www.youtube.com/embed/NSAOrGb9orM?autoplay=1&mute=1&loop=1&playlist=NSAOrGb9orM&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&fs=1&disablekb=1&start=0&end=0"
```

## How to Change the Video
To change to a different video:

1. **Get the YouTube Video URL**: Copy the YouTube video URL (e.g., `https://www.youtube.com/watch?v=VIDEO_ID` or `https://youtu.be/VIDEO_ID`)

2. **Extract the Video ID**: 
   - From `https://www.youtube.com/watch?v=ABC123XYZ` → Video ID is `ABC123XYZ`
   - From `https://youtu.be/ABC123XYZ` → Video ID is `ABC123XYZ`

3. **Update the Code**: In `frontend/src/App.js`, replace `NSAOrGb9orM` with your new video ID in TWO places:
   - In the embed URL: `https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=1&mute=1&loop=1&playlist=YOUR_VIDEO_ID&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&fs=1&disablekb=1&start=0&end=0`

## Example:
If you want to use video ID `ABC123XYZ`, the line should be:
```javascript
src="https://www.youtube.com/embed/ABC123XYZ?autoplay=1&mute=1&loop=1&playlist=ABC123XYZ&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&fs=1&disablekb=1&start=0&end=0"
```

## Features:
- ✅ Video plays automatically (autoplay=1)
- ✅ Video is muted (mute=1)
- ✅ Video loops continuously (loop=1&playlist=VIDEO_ID)
- ✅ No controls shown (controls=0)
- ✅ No video info shown (showinfo=0)
- ✅ No related videos (rel=0)
- ✅ Minimal YouTube branding (modestbranding=1)
- ✅ No annotations (iv_load_policy=3)
- ✅ No fullscreen button (fs=0)
- ✅ Keyboard controls disabled (disablekb=1)

## Alternative: If you can't find the exact video
You can use any climate change video from YouTube by following the same steps above.
