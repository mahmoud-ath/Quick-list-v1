# QuickList Web - Requirements Document

## Project Overview

**QuickList Web** is a modern YouTube playlist creator and manager designed for productivity and seamless video consumption. The application provides a clean, Notion-inspired interface for organizing YouTube videos into custom playlists with built-in continuous playback functionality.

## Core Features

### 1. Video Management
- **Quick Add**: Paste YouTube video URLs to instantly add videos to playlists
- **URL Parsing**: Automatic extraction of YouTube video IDs from various URL formats
- **Video Information**: Fetch and display video titles, thumbnails, and metadata
- **Duplicate Prevention**: Smart handling of duplicate video additions

### 2. Playlist Management
- **Create Playlists**: Quick playlist creation with custom names
- **Rename Playlists**: Inline editing of playlist names
- **Delete Playlists**: Safe deletion with confirmation
- **Reorder Videos**: Drag-and-drop video reordering within playlists
- **Remove Videos**: Individual video removal from playlists

### 3. Playback System
- **Continuous Playback**: Auto-advance to next video when current video ends
- **Player Controls**: Previous/Next navigation with proper boundary handling
- **Queue Management**: Visual playlist queue with current video highlighting
- **Jump Navigation**: Click any video in queue to jump to it immediately
- **Player Modes**: Toggle between standard view and focused player mode

### 4. User Interface
- **Sidebar Navigation**: Collapsible sidebar with playlist organization
- **Dashboard View**: Central hub with recent playlists and quick actions
- **Modal Workflows**: Clean modal-based video addition process
- **Search Functionality**: Real-time playlist search
- **Responsive Design**: Mobile-first design with touch-friendly controls

## Technical Requirements

### Frontend Stack
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS for utility-first styling
- **Icons**: Lucide React for consistent iconography
- **State Management**: React hooks (useState, useEffect) for local state

### Browser Compatibility
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile Browsers**: iOS Safari 14+, Chrome Mobile 90+
- **JavaScript**: ES2020+ features supported

### Performance Requirements
- **Initial Load**: < 3 seconds on 3G connection
- **Video Addition**: < 1 second response time
- **Playlist Loading**: < 500ms for playlists with 100+ videos
- **Memory Usage**: < 100MB for typical usage (50 playlists, 500 videos)

## Design System

### Color Palette
```css
/* Primary Colors */
--blue-50: #eff6ff
--blue-600: #2563eb
--blue-700: #1d4ed8

/* Neutral Colors */
--gray-50: #f9fafb
--gray-100: #f3f4f6
--gray-200: #e5e7eb
--gray-500: #6b7280
--gray-700: #374151
--gray-900: #111827

/* Semantic Colors */
--red-50: #fef2f2
--red-500: #ef4444
--green-50: #f0fdf4
--green-600: #16a34a
```

### Typography
- **Font Family**: System font stack (Inter, SF Pro, Segoe UI)
- **Font Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- **Line Heights**: 1.2 for headings, 1.5 for body text
- **Font Sizes**: 12px (xs) to 24px (2xl) with consistent scale

### Spacing System
- **Base Unit**: 4px (0.25rem)
- **Scale**: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 48px, 64px
- **Component Padding**: 16px (p-4) standard, 24px (p-6) for cards
- **Section Margins**: 24px (mb-6) between major sections

### Component Design
- **Border Radius**: 8px (rounded-lg) for cards, 6px (rounded-md) for buttons
- **Shadows**: Subtle box-shadows for depth (shadow-sm, shadow-md)
- **Borders**: 1px solid with gray-200 for subtle separation
- **Hover States**: Smooth transitions (200ms) with color/shadow changes

## User Experience Requirements

### Workflow 1: Adding Videos
1. User pastes YouTube URL in prominent input field
2. Modal appears instantly with playlist selection
3. User chooses existing playlist or creates new one
4. Video is added with visual confirmation
5. Modal closes automatically, returning to main view

### Workflow 2: Playlist Management
1. User sees all playlists in sidebar and main dashboard
2. Playlists display as cards with thumbnails and video counts
3. Hover states reveal management options (rename, delete)
4. Inline editing for playlist names with auto-save
5. Drag-and-drop for video reordering within playlists

### Workflow 3: Playback Experience
1. User clicks "Play All" on any playlist
2. Interface transforms to "Productivity Panel" layout:
   - Sidebar collapses to icons-only
   - Left panel shows full playlist queue (320px width)
   - Right panel shows embedded YouTube player
3. Currently playing video highlighted in queue
4. Auto-advance to next video on completion
5. "Back to Library" button restores normal view

### Accessibility Requirements
- **Keyboard Navigation**: Full keyboard accessibility for all interactions
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Color Contrast**: WCAG AA compliance (4.5:1 ratio minimum)
- **Focus Indicators**: Clear focus states for all interactive elements
- **Touch Targets**: Minimum 44px touch targets for mobile

## Data Management

### Local Storage Schema
```typescript
interface VideoItem {
  id: string;           // Unique identifier
  title: string;        // Video title from YouTube
  thumbnail: string;    // YouTube thumbnail URL
  videoId: string;      // YouTube video ID
  duration?: string;    // Video duration (optional)
  addedAt: string;      // ISO timestamp
}

interface Playlist {
  id: string;           // Unique identifier
  name: string;         // User-defined playlist name
  videos: VideoItem[];  // Array of videos in order
  createdAt: string;    // ISO timestamp
  updatedAt: string;    // ISO timestamp
}
```

### Storage Strategy
- **Primary Storage**: Browser localStorage for persistence
- **Backup Strategy**: Export/import functionality for data portability
- **Migration Path**: Version-aware data structure for future updates
- **Size Limits**: Monitor localStorage usage (5-10MB typical limit)

## API Integration

### YouTube Integration
- **Video ID Extraction**: Support multiple YouTube URL formats
- **Thumbnail URLs**: Use YouTube's thumbnail API endpoints
- **Embed Player**: YouTube iframe API for video playback
- **No API Key Required**: Use public endpoints where possible

### Future Backend API
```typescript
// Planned REST API endpoints
GET    /api/playlists              // Get user playlists
POST   /api/playlists              // Create new playlist
PUT    /api/playlists/:id          // Update playlist
DELETE /api/playlists/:id          // Delete playlist
POST   /api/playlists/:id/videos   // Add video to playlist
DELETE /api/playlists/:id/videos/:videoId // Remove video
```

## Security Considerations

### Client-Side Security
- **Input Validation**: Sanitize all user inputs
- **URL Validation**: Verify YouTube URLs before processing
- **XSS Prevention**: Escape user-generated content
- **Content Security Policy**: Restrict external resource loading

### Privacy
- **No Tracking**: No analytics or user tracking by default
- **Local Data**: All data stored locally unless user opts for sync
- **YouTube Privacy**: Use privacy-enhanced YouTube embeds
- **Data Export**: Allow users to export their data

## Performance Optimization

### Code Splitting
- **Route-based**: Split by main views (Dashboard, Playlist, Player)
- **Component-based**: Lazy load heavy components (VideoPlayer)
- **Vendor Splitting**: Separate vendor bundles for better caching

### Asset Optimization
- **Image Loading**: Lazy load playlist thumbnails
- **Bundle Size**: Target < 500KB initial bundle
- **Tree Shaking**: Remove unused code and dependencies
- **Compression**: Enable gzip/brotli compression

### Runtime Performance
- **Virtual Scrolling**: For playlists with 100+ videos
- **Debounced Search**: 300ms debounce for search inputs
- **Memoization**: React.memo for expensive components
- **State Optimization**: Minimize re-renders with proper state structure

## Testing Requirements

### Unit Testing
- **Component Tests**: Test all React components in isolation
- **Utility Tests**: Test YouTube URL parsing and data utilities
- **Hook Tests**: Test custom React hooks
- **Coverage Target**: 80%+ code coverage

### Integration Testing
- **User Workflows**: Test complete user journeys
- **Local Storage**: Test data persistence and retrieval
- **Modal Interactions**: Test modal opening/closing flows
- **Player Integration**: Test YouTube embed functionality

### Browser Testing
- **Cross-browser**: Test on Chrome, Firefox, Safari, Edge
- **Mobile Testing**: Test on iOS Safari and Chrome Mobile
- **Responsive Testing**: Test all breakpoints (320px to 1920px)
- **Performance Testing**: Test with large playlists (500+ videos)

## Deployment Requirements

### Build Process
- **Production Build**: Optimized Vite build with minification
- **Asset Optimization**: Image compression and format optimization
- **Bundle Analysis**: Monitor bundle size and dependencies
- **Environment Variables**: Support for different deployment environments

### Hosting Requirements
- **Static Hosting**: Compatible with Netlify, Vercel, GitHub Pages
- **HTTPS Required**: For YouTube embed functionality
- **CDN Support**: Fast global content delivery
- **Caching Strategy**: Proper cache headers for assets

## Future Enhancements

### Phase 2 Features
- **User Accounts**: Registration and authentication system
- **Cloud Sync**: Sync playlists across devices
- **Sharing**: Share playlists with other users
- **Collaboration**: Collaborative playlist editing
- **Import/Export**: Backup and restore functionality

### Phase 3 Features
- **Advanced Search**: Search within video content
- **Tags and Categories**: Organize playlists with tags
- **Analytics**: View watching statistics and trends
- **Offline Mode**: Download videos for offline viewing
- **Mobile App**: Native iOS and Android applications

### Integration Possibilities
- **Multiple Platforms**: Support for Vimeo, Twitch, etc.
- **Note Taking**: Integration with note-taking apps
- **Calendar**: Schedule playlist watching sessions
- **Social Features**: Follow other users and discover playlists

## Success Metrics

### User Engagement
- **Daily Active Users**: Target 1000+ DAU within 6 months
- **Session Duration**: Average 15+ minutes per session
- **Playlist Creation**: 5+ playlists per active user
- **Video Addition**: 20+ videos added per user per month

### Technical Metrics
- **Page Load Speed**: < 3 seconds on 3G
- **Error Rate**: < 1% JavaScript errors
- **Uptime**: 99.9% availability
- **User Retention**: 60%+ 7-day retention rate

### Business Metrics
- **User Growth**: 20% month-over-month growth
- **Feature Adoption**: 80%+ users use playlist playback
- **User Satisfaction**: 4.5+ star rating
- **Support Tickets**: < 5% of users need support

---

## Development Guidelines

### Code Standards
- **TypeScript**: Strict mode enabled, no `any` types
- **ESLint**: Airbnb configuration with React hooks rules
- **Prettier**: Consistent code formatting
- **Git Hooks**: Pre-commit linting and formatting

### Component Architecture
- **Functional Components**: Use hooks instead of class components
- **Custom Hooks**: Extract reusable logic into custom hooks
- **Props Interface**: Define TypeScript interfaces for all props
- **Error Boundaries**: Implement error boundaries for robustness

### State Management
- **Local State**: Use useState for component-specific state
- **Shared State**: Lift state up to common ancestors
- **Side Effects**: Use useEffect for data fetching and subscriptions
- **Performance**: Use useMemo and useCallback judiciously

This requirements document serves as the single source of truth for QuickList Web development and should be updated as the project evolves.