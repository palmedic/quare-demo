import { QuestionData } from '@/store/customerTwinStore'

export const sampleQuestions: QuestionData[] = [
  {
    question: "Why do customers abandon during pricing review?",
    boosts: { pricing: 15, churn: 10 },
    sources: ['CRM Notes', 'Exit Surveys', 'Sales Calls'],
    answer: "Based on analysis of 147 deals in your CRM and 23 exit surveys, customers abandon pricing review primarily due to: (1) Unexpected enterprise tier pricing jumps - 42% cite sticker shock when moving from Growth to Enterprise, (2) Complex per-seat calculations - 31% struggle to predict costs for growing teams, (3) Missing ROI justification materials - 27% need more concrete value documentation for internal approval. Consider implementing a pricing calculator and ROI toolkit."
  },
  {
    question: "What makes customers stop the onboarding process?",
    boosts: { onboarding: 18, churn: 8, satisfaction: 5 },
    sources: ['Product Analytics', 'Support Tickets', 'SME: CS Lead'],
    answer: "Analysis of 892 onboarding sessions reveals three critical drop-off points: (1) Integration setup - 34% abandon at CRM connection step, avg time spent: 23 mins, (2) Team invitation - 28% stop after inviting first team member (waiting for others), (3) First workflow creation - 21% exit during template selection, indicating choice paralysis. Your CS Lead confirms that customers who complete a 15-min guided session have 3.2x higher completion rates."
  },
  {
    question: "Which features drive the most engagement?",
    boosts: { features: 20, satisfaction: 12 },
    sources: ['Usage Data', 'Code Logic', 'NPS Comments'],
    answer: "Top engagement drivers based on 45-day usage analysis: (1) Automated Workflows - 78% of power users access daily, correlates with 92 NPS score, (2) Team Dashboards - 2.3x session length when accessed, (3) Custom Reports - highest correlation with expansion revenue (r=0.73), (4) Mobile App - 45% increase in weekend engagement. Code analysis shows Automated Workflows has the most business logic complexity, suggesting it's your core differentiator."
  },
  {
    question: "What triggers customers to contact support?",
    boosts: { support: 22, satisfaction: 8, features: 5 },
    sources: ['Zendesk Tickets', 'Chat Logs', 'SME: Support Manager'],
    answer: "Support ticket analysis (n=2,341) reveals patterns: (1) Billing questions - 28% of tickets, peak on 1st of month, (2) Integration errors - 24%, mostly Salesforce sync issues, (3) Permission/access issues - 19%, spike when new team members join, (4) Feature requests disguised as bugs - 15%. Your Support Manager notes that 40% of tickets could be resolved with better in-app tooltips. Customers who use chat have 18% faster resolution times."
  },
  {
    question: "Why do enterprise customers choose us over competitors?",
    boosts: { pricing: 12, satisfaction: 15, features: 10 },
    sources: ['Win/Loss Analysis', 'Sales Recordings', 'Contract Notes'],
    answer: "Win analysis of 56 enterprise deals (>$100K ACV) shows: (1) Security & compliance - 67% cite SOC2 and GDPR features as decisive, (2) API flexibility - 54% value unlimited API calls vs competitor caps, (3) Customer success included - 48% appreciate dedicated CSM at no extra cost, (4) Migration support - 41% influenced by white-glove data migration. Top competitor losses: 23% to Vendor A (better Salesforce integration), 18% to Vendor B (lower price point)."
  },
]

export const getQuestionAnswer = (question: string): string => {
  const found = sampleQuestions.find(q => q.question === question)
  return found?.answer || "Based on analysis of your connected data sources, I've identified several key patterns. This insight helps strengthen your Customer Twin's understanding of this dimension."
}
