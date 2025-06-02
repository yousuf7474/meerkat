# AWS Amplify Deployment Guide for Meerkat

## Overview
This guide covers deploying the Meerkat frontend application to AWS Amplify with proper configuration.

## Prerequisites
- AWS Account with Amplify access
- GitHub repository connected to AWS Amplify
- Node.js 18+ in your local environment

## Environment Variables Setup

### Required Environment Variables in AWS Amplify Console:
```
VITE_AWS_REGION=us-east-1
VITE_AWS_ACCESS_KEY_ID=your_access_key_here
VITE_AWS_SECRET_ACCESS_KEY=your_secret_key_here
VITE_BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0
VITE_API_BASE_URL=https://your-api-domain.com
VITE_WS_URL=wss://your-websocket-domain.com
VITE_NODE_ENV=production
```

### Setting Environment Variables in Amplify:
1. Go to AWS Amplify Console
2. Select your app → Environment variables
3. Add each variable listed above
4. Click "Save"

## Build Configuration

The project uses the `amplify.yml` file for build configuration. Key features:
- Node.js 18 for consistency
- Optimized npm caching
- Type checking before build
- Security headers

## Troubleshooting Common Issues

### 1. SSM Secrets Setup Failed
**Issue**: `!Failed to set up process.env.secrets`
**Solution**: 
- Ensure environment variables are set in Amplify Console
- Check IAM permissions for Amplify service role

### 2. Deprecated Package Warnings
**Issue**: Multiple npm deprecation warnings
**Solution**: These are warnings only and don't break the build. Dependencies have been updated to latest compatible versions.

### 3. Build Cache Issues
**Issue**: Build fails due to cache corruption
**Solution**: 
- Clear cache in build settings
- The `amplify.yml` includes cache clearing commands

### 4. Type Check Failures
**Issue**: TypeScript compilation errors
**Solution**:
- Run `npm run type-check` locally first
- Fix any TypeScript errors before deploying

## Build Process Steps

1. **preBuild Phase**:
   - Set Node.js version to 18
   - Clear npm cache
   - Install dependencies with optimized caching
   - Set environment variables

2. **Build Phase**:
   - Run TypeScript type checking
   - Build production bundle
   - Generate optimized assets

3. **Deploy Phase**:
   - Deploy to Amplify CDN
   - Apply security headers
   - Enable SPA routing

## Performance Optimizations

- Code splitting by vendor, UI, and router chunks
- Terser minification enabled
- Source maps disabled for production
- Optimized chunk size warnings

## Security Headers Applied

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`

## AWS Bedrock Integration

The project is configured to use AWS Bedrock instead of OpenAI:
- Removed OpenAPI TypeScript generation
- Environment variables configured for Bedrock
- Claude 3 Sonnet model as default

## Monitoring and Logs

Check build logs in AWS Amplify Console:
1. Go to your app in Amplify Console
2. Click on "Build settings" → "Build history"
3. Click on any build to see detailed logs

## Local Development

To test the build locally:
```bash
npm run type-check
npm run build
npm run preview
```

## Support

If you encounter issues:
1. Check the build logs in Amplify Console
2. Verify all environment variables are set
3. Ensure your AWS IAM permissions are correct
4. Test the build locally first 