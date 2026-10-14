import { supabase } from '../src/shared/config/supabase';

const FIRST_NAMES_F = [
  'Priya', 'Anjali', 'Kavya', 'Sneha', 'Divya', 'Pooja', 'Riya', 'Neha',
  'Ananya', 'Shreya', 'Meera', 'Aisha', 'Fatima', 'Sania', 'Zara', 'Lakshmi',
  'Deepa', 'Nisha', 'Sunita', 'Rekha', 'Ishita', 'Tanvi', 'Simran', 'Roshni'
];

const FIRST_NAMES_M = [
  'Arjun', 'Rahul', 'Vikram', 'Aditya', 'Rohan', 'Karan', 'Siddharth', 'Akash',
  'Nikhil', 'Amit', 'Ravi', 'Suresh', 'Mohan', 'Rajesh', 'Deepak', 'Kabir',
  'Dev', 'Varun', 'Kunal', 'Manish'
];

const LAST_NAMES = [
  'Sharma', 'Patel', 'Verma', 'Singh', 'Kumar', 'Gupta', 'Mehta', 'Joshi',
  'Nair', 'Iyer', 'Reddy', 'Rao', 'Khan', 'Ansari', 'Siddiqui', 'Malhotra',
  'Bansal', 'Kapoor', 'Choudhary', 'Sen'
];

const CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad',
  'Chennai', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Chandigarh', 'Gurgaon'
];

const RELIGIONS = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Parsi'];
const DEGREES = ['B.Tech Computer Science', 'MBA Finance', 'MBA Marketing', 'M.Tech', 'B.Com Honours', 'BCA', 'MCA', 'B.Sc Data Science', 'MBBS', 'Chartered Accountant'];
const COMPANIES = ['Google', 'Microsoft', 'Amazon', 'Flipkart', 'Zomato', 'TCS', 'Infosys', 'McKinsey', 'Goldman Sachs', 'Swiggy', 'Deloitte', 'HDFC Bank'];
const DESIGNATIONS_F = [
  'Software Engineer', 'Senior Product Manager', 'Data Analyst', 'HR Business Partner',
  'Marketing Director', 'UX Researcher', 'Physician', 'Chartered Accountant',
  'Brand Strategist', 'Solutions Architect'
];
const DESIGNATIONS_M = [
  'Senior Software Engineer', 'Product Lead', 'Investment Banker', 'Engineering Manager',
  'Management Consultant', 'Founder & CEO', 'Data Scientist', 'VP Operations',
  'Fintech Architect', 'Orthopedic Surgeon'
];

const HOBBIES = [
  'reading', 'cooking', 'yoga', 'traveling', 'classical music', 'photography',
  'hiking', 'badminton', 'painting', 'fitness & gym', 'baking', 'scuba diving',
  'board games', 'gardening', 'podcasts'
];

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randDate(startYear: number, endYear: number): string {
  const y = randInt(startYear, endYear);
  const m = String(randInt(1, 12)).padStart(2, '0');
  const d = String(randInt(1, 28)).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

async function seed() {
  console.log('🌱 Starting database seeding...');

  const { data: matchmaker, error: mmErr } = await supabase
    .from('matchmakers')
    .select('id, email, name')
    .eq('email', 'demo@thedatecrew.com')
    .single();

  if (mmErr || !matchmaker) {
    console.error('❌ Could not find demo matchmaker demo@thedatecrew.com. Make sure migration 004 has run.');
    process.exit(1);
  }

  console.log(`👤 Found demo matchmaker: ${matchmaker.name} (${matchmaker.id})`);

  const assignedClients = [
    {
      assigned_matchmaker_id: matchmaker.id,
      first_name: 'Aryan',
      last_name: 'Mehta',
      gender: 'male',
      date_of_birth: '1996-04-18',
      country: 'India',
      city: 'Bangalore',
      height_cm: 180,
      email: 'aryan.mehta@example.com',
      phone: '+919876543210',
      college: 'BITS Pilani',
      degree: 'B.Tech Computer Science',
      income_lpa: 38.5,
      company: 'Google',
      designation: 'Senior Software Engineer',
      marital_status: 'single',
      languages: ['English', 'Hindi', 'Gujarati'],
      siblings: 1,
      caste: 'Vaishya',
      religion: 'Hindu',
      want_kids: 'yes',
      open_to_relocate: 'yes',
      open_to_pets: 'yes',
      dietary_preference: 'veg',
      drinking: 'socially',
      smoking: 'never',
      hobbies: ['traveling', 'fitness & gym', 'photography', 'reading'],
      status_tag: 'active',
      profile_photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      notes: 'High intent client looking for an ambitious, intellectually curious partner based in Bangalore or Mumbai.',
      is_dummy: false,
    },
    {
      assigned_matchmaker_id: matchmaker.id,
      first_name: 'Ananya',
      last_name: 'Sen',
      gender: 'female',
      date_of_birth: '1997-09-12',
      country: 'India',
      city: 'Mumbai',
      height_cm: 165,
      email: 'ananya.sen@example.com',
      phone: '+919820123456',
      college: 'St. Xavier’s College & MICA',
      degree: 'MBA Marketing',
      income_lpa: 28.0,
      company: 'Unilever',
      designation: 'Senior Brand Manager',
      marital_status: 'single',
      languages: ['English', 'Hindi', 'Bengali'],
      siblings: 1,
      caste: 'General',
      religion: 'Hindu',
      want_kids: 'yes',
      open_to_relocate: 'maybe',
      open_to_pets: 'yes',
      dietary_preference: 'non-veg',
      drinking: 'socially',
      smoking: 'never',
      hobbies: ['classical music', 'baking', 'traveling', 'yoga'],
      status_tag: 'new',
      profile_photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      notes: 'New registration. Values open communication, cultural arts, and balanced lifestyle.',
      is_dummy: false,
    },
    {
      assigned_matchmaker_id: matchmaker.id,
      first_name: 'Rohan',
      last_name: 'Verma',
      gender: 'male',
      date_of_birth: '1993-11-05',
      country: 'India',
      city: 'Delhi',
      height_cm: 178,
      email: 'rohan.verma@example.com',
      phone: '+919811234567',
      college: 'IIT Delhi & IIM Ahmedabad',
      degree: 'MBA Finance',
      income_lpa: 52.0,
      company: 'McKinsey & Co',
      designation: 'Associate Partner',
      marital_status: 'single',
      languages: ['English', 'Hindi', 'Punjabi'],
      siblings: 0,
      caste: 'Kshatriya',
      religion: 'Hindu',
      want_kids: 'yes',
      open_to_relocate: 'yes',
      open_to_pets: 'maybe',
      dietary_preference: 'eggetarian',
      drinking: 'occasionally',
      smoking: 'never',
      hobbies: ['hiking', 'board games', 'reading'],
      status_tag: 'matched',
      profile_photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      notes: 'Currently in conversation with candidates. Highly active.',
      is_dummy: false,
    },
    {
      assigned_matchmaker_id: matchmaker.id,
      first_name: 'Sneha',
      last_name: 'Patel',
      gender: 'female',
      date_of_birth: '1998-02-24',
      country: 'India',
      city: 'Pune',
      height_cm: 162,
      email: 'sneha.patel@example.com',
      phone: '+919765432109',
      college: 'Symbiosis Institute of Design',
      degree: 'B.Des User Experience',
      income_lpa: 22.0,
      company: 'Microsoft',
      designation: 'Senior Product Designer',
      marital_status: 'single',
      languages: ['English', 'Hindi', 'Gujarati', 'Marathi'],
      siblings: 2,
      caste: 'Patel',
      religion: 'Hindu',
      want_kids: 'maybe',
      open_to_relocate: 'yes',
      open_to_pets: 'yes',
      dietary_preference: 'veg',
      drinking: 'never',
      smoking: 'never',
      hobbies: ['painting', 'yoga', 'traveling', 'gardening'],
      status_tag: 'active',
      profile_photo_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
      notes: 'Looking for a warm, family-oriented partner with artistic sensibilities.',
      is_dummy: false,
    },
    {
      assigned_matchmaker_id: matchmaker.id,
      first_name: 'Siddharth',
      last_name: 'Rao',
      gender: 'male',
      date_of_birth: '1991-07-30',
      country: 'India',
      city: 'Hyderabad',
      height_cm: 182,
      email: 'siddharth.rao@example.com',
      phone: '+919440123456',
      college: 'Osmania University',
      degree: 'Chartered Accountant & CFA',
      income_lpa: 34.0,
      company: 'Deloitte',
      designation: 'Financial Advisory Manager',
      marital_status: 'single',
      languages: ['English', 'Telugu', 'Hindi'],
      siblings: 1,
      caste: 'Brahmin',
      religion: 'Hindu',
      want_kids: 'yes',
      open_to_relocate: 'no',
      open_to_pets: 'maybe',
      dietary_preference: 'veg',
      drinking: 'never',
      smoking: 'never',
      hobbies: ['badminton', 'reading', 'cooking'],
      status_tag: 'active',
      profile_photo_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80',
      notes: 'Wants to settle in Hyderabad. Values tradition and strong professional drive.',
      is_dummy: false,
    },
    {
      assigned_matchmaker_id: matchmaker.id,
      first_name: 'Pooja',
      last_name: 'Joshi',
      gender: 'female',
      date_of_birth: '1994-10-15',
      country: 'India',
      city: 'Bangalore',
      height_cm: 168,
      email: 'pooja.joshi@example.com',
      phone: '+919980765432',
      college: 'IIT Roorkee',
      degree: 'M.Tech AI & Data Engineering',
      income_lpa: 45.0,
      company: 'Amazon',
      designation: 'Applied Scientist',
      marital_status: 'single',
      languages: ['English', 'Hindi', 'Kannada'],
      siblings: 1,
      caste: 'Brahmin',
      religion: 'Hindu',
      want_kids: 'yes',
      open_to_relocate: 'yes',
      open_to_pets: 'yes',
      dietary_preference: 'veg',
      drinking: 'socially',
      smoking: 'never',
      hobbies: ['fitness & gym', 'reading', 'traveling'],
      status_tag: 'active',
      profile_photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
      notes: 'Prefers partner with strong tech or research background.',
      is_dummy: false,
    },
    {
      assigned_matchmaker_id: matchmaker.id,
      first_name: 'Kabir',
      last_name: 'Khan',
      gender: 'male',
      date_of_birth: '1995-03-21',
      country: 'India',
      city: 'Mumbai',
      height_cm: 185,
      email: 'kabir.khan@example.com',
      phone: '+919821876543',
      college: 'Sir JJ College of Architecture',
      degree: 'B.Arch Urban Planning',
      income_lpa: 26.0,
      company: 'Morphogenesis Studio',
      designation: 'Senior Architect',
      marital_status: 'single',
      languages: ['English', 'Hindi', 'Urdu'],
      siblings: 2,
      caste: 'General',
      religion: 'Muslim',
      want_kids: 'yes',
      open_to_relocate: 'maybe',
      open_to_pets: 'yes',
      dietary_preference: 'non-veg',
      drinking: 'never',
      smoking: 'never',
      hobbies: ['photography', 'scuba diving', 'traveling'],
      status_tag: 'paused',
      profile_photo_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
      notes: 'Profile paused temporarily until next month due to overseas architectural project.',
      is_dummy: false,
    },
    {
      assigned_matchmaker_id: matchmaker.id,
      first_name: 'Tanya',
      last_name: 'Malhotra',
      gender: 'female',
      date_of_birth: '1995-12-08',
      country: 'India',
      city: 'Delhi',
      height_cm: 170,
      email: 'tanya.malhotra@example.com',
      phone: '+919810987654',
      college: 'Lady Shri Ram College & LBS',
      degree: 'M.Sc Financial Economics',
      income_lpa: 36.0,
      company: 'Goldman Sachs',
      designation: 'Vice President',
      marital_status: 'single',
      languages: ['English', 'Hindi', 'Punjabi'],
      siblings: 1,
      caste: 'Khatri',
      religion: 'Hindu',
      want_kids: 'yes',
      open_to_relocate: 'yes',
      open_to_pets: 'maybe',
      dietary_preference: 'non-veg',
      drinking: 'socially',
      smoking: 'never',
      hobbies: ['fitness & gym', 'podcasts', 'cooking'],
      status_tag: 'active',
      profile_photo_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
      notes: 'Ambitious, cosmopolitan, values mutual respect and shared lifestyle goals.',
      is_dummy: false,
    }
  ];

  console.log(`📋 Inserting ${assignedClients.length} primary assigned clients for Priya...`);
  const { error: clientErr } = await supabase
    .from('customers')
    .upsert(assignedClients, { onConflict: 'email' });

  if (clientErr) {
    console.error('❌ Failed to insert assigned clients:', clientErr.message);
  } else {
    console.log('✅ Assigned clients seeded successfully.');
  }

  const poolProfiles: any[] = [];

  for (let i = 0; i < 60; i++) {
    const fName = rand(FIRST_NAMES_F);
    const lName = rand(LAST_NAMES);
    const city = rand(CITIES);
    const religion = rand(RELIGIONS);
    const h1 = rand(HOBBIES);
    let h2 = rand(HOBBIES);
    while (h2 === h1) h2 = rand(HOBBIES);

    poolProfiles.push({
      first_name: fName,
      last_name: lName,
      gender: 'female',
      date_of_birth: randDate(1992, 2001),
      country: 'India',
      city: city,
      height_cm: randInt(152, 172),
      email: `female_candidate_${i + 1}@pool.tdc.test`,
      phone: `+91${randInt(7000000000, 9999999999)}`,
      college: `${city} University`,
      degree: rand(DEGREES),
      income_lpa: parseFloat((randInt(8, 38) + Math.random() * 0.9).toFixed(1)),
      company: rand(COMPANIES),
      designation: rand(DESIGNATIONS_F),
      marital_status: Math.random() > 0.88 ? 'divorced' : 'single',
      languages: ['English', 'Hindi'].concat(Math.random() > 0.4 ? [rand(['Tamil', 'Telugu', 'Marathi', 'Gujarati', 'Bengali', 'Punjabi'])] : []),
      siblings: randInt(0, 3),
      caste: rand(['Brahmin', 'Kshatriya', 'Vaishya', 'General', 'OBC']),
      religion: religion,
      want_kids: rand(['yes', 'yes', 'maybe']),
      open_to_relocate: rand(['yes', 'no', 'maybe']),
      open_to_pets: rand(['yes', 'yes', 'maybe', 'no']),
      dietary_preference: rand(['veg', 'veg', 'non-veg', 'eggetarian', 'jain']),
      drinking: rand(['never', 'occasionally', 'socially']),
      smoking: Math.random() > 0.92 ? 'occasionally' : 'never',
      hobbies: [h1, h2],
      status_tag: 'active',
      is_dummy: true,
      notes: 'Candidate profile in matching pool.',
    });
  }

  for (let i = 0; i < 50; i++) {
    const fName = rand(FIRST_NAMES_M);
    const lName = rand(LAST_NAMES);
    const city = rand(CITIES);
    const religion = rand(RELIGIONS);
    const h1 = rand(HOBBIES);
    let h2 = rand(HOBBIES);
    while (h2 === h1) h2 = rand(HOBBIES);

    poolProfiles.push({
      first_name: fName,
      last_name: lName,
      gender: 'male',
      date_of_birth: randDate(1988, 1999),
      country: 'India',
      city: city,
      height_cm: randInt(168, 188),
      email: `male_candidate_${i + 1}@pool.tdc.test`,
      phone: `+91${randInt(7000000000, 9999999999)}`,
      college: `IIT ${city}`,
      degree: rand(DEGREES),
      income_lpa: parseFloat((randInt(12, 55) + Math.random() * 0.9).toFixed(1)),
      company: rand(COMPANIES),
      designation: rand(DESIGNATIONS_M),
      marital_status: Math.random() > 0.9 ? 'divorced' : 'single',
      languages: ['English', 'Hindi'].concat(Math.random() > 0.4 ? [rand(['Tamil', 'Telugu', 'Marathi', 'Gujarati', 'Bengali', 'Punjabi'])] : []),
      siblings: randInt(0, 2),
      caste: rand(['Brahmin', 'Kshatriya', 'Vaishya', 'General', 'OBC']),
      religion: religion,
      want_kids: rand(['yes', 'yes', 'maybe']),
      open_to_relocate: rand(['yes', 'maybe', 'no']),
      open_to_pets: rand(['yes', 'maybe', 'no']),
      dietary_preference: rand(['veg', 'non-veg', 'eggetarian']),
      drinking: rand(['never', 'occasionally', 'socially']),
      smoking: Math.random() > 0.88 ? 'occasionally' : 'never',
      hobbies: [h1, h2],
      status_tag: 'active',
      is_dummy: true,
      notes: 'Candidate profile in matching pool.',
    });
  }

  console.log(`🌊 Seeding candidate pool (${poolProfiles.length} profiles)...`);

  const batchSize = 25;
  for (let i = 0; i < poolProfiles.length; i += batchSize) {
    const batch = poolProfiles.slice(i, i + batchSize);
    const { error: poolErr } = await supabase
      .from('customers')
      .upsert(batch, { onConflict: 'email' });

    if (poolErr) {
      console.error(`❌ Batch ${i / batchSize + 1} failed:`, poolErr.message);
    } else {
      console.log(`  ✓ Inserted batch ${i / batchSize + 1} (${batch.length} profiles)`);
    }
  }

  console.log('🎉 Seeding complete! Total pool ready for matching.');
}

seed().catch((err) => {
  console.error('Fatal seeding error:', err);
  process.exit(1);
});
