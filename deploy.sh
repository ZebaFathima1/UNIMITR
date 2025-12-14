#!/bin/bash

# UniMitr Deployment Script
# Builds React and deploys with Django
# Run from root directory: bash deploy.sh

echo "🚀 UniMitr Deployment Script Starting..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Clean previous build
echo -e "${CYAN}Step 1: Cleaning previous builds...${NC}"
if [ -d "build" ]; then
    rm -rf build
    echo -e "${GREEN}✓ Cleaned build/ folder${NC}"
fi

# Step 2: Install dependencies
echo -e "\n${CYAN}Step 2: Installing frontend dependencies...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ npm install failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Dependencies installed${NC}"

# Step 3: Build React
echo -e "\n${CYAN}Step 3: Building React frontend...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ npm run build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ React build completed${NC}"

# Step 4: Copy build to Django
echo -e "\n${CYAN}Step 4: Copying React build to Django...${NC}"
mkdir -p backend/staticfiles_build/frontend
rm -rf backend/staticfiles_build/frontend/*
cp -r build/* backend/staticfiles_build/frontend/
echo -e "${GREEN}✓ React build copied to Django${NC}"

# Step 5: Run collectstatic (optional)
echo -e "\n${CYAN}Step 5: Collecting Django static files...${NC}"
cd backend
python manage.py collectstatic --noinput
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠ Warning: collectstatic encountered issues${NC}"
fi
cd ..
echo -e "${GREEN}✓ Static files collected${NC}"

# Step 6: Summary
echo -e "\n${GREEN}═════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ DEPLOYMENT COMPLETE!${NC}"
echo -e "${GREEN}═════════════════════════════════════════${NC}"
echo ""
echo -e "${CYAN}Frontend location: backend/staticfiles_build/frontend/${NC}"
echo -e "${CYAN}Build type: Production${NC}"
echo ""
echo -e "${CYAN}Next steps:${NC}"
echo "1. Start Django server:"
echo -e "   ${YELLOW}cd backend${NC}"
echo -e "   ${YELLOW}python manage.py runserver 0.0.0.0:8000${NC}"
echo ""
echo "2. Open browser:"
echo -e "   ${YELLOW}http://localhost:8000${NC}"
echo ""
echo "3. Access admin:"
echo -e "   ${YELLOW}http://localhost:8000/admin/${NC}"
echo ""
echo -e "${GREEN}═════════════════════════════════════════${NC}"
