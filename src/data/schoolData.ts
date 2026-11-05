/**
 * Hassan Scholars Public School - Zafarwal, Punjab, Pakistan
 * Core institution information, academic programs, facilities, faculty, events & gallery data.
 */

export interface AcademicProgram {
  id: string;
  name: string;
  ageGroup: string;
  category: 'Early Childhood' | 'Primary' | 'Middle' | 'Secondary';
  tagline: string;
  description: string;
  keySubjects: string[];
  features: string[];
  timing: string;
  eligibility: string;
  monthlyFeeEst: string;
}

export interface Facility {
  id: string;
  title: string;
  category: string;
  description: string;
  iconName: string;
  image: string;
  highlights: string[];
}

export interface TeacherProfile {
  id: string;
  name: string;
  designation: string;
  subject: string;
  qualification: string;
  experience: string;
  quote: string;
  avatarColor: string;
}

export interface SchoolEvent {
  id: string;
  title: string;
  category: 'Event' | 'Examination' | 'Admission' | 'Meeting';
  date: string;
  time: string;
  location: string;
  description: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Campus' | 'Classrooms' | 'Labs' | 'Sports' | 'Events';
  image: string;
  caption: string;
  date: string;
}

export interface AdmissionApplication {
  id: string;
  trackingId: string;
  submissionDate: string;
  studentName: string;
  fatherName: string;
  dob: string;
  gender: string;
  grade: string;
  parentPhone: string;
  address: string;
  previousSchool: string;
  guardianCnic?: string;
  additionalNotes?: string;
  status: 'Received' | 'Review Underway' | 'Assessment Scheduled' | 'Admission Offered';
}

export const SCHOOL_DETAILS = {
  name: 'Hassan Scholars Public School',
  urduName: 'حسن اسکالرز پبلک اسکول ظفروال',
  tagline: 'Building Bright Futures Through Quality Education',
  motto: 'Knowledge, Character & Excellence',
  establishedYear: '2012',
  locationCity: 'Zafarwal',
  district: 'Narowal',
  province: 'Punjab',
  country: 'Pakistan',
  fullAddress: 'Main Circular Road, near Degree College Chowk, Zafarwal, District Narowal, Punjab, Pakistan',
  phonePrimary: '+92 542 538120',
  phoneMobile: '+92 300 7548921',
  phoneWhatsApp: '+92 300 7548921',
  email: 'info@hassanscholars.edu.pk',
  admissionsEmail: 'admissions@hassanscholars.edu.pk',
  affiliation: 'Board of Intermediate & Secondary Education (BISE) Gujranwala / Punjab School Education Dept',
  hours: {
    regular: 'Monday – Thursday: 07:45 AM – 01:45 PM',
    friday: 'Friday: 07:45 AM – 12:00 PM',
    saturdayOffice: 'Saturday (Admin Office only): 08:30 AM – 12:30 PM',
    sunday: 'Sunday: Closed',
  },
  stats: [
    { value: '100%', label: 'Matric Board Pass Rate', sub: 'Distinction Records' },
    { value: '35+', label: 'Qualified Educators', sub: 'Subject Specialists' },
    { value: '15:1', label: 'Student-Teacher Ratio', sub: 'Personalized Focus' },
    { value: '1,200+', label: 'Enrolled Scholars', sub: 'Nursery to Grade 10' },
  ],
};

export const ACADEMIC_PROGRAMS: AcademicProgram[] = [
  {
    id: 'playgroup',
    name: 'Playgroup',
    ageGroup: '2.5 – 3.5 Years',
    category: 'Early Childhood',
    tagline: 'Joyful first steps into social interaction and cognitive discovery.',
    description: 'A warm, nurturing play-based learning atmosphere focused on sensory development, language stimulation, motor skills, and foundational routines in a secure environment.',
    keySubjects: ['Sensory Exploration', 'Phonics & Nursery Rhymes', 'Creative Arts', 'Urdu & English Listening'],
    features: ['Montessori didactic apparatus', 'Child-safe soft indoor activity area', 'Trained early childhood caregivers', 'Habit formation & social bonding'],
    timing: '08:15 AM – 12:00 PM',
    eligibility: 'Minimum 2.5 years of age at admission time.',
    monthlyFeeEst: 'PKR 3,500',
  },
  {
    id: 'nursery',
    name: 'Nursery',
    ageGroup: '3.5 – 4.5 Years',
    category: 'Early Childhood',
    tagline: 'Fostering natural curiosity, alphabet awareness, and early numbers.',
    description: 'Children develop self-confidence, phonemic awareness in English and Urdu, counting foundations, fine motor control, and cooperative play through guided discovery.',
    keySubjects: ['English Alphabet & Phonics', 'Urdu Haroof-e-Tahajji', 'Early Numeracy (1-50)', 'General Knowledge & Islamiyat'],
    features: ['Storytelling circle sessions', 'Tracing & pre-writing refinement', 'Color & shape recognition games', 'Routine moral stories & etiquette'],
    timing: '08:00 AM – 12:30 PM',
    eligibility: 'Minimum 3.5 years of age at admission time.',
    monthlyFeeEst: 'PKR 3,800',
  },
  {
    id: 'kindergarten',
    name: 'Kindergarten (Prep)',
    ageGroup: '4.5 – 5.5 Years',
    category: 'Early Childhood',
    tagline: 'Preparing confident young scholars for formal primary schooling.',
    description: 'Comprehensive school-readiness curriculum introducing basic sentence reading, mental math, science curiosity, bilingual vocabulary, and classroom focus.',
    keySubjects: ['Bilingual Reading & Writing', 'Mathematics Foundations', 'Nature & Discovery Science', 'Islamic Ethics & Values'],
    features: ['Sight word mastery & cursive intro', 'Basic additions and subtractions', 'Computer orientation & audio-visual aids', 'Stage confidence & assembly presentations'],
    timing: '07:45 AM – 01:00 PM',
    eligibility: 'Completion of Nursery or developmental age 4.5+ years.',
    monthlyFeeEst: 'PKR 4,200',
  },
  {
    id: 'primary',
    name: 'Primary Classes (Grade 1 – 5)',
    ageGroup: '6 – 10 Years',
    category: 'Primary',
    tagline: 'Strong academic grounding with concept mastery and moral integrity.',
    description: 'Rigorous Punjab and Oxford/Single National Curriculum blend that cements fluent literacy, computational problem-solving, environmental science, and Islamic character values.',
    keySubjects: ['English Language & Literature', 'Urdu Adab & Grammar', 'Mathematics', 'General Science', 'Social Studies & Islamiyat', 'Basic Computing'],
    features: ['Regular STEM activity workshops', 'Quranic Nazra with Tajweed recitation', 'Spelling bees & mental math contests', 'Weekly library and sports periods'],
    timing: '07:45 AM – 01:30 PM',
    eligibility: 'Satisfactory assessment test & previous school school leaving record.',
    monthlyFeeEst: 'PKR 4,800 – 5,500',
  },
  {
    id: 'middle',
    name: 'Middle Classes (Grade 6 – 8)',
    ageGroup: '11 – 13 Years',
    category: 'Middle',
    tagline: 'Analytical thinking, scientific inquiry, and leadership readiness.',
    description: 'Transitioning students toward critical thinking, laboratory-based experimentation, structured essay writing, computer programming fundamentals, and competitive sports.',
    keySubjects: ['Advanced English', 'Urdu Insha', 'General Science (Physics/Chemistry/Bio intro)', 'Algebra & Geometry', 'History & Geography', 'Computer Science & ICT'],
    features: ['Hands-on science lab sessions', 'Coding & IT basics in multimedia lab', 'Inter-house debates and speech contests', 'Personal guidance and career mentoring'],
    timing: '07:45 AM – 01:45 PM',
    eligibility: 'Pass in Grade 5 / Grade 6 entrance assessment.',
    monthlyFeeEst: 'PKR 5,800 – 6,500',
  },
  {
    id: 'secondary',
    name: 'Secondary / Matriculation (Grade 9 – 10)',
    ageGroup: '14 – 16 Years',
    category: 'Secondary',
    tagline: 'Excellence in BISE Gujranwala Board Matriculation examinations.',
    description: 'Intensive academic preparation for SSC (Matric) with dedicated Science (Biology/Physics/Chemistry/Maths) and Computer Science streams, rigorous test series, and past-paper mastery.',
    keySubjects: ['Physics', 'Chemistry', 'Biology / Computer Science', 'Mathematics', 'English Compulsory', 'Urdu Compulsory', 'Islamiyat & Pakistan Studies'],
    features: ['Full syllabus coverage with 3-phase revision rounds', 'Fully equipped physics, chemistry, and biology labs', 'Special evening remedial and doubt-clearing sessions', 'Consistent top grade (A+ & A) track record in BISE Gujranwala'],
    timing: '07:45 AM – 02:00 PM',
    eligibility: 'Pass in Grade 8 with minimum 60% marks or assessment.',
    monthlyFeeEst: 'PKR 7,000 – 7,800',
  },
];

export const SCHOOL_FACILITIES: Facility[] = [
  {
    id: 'classrooms',
    title: 'Modern Smart Classrooms',
    category: 'Academics',
    description: 'Well-ventilated, naturally lit classrooms equipped with multimedia smart projectors, comfortable ergonomic wooden benches, and interactive whiteboards.',
    iconName: 'School',
    image: '/src/assets/images/classroom_learning_1793852516096.jpg',
    highlights: ['Interactive smart screens', 'Maximum 28 students per section', 'Climate-controlled air circulation'],
  },
  {
    id: 'faculty',
    title: 'Qualified & Passionate Faculty',
    category: 'Teaching Excellence',
    description: 'Over 35 experienced educators holding Master’s and M.Phil degrees with regular teacher training certifications in modern child psychology and instructional methodologies.',
    iconName: 'GraduationCap',
    image: '/src/assets/images/hero_school_students_1793852515659.jpg',
    highlights: ['Subject specialists for every grade', 'Ongoing pedagogical workshops', 'Parent-accessible mentoring'],
  },
  {
    id: 'computer-lab',
    title: 'Advanced Computer & IT Education',
    category: 'Technology',
    description: 'High-speed networked computer lab offering practical training in coding fundamentals, Office applications, typing proficiency, and digital research literacy.',
    iconName: 'Laptop',
    image: '/src/assets/images/science_computer_lab_1793852516955.jpg',
    highlights: ['1:1 student-to-computer ratio', 'High-speed filtered educational internet', 'Python & web foundations for seniors'],
  },
  {
    id: 'science-labs',
    title: 'Science & Experimental Learning',
    category: 'STEM Laboratories',
    description: 'Separate well-equipped laboratories for Physics, Chemistry, and Biology complying with BISE standards, encouraging empirical curiosity and safe experimentation.',
    iconName: 'FlaskConical',
    image: '/src/assets/images/science_computer_lab_1793852516955.jpg',
    highlights: ['High-precision optical microscopes', 'Certified lab technicians & safety gear', 'Regular weekly practical demonstrations'],
  },
  {
    id: 'library',
    title: 'Resourceful School Library',
    category: 'Literature & Research',
    description: 'A serene reading sanctuary housing over 5,000 volumes including classical literature, encyclopedias, Islamic studies collections, poetry, and academic journals.',
    iconName: 'BookOpen',
    image: '/src/assets/images/classroom_learning_1793852516096.jpg',
    highlights: ['Bilingual Urdu & English fiction and non-fiction', 'Quiet study cubicles', 'Weekly reading hour for all grades'],
  },
  {
    id: 'sports',
    title: 'Sports & Physical Fitness Ground',
    category: 'Athletics',
    description: 'Expansive lush grass sports ground supporting cricket, football, badminton, athletics, volleyball, and gymnastics under the guidance of certified physical trainers.',
    iconName: 'Trophy',
    image: '/src/assets/images/sports_activities_1793852517629.jpg',
    highlights: ['Annual sports gala tournament', 'Inter-school cricket & athletics teams', 'Daily morning physical warm-ups'],
  },
  {
    id: 'cleanliness',
    title: 'Clean & Secure Campus',
    category: 'Safety & Hygiene',
    description: 'Gated 24/7 guarded premises equipped with HD CCTV surveillance, dedicated RO water filtration plants delivering certified pure drinking water, and sanitization protocols.',
    iconName: 'ShieldCheck',
    image: '/src/assets/images/hero_school_students_1793852515659.jpg',
    highlights: ['RO pure mineral water plant', 'CCTV monitoring on all gates and corridors', 'Full-time security personnel and nurse care'],
  },
  {
    id: 'character',
    title: 'Character & Spiritual Development',
    category: 'Values & Ethics',
    description: 'Holistic emphasis on moral values, Tarbiyah, daily Hadith reflections in morning assembly, Quranic Nazra recitation, truthfulness, teamwork, and civic responsibility.',
    iconName: 'HeartHandshake',
    image: '/src/assets/images/school_annual_event_1793852517539.jpg',
    highlights: ['Daily morning assembly ethics talks', 'Charity drives & community service', 'Leadership and house prefect system'],
  },
];

export const TEACHERS_LIST: TeacherProfile[] = [
  {
    id: 't1',
    name: 'Sir Muhammad Naveed Hassan',
    designation: 'Principal & Senior Administrator',
    subject: 'Educational Administration & Mathematics',
    qualification: 'M.Sc. Mathematics, M.Ed. (Punjab University)',
    experience: '18+ Years Experience',
    quote: 'True education harmonizes brilliant intellectual attainment with unshakeable moral integrity.',
    avatarColor: 'bg-blue-900',
  },
  {
    id: 't2',
    name: 'Madam Shabnam Riaz',
    designation: 'Vice Principal & Head of Sciences',
    subject: 'Biology & Chemistry',
    qualification: 'M.Phil Biochemistry (Quaid-i-Azam University)',
    experience: '14+ Years Experience',
    quote: 'Our laboratories are playgrounds of curiosity where students turn textbook facts into living discoveries.',
    avatarColor: 'bg-emerald-800',
  },
  {
    id: 't3',
    name: 'Sir Tariq Mahmood',
    designation: 'Senior Faculty & Board Coordinator',
    subject: 'Physics & Senior Mathematics',
    qualification: 'M.Sc. Physics (GCU Lahore), B.Ed.',
    experience: '12+ Years Experience',
    quote: 'Demystifying complex physics concepts equips our Matric scholars with lifelong problem-solving intuition.',
    avatarColor: 'bg-indigo-900',
  },
  {
    id: 't4',
    name: 'Madam Ayesha Siddiqua',
    designation: 'Senior English Specialist',
    subject: 'English Language & World Literature',
    qualification: 'M.A. English Literature & Linguistics (PU)',
    experience: '10+ Years Experience',
    quote: 'Articulate expression in speech and writing is the master key to global opportunity.',
    avatarColor: 'bg-amber-900',
  },
  {
    id: 't5',
    name: 'Sir Usman Ali Cheema',
    designation: 'Head of IT & Computer Sciences',
    subject: 'Computer Science & ICT',
    qualification: 'BS Computer Science (FAST-NUCES), Certified Educator',
    experience: '8+ Years Experience',
    quote: 'We prepare students not just to consume technology, but to innovate, code, and lead in the digital era.',
    avatarColor: 'bg-cyan-900',
  },
  {
    id: 't6',
    name: 'Madam Farhat Yasmeen',
    designation: 'Coordinator, Early Childhood Education',
    subject: 'Montessori & Primary Foundations',
    qualification: 'M.A. Urdu, Diploma in Montessori Education',
    experience: '11+ Years Experience',
    quote: 'Every child blossoms when nurtured with kindness, playful exploration, and consistent encouragement.',
    avatarColor: 'bg-rose-900',
  },
];

export const SCHOOL_EVENTS: SchoolEvent[] = [
  {
    id: 'e1',
    title: 'Admissions Open for Academic Session 2026–2027',
    category: 'Admission',
    date: 'March 15 – April 30, 2026',
    time: '08:00 AM – 01:30 PM (Daily)',
    location: 'Main Admissions Desk & Online Portal',
    description: 'Registration and entrance assessment for Playgroup through Grade 9. Merit scholarships and sibling fee concessions available.',
    status: 'Ongoing',
  },
  {
    id: 'e2',
    title: 'Annual Grand Prize Distribution Ceremony',
    category: 'Event',
    date: 'April 18, 2026',
    time: '10:00 AM – 01:00 PM',
    location: 'School Main Auditorium & Lawn',
    description: 'Honoring top board achievers, academic distinction holders, debate champions, and athletic trophy winners with distinguished guests.',
    status: 'Upcoming',
  },
  {
    id: 'e3',
    title: 'BISE Gujranwala Matriculation Board Examinations',
    category: 'Examination',
    date: 'May 05 – May 25, 2026',
    time: '08:30 AM – 11:30 AM',
    location: 'Official BISE Examination Centers',
    description: 'SSC Part 1 & Part 2 theory and laboratory practical examinations. Roll number slips dispatched to candidates.',
    status: 'Upcoming',
  },
  {
    id: 'e4',
    title: 'Quarterly Parent-Teacher Consultative Meeting (PTM)',
    category: 'Meeting',
    date: 'April 25, 2026',
    time: '08:30 AM – 01:00 PM',
    location: 'Respective Classrooms & Faculty Lounge',
    description: 'Individual parent discussions with subject teachers regarding student progress cards, attendance records, and personalized coaching.',
    status: 'Upcoming',
  },
  {
    id: 'e5',
    title: 'Inter-House Sports Gala & Cricket Championship',
    category: 'Event',
    date: 'February 20, 2026',
    time: 'Full Day',
    location: 'School Athletic Grounds',
    description: 'Jinnah House, Iqbal House, Sir Syed House, and Liaquat House clashed in cricket, 100m sprint, tug of war, and gymnastics.',
    status: 'Completed',
  },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g1',
    title: 'Campus Front Courtyard & Morning Assembly',
    category: 'Campus',
    image: '/src/assets/images/hero_school_students_1793852515659.jpg',
    caption: 'Students gathered for the morning assembly and national anthem under the clock tower.',
    date: 'March 2026',
  },
  {
    id: 'g2',
    title: 'Interactive Smart Board Classroom Session',
    category: 'Classrooms',
    image: '/src/assets/images/classroom_learning_1793852516096.jpg',
    caption: 'Teacher demonstrating geography and river systems of Pakistan on high-resolution interactive screen.',
    date: 'February 2026',
  },
  {
    id: 'g3',
    title: 'Senior STEM & IT Computer Science Laboratory',
    category: 'Labs',
    image: '/src/assets/images/science_computer_lab_1793852516955.jpg',
    caption: 'Scholars performing chemical titration, microscopy, and coding exercises under specialist supervision.',
    date: 'January 2026',
  },
  {
    id: 'g4',
    title: 'Annual Sports Day & Cricket Match on Lawn',
    category: 'Sports',
    image: '/src/assets/images/sports_activities_1793852517629.jpg',
    caption: 'Inter-house cricket tournament and track events on the sprawling green athletic ground.',
    date: 'February 2026',
  },
  {
    id: 'g5',
    title: 'Annual Function Academic Awards Ceremony',
    category: 'Events',
    image: '/src/assets/images/school_annual_event_1793852517539.jpg',
    caption: 'High achievers receiving shields and merit certificates on the stage from senior dignitaries.',
    date: 'March 2026',
  },
];

export const INITIAL_ADMISSIONS_DATA: AdmissionApplication[] = [
  {
    id: 'adm-01',
    trackingId: 'HSPS-2026-0842',
    submissionDate: '2026-03-20',
    studentName: 'Zainab Fatima',
    fatherName: 'Muhammad Tariq',
    dob: '2016-04-12',
    gender: 'Female',
    grade: 'Primary Classes (Grade 4)',
    parentPhone: '0301-7654321',
    address: 'Near Old Hospital Road, Mohallah Farooqabad, Zafarwal',
    previousSchool: 'Al-Huda Model School, Zafarwal',
    status: 'Admission Offered',
  },
  {
    id: 'adm-02',
    trackingId: 'HSPS-2026-0915',
    submissionDate: '2026-03-24',
    studentName: 'Hamza Bilal',
    fatherName: 'Bilal Ahmad Khan',
    dob: '2012-09-08',
    gender: 'Male',
    grade: 'Secondary / Matriculation (Grade 9)',
    parentPhone: '0333-8912345',
    address: 'Circular Road, Pasrur Stop, Zafarwal',
    previousSchool: 'Government High School, Zafarwal',
    status: 'Assessment Scheduled',
  },
  {
    id: 'adm-03',
    trackingId: 'HSPS-2026-1044',
    submissionDate: '2026-04-02',
    studentName: 'Muhammad Rayyan',
    fatherName: 'Khurram Shehzad',
    dob: '2021-02-18',
    gender: 'Male',
    grade: 'Kindergarten (Prep)',
    parentPhone: '0300-6549871',
    address: 'Chowk Degree College, Ward No. 4, Zafarwal',
    previousSchool: 'Home Taught',
    status: 'Review Underway',
  },
];
