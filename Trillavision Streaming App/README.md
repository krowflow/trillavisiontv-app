# Trillavision T.V. - Professional Live Streaming Platform

A professional-grade live streaming platform with seamless YouTube integration, custom branding overlays, multi-scene management, and advanced audio processing.

![Trillavision T.V. Dashboard](https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80)

## Features

- **YouTube Integration**: Connect directly to YouTube Streaming Studio
- **Custom Branding**: Add overlays, logos, and custom colors
- **Scene Management**: Create and manage multiple scenes
- **Source Control**: Add cameras, screen captures, images, and more
- **Real-time Streaming**: Monitor your stream status and viewer count
- **Live Chat**: Engage with viewers in real-time
- **Professional Audio Mixer**: Complete with compressor, limiter, EQ, gate, and de-esser
- **Podcasting Mode**: Dedicated mode for podcast recording with dual microphone support

## Technical Stack

- **Frontend**: React.js with TypeScript
- **Backend**: Node.js with Express
- **State Management**: Redux Toolkit
- **UI Components**: Tailwind CSS
- **Real-time**: Socket.IO
- **Video Processing**: FFmpeg
- **Audio Processing**: Web Audio API with Tone.js
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- FFmpeg installed on your system (for production use)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on the `.env.example` template
4. Start the development server:

```bash
npm run dev
```

## Usage

### Connecting to YouTube

1. Click "Connect to YouTube" in the footer
2. Authorize the application
3. Configure your stream settings

### Creating Scenes

1. Use the sidebar to add new scenes
2. Add sources to your scenes (camera, screen capture, etc.)
3. Arrange sources in the preview area

### Customizing Brand

1. Open Brand Settings from the sidebar
2. Set your brand colors and name
3. Add overlays for your stream

### Audio Processing

1. Click the Audio Mixer button in the right panel
2. Configure audio processors for each microphone
3. Apply presets or create custom settings for your microphones
4. Enable Podcasting Mode for dual microphone setups

### Going Live

1. Configure your stream settings
2. Click "Go Live" to start streaming
3. Monitor your stream status and viewer count

## Development

### Project Structure

- `/src`: Frontend React application
  - `/components`: UI components
  - `/store`: Redux store and slices
  - `/hooks`: Custom React hooks
  - `/types`: TypeScript type definitions
  - `/utils`: Utility functions
  - `/services`: API and Socket services
  - `/pages`: Main application pages
  - `/config`: Environment-specific configuration
- `/server`: Backend Express server
  - `/routes`: API route handlers
  - `/middleware`: Express middleware
- `/scripts`: Build and deployment scripts
- `/docs`: Documentation files

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate test coverage report
npm run test:coverage
```

### Building for Production

```bash
npm run build
```

This will create a production build in the `dist` directory.

## Deployment

### Method 1: Docker Deployment

The easiest way to deploy Trillavision T.V. is using Docker:

1. Make sure Docker and Docker Compose are installed on your system
2. Create a `.env` file with your environment variables:

```
JWT_SECRET=your-jwt-secret-key
YOUTUBE_CLIENT_ID=your-youtube-client-id
YOUTUBE_CLIENT_SECRET=your-youtube-client-secret
YOUTUBE_REDIRECT_URI=https://your-domain.com/auth/youtube/callback
```

3. Build and start the Docker container:

```bash
docker-compose up -d
```

4. Access the application at http://localhost:3000

### Method 2: Manual Deployment

1. Build the application:

```bash
npm run build
```

2. Copy the following files to your server:
   - `dist/` directory (frontend build)
   - `server/` directory
   - `package.json` and `package-lock.json`
   - `.env` file (configured for production)

3. Install production dependencies:

```bash
npm ci --omit=dev
```

4. Start the server:

```bash
node server/index.js
```

### Method 3: Automated Deployment Script

We provide a deployment script that handles the build and deployment process:

```bash
# Build, deploy, and start the server
node scripts/deploy.js

# Only build the application
node scripts/deploy.js --build

# Only deploy the application
node scripts/deploy.js --deploy

# Only start the server
node scripts/deploy.js --start
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `CLIENT_URL` | Frontend URL | `http://localhost:5173` |
| `YOUTUBE_CLIENT_ID` | YouTube API client ID | - |
| `YOUTUBE_CLIENT_SECRET` | YouTube API client secret | - |
| `YOUTUBE_REDIRECT_URI` | YouTube OAuth redirect URI | `http://localhost:5173/auth/youtube/callback` |
| `JWT_SECRET` | Secret for JWT tokens | - |
| `FFMPEG_PATH` | Path to FFmpeg executable | - |
| `VITE_API_URL` | API URL for frontend | `http://localhost:3000/api` |
| `VITE_SOCKET_URL` | Socket URL for frontend | `http://localhost:3000` |

## Troubleshooting

### Common Issues

#### Connection Problems

**Issue**: Unable to connect to YouTube
**Solution**:
1. Check your internet connection
2. Verify your YouTube account has live streaming enabled
3. Try reconnecting to YouTube in the application
4. Ensure your YouTube API credentials are valid
5. Check if you've reached YouTube's API quota limits

**Issue**: Stream keeps disconnecting
**Solution**:
1. Check your internet connection stability
2. Lower your stream quality to reduce bandwidth requirements
3. Close other applications that might be using your network
4. Try a wired connection instead of Wi-Fi
5. Contact your ISP if problems persist

#### Video and Audio Issues

**Issue**: No video from camera
**Solution**:
1. Verify the camera is properly connected
2. Check if another application is using the camera
3. Restart the camera in Device Settings
4. Update your camera drivers
5. Try a different USB port

**Issue**: Poor video quality
**Solution**:
1. Improve lighting conditions
2. Adjust camera settings (focus, exposure, white balance)
3. Increase stream quality settings if your connection allows
4. Use a higher quality camera
5. Check for background applications consuming resources

**Issue**: No audio or poor audio quality
**Solution**:
1. Check microphone connections
2. Verify the correct audio device is selected
3. Adjust microphone gain and levels
4. Use noise suppression features
5. Consider using a dedicated microphone

#### Performance Issues

**Issue**: High CPU usage
**Solution**:
1. Lower stream quality settings
2. Reduce the number of active sources
3. Close background applications
4. Enable hardware acceleration if available
5. Upgrade your computer hardware if necessary

**Issue**: Dropped frames
**Solution**:
1. Lower your stream bitrate
2. Reduce resolution or frame rate
3. Close other applications
4. Check for network congestion
5. Use a wired internet connection

## Contributing

We welcome contributions to improve Trillavision T.V.! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests to ensure everything works (`npm test`)
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

This project is proprietary and for authorized use only.

## Author

Trillavision T.V. Team