#!/bin/bash

echo "🚀 Setting up Yackson's World..."

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created. Please review and update if needed."
else
    echo "✅ .env file already exists."
fi

# Check if SSL certificates exist
if [ ! -f "ssl/fullchain.pem" ] || [ ! -f "ssl/privkey.pem" ]; then
    echo ""
    echo "⚠️  SSL certificates not found!"
    echo "Would you like to generate self-signed certificates for development? (y/n)"
    read -r response
    
    if [ "$response" = "y" ] || [ "$response" = "Y" ]; then
        echo "🔐 Generating self-signed SSL certificates..."
        
        # Create ssl directory if it doesn't exist
        mkdir -p ssl
        
        # Generate self-signed certificate using OpenSSL
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout ssl/privkey.pem \
            -out ssl/fullchain.pem \
            -subj "/CN=localhost"
        
        if [ $? -eq 0 ]; then
            echo "✅ Self-signed certificates generated!"
        else
            echo "❌ Failed to generate certificates. Please install OpenSSL or generate them manually."
            echo "See ssl/README.md for instructions."
        fi
    else
        echo "⚠️  Please add your SSL certificates to the ssl/ directory before starting."
        echo "See ssl/README.md for instructions."
    fi
else
    echo "✅ SSL certificates found."
fi

echo ""
echo "📦 Building and starting Docker containers..."
echo "This may take a few minutes on first run..."

# Build and start containers
docker-compose up -d --build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Yackson's World is running!"
    echo ""
    echo "🌐 Access your application at:"
    echo "   - HTTP:  http://localhost"
    echo "   - HTTPS: https://localhost"
    echo ""
    echo "🔧 API endpoints:"
    echo "   - Backend API: http://localhost/api/"
    echo ""
    echo "📊 View logs:"
    echo "   docker-compose logs -f"
    echo ""
    echo "🛑 Stop the application:"
    echo "   docker-compose down"
else
    echo ""
    echo "❌ Failed to start Docker containers."
    echo "Check the error messages above for details."
fi
