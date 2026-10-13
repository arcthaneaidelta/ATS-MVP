import { Course, Certificate } from '../../types';

export const initialCourses: Course[] = [
  {
    id: 'course-rest-ops',
    slug: 'restaurant-operations-essentials',
    title: 'Restaurant Operations Essentials',
    description: 'Master shift pacing, service recovery protocols, food cost controls, and kitchen-to-floor synchronization.',
    level: 'Beginner',
    instructor: 'Dr. Sana Malik',
    instructorRole: 'Hospitality Operations Lead & Former Michelin GM',
    lessonCount: 24,
    durationHours: 6.5,
    price: 79,
    rating: 4.9,
    studentsEnrolled: 84,
    status: 'Published',
    category: 'Operations',
    modules: [
      {
        id: 'mod-1',
        title: 'Module 1: Opening Checklists & Shift Cadence',
        lessons: [
          { id: 'les-1', title: '1.1 The Golden 60 Minutes Before Doors Open', duration: '14:20', durationMinutes: 14, isCompleted: true },
          { id: 'les-2', title: '1.2 Line Check Audits and Temperature Logs', duration: '18:45', durationMinutes: 18, isCompleted: true },
          { id: 'les-3', title: '1.3 Pre-Shift Team Briefings that Actually Work', duration: '12:10', durationMinutes: 12, isCompleted: true },
        ],
      },
      {
        id: 'mod-2',
        title: 'Module 2: Floor Pacing and Table Turns',
        lessons: [
          { id: 'les-4', title: '2.1 Reading Rush Velocity Without Shouting', duration: '16:30', durationMinutes: 16, isCompleted: true },
          { id: 'les-5', title: '2.2 Managing Host Stand Bottlenecks', duration: '15:15', durationMinutes: 15, isCompleted: true },
          { id: 'les-6', title: '2.3 Section Load Balancing Under Heavy Covers', duration: '20:00', durationMinutes: 20, isCompleted: true },
        ],
      },
      {
        id: 'mod-3',
        title: 'Module 3: Kitchen Display System Synchronization',
        lessons: [
          { id: 'les-7', title: '3.1 Ticket Routing Logic & Fire Commands', duration: '14:50', durationMinutes: 14, isCompleted: true },
          { id: 'les-8', title: '3.2 Eliminating the 12-Minute Plateau', duration: '17:25', durationMinutes: 17, isCompleted: true },
          { id: 'les-9', title: '3.3 Expo Station Command: Eyes on Every Plate', duration: '22:10', durationMinutes: 22, isCompleted: true },
          { id: 'les-10', title: '3.4 Managing Modifiers & Allergy Protocols Live', duration: '19:40', durationMinutes: 19, isCompleted: true },
          { id: 'les-11', title: '3.5 Real-Time Variance Tracking with Cirqla KDS', duration: '16:05', durationMinutes: 16, isCompleted: false }, // Currently at 11
        ],
      },
      {
        id: 'mod-4',
        title: 'Module 4: Closing, Audits & Reconciliation',
        lessons: [
          { id: 'les-12', title: '4.1 End-of-Day Register Reconciliation', duration: '15:00', durationMinutes: 15, isLocked: true },
          { id: 'les-13', title: '4.2 Waste Log Documentation', duration: '11:30', durationMinutes: 11, isLocked: true },
        ],
      },
    ],
  },
  {
    id: 'course-data-lit',
    slug: 'reading-your-numbers',
    title: 'Reading Your Numbers: Data Literacy for Managers',
    description: 'Transform POS transaction reports into actionable margin protection, labour efficiency, and prep pacing decisions.',
    level: 'Intermediate',
    instructor: 'Omar Haddad',
    instructorRole: 'Head of Financial Analytics at MetroDining',
    lessonCount: 18,
    durationHours: 5.0,
    price: 99,
    rating: 4.8,
    studentsEnrolled: 62,
    status: 'Published',
    category: 'Finance & Analytics',
    modules: [
      {
        id: 'mod-dl-1',
        title: 'Module 1: Prime Cost Decoded',
        lessons: [
          { id: 'les-dl-1', title: '1.1 Food Cost vs Labour Cost Trade-offs', duration: '16:20', durationMinutes: 16, isCompleted: true },
          { id: 'les-dl-2', title: '1.2 Calculating Theoretical vs Actual COGS', duration: '21:10', durationMinutes: 21, isCompleted: true },
          { id: 'les-dl-3', title: '1.3 Reading Margin Erosion in Realtime', duration: '18:40', durationMinutes: 18, isCompleted: false }, // Current lesson 3
        ],
      },
    ],
  },
  {
    id: 'course-guest-exp',
    slug: 'designing-the-guest-experience',
    title: 'Designing the Guest Experience',
    description: 'From initial table scan to departure gesture: engineering frictionless touchpoints that turn diners into vocal champions.',
    level: 'Intermediate',
    instructor: 'Priya Natarajan',
    instructorRole: 'Experience Design Director',
    lessonCount: 20,
    durationHours: 5.5,
    price: 89,
    rating: 4.9,
    studentsEnrolled: 51,
    status: 'Published',
    category: 'Service Design',
    modules: [
      {
        id: 'mod-ge-1',
        title: 'Module 1: Frictionless Touchpoints',
        lessons: [
          { id: 'les-ge-1', title: '1.1 The Psychology of the QR Menu Scan', duration: '15:30', durationMinutes: 15 },
          { id: 'les-ge-2', title: '1.2 Digital Up-sells that Feel Hospitable', duration: '18:00', durationMinutes: 18 },
        ],
      },
    ],
  },
  {
    id: 'course-food-safety',
    slug: 'food-safety-compliance',
    title: 'Food Safety and Compliance Fundamentals',
    description: 'Critical temperature controls, allergen containment workflows, hazard analysis, and inspection readiness.',
    level: 'Beginner',
    instructor: 'Dr. Sana Malik',
    instructorRole: 'Hospitality Operations Lead & Former Michelin GM',
    lessonCount: 12,
    durationHours: 3.0,
    price: 0,
    isFree: true,
    rating: 5.0,
    studentsEnrolled: 140,
    status: 'Published',
    category: 'Compliance',
    modules: [
      {
        id: 'mod-fs-1',
        title: 'Module 1: Critical Control Points',
        lessons: [
          { id: 'les-fs-1', title: '1.1 HACCP Principles in Modern Kitchens', duration: '18:00', durationMinutes: 18, isCompleted: true },
          { id: 'les-fs-2', title: '1.2 Allergen Segregation in Prep Lines', duration: '22:00', durationMinutes: 22, isCompleted: true },
        ],
      },
    ],
  },
  {
    id: 'course-menu-eng',
    slug: 'menu-engineering-and-pricing',
    title: 'Menu Engineering and Pricing',
    description: 'Stars, Plowhorses, Puzzles, and Dogs: restructuring menu layouts to lift bottom-line margins by 12–18%.',
    level: 'Advanced',
    instructor: 'Elias Brandt',
    instructorRole: 'Revenue Optimization Strategist',
    lessonCount: 16,
    durationHours: 4.5,
    price: 119,
    rating: 4.7,
    studentsEnrolled: 38,
    status: 'Published',
    category: 'Finance & Analytics',
    modules: [],
  },
  {
    id: 'course-lead-teams',
    slug: 'leading-service-teams',
    title: 'Leading Service Teams',
    description: 'Retain frontline culinary and service talent through structured coaching, objective feedback, and transparent shift incentives.',
    level: 'Intermediate',
    instructor: 'Priya Natarajan',
    instructorRole: 'Experience Design Director',
    lessonCount: 14,
    durationHours: 4.0,
    price: 89,
    rating: 4.9,
    studentsEnrolled: 45,
    status: 'Published',
    category: 'Leadership',
    modules: [],
  },
];

export const initialCertificates: Certificate[] = [
  {
    id: 'cert-hira-fs',
    certificateNumber: 'BIQ-2026-00391',
    studentName: 'Hira Siddiqui',
    courseTitle: 'Food Safety and Compliance Fundamentals',
    courseSlug: 'food-safety-compliance',
    issueDate: 'August 24, 2026',
    status: 'Valid',
    qrVerifyUrl: '/academy/verify/BIQ-2026-00391',
  },
];

export const quizQuestions = [
  {
    id: 'q1',
    question: 'When a diner places an order with a required modifier group (e.g. choice of side), what is the system UX rule?',
    options: [
      'The item is added immediately with a random default',
      'The Add to Order button remains disabled with a subtle shake hint until a selection is made',
      'An alert popup forces the user to browse another menu category',
      'The modifier is billed at checkout as an unexpected fee'
    ],
    correctAnswer: 1,
    explanation: 'Section 8.4 mandates that required modifier groups must be explicitly chosen; the sticky Add button disables and gently shakes if tapped without choice.'
  },
  {
    id: 'q2',
    question: 'In BionicIQ multi-tenancy architecture, how is venue theme customization achieved?',
    options: [
      'Each venue requires a completely separate deploy and code fork',
      'By dynamically overriding the --clay CSS token and tenant metadata without changing core layouts',
      'By injecting raw arbitrary HTML scripts from untrusted venue admins',
      'Through hardcoded iframe embeds'
    ],
    correctAnswer: 1,
    explanation: 'Section 8.7 specifies that only the --clay accent token and tenant logo/name are dynamically updated at the app root, keeping all shared design tokens intact.'
  },
  {
    id: 'q3',
    question: 'What is the target threshold for sub-second live order synchronization between diner and kitchen?',
    options: [
      'Within 300 ms across active tabs via shared state and BroadcastChannel',
      'Within 15 to 30 seconds via batch HTTP polling',
      'Only upon full browser page refresh',
      'Within 5 minutes via cron jobs'
    ],
    correctAnswer: 0,
    explanation: 'Cross-tab and cross-device sync operates with sub-300ms responsiveness as proven in Section 8.6 and 14.1.'
  },
  {
    id: 'q4',
    question: 'Under anti-AI design guidelines, which aesthetic practice is explicitly prohibited in BionicIQ?',
    options: [
      'Instrument Serif typography',
      'Opaque cards with 1px hairlines',
      'Gradients, glassmorphism, floating neon blobs and giant 96px gradient text',
      'Warm paper canvas background (#F6F3ED)'
    ],
    correctAnswer: 2,
    explanation: 'Anti-AI rules (Section 2) prohibit glassmorphism, gradients (except a 2% hero wash), neon colors, and floating particle fields.'
  },
  {
    id: 'q5',
    question: 'When testing payment transactions, which test card number triggers a realistic declined state?',
    options: [
      '4242 4242 4242 4242',
      '4000 0000 0000 0002',
      '4000 0000 0000 3220',
      '5555 5555 5555 4444'
    ],
    correctAnswer: 1,
    explanation: 'Section 7.4 specifies card ending in 0002 triggers an inline declined banner and allows immediate retry with form preservation.'
  }
];
