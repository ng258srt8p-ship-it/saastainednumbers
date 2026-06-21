# AI Chat Integration Development Setup

This project already has a fully implemented AI chat integration using OpenRouter API. This document provides the development setup and configuration.

## Current Status ✅

The AI chat integration is **fully implemented and functional** with:

### Core Components
- **lib/ai-chat-context.tsx** - Context provider for AI chat state
- **lib/openrouter.ts** - OpenRouter API integration with built-in rate limiting
- **lib/chat-key.json** - API key configuration
- **components/AiChatWidget.tsx** - Chat UI component with portal rendering
- **Integration** in app/canvas/page.tsx and app/[category]/[slug]/CalculatorClient.tsx

### Development Environment
- ✅ TypeScript configuration (tsconfig.json)
- ✅ Next.js framework with Vite plugin
- ✅ Biome linting and formatting
- ✅ Tailwind CSS with animations
- ✅ Playwright E2E testing
- ✅ Vitest unit testing
- ✅ Environment variable setup (.env.example)

## Project Structure

```
lib/
├── ai-chat-context.tsx          # AI chat context provider
├── openrouter.ts                # OpenRouter API integration
├── chat-key.json                # API key configuration (base64)
├── other-lib-files...

components/
├── AiChatWidget.tsx             # Chat UI component
├── other-components...

app/
├── canvas/page.tsx             # Canvas page with AI chat
├── [category]/[slug]/CalculatorClient.tsx  # Calculator pages with AI chat
├── other-pages...

package.json                    # Dependencies and scripts
tsconfig.json                   # TypeScript configuration
.env.example                     # Environment variables template
.env.development.local          # Development overrides
.env                              # Development environment

.vscode/
  settings.json                 # IDE configuration

.gitignore                       # Git ignore patterns

AGENTS.md                       # Agent documentation

scripts/
  build-with-ai-key.sh           # Build script with API key
  add-ja-locales.mjs            # Localization script
  other-scripts...
```

## Development Scripts

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint and fix code
npm run lint:fix

# Format code with Biome
npm run format

# Type check
npm run type-check

# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Build static export
npm run build:static
```

## AI Chat Configuration

### Environment Variables

The OpenRouter API key should be set in `.env` file:

```bash
NEXT_PUBLIC_OPENROUTER_API_KEY=sk-or-v1-your-key-here
```

**Note**: The current implementation uses a base64 encoded key in `lib/chat-key.json` for security. Consider migrating to environment variables for better development experience.

### OpenRouter Integration

The AI chat integration uses:
- **Model**: `openrouter/free` (free models only)
- **API URL**: `https://openrouter.ai/api/v1/chat/completions`
- **Timeout**: 10 seconds with automatic abort
- **Rate limiting**: Handles 429 errors with daily limit notifications
- **Context**: Provides calculator-specific prompts based on current page context

### Features

1. **Context-Aware Responses**: AI provides help specific to the current calculator or canvas
2. **Responsive UI**: Fixed chat button with slide-over panel
3. **Mobile Optimized**: Works on mobile devices with viewport adaptation
4. **Performance**: Memoized calculations and efficient re-renders
5. **Accessibility**: ARIA labels and keyboard navigation support

## Testing

### Unit Tests

```bash
npm run test           # Run all unit tests
npm run test:ui       # Run with Vitest UI
npm run test:coverage # Run with coverage report
```

### E2E Tests

```bash
npm run test:e2e        # Run Playwright tests
npm run test:e2e:ui     # Run with UI mode
npm run test:e2e:headed # Run in headed mode
```

## Development Workflow

### 1. Initial Setup

```bash
# Clone the repository
# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. Making Changes

```bash
# Edit files
# Format code
npm run format

# Type check
npm run type-check

# Run tests
npm run test
```

### 3. Testing AI Chat

1. Navigate to a calculator page
2. Look for the chat button (bottom-right corner)
3. Click to open chat
4. Try asking questions about the calculator

### 4. Troubleshooting

#### Common Issues

1. **Chat not appearing**: Check if the calculator page includes the AiChatWidget component
2. **API errors**: Ensure NEXT_PUBLIC_OPENROUTER_API_KEY is set in .env
3. **Performance issues**: Check browser console for errors, ensure network requests are working

## Migration Guide

### From Base64 Key to Environment Variables

Currently, the API key is stored as base64 in `lib/chat-key.json`. To migrate to environment variables:

1. Add `NEXT_PUBLIC_OPENROUTER_API_KEY` to `.env` file
2. Update `lib/openrouter.ts` to read from environment variables instead of base64
3. Update the build script to bake environment variables into the static export

## Contributing

### Code Quality

- Use Prettier for formatting (`npm run format`)
- Run ESLint for linting (`npm run lint:fix`)
- Type check before committing (`npm run type-check`)
- Write tests for new functionality
- Follow existing code style and conventions

### AI Chat Improvements

- Add new calculator context for more specific responses
- Improve error handling and user feedback
- Add more sophisticated conversation management
- Optimize performance for large calculations

## Monitoring

### Performance Metrics

The application includes:
- Calculator performance benchmarks
- AI response time tracking
- Error monitoring and reporting
- User interaction analytics

### Debugging

Enable development debugging:

```bash
# Enable verbose logging in .env
development: true

# Check browser console for AI chat errors
# Monitor network requests for OpenRouter API calls
```

## Future Enhancements

### Planned Features

1. **Advanced AI Integration**
   - Context memory across conversations
   - Personalized recommendations
   - Multi-step problem solving

2. **Enhanced UI**
   - Chat history persistence
   - Quick actions and templates
   - Advanced formatting and markdown support

3. **Backend Improvements**
   - API key management system
   - Usage analytics and monitoring
   - Custom model configuration

## Support

For issues with the AI chat integration:
1. Check browser console for error messages
2. Verify environment variables are set
3. Test in different browsers
4. Check network requests to OpenRouter API

## License

This project is licensed under the terms of the MIT license.
