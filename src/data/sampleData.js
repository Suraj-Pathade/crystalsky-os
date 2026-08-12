/**
 * Sample Demo Data for Pravin Ghukshe - CrystalSky Photography & Film
 * Phone: 8412850833
 */

export const SAMPLE_CLIENTS = [
  {
    ClientID: 'CL001',
    Name: 'Rahul & Priya Sharma',
    Phone: '9823011223',
    WhatsApp: '9823011223',
    Email: 'rahul.sharma@gmail.com',
    City: 'Nagpur',
    Address: 'Civil Lines, Nagpur',
    Instagram: '@rahul_priya_wedding',
    Notes: 'Grand destination wedding shoot. Requested drone coverage and 2 candid photographers.',
    CreatedAt: '2026-08-01T10:00:00.000Z'
  },
  {
    ClientID: 'CL002',
    Name: 'Aniket & Sneha Deshmukh',
    Phone: '9970123456',
    WhatsApp: '9970123456',
    Email: 'aniket.d@gmail.com',
    City: 'Pune',
    Address: 'Koregaon Park, Pune',
    Instagram: '@aniket_sneha',
    Notes: 'Outdoor pre-wedding photoshoot in Mahabaleshwar.',
    CreatedAt: '2026-08-05T14:30:00.000Z'
  },
  {
    ClientID: 'CL003',
    Name: 'Vikram Kulkarni (Corporate)',
    Phone: '9890112233',
    WhatsApp: '9890112233',
    Email: 'vikram@techcorp.in',
    City: 'Nagpur',
    Address: 'IT Park, Nagpur',
    Instagram: '@techcorp_events',
    Notes: 'Annual Corporate Award Gala Ceremony photography & video reel.',
    CreatedAt: '2026-08-10T11:15:00.000Z'
  }
];

export const SAMPLE_EVENTS = [
  {
    EventID: 'EV001',
    ClientID: 'CL001',
    ClientName: 'Rahul & Priya Sharma',
    ClientPhone: '9823011223',
    EventName: 'Rahul & Priya Grand Wedding',
    EventType: 'Wedding',
    EventDate: '2026-08-20',
    StartTime: '10:00',
    EndTime: '23:00',
    Venue: 'Radisson Blu Resort & Lawn',
    Address: 'Wardha Road, Nagpur',
    City: 'Nagpur',
    GoogleMapsLink: 'https://maps.google.com',
    TotalContractValue: 150000,
    EventStatus: 'Booked',
    ProductionStatus: 'PHOTO EDITING',
    Notes: 'Full wedding photography package: 2 Traditional, 2 Candid, 1 Cinematic Video, Drone + Premium Photobook Album.'
  },
  {
    EventID: 'EV002',
    ClientID: 'CL002',
    ClientName: 'Aniket & Sneha Deshmukh',
    ClientPhone: '9970123456',
    EventName: 'Aniket & Sneha Pre-Wedding Shoot',
    EventType: 'Pre-Wedding',
    EventDate: '2026-08-15',
    StartTime: '06:00',
    EndTime: '18:00',
    Venue: 'Mahabaleshwar Venna Lake',
    Address: 'Mahabaleshwar Hill Station',
    City: 'Pune',
    GoogleMapsLink: 'https://maps.google.com',
    TotalContractValue: 60000,
    EventStatus: 'Upcoming',
    ProductionStatus: 'EVENT UPCOMING',
    Notes: 'Outdoor pre-wedding photoshoot + 2 Instagram Reels.'
  },
  {
    EventID: 'EV003',
    ClientID: 'CL003',
    ClientName: 'Vikram Kulkarni (Corporate)',
    ClientPhone: '9890112233',
    EventName: 'TechCorp Annual Corporate Gala',
    EventType: 'Corporate',
    EventDate: '2026-08-08',
    StartTime: '18:00',
    EndTime: '22:00',
    Venue: 'Hotel Centre Point Ballroom',
    Address: 'Ramdaspeth, Nagpur',
    City: 'Nagpur',
    GoogleMapsLink: 'https://maps.google.com',
    TotalContractValue: 40000,
    EventStatus: 'Completed',
    ProductionStatus: 'DELIVERY',
    Notes: 'Corporate awards evening coverage + quick teaser reel.'
  }
];

export const SAMPLE_PAYMENTS = [
  {
    PaymentID: 'PAY001',
    EventID: 'EV001',
    ClientID: 'CL001',
    ClientName: 'Rahul & Priya Sharma',
    EventName: 'Rahul & Priya Grand Wedding',
    PaymentDate: '2026-08-02',
    Amount: 50000,
    PaymentMethod: 'UPI',
    PaymentType: 'Advance',
    ReferenceNumber: 'UPI/9876543210',
    Notes: 'Initial booking advance payment received via GPay'
  },
  {
    PaymentID: 'PAY002',
    EventID: 'EV001',
    ClientID: 'CL001',
    ClientName: 'Rahul & Priya Sharma',
    EventName: 'Rahul & Priya Grand Wedding',
    PaymentDate: '2026-08-20',
    Amount: 50000,
    PaymentMethod: 'Bank Transfer',
    PaymentType: 'Wedding Day',
    ReferenceNumber: 'IMPS/12349876',
    Notes: 'Wedding day second installment payment'
  },
  {
    PaymentID: 'PAY003',
    EventID: 'EV003',
    ClientID: 'CL003',
    ClientName: 'Vikram Kulkarni (Corporate)',
    EventName: 'TechCorp Annual Corporate Gala',
    PaymentDate: '2026-08-08',
    Amount: 40000,
    PaymentMethod: 'Bank Transfer',
    PaymentType: 'Final',
    ReferenceNumber: 'NEFT/55443322',
    Notes: 'Full corporate booking payment cleared in single transfer'
  }
];

export const SAMPLE_EXPENSES = [
  {
    ExpenseID: 'EXP001',
    Date: '2026-08-03',
    EventID: 'EV001',
    ClientID: 'CL001',
    Category: 'Camera Rental',
    Subcategory: 'Sony A7SIII + 24-70mm Lens',
    PersonVendor: 'Nagpur Camera Rentals',
    Description: 'Second camera body rental for wedding day',
    Amount: 4500,
    PaymentMethod: 'UPI',
    PaidBy: 'Pravin Ghukshe',
    PaymentStatus: 'Paid'
  },
  {
    ExpenseID: 'EXP002',
    Date: '2026-08-15',
    EventID: 'EV002',
    ClientID: 'CL002',
    Category: 'Travel',
    Subcategory: 'Fuel & Toll',
    PersonVendor: 'Indian Oil Petrol Pump',
    Description: 'Nagpur to Mahabaleshwar travel fuel for pre-wedding shoot',
    Amount: 6000,
    PaymentMethod: 'Cash',
    PaidBy: 'Pravin Ghukshe',
    PaymentStatus: 'Paid'
  },
  {
    ExpenseID: 'EXP003',
    Date: '2026-08-10',
    EventID: 'EV001',
    ClientID: 'CL001',
    Category: 'Album Printing',
    Subcategory: '30-Page Flush Mount Canvera Album',
    PersonVendor: 'Canvera Photobook Printers',
    Description: 'Premium acrylic glass wedding album printing',
    Amount: 12000,
    PaymentMethod: 'Bank Transfer',
    PaidBy: 'Pravin Ghukshe',
    PaymentStatus: 'Paid'
  }
];

export const SAMPLE_TEAM = [
  {
    PersonID: 'TEAM001',
    Name: 'Amit Verma',
    Phone: '9822114455',
    WhatsApp: '9822114455',
    Role: 'Candid Photographer',
    Category: 'Freelancer',
    Notes: 'Specialist in wedding candid portraits. Owns Sony A7IV + 85mm f1.4',
    Active: true
  },
  {
    PersonID: 'TEAM002',
    Name: 'Sagar Patil',
    Phone: '9923445566',
    WhatsApp: '9923445566',
    Role: 'Cinematographer',
    Category: 'Freelancer',
    Notes: 'Gimbal operator & cinematic wedding video specialist',
    Active: true
  }
];

export const SAMPLE_EVENT_TEAM = [
  {
    AssignmentID: 'ET001',
    EventID: 'EV001',
    PersonID: 'TEAM001',
    PersonName: 'Amit Verma',
    Role: 'Candid Photographer',
    AgreedAmount: 12000,
    PaidAmount: 6000,
    PendingAmount: 6000,
    PaymentStatus: 'PARTIALLY PAID',
    PaymentDate: '2026-08-20',
    Notes: 'Wedding day candid shoot'
  }
];

export const SAMPLE_TASKS = [
  {
    TaskID: 'TSK001',
    TaskName: 'Color Grade & Deliver Pre-wedding Teaser Reel',
    EventID: 'EV002',
    ClientID: 'CL002',
    AssignedTo: 'Rohan Editor',
    Category: 'Reel',
    Priority: 'HIGH',
    DueDate: '2026-08-18',
    Status: 'IN PROGRESS'
  }
];

export const SAMPLE_DELIVERABLES = [
  {
    DeliverableID: 'DEL001',
    EventID: 'EV001',
    EventName: 'Rahul & Priya Grand Wedding',
    ClientName: 'Rahul & Priya Sharma',
    Type: 'Photos',
    Status: 'IN PROGRESS',
    DueDate: '2026-08-28',
    Notes: 'Raw photo selection link active'
  }
];
