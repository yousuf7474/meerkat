# 1. Install dependencies
npm install

# 2. Copy your API specifications
# Replace specs/openapi.json with your actual OpenAPI 3.1 specification
# Replace specs/asyncapi.yaml with your actual AsyncAPI 3.0 specification

# 3. Copy the ScaleCapacity logo
# Place sc-logo.png in the public/ directory

# 4. Generate API clients
npm run generate

# 5. Set up environment variables
cp .env.example .env
# Edit .env to set VITE_API_BASE_URL to your backend URL

# 6. Start development server
npm run dev

# 7. Build for production
npm run build

# 8. Preview production build
npm run preview