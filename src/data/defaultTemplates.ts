import { RecordType, Student, CommentLibraryItem, RecordEntry } from '../types';

export const DEFAULT_TEMPLATES: RecordType[] = [
  {
    id: 'template-assessment',
    name: 'Assessment Record',
    description: 'Track ongoing assessments, quiz scores, percentages, and letter grades.',
    isTemplate: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    icon: 'FileSpreadsheet',
    category: 'Academic',
    columns: [
      { id: 'col_date', name: 'Date', type: 'date', order: 0, isRequired: true, defaultValue: 'today' },
      { id: 'col_subject', name: 'Subject', type: 'dropdown', order: 1, isRequired: true, dropdownOptions: ['Mathematics', 'Science', 'English Language Arts', 'Social Studies', 'Art', 'PE'] },
      { id: 'col_type', name: 'Assessment Type', type: 'dropdown', order: 2, dropdownOptions: ['Quiz', 'Project', 'Homework', 'Classwork', 'Oral Presentation'] },
      { id: 'col_score', name: 'Score', type: 'number', order: 3, defaultValue: 0 },
      { id: 'col_max_score', name: 'Max Score', type: 'number', order: 4, defaultValue: 100 },
      { 
        id: 'col_pct', 
        name: 'Percentage', 
        type: 'calculated', 
        order: 5, 
        formula: 'percentage',
        formulaConfig: { scoreColId: 'col_score', maxScoreColId: 'col_max_score' }
      },
      { 
        id: 'col_grade', 
        name: 'Grade', 
        type: 'calculated', 
        order: 6, 
        formula: 'grade',
        formulaConfig: { scoreColId: 'col_pct' }
      },
      { id: 'col_notes', name: 'Notes', type: 'longText', order: 7 }
    ]
  },
  {
    id: 'template-reading',
    name: 'Reading Record',
    description: 'Monitor reading progress, book titles, page count, and comprehension.',
    isTemplate: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    icon: 'BookOpen',
    category: 'Literacy',
    columns: [
      { id: 'col_r_date', name: 'Date', type: 'date', order: 0, defaultValue: 'today' },
      { id: 'col_book', name: 'Book Title', type: 'text', order: 1, isRequired: true },
      { id: 'col_pages', name: 'Pages Read', type: 'number', order: 2, defaultValue: 10 },
      { id: 'col_level', name: 'Reading Level', type: 'dropdown', order: 3, dropdownOptions: ['Guided Reading A-Z', 'DRA 1-40', 'Lexile 200L-800L', 'Emergent', 'Early', 'Fluent', 'Advanced'] },
      { id: 'col_comp', name: 'Comprehension Score', type: 'dropdown', order: 4, dropdownOptions: ['1 - Needs Practice', '2 - Developing', '3 - Proficient', '4 - Advanced'] },
      { id: 'col_comments', name: 'Comments', type: 'longText', order: 5 }
    ]
  },
  {
    id: 'template-remedial',
    name: 'Remedial Record',
    description: 'Document targeted interventions, skills practiced, and next steps.',
    isTemplate: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    icon: 'LifeBuoy',
    category: 'Intervention',
    columns: [
      { id: 'col_rem_date', name: 'Date', type: 'date', order: 0, defaultValue: 'today' },
      { id: 'col_rem_subj', name: 'Subject', type: 'dropdown', order: 1, dropdownOptions: ['Math', 'Reading', 'Writing', 'Science'] },
      { id: 'col_topic', name: 'Topic / Skill', type: 'text', order: 2, isRequired: true },
      { id: 'col_activity', name: 'Activities Done', type: 'longText', order: 3 },
      { id: 'col_progress', name: 'Progress Level', type: 'dropdown', order: 4, dropdownOptions: ['Initial Stage', 'Slight Improvement', 'Moderate Mastery', 'Fully Mastered'] },
      { id: 'col_next', name: 'Next Steps', type: 'text', order: 5 }
    ]
  },
  {
    id: 'template-test',
    name: 'Test Record',
    description: 'Formal exam tracking with weighted scores, percentages, and teacher remarks.',
    isTemplate: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    icon: 'GraduationCap',
    category: 'Academic',
    columns: [
      { id: 'col_t_date', name: 'Test Date', type: 'date', order: 0, defaultValue: 'today' },
      { id: 'col_t_subj', name: 'Subject', type: 'dropdown', order: 1, dropdownOptions: ['Mathematics', 'Science', 'English Language Arts', 'Social Studies'] },
      { id: 'col_t_name', name: 'Test Name', type: 'text', order: 2, isRequired: true },
      { id: 'col_t_score', name: 'Score', type: 'number', order: 3 },
      { id: 'col_t_max', name: 'Max Score', type: 'number', order: 4, defaultValue: 100 },
      { 
        id: 'col_t_pct', 
        name: 'Percentage', 
        type: 'calculated', 
        order: 5, 
        formula: 'percentage',
        formulaConfig: { scoreColId: 'col_t_score', maxScoreColId: 'col_t_max' }
      },
      { 
        id: 'col_t_grade', 
        name: 'Grade', 
        type: 'calculated', 
        order: 6, 
        formula: 'grade',
        formulaConfig: { scoreColId: 'col_t_pct' }
      },
      { id: 'col_t_remarks', name: 'Remarks', type: 'longText', order: 7 }
    ]
  },
  {
    id: 'template-social',
    name: 'Social Record',
    description: 'Log social-emotional incidents, positive behaviors, actions, and follow-ups.',
    isTemplate: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    icon: 'HeartHandshake',
    category: 'Behavioral',
    columns: [
      { id: 'col_s_date', name: 'Date', type: 'date', order: 0, defaultValue: 'today' },
      { id: 'col_s_type', name: 'Incident / Behavior', type: 'dropdown', order: 1, dropdownOptions: ['Positive Behavior', 'Peer Conflict', 'Disruption', 'Kindness Award', 'Emotional Distress', 'Leadership'] },
      { id: 'col_s_desc', name: 'Description', type: 'longText', order: 2, isRequired: true },
      { id: 'col_s_action', name: 'Action Taken', type: 'text', order: 3 },
      { id: 'col_s_followup', name: 'Follow-up Required', type: 'checkbox', order: 4, defaultValue: false }
    ]
  },
  {
    id: 'template-progress',
    name: 'Progress Record',
    description: 'Track growth over school terms from initial benchmark to current level.',
    isTemplate: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    icon: 'TrendingUp',
    category: 'Reports',
    columns: [
      { id: 'col_p_term', name: 'Term', type: 'dropdown', order: 0, dropdownOptions: ['Term 1', 'Term 2', 'Term 3', 'Term 4', 'Semester 1', 'Semester 2'] },
      { id: 'col_p_subj', name: 'Subject', type: 'dropdown', order: 1, dropdownOptions: ['Mathematics', 'Reading', 'Writing', 'Science', 'Social Studies'] },
      { id: 'col_p_begin', name: 'Beginning Level', type: 'dropdown', order: 2, dropdownOptions: ['Below Grade Level', 'At Grade Level', 'Above Grade Level'] },
      { id: 'col_p_curr', name: 'Current Level', type: 'dropdown', order: 3, dropdownOptions: ['Below Grade Level', 'At Grade Level', 'Above Grade Level', 'Exceeding Grade Level'] },
      { id: 'col_p_imprv', name: 'Improvement', type: 'dropdown', order: 4, dropdownOptions: ['Significant Growth', 'Steady Growth', 'Needs Reinforcement', 'No Change'] },
      { id: 'col_p_comments', name: 'Teacher Comments', type: 'longText', order: 5 }
    ]
  }
];

export const INITIAL_STUDENTS: Student[] = [
  { id: 'stu_1', name: 'Alex Johnson', studentId: 'STU-1001', tags: ['Advanced', 'Math Group 1'], notes: 'Participates actively in science experiments.', isArchived: false, createdAt: new Date().toISOString(), gender: 'M', gradeLevel: 'Grade 5' },
  { id: 'stu_2', name: 'Beatrix Vance', studentId: 'STU-1002', tags: ['Reading Group A', 'Honor Roll'], notes: 'Avid reader, completed 15 books this term.', isArchived: false, createdAt: new Date().toISOString(), gender: 'F', gradeLevel: 'Grade 5' },
  { id: 'stu_3', name: 'Carlos Mendez', studentId: 'STU-1003', tags: ['Needs Support', 'ESL'], notes: 'Requires visual aids for math story problems.', isArchived: false, createdAt: new Date().toISOString(), gender: 'M', gradeLevel: 'Grade 5' },
  { id: 'stu_4', name: 'Diana Prince', studentId: 'STU-1004', tags: ['Advanced', 'Leadership'], notes: 'Class monitor, excellent group facilitator.', isArchived: false, createdAt: new Date().toISOString(), gender: 'F', gradeLevel: 'Grade 5' },
  { id: 'stu_5', name: 'Ethan Hunt', studentId: 'STU-1005', tags: ['Needs Support', 'Math Group 2'], notes: 'Benefits from fill-down worksheet structure.', isArchived: false, createdAt: new Date().toISOString(), gender: 'M', gradeLevel: 'Grade 5' },
  { id: 'stu_6', name: 'Fiona Gallagher', studentId: 'STU-1006', tags: ['Reading Group B'], notes: 'Making steady progress in phonics decoding.', isArchived: false, createdAt: new Date().toISOString(), gender: 'F', gradeLevel: 'Grade 5' },
  { id: 'stu_7', name: 'George Clark', studentId: 'STU-1007', tags: ['Honor Roll'], notes: 'Consistently completes homework on time.', isArchived: false, createdAt: new Date().toISOString(), gender: 'M', gradeLevel: 'Grade 5' },
  { id: 'stu_8', name: 'Hannah Abbott', studentId: 'STU-1008', tags: ['Reading Group A'], notes: 'Expresses creative ideas in narrative writing.', isArchived: false, createdAt: new Date().toISOString(), gender: 'F', gradeLevel: 'Grade 5' },
  { id: 'stu_9', name: 'Ian Malcolm', studentId: 'STU-1009', tags: ['Math Group 1', 'Advanced'], notes: 'Enjoys logic puzzles and math challenges.', isArchived: false, createdAt: new Date().toISOString(), gender: 'M', gradeLevel: 'Grade 5' },
  { id: 'stu_10', name: 'Jasmine Reed', studentId: 'STU-1010', tags: ['ESL'], notes: 'Rapidly improving vocabulary acquisition.', isArchived: false, createdAt: new Date().toISOString(), gender: 'F', gradeLevel: 'Grade 5' },
  { id: 'stu_11', name: 'Kevin Tran', studentId: 'STU-1011', tags: ['Math Group 1'], notes: 'Strong mental math calculation skills.', isArchived: false, createdAt: new Date().toISOString(), gender: 'M', gradeLevel: 'Grade 5' },
  { id: 'stu_12', name: 'Laura Palmer', studentId: 'STU-1012', tags: ['Reading Group B'], notes: 'Needs encouragement during oral reading.', isArchived: false, createdAt: new Date().toISOString(), gender: 'F', gradeLevel: 'Grade 5' },
  { id: 'stu_13', name: 'Michael Scott', studentId: 'STU-1013', tags: ['Leadership'], notes: 'Brings great enthusiasm to group activities.', isArchived: false, createdAt: new Date().toISOString(), gender: 'M', gradeLevel: 'Grade 5' },
  { id: 'stu_14', name: 'Nina Simone', studentId: 'STU-1014', tags: ['Honor Roll', 'Advanced'], notes: 'Exceptional artistic and presentation skills.', isArchived: false, createdAt: new Date().toISOString(), gender: 'F', gradeLevel: 'Grade 5' },
  { id: 'stu_15', name: 'Oscar Isaac', studentId: 'STU-1015', tags: ['Needs Support'], notes: 'Accommodated with extra time for tests.', isArchived: false, createdAt: new Date().toISOString(), gender: 'M', gradeLevel: 'Grade 5' },
  { id: 'stu_16', name: 'Penelope Cruz', studentId: 'STU-1016', tags: ['Reading Group A'], notes: 'Excellent reading comprehension scores.', isArchived: false, createdAt: new Date().toISOString(), gender: 'F', gradeLevel: 'Grade 5' },
  { id: 'stu_17', name: 'Quincy Jones', studentId: 'STU-1017', tags: ['Math Group 2'], notes: 'Responsive to small-group math tutoring.', isArchived: false, createdAt: new Date().toISOString(), gender: 'M', gradeLevel: 'Grade 5' },
  { id: 'stu_18', name: 'Rachel Green', studentId: 'STU-1018', tags: ['Honor Roll'], notes: 'Very organized notebook and study habits.', isArchived: false, createdAt: new Date().toISOString(), gender: 'F', gradeLevel: 'Grade 5' },
  { id: 'stu_19', name: 'Samuel Jackson', studentId: 'STU-1019', tags: ['Advanced'], notes: 'Presents confident book reviews.', isArchived: false, createdAt: new Date().toISOString(), gender: 'M', gradeLevel: 'Grade 5' },
  { id: 'stu_20', name: 'Tina Fey', studentId: 'STU-1020', tags: ['Leadership', 'Honor Roll'], notes: 'Helpful peer tutor for classmates.', isArchived: false, createdAt: new Date().toISOString(), gender: 'F', gradeLevel: 'Grade 5' }
];

export const INITIAL_COMMENT_LIBRARY: CommentLibraryItem[] = [
  { id: 'c_1', text: 'Demonstrates excellent comprehension and critical thinking.', category: 'Academic', usageCount: 14, createdAt: new Date().toISOString() },
  { id: 'c_2', text: 'Shows steady improvement in problem-solving accuracy.', category: 'Academic', usageCount: 9, createdAt: new Date().toISOString() },
  { id: 'c_3', text: 'Requires additional time and guidance to complete multi-step tasks.', category: 'Academic', usageCount: 6, createdAt: new Date().toISOString() },
  { id: 'c_4', text: 'Active and enthusiastic participant in class discussions.', category: 'Behavior', usageCount: 18, createdAt: new Date().toISOString() },
  { id: 'c_5', text: 'Consistently respectful, helpful, and collaborative with peers.', category: 'Behavior', usageCount: 12, createdAt: new Date().toISOString() },
  { id: 'c_6', text: 'Encouraged to minimize classroom distractions during independent work.', category: 'Behavior', usageCount: 4, createdAt: new Date().toISOString() },
  { id: 'c_7', text: 'Reads fluently with great expression and intonation.', category: 'Reading', usageCount: 15, createdAt: new Date().toISOString() },
  { id: 'c_8', text: 'Working on expanding vocabulary and identifying key story themes.', category: 'Reading', usageCount: 11, createdAt: new Date().toISOString() },
  { id: 'c_9', text: 'Strong grasp of foundational mathematical concepts and algorithms.', category: 'Math', usageCount: 10, createdAt: new Date().toISOString() },
  { id: 'c_10', text: 'Needs continued practice with multiplication tables and word problems.', category: 'Math', usageCount: 8, createdAt: new Date().toISOString() },
  { id: 'c_11', text: 'Pleasure to have in class; shows consistent pride in work.', category: 'General', usageCount: 22, createdAt: new Date().toISOString() },
  { id: 'c_12', text: 'Parent contact recommended to discuss attendance and home practice.', category: 'General', usageCount: 3, createdAt: new Date().toISOString() }
];

// Seed initial record entries for Assessment Record so user sees instant live populated grid
const todayStr = new Date().toISOString().split('T')[0];

export const INITIAL_RECORD_ENTRIES: RecordEntry[] = [
  {
    id: 'entry_1',
    recordTypeId: 'template-assessment',
    studentId: 'stu_1',
    data: {
      col_date: todayStr,
      col_subject: 'Mathematics',
      col_type: 'Quiz',
      col_score: 95,
      col_max_score: 100,
      col_pct: 95,
      col_grade: 'A',
      col_notes: 'Flawless execution on fraction division problems.'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'entry_2',
    recordTypeId: 'template-assessment',
    studentId: 'stu_2',
    data: {
      col_date: todayStr,
      col_subject: 'English Language Arts',
      col_type: 'Oral Presentation',
      col_score: 92,
      col_max_score: 100,
      col_pct: 92,
      col_grade: 'A',
      col_notes: 'Well structured slides and clear speaking tone.'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'entry_3',
    recordTypeId: 'template-assessment',
    studentId: 'stu_3',
    data: {
      col_date: todayStr,
      col_subject: 'Mathematics',
      col_type: 'Quiz',
      col_score: 72,
      col_max_score: 100,
      col_pct: 72,
      col_grade: 'C',
      col_notes: 'Struggled with multi-step word problems. Needs review.'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'entry_4',
    recordTypeId: 'template-assessment',
    studentId: 'stu_4',
    data: {
      col_date: todayStr,
      col_subject: 'Science',
      col_type: 'Project',
      col_score: 98,
      col_max_score: 100,
      col_pct: 98,
      col_grade: 'A',
      col_notes: 'Exceptional ecosystem poster diagram.'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'entry_5',
    recordTypeId: 'template-assessment',
    studentId: 'stu_5',
    data: {
      col_date: todayStr,
      col_subject: 'Mathematics',
      col_type: 'Quiz',
      col_score: 65,
      col_max_score: 100,
      col_pct: 65,
      col_grade: 'D',
      col_notes: 'Recommended for Friday remedial session.'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
