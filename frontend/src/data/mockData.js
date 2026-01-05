import { Users, Database, Monitor, Globe, Code2 } from 'lucide-react';
export const categories = [
  { id: 'Web Development', name: 'Web Development', icon: '💬', color: 'hsl(var(--chart-1))' },
  { id: 'Data Structures', name: 'Data Structures', icon: '💻', color: 'hsl(var(--chart-2))' },
  { id: 'HR', name: 'HR', icon: '🎯', color: 'hsl(var(--chart-3))' },
  { id: 'Database', name: 'Database', icon: '👥', color: 'hsl(var(--chart-4))' },
  { id: 'Operating Systems', name: 'Operating Systems', icon: '🧩', color: 'hsl(var(--chart-5))' },
];

export const questions = [
  {
    id: '1',
    category: 'behavioral',
    text: 'Tell me about a time when you had to work with a difficult team member.',
    difficulty: 'medium',
    expectedAnswerType: 'STAR Method (Situation, Task, Action, Result)',
  },
  {
    id: '2',
    category: 'technical',
    text: 'Explain the difference between REST and GraphQL APIs.',
    difficulty: 'medium',
    expectedAnswerType: 'Technical Explanation with Examples',
  },
  {
    id: '3',
    category: 'situational',
    text: 'How would you handle a project with an unrealistic deadline?',
    difficulty: 'hard',
    expectedAnswerType: 'Problem-Solution Framework',
  },
  {
    id: '4',
    category: 'leadership',
    text: 'Describe a situation where you had to motivate a demotivated team.',
    difficulty: 'hard',
    expectedAnswerType: 'Leadership Framework with Outcome',
  },
  {
    id: '5',
    category: 'problem-solving',
    text: 'How would you approach debugging a production issue under pressure?',
    difficulty: 'medium',
    expectedAnswerType: 'Systematic Approach with Prioritization',
  },
  {
    id: '6',
    category: 'behavioral',
    text: 'Give an example of when you received critical feedback and how you handled it.',
    difficulty: 'easy',
    expectedAnswerType: 'STAR Method with Growth Mindset',
  },
  {
    id: '7',
    category: 'technical',
    text: 'What are the key principles of writing clean, maintainable code?',
    difficulty: 'easy',
    expectedAnswerType: 'Best Practices List with Justification',
  },
  {
    id: '8',
    category: 'situational',
    text: 'A stakeholder disagrees with your technical recommendation. How do you proceed?',
    difficulty: 'medium',
    expectedAnswerType: 'Conflict Resolution + Communication Strategy',
  },
];

export const mockAnswers = [
  {
    id: 'a1',
    questionId: '1',
    question: questions[0],
    userAnswer: 'In my previous role, I worked with a colleague who often missed deadlines. I scheduled a one-on-one meeting to understand their challenges and discovered they were overwhelmed. We created a shared task board and I offered to help prioritize. As a result, they improved their delivery rate by 40%.',
    score: 85,
    feedback: 'Excellent use of the STAR method. Your answer demonstrates empathy and proactive problem-solving.',
    improvements: [
      'Include specific metrics for the initial problem',
      'Mention the timeline of improvement',
      'Add how this affected team dynamics positively',
    ],
    idealAnswer: 'A strong answer would include: specific situation context, clear task ownership, detailed actions taken (like the meeting and task board), and measurable results with timeline.',
    timestamp: new Date('2024-01-15'),
  },
  {
    id: 'a2',
    questionId: '2',
    question: questions[1],
    userAnswer: 'REST uses HTTP methods and endpoints while GraphQL uses a single endpoint with queries. GraphQL allows clients to request specific data they need.',
    score: 65,
    feedback: 'Good basic understanding but lacks depth. Consider discussing use cases and trade-offs.',
    improvements: [
      'Explain over-fetching and under-fetching problems',
      'Discuss caching differences',
      'Provide real-world use case examples',
      'Mention schema and type safety in GraphQL',
    ],
    idealAnswer: 'Compare REST\'s resource-based approach vs GraphQL\'s query language, discuss performance implications, caching strategies, and when to use each.',
    timestamp: new Date('2024-01-16'),
  },
];

export const mockSessions = [
  {
    id: 's1',
    date: new Date('2024-01-15'),
    category: 'behavioral',
    questionsAnswered: 5,
    averageScore: 78,
    answers: [mockAnswers[0]],
  },
  {
    id: 's2',
    date: new Date('2024-01-16'),
    category: 'technical',
    questionsAnswered: 4,
    averageScore: 72,
    answers: [mockAnswers[1]],
  },
  {
    id: 's3',
    date: new Date('2024-01-18'),
    category: 'situational',
    questionsAnswered: 3,
    averageScore: 85,
    answers: [],
  },
  {
    id: 's4',
    date: new Date('2024-01-20'),
    category: 'leadership',
    questionsAnswered: 4,
    averageScore: 80,
    answers: [],
  },
];

export const performanceData = [
  { date: 'Jan 10', score: 65, category: 'behavioral' },
  { date: 'Jan 12', score: 70, category: 'technical' },
  { date: 'Jan 15', score: 78, category: 'behavioral' },
  { date: 'Jan 16', score: 72, category: 'technical' },
  { date: 'Jan 18', score: 85, category: 'situational' },
  { date: 'Jan 20', score: 80, category: 'leadership' },
  { date: 'Jan 22', score: 82, category: 'problem-solving' },
  { date: 'Jan 25', score: 88, category: 'behavioral' },
];

export const categoryStats = [
  { category: 'Behavioral', totalQuestions: 25, averageScore: 82, improvement: 12 },
  { category: 'Technical', totalQuestions: 18, averageScore: 75, improvement: 8 },
  { category: 'Situational', totalQuestions: 12, averageScore: 85, improvement: 15 },
  { category: 'Leadership', totalQuestions: 8, averageScore: 78, improvement: 10 },
  { category: 'Problem Solving', totalQuestions: 10, averageScore: 80, improvement: 5 },
];
export const leaderboardData = [
  { rank: 1, name: 'Alex Johnson', avatar: 'AJ', score: 2450, questionsAnswered: 156, streak: 23 },
  { rank: 2, name: 'Sarah Chen', avatar: 'SC', score: 2280, questionsAnswered: 142, streak: 18 },
  { rank: 3, name: 'Mike Wilson', avatar: 'MW', score: 2150, questionsAnswered: 134, streak: 15 },
  { rank: 4, name: 'Emily Davis', avatar: 'ED', score: 1980, questionsAnswered: 128, streak: 12 },
  { rank: 5, name: 'You', avatar: 'YO', score: 1850, questionsAnswered: 115, streak: 8, isCurrentUser: true },
  { rank: 6, name: 'Chris Brown', avatar: 'CB', score: 1720, questionsAnswered: 108, streak: 7 },
  { rank: 7, name: 'Lisa Wang', avatar: 'LW', score: 1650, questionsAnswered: 102, streak: 5 },
  { rank: 8, name: 'James Lee', avatar: 'JL', score: 1580, questionsAnswered: 98, streak: 4 },
];