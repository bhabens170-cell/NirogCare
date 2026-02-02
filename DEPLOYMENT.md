# 🚀 Deployment Guide

This guide will help you deploy NirogCare to various platforms.

## 📋 Prerequisites

- Node.js 18+ installed
- Git repository set up
- Domain name (optional)
- Hosting platform account

## 🌐 Deployment Options

### 1. 🆓 Vercel (Recommended)

#### Quick Deploy
1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables:
     ```
     VITE_GEMINI_API_KEY=your_api_key_here
     ```
   - Click "Deploy"

#### Custom Domain
- In Vercel dashboard → Settings → Domains
- Add your custom domain
- Update DNS records

### 2. 🆓 Netlify

#### Deploy via Git
1. **Push to GitHub**
2. **Connect Netlify**
   - Go to [netlify.com](https://netlify.com)
   - "Add new site" → "Import an existing project"
   - Connect GitHub repository
   - Build settings:
     ```
     Build command: npm run build
     Publish directory: dist
     ```
   - Add environment variables in Site settings

#### Manual Deploy
```bash
npm run build
# Upload 'dist' folder to Netlify
```

### 3. 🆓 GitHub Pages

#### Setup
1. **Update vite.config.ts**
   ```typescript
   export default defineConfig({
     base: '/nirogcare/',
     // ... rest of config
   })
   ```

2. **Create GitHub Action**
   Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [ main ]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: '18'
         - run: npm ci
         - run: npm run build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

3. **Enable GitHub Pages**
   - Repository → Settings → Pages
   - Source: Deploy from a branch
   - Branch: gh-pages

### 4. 🐳 Docker

#### Create Dockerfile
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Build and Run
```bash
docker build -t nirogcare .
docker run -p 80:80 nirogcare
```

### 5. ☁️ Cloud Platforms

#### AWS S3 + CloudFront
1. **Build the app**
   ```bash
   npm run build
   ```

2. **Upload to S3**
   ```bash
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

3. **Configure CloudFront**
   - Create CloudFront distribution
   - Set S3 bucket as origin
   - Configure caching

#### Google Cloud Platform
```bash
# Deploy to Firebase Hosting
npm install -g firebase-tools
firebase init hosting
firebase deploy
```

## 🔧 Environment Configuration

### Required Environment Variables
```bash
# Google Gemini API (Required for AI features)
VITE_GEMINI_API_KEY=your_gemini_api_key

# Optional: Supabase (for backend features)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

### Setup Instructions
1. **Get Gemini API Key**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create new API key
   - Add to environment variables

2. **Optional Supabase Setup**
   - Create account at [supabase.com](https://supabase.com)
   - Create new project
   - Copy URL and anon key
   - Add to environment variables

## 📱 Mobile App Deployment

### Progressive Web App (PWA)
NirogCare is PWA-ready! Users can:
1. Install on mobile devices
2. Use offline capabilities
3. Receive push notifications

### Native App Options
- **Capacitor**: Convert to iOS/Android apps
- **React Native**: Rewrite for native performance
- **Expo**: Deploy to app stores

## 🔒 Security Considerations

### Production Checklist
- [ ] Remove all console.log statements
- [ ] Use HTTPS everywhere
- [ ] Implement rate limiting
- [ ] Set up monitoring
- [ ] Configure CORS properly
- [ ] Use environment variables for secrets
- [ ] Enable CSP headers
- [ ] Set up backup systems

### API Security
```javascript
// Example rate limiting middleware
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
```

## 📊 Monitoring & Analytics

### Recommended Tools
- **Google Analytics**: User behavior tracking
- **Sentry**: Error monitoring
- **LogRocket**: Session replay
- **Hotjar**: Heatmaps and recordings

### Setup Example
```javascript
// Google Analytics
import ReactGA from 'react-ga';

ReactGA.initialize('GA_MEASUREMENT_ID');
ReactGA.pageview(window.location.pathname);
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: CI/CD Pipeline
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      
  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🚀 Performance Optimization

### Build Optimization
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          charts: ['recharts']
        }
      }
    }
  }
})
```

### Caching Strategy
- Static assets: 1 year cache
- API responses: 5 minutes cache
- HTML: No cache (always fresh)

## 📞 Support

### Deployment Issues
1. **Check build logs** for errors
2. **Verify environment variables**
3. **Test locally first**
4. **Check platform documentation**
5. **Contact platform support**

### Common Issues
- **CORS errors**: Configure allowed origins
- **Build failures**: Check Node.js version
- **API errors**: Verify API keys
- **Routing issues**: Check base URL configuration

---

## 🎯 Quick Deployment Checklist

- [ ] Code is committed to GitHub
- [ ] All tests pass
- [ ] Environment variables configured
- [ ] Build succeeds locally
- [ ] Documentation updated
- [ ] Security review completed
- [ ] Backup plan in place
- [ ] Monitoring configured
- [ ] Domain configured (if applicable)
- [ ] SSL certificate installed

---

**🚀 Ready to deploy NirogCare to the world! 💚**

*For deployment support, create an issue on GitHub*
