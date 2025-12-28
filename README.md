# Shreddr

A dead simple mobile-first ticketing system for live music and indie events.

![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)
![Go](https://img.shields.io/badge/Go-1.25-blue.svg)
![React](https://img.shields.io/badge/React-19.2-blue.svg)

## Features

- 🎵 **Event Discovery** - Discover events near you with an intuitive interface
- 💳 **Easy Purchases** - Buy tickets with fiat payments via Coinflow
- 🔐 **Wallet Authentication** - Secure wallet-based authentication with Phantom
- 📱 **Mobile-First** - Progressive Web App (PWA) optimized for mobile devices
- 🎫 **QR Code Tickets** - Digital tickets with QR codes for easy redemption
- ⚡ **Fast & Modern** - Built with React, TypeScript, and Go for performance

## Tech Stack

**Frontend:**
- React 19 with TypeScript
- TanStack Router for routing
- Tailwind CSS for styling
- Vite for build tooling
- Connect RPC for API communication

**Backend:**
- Go 1.25
- Connect RPC service
- Protocol Buffers for API definitions

**Blockchain:**
- Solana integration via Phantom wallet
- Support for multiple wallet types (Ethereum, Solana, Bitcoin, Sui)

## Getting Started

### Prerequisites

- Node.js (for frontend)
- Go 1.25+ (for backend)
- Buf CLI (for protocol buffer generation)

### Development

1. Clone the repository:
```bash
git clone https://github.com/alecsavvy/shreddr.git
cd shreddr
```

2. Start the backend server:
```bash
cd server
go run cmd/app/main.go
```

3. Start the frontend development server:
```bash
cd client
npm install
npm run dev
```

## License

Licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for details.