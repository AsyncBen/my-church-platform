import type {
  Scripture,
  QueueItem,
  ActivityItem,
  Announcement,
  GivingRecord,
  Sermon,
} from '../types/media.types'

export const SCRIPTURES_DB: Scripture[] = [
  {
    id: '1',
    ref: 'Romans 8:28',
    text: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.',
    favorite: true,
  },
  {
    id: '2',
    ref: 'Hebrews 11:1',
    text: 'Now faith is confidence in what we hope for and assurance about what we do not see.',
    favorite: true,
  },
  {
    id: '3',
    ref: 'Isaiah 60:1',
    text: 'Arise, shine, for your light has come, and the glory of the Lord rises upon you.',
    favorite: true,
  },
  {
    id: '4',
    ref: 'John 3:16',
    text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
  },
  {
    id: '5',
    ref: 'Psalm 23:1',
    text: 'The Lord is my shepherd, I lack nothing.',
  },
  {
    id: '6',
    ref: 'Philippians 4:13',
    text: 'I can do all this through him who gives me strength.',
  },
  {
    id: '7',
    ref: 'Proverbs 3:5-6',
    text: 'Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.',
  },
  {
    id: '8',
    ref: 'Jeremiah 29:11',
    text: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.',
  },
  {
    id: '9',
    ref: 'Isaiah 40:31',
    text: 'But those who hope in the Lord will renew their strength. They will soar on wings like eagles, they will run and not grow weary, they will walk and not be faint.',
  },
  {
    id: '10',
    ref: 'Matthew 6:33',
    text: 'But seek first his kingdom and his righteousness, and all these things will be given to you as well.',
  },
]

export const INITIAL_QUEUE: QueueItem[] = [
  {
    id: 'q1',
    ref: 'Romans 8:28',
    text: 'And we know that in all things God works for the good of those who love him.',
    active: true,
    broadcast: true,
  },
  {
    id: 'q2',
    ref: 'Hebrews 11:1',
    text: 'Now faith is confidence in what we hope for and assurance about what we do not see.',
  },
  {
    id: 'q3',
    ref: 'Isaiah 60:1',
    text: 'Arise, shine, for your light has come, and the glory of the Lord rises upon you.',
  },
]

export const ACTIVITY_FEED: ActivityItem[] = [
  {
    id: 'a1',
    type: 'scripture',
    message: 'Romans 8:28 broadcast to congregation',
    time: '2 min ago',
  },
  {
    id: 'a2',
    type: 'service',
    message: 'Live service started — 214 devices connected',
    time: '18 min ago',
  },
  {
    id: 'a3',
    type: 'announcement',
    message: 'Offering announcement pushed',
    time: '24 min ago',
  },
  {
    id: 'a4',
    type: 'scripture',
    message: 'John 3:16 broadcast to congregation',
    time: '31 min ago',
  },
  {
    id: 'a5',
    type: 'sync',
    message: 'Sync health restored — 100% devices online',
    time: '45 min ago',
  },
]

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'an1',
    title: 'Sunday Offering',
    body: 'Please give generously as we support the building fund this month.',
    category: 'Offering',
    sent: true,
    time: '24 min ago',
  },
  {
    id: 'an2',
    title: 'Youth Camp Registration',
    body: 'Youth camp registration is open until June 15. Forms available at the welcome desk.',
    category: 'Event',
    sent: true,
    time: 'Last Sunday',
  },
  {
    id: 'an3',
    title: 'Prayer Meeting',
    body: 'Join us every Wednesday at 6PM for corporate prayer. All are welcome.',
    category: 'Prayer',
    sent: false,
  },
]

export const GIVING_RECORDS: GivingRecord[] = [
  {
    id: 'g1',
    name: 'Emmanuel Okafor',
    amount: 15000,
    ref: 'TXN-2024-001',
    service: 'Sunday Service',
    date: '2024-12-08',
    type: 'tithe',
  },
  {
    id: 'g2',
    name: 'Grace Adeyemi',
    amount: 5000,
    ref: 'TXN-2024-002',
    service: 'Sunday Service',
    date: '2024-12-08',
    type: 'offering',
  },
  {
    id: 'g3',
    name: 'Blessing Nwosu',
    amount: 25000,
    ref: 'TXN-2024-003',
    service: 'Sunday Service',
    date: '2024-12-08',
    type: 'special',
  },
  {
    id: 'g4',
    name: 'Faith Abiodun',
    amount: 10000,
    ref: 'TXN-2024-004',
    service: 'Sunday Service',
    date: '2024-12-08',
    type: 'tithe',
  },
  {
    id: 'g5',
    name: 'Samuel Eze',
    amount: 7500,
    ref: 'TXN-2024-005',
    service: 'Midweek Service',
    date: '2024-12-04',
    type: 'offering',
  },
  {
    id: 'g6',
    name: 'Ruth Fashola',
    amount: 20000,
    ref: 'TXN-2024-006',
    service: 'Sunday Service',
    date: '2024-12-01',
    type: 'tithe',
  },
  {
    id: 'g7',
    name: 'David Olawale',
    amount: 3000,
    ref: 'TXN-2024-007',
    service: 'Midweek Service',
    date: '2024-12-04',
    type: 'offering',
  },
  {
    id: 'g8',
    name: 'Esther Taiwo',
    amount: 50000,
    ref: 'TXN-2024-008',
    service: 'Sunday Service',
    date: '2024-12-01',
    type: 'special',
  },
]

export const INITIAL_SERMONS: Sermon[] = [
  {
    id: 's1',
    title: 'Walking in Divine Purpose',
    series: 'Identity in Christ',
    pastor: 'Pastor James Adeyemi',
    date: '2024-12-15',
    scriptures: ['Romans 8:28', 'Jeremiah 29:11'],
    status: 'ready',
  },
  {
    id: 's2',
    title: 'The Power of Faith',
    series: 'Foundations of Faith',
    pastor: 'Pastor James Adeyemi',
    date: '2024-12-08',
    scriptures: ['Hebrews 11:1', 'Matthew 17:20'],
    status: 'delivered',
  },
  {
    id: 's3',
    title: 'Arise and Shine',
    series: 'Kingdom Light',
    pastor: 'Pastor Sarah Mensah',
    date: '2024-12-22',
    scriptures: ['Isaiah 60:1', 'Matthew 5:14'],
    status: 'draft',
  },
]
