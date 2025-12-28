# Shreddr

A dead simple mobile-first ticketing system for live music and indie events.

![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)
![Go](https://img.shields.io/badge/Go-1.25-blue.svg)
![React](https://img.shields.io/badge/React-19.2-blue.svg)

## Features

- Browse and discover events in your area
- Purchase tickets with Apple Pay and Google Pay via Coinflow
- Social login powered by Phantom Connect
- Digital tickets with QR codes for sharing and verifiable entry
- Optimized for mobile use as a Progressive Web App (PWA), no app store required

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