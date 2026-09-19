export type TaskCategory = 'Money' | 'Housing' | 'Health' | 'Work' | 'Legal/Admin';

export interface Step {
  id: string;
  description: string;
}

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  explainer: string;
  timeEstimate: string; // e.g. "15 mins"
  isRecurring: boolean;
  recurrenceInterval?: 'monthly' | 'yearly';
  steps: Step[];
  hasAIDraft?: boolean;
  aiPromptTemplate?: string;
  draftType?: 'email' | 'call_script' | 'letter';
}

export const tasks: Task[] = [
  {
    id: 't_money_1',
    title: 'Dispute a bank fee',
    category: 'Money',
    explainer: 'Banks sometimes charge unexpected fees (like overdraft or low balance fees). You can often get these waived just by asking.',
    timeEstimate: '10 mins',
    isRecurring: false,
    hasAIDraft: true,
    draftType: 'call_script',
    aiPromptTemplate: 'Write a polite but firm call script to a bank asking to waive a fee. Bank name: {{bankName}}, Fee amount: {{feeAmount}}, Reason: {{reason}}',
    steps: [
      { id: 's1', description: 'Log into your bank account and find the exact fee amount and date.' },
      { id: 's2', description: 'Find the customer service phone number on the back of your debit card.' },
      { id: 's3', description: 'Generate and review your call script.' },
      { id: 's4', description: 'Call the bank and read the script.' }
    ]
  },
  {
    id: 't_money_2',
    title: 'Set up a basic budget',
    category: 'Money',
    explainer: 'A budget helps you understand where your money goes so you don\'t run out before payday. The 50/30/20 rule is a great place to start.',
    timeEstimate: '30 mins',
    isRecurring: true,
    recurrenceInterval: 'monthly',
    steps: [
      { id: 's1', description: 'Calculate your total monthly income after taxes.' },
      { id: 's2', description: 'List all fixed expenses (rent, utilities, insurance).' },
      { id: 's3', description: 'List variable expenses (groceries, entertainment).' },
      { id: 's4', description: 'Allocate roughly 50% to needs, 30% to wants, 20% to savings.' }
    ]
  },
  {
    id: 't_money_3',
    title: 'File your taxes',
    category: 'Money',
    explainer: 'Taxes are due every April in the US. If you only have W-2 income, filing is usually free and relatively straightforward.',
    timeEstimate: '1 hr',
    isRecurring: true,
    recurrenceInterval: 'yearly',
    steps: [
      { id: 's1', description: 'Gather your W-2 forms from your employer(s).' },
      { id: 's2', description: 'Choose a free tax filing software (like FreeTaxUSA or TurboTax Free Edition).' },
      { id: 's3', description: 'Enter your personal info and W-2 details into the software.' },
      { id: 's4', description: 'Review and submit your return.' }
    ]
  },
  {
    id: 't_housing_1',
    title: 'Get Renters Insurance',
    category: 'Housing',
    explainer: 'Your landlord\'s insurance covers the building, not your stuff. Renters insurance covers your belongings if they are stolen or damaged in a fire, and usually costs less than $15/month.',
    timeEstimate: '20 mins',
    isRecurring: true,
    recurrenceInterval: 'yearly',
    steps: [
      { id: 's1', description: 'Estimate the total value of your belongings (laptop, clothes, furniture).' },
      { id: 's2', description: 'Get quotes from 2-3 insurance companies (e.g., Lemonade, Geico, State Farm).' },
      { id: 's3', description: 'Choose a policy and set up monthly or annual payments.' },
      { id: 's4', description: 'Save a copy of your policy document.' }
    ]
  },
  {
    id: 't_housing_2',
    title: 'Ask Landlord to Fix Something',
    category: 'Housing',
    explainer: 'Your landlord is legally required to keep your apartment habitable. Put repair requests in writing so there\'s a paper trail.',
    timeEstimate: '10 mins',
    isRecurring: false,
    hasAIDraft: true,
    draftType: 'email',
    aiPromptTemplate: 'Write a polite maintenance request email to a landlord. Issue: {{issue}}, Urgency: {{urgency}}, Preferred access time: {{accessTime}}',
    steps: [
      { id: 's1', description: 'Take photos or videos of the issue.' },
      { id: 's2', description: 'Check your lease to see how maintenance requests should be submitted.' },
      { id: 's3', description: 'Generate the email and send it to your landlord/property manager.' },
      { id: 's4', description: 'Follow up if you don\'t hear back in 48 hours.' }
    ]
  },
  {
    id: 't_housing_3',
    title: 'Set up Utilities',
    category: 'Housing',
    explainer: 'You need to set up electricity, internet, and sometimes gas/water in your name before moving into a new place.',
    timeEstimate: '45 mins',
    isRecurring: false,
    steps: [
      { id: 's1', description: 'Ask your landlord which utilities you are responsible for.' },
      { id: 's2', description: 'Find the local providers for your address.' },
      { id: 's3', description: 'Call or go online to start service on your move-in date.' },
      { id: 's4', description: 'Set up auto-pay for your new accounts.' }
    ]
  },
  {
    id: 't_health_1',
    title: 'Find a Primary Care Doctor',
    category: 'Health',
    explainer: 'Having a regular doctor makes it easier to get care when you\'re sick, and preventative visits are usually 100% covered by insurance.',
    timeEstimate: '30 mins',
    isRecurring: false,
    hasAIDraft: true,
    draftType: 'call_script',
    aiPromptTemplate: 'Write a short script to call a doctor\'s office and ask if they are accepting new patients and take my insurance. Insurance provider: {{insuranceProvider}}, Plan type: {{planType}}',
    steps: [
      { id: 's1', description: 'Log into your insurance portal to find "in-network" doctors near you.' },
      { id: 's2', description: 'Check online reviews for a few doctors on the list.' },
      { id: 's3', description: 'Call the office to confirm they take your insurance and are accepting new patients.' },
      { id: 's4', description: 'Schedule an initial "new patient" or physical exam.' }
    ]
  },
  {
    id: 't_health_2',
    title: 'Understand Your Health Insurance',
    category: 'Health',
    explainer: 'Knowing terms like premium, deductible, copay, and out-of-pocket maximum will save you from surprise medical bills.',
    timeEstimate: '15 mins',
    isRecurring: false,
    steps: [
      { id: 's1', description: 'Find out your deductible (how much you pay before insurance kicks in).' },
      { id: 's2', description: 'Find out your copay (the fixed amount you pay for a doctor visit).' },
      { id: 's3', description: 'Keep your digital or physical insurance card accessible.' }
    ]
  },
  {
    id: 't_health_3',
    title: 'Refill a Prescription',
    category: 'Health',
    explainer: 'Don\'t wait until you run out of meds. Most pharmacies let you set up auto-refills.',
    timeEstimate: '10 mins',
    isRecurring: true,
    recurrenceInterval: 'monthly',
    steps: [
      { id: 's1', description: 'Check the label to see if you have refills left.' },
      { id: 's2', description: 'If yes, call the pharmacy or use their app to request a refill.' },
      { id: 's3', description: 'If no, contact your doctor\'s office to request a new prescription.' }
    ]
  },
  {
    id: 't_work_1',
    title: 'Set up 401(k) / Retirement',
    category: 'Work',
    explainer: 'If your employer offers a 401(k) match, it is literal free money. Try to contribute at least enough to get the full match.',
    timeEstimate: '30 mins',
    isRecurring: false,
    steps: [
      { id: 's1', description: 'Log into your employer\'s retirement portal (e.g., Fidelity, Vanguard).' },
      { id: 's2', description: 'Find out what the employer match is.' },
      { id: 's3', description: 'Set your contribution rate to at least the match percentage.' },
      { id: 's4', description: 'Choose an investment fund (a Target Date Fund is a good default).' }
    ]
  },
  {
    id: 't_work_2',
    title: 'Understand your Pay Stub',
    category: 'Work',
    explainer: 'Your take-home pay is less than your salary because of taxes and deductions. It\'s important to check that the deductions are correct.',
    timeEstimate: '15 mins',
    isRecurring: false,
    steps: [
      { id: 's1', description: 'Find Gross Pay (what you earned before deductions).' },
      { id: 's2', description: 'Review tax deductions (Federal, State, FICA/Medicare).' },
      { id: 's3', description: 'Review benefit deductions (health insurance, 401k).' },
      { id: 's4', description: 'Confirm Net Pay (what actually hits your bank account).' }
    ]
  },
  {
    id: 't_work_3',
    title: 'Negotiate a Raise',
    category: 'Work',
    explainer: 'If you\'ve taken on more responsibility or been at a job for a year, it might be time to ask for more money. Come prepared with data.',
    timeEstimate: '1 hr',
    isRecurring: false,
    hasAIDraft: true,
    draftType: 'email',
    aiPromptTemplate: 'Write an email to my manager asking for a meeting to discuss compensation. Mention my recent achievements: {{achievements}}, and my current role: {{role}}',
    steps: [
      { id: 's1', description: 'Research market rates for your role (Glassdoor, Payscale).' },
      { id: 's2', description: 'Make a list of your accomplishments and added value over the last year.' },
      { id: 's3', description: 'Schedule a meeting with your manager specifically to discuss compensation.' },
      { id: 's4', description: 'Practice your pitch and prepare for counter-offers.' }
    ]
  },
  {
    id: 't_legal_1',
    title: 'Update your Address',
    category: 'Legal/Admin',
    explainer: 'When you move, you need to tell the post office, your bank, and the DMV so you don\'t miss important mail.',
    timeEstimate: '30 mins',
    isRecurring: false,
    steps: [
      { id: 's1', description: 'Fill out a change of address form with the USPS (costs $1.10 online).' },
      { id: 's2', description: 'Update your address with your bank and credit card companies.' },
      { id: 's3', description: 'Update your employer/HR department.' },
      { id: 's4', description: 'Update your driver\'s license and car registration at the DMV.' }
    ]
  },
  {
    id: 't_legal_2',
    title: 'Register to Vote',
    category: 'Legal/Admin',
    explainer: 'If you moved to a new state or county, you need to update your voter registration to vote in local and national elections.',
    timeEstimate: '15 mins',
    isRecurring: false,
    steps: [
      { id: 's1', description: 'Go to vote.gov to find your state\'s registration rules.' },
      { id: 's2', description: 'Fill out the online or mail-in form.' },
      { id: 's3', description: 'Confirm your polling place before election day.' }
    ]
  },
  {
    id: 't_legal_3',
    title: 'Cancel a Subscription',
    category: 'Legal/Admin',
    explainer: 'Gyms and some services make it notoriously hard to cancel. Sometimes you have to send a formal email or letter.',
    timeEstimate: '15 mins',
    isRecurring: false,
    hasAIDraft: true,
    draftType: 'email',
    aiPromptTemplate: 'Write a firm email to cancel a subscription/membership. Service name: {{serviceName}}, Account number: {{accountNumber}}, Effective date: {{effectiveDate}}',
    steps: [
      { id: 's1', description: 'Find the cancellation policy in your contract or on their website.' },
      { id: 's2', description: 'Locate your account number or member ID.' },
      { id: 's3', description: 'Generate a cancellation email/letter and send it.' },
      { id: 's4', description: 'Monitor your credit card statement to ensure you aren\'t billed again.' }
    ]
  }
];
