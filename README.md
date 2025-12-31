# Quare - AI Customer Twin Platform

Quare creates AI-powered "digital twins" of your customers by combining your organizational knowledge with real-time customer data. Ask your customers questions at scale, and watch your understanding grow with every interaction.

## What is a Customer Twin?

A Customer Twin is an AI model that represents your collective understanding of customers. It synthesizes knowledge from:

- **Data Sources** - CRM systems (Salesforce, HubSpot), support platforms (Zendesk, Intercom), and analytics tools (Mixpanel)
- **Knowledge Sources** - Internal documentation, wikis (Confluence), and notes (Notion, Google Drive)
- **SME Interviews** - Captured expertise from Sales, CS, Product, and Support teams
- **Code Extraction** - Business rules and logic extracted from your codebase

## Features

### Ask Your Customer
Ask questions about your customers and receive AI-generated answers synthesized from all connected sources. Each question:
- Shows a detailed execution plan of data sources, knowledge, SME interviews, and code being queried
- Improves your Customer Twin's understanding across 6 key dimensions
- Builds a searchable history of insights

### Customer Twin Visualization
A radar chart visualization showing your understanding across 6 dimensions:
- **Pricing Decisions** - Understanding of price sensitivity and negotiation patterns
- **Churn Signals** - Knowledge of at-risk indicators and retention triggers
- **Onboarding Journey** - Insight into activation paths and drop-off points
- **Feature Adoption** - Understanding of usage patterns and power users
- **Support Patterns** - Knowledge of common issues and resolution paths
- **Satisfaction Drivers** - Insight into NPS drivers and detractors

Click on any historical question to see how your understanding evolved over time.

### Autonomous Agents
AI agents that act on Customer Twin insights:
- **Churn Prevention Agent** - Monitors at-risk customers and triggers retention actions
- **Pricing Optimization Agent** - Adjusts proposals based on customer value signals
- **Onboarding Agent** - Personalizes onboarding sequences for each customer
- **Feature Adoption Agent** - Recommends features based on usage patterns

### Settings & Integrations
Connect and manage:
- Data sources (CRM, Support, Analytics)
- Knowledge sources (Wikis, Docs, Notes)
- Code repositories for business rule extraction

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Charts**: Custom Canvas-based radar chart
- **Icons**: Custom SVG icon components
- **Deployment**: Vercel

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/palmedic/quare-demo.git
cd quare-demo

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Dashboard
│   ├── ask/               # Ask Your Customer page
│   ├── twin/              # Customer Twin visualization
│   ├── automations/       # Autonomous agents
│   └── settings/          # Data source management
├── components/            # Reusable UI components
│   ├── Icons.tsx          # SVG icon components
│   ├── RadarChart.tsx     # Canvas-based radar visualization
│   ├── DimensionBars.tsx  # Progress bar components
│   ├── MetricCard.tsx     # Stat display cards
│   └── Sidebar.tsx        # Navigation sidebar
├── store/                 # Zustand state management
│   └── customerTwinStore.ts
└── data/                  # Sample data
    └── sampleQuestions.ts
```

## Demo Data

This is a demonstration mockup with simulated data. In a production environment:
- Data sources would connect to real CRM, support, and analytics APIs
- Knowledge sources would index actual documents and wikis
- SME interviews would be conducted and transcribed
- Code extraction would scan real repositories for business logic

## License

MIT

---

Built with Next.js and Tailwind CSS. Designed for investor demonstrations.
