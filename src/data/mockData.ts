import {
  Product,
  EquipmentItem,
  SeedItem,
  MarketPrice,
  WeatherData,
  LearningContent,
  NearbyLocation,
  User,
  Order,
  AppNotification,
  FarmTaskLog,
  SoilDataProfile,
  HarvestHistoryRecord,
  CropRotationPlanRecommendation
} from '../types';
import bakoRedOnionsImg from '../assets/images/bako_red_onions_1792481248813.jpg';
import boranBullCattleImg from '../assets/images/boran_bull_cattle_1792481248514.jpg';

export const initialCurrentUser: User = {
  id: 'u-101',
  name: 'IFA SANBATO',
  email: 'gadaa.farmer@buttaa.org',
  phone: '+251 911 234 567',
  role: 'admin',
  location: 'Jimma, Oromia, Ethiopia',
  profilePic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  farmInfo: {
    farmName: 'Bona Organics Farm',
    sizeHectares: 4.5,
    mainCrops: ['Coffee', 'Maize', 'Avocado', 'Honey'],
    locationCoords: { lat: 7.6734, lng: 36.8344 }
  },
  earningsTotal: 184500
};

export const initialProducts: Product[] = [
  {
    id: 'prod-01',
    title: 'Grade 1 Specialty Arabica Coffee Beans (Yirgacheffe / Jimma Sun-Dried)',
    category: 'Coffee',
    price: 45000,
    unit: 'Quintal (100kg)',
    availableQuantity: 25,
    location: 'Jimma, Oromia',
    farmerId: 'u-101',
    farmerName: 'Gadaa Tolasaa',
    farmerPhone: '+251 911 234 567',
    rating: 4.9,
    reviewsCount: 38,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    description: '100% Organic sun-dried Arabica coffee beans grown at 1,950m altitude. Rich floral notes, citrus acidity, and dark chocolate finish. Hand-picked and carefully sorted.',
    isOrganic: true,
    reviews: [
      { id: 'rev-1', userName: 'Abebe T.', rating: 5, comment: 'Exceptional aroma and clean grade 1 beans! Shipped directly to my coffee roastery in Addis.', date: '2026-08-02' }
    ]
  },
  {
    id: 'prod-02',
    title: 'Pure White Teff (Magagna) - Fresh Season Harvest',
    category: 'Cereals',
    price: 12500,
    unit: 'Quintal (100kg)',
    availableQuantity: 50,
    location: 'East Shoa / Ada\'a, Oromia',
    farmerId: 'u-102',
    farmerName: 'Worku Tadesse',
    farmerPhone: '+251 912 345 678',
    rating: 4.8,
    reviewsCount: 29,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    description: 'Premium quality Ada\'a white teff grain. Super clean, sand-free, nutrient-rich gluten-free supergrain ideal for fine Injera.',
    isOrganic: true
  },
  {
    id: 'prod-03',
    title: 'Hybrid Grain Maize (Yellow & White)',
    category: 'Cereals',
    price: 4800,
    unit: 'Quintal (100kg)',
    availableQuantity: 120,
    location: 'Bako, West Shoa',
    farmerId: 'u-103',
    farmerName: 'Chala Gemechu',
    farmerPhone: '+251 920 112 233',
    rating: 4.7,
    reviewsCount: 19,
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80',
    description: 'High starch moisture-controlled yellow hybrid maize. Ideal for food processing, flour production, or poultry feed.',
    isOrganic: false
  },
  {
    id: 'prod-04',
    title: 'Fresh Organic Hass Avocadoes',
    category: 'Fruits',
    price: 180,
    unit: 'Kg',
    availableQuantity: 800,
    location: 'Hawassa, Sidama',
    farmerId: 'u-104',
    farmerName: 'Aregash Mamo',
    farmerPhone: '+251 913 998 877',
    rating: 4.9,
    reviewsCount: 44,
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80',
    description: 'Creamy high-oil organic export grade Hass avocadoes. Naturally grown without artificial chemicals.',
    isOrganic: true
  },
  {
    id: 'prod-05',
    title: 'Red Bulb Onions (Bako Red Creole)',
    category: 'Vegetables',
    price: 95,
    unit: 'Kg',
    availableQuantity: 1500,
    location: 'Ziway / Meki',
    farmerId: 'u-105',
    farmerName: 'Bekele Desta',
    farmerPhone: '+251 911 554 433',
    rating: 4.6,
    reviewsCount: 15,
    image: bakoRedOnionsImg,
    description: 'Firm, dry-cured red onions with excellent shelf life. Great pungent flavor for culinary dishes and sauces.',
    isOrganic: false
  },
  {
    id: 'prod-06',
    title: 'Pure Wildflower Organic Forest Honey (Bale Mountains)',
    category: 'Honey',
    price: 750,
    unit: 'Kg',
    availableQuantity: 200,
    location: 'Robe, Bale',
    farmerId: 'u-101',
    farmerName: 'Gadaa Tolasaa',
    farmerPhone: '+251 911 234 567',
    rating: 5.0,
    reviewsCount: 62,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    description: 'Raw, unpasteurized natural forest honey harvested from traditional hives in natural mountain forests. Rich medicinal properties.',
    isOrganic: true
  },
  {
    id: 'prod-07',
    title: 'Fresh Farm Whole Milk (Aysha Dairy)',
    category: 'Dairy Products',
    price: 85,
    unit: 'Liter',
    availableQuantity: 300,
    location: 'Debre Zeit / Bishoftu',
    farmerId: 'u-106',
    farmerName: 'Almaz Kassa',
    farmerPhone: '+251 914 332 211',
    rating: 4.8,
    reviewsCount: 22,
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=800&q=80',
    description: 'Fresh pasteurized whole cow milk daily from healthy Holando-breed cattle.',
    isOrganic: true
  },
  {
    id: 'prod-08',
    title: 'Boran Breed Cattle (Healthy Young Bull)',
    category: 'Livestock',
    price: 85000,
    unit: 'Head',
    availableQuantity: 8,
    location: 'Yabelo, Borana',
    farmerId: 'u-107',
    farmerName: 'Jilo Guyo',
    farmerPhone: '+251 915 776 655',
    rating: 4.9,
    reviewsCount: 11,
    image: boranBullCattleImg,
    description: 'Vaccinated, drought-resistant pure Boran beef cattle. Excellent weight gain and genetics.',
    isOrganic: true
  },
  {
    id: 'prod-09',
    title: 'Export Quality Red Roses (Ziway Greenhouse)',
    category: 'Flowers',
    price: 350,
    unit: 'Bundle (25 stems)',
    availableQuantity: 100,
    location: 'Ziway Floriculture Zone',
    farmerId: 'u-108',
    farmerName: 'Selam Agri-Flowers',
    farmerPhone: '+251 911 889 900',
    rating: 4.7,
    reviewsCount: 8,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    description: 'Vibrant long-stem red stem roses grown under climate-controlled greenhouse conditions.',
    isOrganic: false
  },
  {
    id: 'prod-10',
    title: 'Fresh Lake Tana Nile Perch & Tilapia',
    category: 'Fish',
    price: 280,
    unit: 'Kg',
    availableQuantity: 150,
    location: 'Bahir Dar, Amhara',
    farmerId: 'u-109',
    farmerName: 'Tana Fishery Coop',
    farmerPhone: '+251 918 221 100',
    rating: 4.9,
    reviewsCount: 17,
    image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=800&q=80',
    description: 'Freshly caught wild fish from Lake Tana. Cleaned, iced, and transported with cold-chain storage.',
    isOrganic: true
  }
];

export const initialEquipment: EquipmentItem[] = [
  {
    id: 'eq-01',
    title: 'John Deere 5075E Utility Tractor (75 HP, 4WD)',
    category: 'Tractor',
    buyPrice: 3800000,
    rentPricePerDay: 8500,
    supplierName: 'Oromia Agri Machinery Supply',
    supplierPhone: '+251 911 400 300',
    location: 'Adama Industrial Zone',
    image: 'https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?auto=format&fit=crop&w=800&q=80',
    specifications: '75 HP Turbocharged Diesel, 4WD, Power steering, Includes 3-disk plow and rotavator attachment.',
    availableForRent: true,
    availableForBuy: true
  },
  {
    id: 'eq-02',
    title: 'High Pressure Diesel Irrigation Water Pump (4 Inch)',
    category: 'Water Pump',
    buyPrice: 145000,
    rentPricePerDay: 1200,
    supplierName: 'Ethiopian Water Techs',
    supplierPhone: '+251 912 888 777',
    location: 'Meki & Modjo',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    specifications: '10 HP Diesel engine, 1200L/min discharge capacity, 45m head lift. Comes with 50m suction hose.',
    availableForRent: true,
    availableForBuy: true
  },
  {
    id: 'eq-03',
    title: 'Multi-Crop Wheat & Maize Mini Combine Harvester',
    category: 'Harvester',
    buyPrice: 2200000,
    rentPricePerDay: 15000,
    supplierName: 'GreenField Implements Ltd',
    supplierPhone: '+251 911 665 544',
    location: 'Arsi Asella',
    image: 'https://images.unsplash.com/photo-1530267981608-bc3409191d84?auto=format&fit=crop&w=800&q=80',
    specifications: 'Self-propelled 1.5m cutter bar, threshes and bags grain automatically. High fuel efficiency.',
    availableForRent: true,
    availableForBuy: true
  },
  {
    id: 'eq-04',
    title: 'Solar Powered Drip Irrigation System (1 Hectare Kit)',
    category: 'Irrigation System',
    buyPrice: 280000,
    rentPricePerDay: 0,
    supplierName: 'SunAgri Solar Ethiopia',
    supplierPhone: '+251 929 101 202',
    location: 'Addis Ababa / Hawassa',
    image: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=800&q=80',
    specifications: 'Complete solar pump + drip lines + filters + header tank for 1 hectare crop field.',
    availableForRent: false,
    availableForBuy: true
  },
  {
    id: 'eq-05',
    title: 'Motorized Knapsack Orchard & Crop Sprayer (25L)',
    category: 'Sprayer',
    buyPrice: 32000,
    rentPricePerDay: 450,
    supplierName: 'Ethio Farmers Input Supply',
    supplierPhone: '+251 911 990 011',
    location: 'Jimma / Ambo',
    image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=800&q=80',
    specifications: '2-stroke gas engine, brass nozzle wand, adjustable pressure up to 25 bar.',
    availableForRent: true,
    availableForBuy: true
  }
];

export const initialSeeds: SeedItem[] = [
  {
    id: 'seed-01',
    title: 'BH-661 Hybrid Maize Seed (Certified High Yield)',
    cropType: 'Maize',
    pricePerKg: 280,
    supplier: 'Ethiopian Seed Enterprise (ESE)',
    supplierPhone: '+251 116 554 411',
    growingGuide: 'Plant in early rainy season at 75cm x 25cm spacing. Requires 120-140 days to maturity. Yield potential: 85-110 quintals/hectare with proper NPS/Urea fertilizer.',
    availabilityStatus: 'In Stock',
    description: 'Drought-tolerant, leaf blight resistant hybrid seed recommended for mid-to-high altitude zones.',
    germinationRate: '98%',
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'seed-02',
    title: 'Kingbird Improved Bread Wheat Seed',
    cropType: 'Wheat',
    pricePerKg: 195,
    supplier: 'Kulumsa Agricultural Research Center Seed Hub',
    supplierPhone: '+251 911 332 244',
    growingGuide: 'Seeding rate: 125 kg/hectare. Resistant to yellow rust and stem rust. Maturity: 115 days.',
    availabilityStatus: 'In Stock',
    description: 'High milling quality flour wheat seed bred specifically for rust resistance.',
    germinationRate: '96%',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'seed-03',
    title: 'CBD Resistant Specialty Coffee Seedlings (74110 Variety)',
    cropType: 'Coffee',
    pricePerKg: 45, // per seedling stem
    supplier: 'Jimma Agricultural Research Center (JARC)',
    supplierPhone: '+251 471 110 099',
    growingGuide: 'Transplant 6-month potted seedlings into 60cm x 60cm pits under shade trees. Spacing 2m x 2m.',
    availabilityStatus: 'In Stock',
    description: 'Immune to Coffee Berry Disease (CBD). Exceptional cupping flavor scores above 88 points.',
    germinationRate: '99%',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'seed-04',
    title: 'Anna F1 Hybrid Tomato Seed',
    cropType: 'Tomato',
    pricePerKg: 3800, // per 100g pack
    supplier: 'East-West Seed Ethiopia',
    supplierPhone: '+251 922 443 322',
    growingGuide: 'Nursery seedling stage 25 days, then transplant into ridges. High tolerance to bacterial wilt and tomato yellow leaf curl virus.',
    availabilityStatus: 'In Stock',
    description: 'Indeterminate greenhouse & field hybrid tomato with thick skin for long transportation.',
    germinationRate: '95%',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'seed-05',
    title: 'Gudenie Disease-Free Seed Potato Tubers',
    cropType: 'Potato',
    pricePerKg: 42,
    supplier: 'Holeta Agricultural Research Center',
    supplierPhone: '+251 112 370 000',
    growingGuide: 'Plant sprouted tubers 10cm deep in ridged rows 75cm apart. High resistance to late blight disease.',
    availabilityStatus: 'Limited Stock',
    description: 'Early maturing, high starch table and processing potato variety.',
    germinationRate: '99%',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80'
  }
];

export const initialMarketPrices: MarketPrice[] = [
  {
    id: 'mp-01',
    commodity: 'Washed Arabica Coffee (Grade 1)',
    category: 'Coffee',
    unit: 'Quintal (100kg)',
    currentPrice: 48500,
    previousPrice: 46200,
    changePercent: 4.98,
    trend: 'up',
    primaryMarkets: ['ECX Jimma', 'ECX Hawassa', 'Addis Ababa Central'],
    updatedAt: 'Today, 09:30 AM'
  },
  {
    id: 'mp-02',
    commodity: 'Magagna White Teff',
    category: 'Cereals',
    unit: 'Quintal (100kg)',
    currentPrice: 12800,
    previousPrice: 12800,
    changePercent: 0,
    trend: 'stable',
    primaryMarkets: ['Ada\'a Bishoftu', 'Bako', 'Elora Central'],
    updatedAt: 'Today, 08:15 AM'
  },
  {
    id: 'mp-03',
    commodity: 'White Wheat (Grain)',
    category: 'Cereals',
    unit: 'Quintal (100kg)',
    currentPrice: 6200,
    previousPrice: 6450,
    changePercent: -3.87,
    trend: 'down',
    primaryMarkets: ['Asella', 'Bale Robe', 'Shashamane'],
    updatedAt: 'Today, 10:00 AM'
  },
  {
    id: 'mp-04',
    commodity: 'Yellow Maize',
    category: 'Cereals',
    unit: 'Quintal (100kg)',
    currentPrice: 4900,
    previousPrice: 4650,
    changePercent: 5.37,
    trend: 'up',
    primaryMarkets: ['Bako', 'Jimma', 'Nekemte', 'Ambo'],
    updatedAt: 'Today, 09:45 AM'
  },
  {
    id: 'mp-05',
    commodity: 'Red Onion (Bako Red)',
    category: 'Vegetables',
    unit: 'Kg',
    currentPrice: 98,
    previousPrice: 110,
    changePercent: -10.9,
    trend: 'down',
    primaryMarkets: ['Ziway Meki Market', 'Jan Meda Addis', 'Adama'],
    updatedAt: 'Today, 07:30 AM'
  },
  {
    id: 'mp-06',
    commodity: 'Red Hot Pepper (Mareko Fana)',
    category: 'Spices',
    unit: 'Kg',
    currentPrice: 420,
    previousPrice: 390,
    changePercent: 7.69,
    trend: 'up',
    primaryMarkets: ['Alaba Kulito', 'Butajira', 'Addis Merkato'],
    updatedAt: 'Today, 11:15 AM'
  },
  {
    id: 'mp-07',
    commodity: 'Boran Fattened Bull',
    category: 'Livestock',
    unit: 'Head',
    currentPrice: 88000,
    previousPrice: 85000,
    changePercent: 3.52,
    trend: 'up',
    primaryMarkets: ['Nazareth Adama Livestock', 'Kera Addis Ababa'],
    updatedAt: 'Today, 08:00 AM'
  }
];

export const regionalWeather: WeatherData = {
  city: 'Jimma Zone',
  region: 'Oromia Region, Ethiopia',
  tempC: 24,
  condition: 'Scattered Showers',
  humidity: 78,
  windKmH: 12,
  rainProbability: 65,
  forecast7Days: [
    { day: 'Mon', highC: 25, lowC: 15, condition: 'Light Rain', rainProb: 70, icon: 'cloud-rain' },
    { day: 'Tue', highC: 26, lowC: 14, condition: 'Partly Cloudy', rainProb: 30, icon: 'cloud-sun' },
    { day: 'Wed', highC: 24, lowC: 15, condition: 'Heavy Rain', rainProb: 85, icon: 'cloud-lightning' },
    { day: 'Thu', highC: 27, lowC: 13, condition: 'Sunny', rainProb: 10, icon: 'sun' },
    { day: 'Fri', highC: 28, lowC: 14, condition: 'Clear', rainProb: 5, icon: 'sun' },
    { day: 'Sat', highC: 25, lowC: 15, condition: 'Moderate Rain', rainProb: 60, icon: 'cloud-rain' },
    { day: 'Sun', highC: 26, lowC: 14, condition: 'Partly Cloudy', rainProb: 25, icon: 'cloud-sun' }
  ],
  farmingTips: [
    'Rain showers predicted on Wednesday: Hold off on top-dressing Urea fertilizer until soil surface dries slightly.',
    'Optimal humidity conditions for coffee drying in shaded raised beds.',
    'Inspect maize crops for Fall Armyworm activity after rain periods.'
  ]
};

export const learningArticles: LearningContent[] = [
  {
    id: 'learn-01',
    title: 'How to Prevent & Control Fall Armyworm in Hybrid Maize',
    category: 'Best Practices',
    type: 'Guide',
    author: 'Dr. Tadesse Dibaba (Senior Agronomist)',
    durationOrReadTime: '5 min read',
    excerpt: 'Step-by-step integrated pest management strategy using neem extract, early monitoring, and recommended biological controls.',
    content: 'Fall Armyworm (Spodoptera frugiperda) can devastate maize yields up to 70% if unmonitored. 1. Inspect early vegetative whorls for pinhole feeding. 2. Apply push-pull intercropping with Desmodium leguminous plants. 3. Use recommended neem oil biopesticide or systemic control during early instar stages.',
    imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'learn-02',
    title: 'Modern Drip Irrigation Systems for High-Value Vegetable Crops',
    category: 'Modern Agriculture',
    type: 'Video',
    author: 'Oromia Agricultural Extension Dept',
    durationOrReadTime: '12 min video',
    excerpt: 'Save up to 60% water while doubling onion, tomato, and pepper yields using low-pressure gravity drip kits.',
    content: 'Drip irrigation delivers water directly to plant root zones, cutting weed growth and evaporation losses significantly. Learn how to set up a 1,000 sqm gravity drip system using local water storage tanks.',
    imageUrl: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 'learn-03',
    title: 'Organic Fertilizer & Bio-Compost Production on Smallholder Farms',
    category: 'Organic Farming',
    type: 'Article',
    author: 'Abeba Haile (Organic Soil Specialist)',
    durationOrReadTime: '7 min read',
    excerpt: 'Turn crop residues, livestock manure, and ash into nutrient-dense humus rich in nitrogen, phosphorus, and trace minerals.',
    content: 'Organic compost restores degraded soil structures and improves water retention. Maintain a 30:1 carbon to nitrogen ratio using green leaves, cattle dung, and wood ash in moist aeration pits.',
    imageUrl: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'learn-04',
    title: 'Dairy Cattle Feed Formulations & Silage Preparation',
    category: 'Livestock Care',
    type: 'Guide',
    author: 'Bole Farmers Dairy Cooperative',
    durationOrReadTime: '8 min read',
    excerpt: 'Boost daily milk output from 8 to 22 liters per cow with properly fermented maize silage and protein concentrates.',
    content: 'Silage ensures high nutrition feed during dry seasons. Harvest green maize at milk-dough stage, chop to 2cm, pack tightly in airtight trench silos with molasses additive.',
    imageUrl: 'https://images.unsplash.com/photo-1546445317-29f4545f9d52?auto=format&fit=crop&w=800&q=80'
  }
];

export const nearbyPlaces: NearbyLocation[] = [
  {
    id: 'loc-01',
    name: 'Jimma Agricultural Farmers Union Cooperative',
    type: 'Cooperative',
    distanceKm: 3.2,
    address: 'Jimma Main Road, Near ECX Depot',
    phone: '+251 471 112 233',
    lat: 7.6750,
    lng: 36.8360
  },
  {
    id: 'loc-02',
    name: 'Oromia Agri Machinery & Equipment Workshop',
    type: 'Equipment Shop',
    distanceKm: 4.8,
    address: 'Adama Industrial Zone, Block B',
    phone: '+251 911 400 300',
    lat: 7.6810,
    lng: 36.8410
  },
  {
    id: 'loc-03',
    name: 'Dr. Girma Veterinary & Livestock Health Clinic',
    type: 'Veterinary Clinic',
    distanceKm: 2.1,
    address: 'Station District, Jimma',
    phone: '+251 911 987 654',
    lat: 7.6710,
    lng: 36.8310
  },
  {
    id: 'loc-04',
    name: 'Addis Export Grain Aggregator Hub',
    type: 'Buyer',
    distanceKm: 8.5,
    address: 'Kality Logistics Center',
    phone: '+251 911 500 600',
    lat: 7.6900,
    lng: 36.8500
  }
];

export const initialOrders: Order[] = [
  {
    id: 'ORD-2026-8801',
    buyerId: 'u-201',
    buyerName: 'Mulugeta Assefa (Green Grocery)',
    buyerPhone: '+251 911 445 566',
    farmerId: 'u-101',
    items: [
      {
        productId: 'prod-01',
        productTitle: 'Grade 1 Specialty Arabica Coffee Beans',
        unitPrice: 45000,
        unit: 'Quintal (100kg)',
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'
      }
    ],
    totalAmount: 90000,
    paymentMethod: 'Telebirr',
    status: 'In Transit',
    orderDate: '2026-08-05',
    deliveryAddress: 'Bole Atlas, Addis Ababa',
    trackingCode: 'BTT-8801-ETH'
  },
  {
    id: 'ORD-2026-8802',
    buyerId: 'u-202',
    buyerName: 'Selam Injera Bakery',
    buyerPhone: '+251 912 334 455',
    farmerId: 'u-101',
    items: [
      {
        productId: 'prod-02',
        productTitle: 'Pure White Teff (Magagna)',
        unitPrice: 12500,
        unit: 'Quintal (100kg)',
        quantity: 3,
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'
      }
    ],
    totalAmount: 37500,
    paymentMethod: 'CBE Birr',
    status: 'Accepted',
    orderDate: '2026-08-06',
    deliveryAddress: 'Kazanchis, Addis Ababa',
    trackingCode: 'BTT-8802-ETH'
  }
];

export const initialNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'New Order Received! (#ORD-2026-8802)',
    body: 'Selam Injera Bakery ordered 3 Quintals of Pure White Teff via CBE Birr.',
    timestamp: '10 mins ago',
    read: false,
    type: 'order'
  },
  {
    id: 'notif-2',
    title: 'Weather Alert: Rainfall Expected',
    body: 'Moderate to heavy rain predicted in Jimma region on Wednesday afternoon.',
    timestamp: '2 hours ago',
    read: false,
    type: 'weather'
  },
  {
    id: 'notif-3',
    title: 'Market Price Alert: Coffee Up +4.98%',
    body: 'Grade 1 Washed Coffee reached 48,500 ETB/Quintal on ECX markets today.',
    timestamp: '5 hours ago',
    read: true,
    type: 'market'
  }
];

// Helper to compute date string relative to today (YYYY-MM-DD)
const getRelativeDateStr = (dayOffset: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export const initialFarmTaskLogs: FarmTaskLog[] = [
  {
    id: 'log-001',
    farmerId: 'u-101',
    activityType: 'Harvesting',
    crop: 'Arabica Coffee',
    plotName: 'Block A - High Altitude Terrace',
    date: getRelativeDateStr(0), // Today
    time: '08:30 AM',
    status: 'Completed',
    priority: 'High',
    durationHours: 6.5,
    workersCount: 8,
    quantityOrMetric: '14.5 Quintals (Ripe Red Cherries)',
    costETB: 3200,
    weather: 'Sunny & Clear, 21°C',
    notes: 'Selectively hand-picked ripe ruby red Arabica cherries. Transported immediately to raised drying beds for natural sun processing.',
    isOrganicCertified: true,
    photoUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    photoTimestamp: `${getRelativeDateStr(0)}T11:45:00`,
    photoVerified: true,
    photoVerificationNote: 'Harvest verified: 14.5 quintals of high-altitude Arabica cherries spread on drying tables.'
  },
  {
    id: 'log-002',
    farmerId: 'u-101',
    activityType: 'Watering',
    crop: 'Roma Tomatoes & Nursery Beds',
    plotName: 'Nursery & Raised Beds',
    date: getRelativeDateStr(0), // Today - Scheduled & Urgent
    time: '06:30 AM',
    status: 'Scheduled',
    priority: 'High',
    durationHours: 2.0,
    workersCount: 1,
    quantityOrMetric: '3,000 Liters (Furrow Irrigation)',
    costETB: 200,
    weather: 'Forecast: Sunny, 24°C',
    notes: 'Urgent: Scheduled morning watering before midday heat to support blossoming fruit set and protect young seedlings.',
    isOrganicCertified: true
  },
  {
    id: 'log-003',
    farmerId: 'u-101',
    activityType: 'Pest Control',
    crop: 'Vegetable Garden Bed #4',
    plotName: 'East Vegetable Plot',
    date: getRelativeDateStr(0), // Today - In Progress & Urgent
    time: '04:00 PM',
    status: 'In Progress',
    priority: 'High',
    durationHours: 1.5,
    workersCount: 2,
    quantityOrMetric: '20 Liters Organic Neem Solution',
    costETB: 350,
    weather: 'Calm & Cool, 20°C',
    notes: 'Scouting revealed minor aphid cluster on underside of outer leaves. Applying organic neem botanical spray before dusk.',
    isOrganicCertified: true
  },
  {
    id: 'log-004',
    farmerId: 'u-101',
    activityType: 'Watering',
    crop: 'Hybrid Maize (BH-661)',
    plotName: 'Valley Flat Field - Section 2',
    date: getRelativeDateStr(-1), // Yesterday
    time: '06:00 AM',
    status: 'Completed',
    priority: 'Medium',
    durationHours: 3.0,
    workersCount: 2,
    quantityOrMetric: '8,200 Liters (Drip Irrigation)',
    costETB: 450,
    weather: 'Early Morning Mist, 18°C',
    notes: 'Ran drip irrigation cycle across 1.8 hectares. Soil moisture probes show deep root penetration at 25cm depth.',
    isOrganicCertified: true,
    photoUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
    photoTimestamp: `${getRelativeDateStr(-1)}T08:15:00`,
    photoVerified: true,
    photoVerificationNote: 'Irrigation verification: Drip lines pressurized across Section 2, soil moisture probe depth at 25cm.'
  },
  {
    id: 'log-005',
    farmerId: 'u-101',
    activityType: 'Planting',
    crop: 'Pure White Teff (Magagna)',
    plotName: 'Ada\'a Loam Plot B',
    date: getRelativeDateStr(-2),
    time: '09:00 AM',
    status: 'Completed',
    priority: 'High',
    durationHours: 5.0,
    workersCount: 4,
    quantityOrMetric: '2.2 Hectares (35 kg certified seeds)',
    costETB: 2800,
    weather: 'Partly Cloudy, 23°C',
    notes: 'Even seed broadcasting on finely tilled seedbed followed by light soil compaction. Optimal pre-germination conditions.',
    isOrganicCertified: true
  },
  {
    id: 'log-006',
    farmerId: 'u-101',
    activityType: 'Fertilizing',
    crop: 'Hass Avocado Orchard',
    plotName: 'East Orchard Slope',
    date: getRelativeDateStr(-3),
    time: '07:30 AM',
    status: 'Completed',
    priority: 'Medium',
    durationHours: 4.0,
    workersCount: 3,
    quantityOrMetric: '450 kg Aged Organic Compost',
    costETB: 1200,
    weather: 'Mild Overcast, 20°C',
    notes: 'Ring application of well-decomposed manure compost around tree drip lines. Mulched with dry teff straw to preserve soil microbes.',
    isOrganicCertified: true
  },
  {
    id: 'log-007',
    farmerId: 'u-101',
    activityType: 'Pest Control',
    crop: 'Roma Tomatoes & Peppers',
    plotName: 'Vegetable Garden Bed #4',
    date: getRelativeDateStr(-4),
    time: '05:30 PM',
    status: 'Completed',
    priority: 'High',
    durationHours: 2.0,
    workersCount: 2,
    quantityOrMetric: '30 Liters Neem Seed Extract Spray',
    costETB: 600,
    weather: 'Calm & Cool, 19°C',
    notes: 'Preventive organic foliar spray applied using backpack sprayers to deter early leaf miner larvae. No chemical pesticides used.',
    isOrganicCertified: true
  },
  {
    id: 'log-008',
    farmerId: 'u-101',
    activityType: 'Pruning',
    crop: 'Arabica Coffee',
    plotName: 'Block C - Shade Canopy Grove',
    date: getRelativeDateStr(-5),
    time: '08:00 AM',
    status: 'Completed',
    priority: 'Medium',
    durationHours: 4.5,
    workersCount: 3,
    quantityOrMetric: '1.2 Hectares (380 bushes pruned)',
    costETB: 1500,
    weather: 'Clear, 22°C',
    notes: 'Removed water sprouts, dead branches, and dense inward growth to improve light penetration and air circulation before heavy flowering.',
    isOrganicCertified: true
  },
  {
    id: 'log-009',
    farmerId: 'u-101',
    activityType: 'General Inspection',
    crop: 'Arabica Coffee',
    plotName: 'Block A - High Altitude Terrace',
    date: getRelativeDateStr(-6),
    time: '10:00 AM',
    status: 'Completed',
    priority: 'Low',
    durationHours: 2.0,
    workersCount: 1,
    quantityOrMetric: 'Full Terrace Walkthrough',
    costETB: 100,
    weather: 'Clear Sky, 23°C',
    notes: 'Scouted terrace bunds and erosion control stones. Everything intact and ready for incoming seasonal rain.',
    isOrganicCertified: true
  },
  {
    id: 'log-010',
    farmerId: 'u-101',
    activityType: 'Harvesting',
    crop: 'Sweet Pepper (Capsicum)',
    plotName: 'South Greenhouse & Beds',
    date: getRelativeDateStr(1), // Tomorrow
    time: '07:00 AM',
    status: 'Scheduled',
    priority: 'Medium',
    durationHours: 3.5,
    workersCount: 3,
    quantityOrMetric: 'Est. 450 kg Fresh Peppers',
    costETB: 900,
    weather: 'Forecast: Mild, 22°C',
    notes: 'Harvest for confirmed local cooperative order. Clean crates prepped.',
    isOrganicCertified: true
  }
];

export const initialSoilProfiles: SoilDataProfile[] = [
  {
    plotId: 'plot-a',
    plotName: 'Block A - High Altitude Terrace',
    soilType: 'Volcanic Sandy Loam',
    ph: 6.2,
    nitrogenKgHa: 38,
    nitrogenStatus: 'Depleted',
    phosphorusPpm: 18,
    potassiumPpm: 220,
    organicMatterPercent: 3.4,
    moisturePercent: 28,
    compactionRisk: 'Moderate',
    biologicalHealthScore: 78,
    lastTestedDate: '2026-09-28'
  },
  {
    plotId: 'plot-b',
    plotName: "Ada'a Loam Plot B",
    soilType: "Ada'a Heavy Vertisol (Black Clay Loam)",
    ph: 6.8,
    nitrogenKgHa: 46,
    nitrogenStatus: 'Moderate',
    phosphorusPpm: 12,
    potassiumPpm: 310,
    organicMatterPercent: 2.9,
    moisturePercent: 35,
    compactionRisk: 'High',
    biologicalHealthScore: 72,
    lastTestedDate: '2026-10-02'
  },
  {
    plotId: 'plot-c',
    plotName: 'Plot 2 - Valley Flat Field',
    soilType: 'Alluvial Heavy Silt Loam',
    ph: 6.5,
    nitrogenKgHa: 32,
    nitrogenStatus: 'Depleted',
    phosphorusPpm: 14,
    potassiumPpm: 195,
    organicMatterPercent: 2.4,
    moisturePercent: 52,
    compactionRisk: 'Moderate',
    biologicalHealthScore: 68,
    lastTestedDate: '2026-09-22'
  },
  {
    plotId: 'plot-d',
    plotName: 'Vegetable Garden Bed #4',
    soilType: 'Rich Organic Compost Loam',
    ph: 6.4,
    nitrogenKgHa: 68,
    nitrogenStatus: 'Optimal',
    phosphorusPpm: 28,
    potassiumPpm: 240,
    organicMatterPercent: 4.8,
    moisturePercent: 22,
    compactionRisk: 'Low',
    biologicalHealthScore: 92,
    lastTestedDate: '2026-10-04'
  },
  {
    plotId: 'plot-e',
    plotName: 'East Orchard Slope',
    soilType: 'Deep Terraced Volcanic Loam',
    ph: 6.1,
    nitrogenKgHa: 42,
    nitrogenStatus: 'Moderate',
    phosphorusPpm: 16,
    potassiumPpm: 210,
    organicMatterPercent: 3.8,
    moisturePercent: 30,
    compactionRisk: 'Low',
    biologicalHealthScore: 84,
    lastTestedDate: '2026-09-18'
  }
];

export const historicalHarvests: HarvestHistoryRecord[] = [
  {
    id: 'harv-101',
    plotId: 'plot-a',
    plotName: 'Block A - High Altitude Terrace',
    season: 'Meher 2025/26',
    crop: 'Arabica Coffee & Sweet Pepper',
    yieldQuintals: 14.5,
    harvestDate: '2026-04-12',
    familyCategory: 'Heavy Feeder',
    nutrientDepletion: 'High',
    pestRisksObserved: ['Coffee berry borer pressure', 'Nitrogen depletion']
  },
  {
    id: 'harv-102',
    plotId: 'plot-b',
    plotName: "Ada'a Loam Plot B",
    season: 'Meher 2025/26',
    crop: 'Pure White Teff',
    yieldQuintals: 18.2,
    harvestDate: '2026-01-15',
    familyCategory: 'Light Feeder / Grain',
    nutrientDepletion: 'Medium',
    pestRisksObserved: ['Residual grass weed seed bank', 'Vertisol surface cracking']
  },
  {
    id: 'harv-103',
    plotId: 'plot-c',
    plotName: 'Plot 2 - Valley Flat Field',
    season: 'Belg 2026',
    crop: 'Hybrid Maize (BH-661)',
    yieldQuintals: 42.0,
    harvestDate: '2026-07-28',
    familyCategory: 'Heavy Feeder',
    nutrientDepletion: 'High',
    pestRisksObserved: ['Fall armyworm larvae residue', 'Phosphorus depletion']
  },
  {
    id: 'harv-104',
    plotId: 'plot-d',
    plotName: 'Vegetable Garden Bed #4',
    season: 'Belg 2026',
    crop: 'Roma Tomatoes',
    yieldQuintals: 28.5,
    harvestDate: '2026-08-10',
    familyCategory: 'Heavy Feeder',
    nutrientDepletion: 'High',
    pestRisksObserved: ['Early blight (Alternaria) fungal spores', 'Root-knot nematode cysts']
  },
  {
    id: 'harv-105',
    plotId: 'plot-e',
    plotName: 'East Orchard Slope',
    season: 'Meher 2025/26',
    crop: 'Hass Avocado',
    yieldQuintals: 36.0,
    harvestDate: '2026-03-20',
    familyCategory: 'Heavy Feeder',
    nutrientDepletion: 'Medium',
    pestRisksObserved: ['Soil compaction in alleys', 'Shallow weed competition']
  }
];

export const initialCropRotationRecommendations: CropRotationPlanRecommendation[] = [
  {
    id: 'rot-01',
    plotId: 'plot-a',
    plotName: 'Block A - High Altitude Terrace',
    currentOrPreviousCrop: 'Arabica Coffee & Pepper (Heavy Feeder)',
    previousHarvestDate: '2026-04-12',
    recommendedCrop: 'Awash-2 Haricot Beans & Desmodium',
    recommendedVariety: 'Awash-2 Bio-fortified (N-Fixer)',
    cropCategory: 'Legume / Nitrogen Fixer',
    optimalPlantingWindow: 'Nov 12 – Dec 02, 2026 (Residual Moisture)',
    recommendedPlantingDate: '2026-11-18',
    expectedHarvestWindow: 'Feb 15 – Mar 05, 2027',
    growthDurationDays: 90,
    projectedYieldQtlHa: 22.0,
    projectedRevenueETB: 132000,
    rotationRationale:
      'High terrace coffee extraction depleted soil nitrogen down to 38 kg/ha. Rotating with nodulating Awash-2 Haricot Beans biologically re-charges nitrogen reserves without synthetic fertilizer while smothering terrace weeds.',
    soilBenefits: {
      nitrogenFixationKgHa: 48,
      organicMatterBoost: '+16% active humus layer',
      pestDiseaseBreak: 'Disrupts Solanaceae fungal blight & nematode cycles',
      rootStructureBenefit: 'Fibrous root nodules aerate upper 25cm terrace soil'
    },
    fourSeasonCycle: [
      { season: 'Meher 2025', crop: 'Coffee & Pepper', role: 'Heavy Feeder', status: 'Completed' },
      { season: 'Belg 2026', crop: 'Cover Rye', role: 'Erosion Barrier', status: 'Completed' },
      { season: 'Bega 2026/27', crop: 'Awash-2 Haricot Beans', role: 'N-Fixing Legume', status: 'Recommended Next' },
      { season: 'Belg 2027', crop: 'Highland Durum Wheat', role: 'Light Cereal Feeder', status: 'Future Planned' }
    ],
    soilSuitabilityScore: 94,
    urgency: 'Immediate'
  },
  {
    id: 'rot-02',
    plotId: 'plot-b',
    plotName: "Ada'a Loam Plot B",
    currentOrPreviousCrop: 'Pure White Teff (Monoculture Cereal)',
    previousHarvestDate: '2026-01-15',
    recommendedCrop: 'Arerti Kabuli Chickpea',
    recommendedVariety: 'Arerti Large Grain (High Export Value)',
    cropCategory: 'Legume / Nitrogen Fixer',
    optimalPlantingWindow: 'Oct 28 – Nov 18, 2026 (Post-rain Vertisol window)',
    recommendedPlantingDate: '2026-11-08',
    expectedHarvestWindow: 'Feb 10 – Feb 28, 2027',
    growthDurationDays: 105,
    projectedYieldQtlHa: 26.5,
    projectedRevenueETB: 198000,
    rotationRationale:
      "Teff continuous cultivation exhausted topsoil potassium and created subsoil compaction. Deep-taproot Chickpea pierces dense Ada'a black vertisols up to 60cm deep, mining subsoil moisture while fixing 54 kg/ha biological nitrogen.",
    soilBenefits: {
      nitrogenFixationKgHa: 54,
      organicMatterBoost: '+19% root biomass decomposition',
      pestDiseaseBreak: 'Breaks Teff rust and head smut fungal spore dormancy',
      rootStructureBenefit: 'Deep vertical taproots naturally shatter hardpan clay'
    },
    fourSeasonCycle: [
      { season: 'Meher 2025', crop: 'White Teff (Quncho)', role: 'Shallow Cereal Feeder', status: 'Completed' },
      { season: 'Bega 2025/26', crop: 'Short Fallow', role: 'Resting Stage', status: 'Completed' },
      { season: 'Bega 2026/27', crop: 'Arerti Chickpea', role: 'Deep Taproot N-Fixer', status: 'Recommended Next' },
      { season: 'Meher 2027', crop: 'Magna Teff (High Yield)', role: 'Premium Cash Crop', status: 'Future Planned' }
    ],
    soilSuitabilityScore: 98,
    urgency: 'Immediate'
  },
  {
    id: 'rot-03',
    plotId: 'plot-c',
    plotName: 'Plot 2 - Valley Flat Field',
    currentOrPreviousCrop: 'Hybrid Maize BH-661 (Heavy Nitrogen Extractor)',
    previousHarvestDate: '2026-07-28',
    recommendedCrop: 'Soybean (Clark 63k) & Pigeon Pea Border',
    recommendedVariety: 'Clark 63k Inoculated Rhizobia',
    cropCategory: 'Legume / Nitrogen Fixer',
    optimalPlantingWindow: 'Nov 15 – Dec 06, 2026 (Furrow Irrigation)',
    recommendedPlantingDate: '2026-11-24',
    expectedHarvestWindow: 'Mar 01 – Mar 22, 2027',
    growthDurationDays: 110,
    projectedYieldQtlHa: 24.0,
    projectedRevenueETB: 168000,
    rotationRationale:
      'Maize cropping drew soil nitrogen down to 32 kg/ha (Depleted alert). Planting inoculated Soybean replenishes the nitrogen deficit by 52 kg/ha and suppresses fall armyworm larvae that survive in maize stalk debris.',
    soilBenefits: {
      nitrogenFixationKgHa: 52,
      organicMatterBoost: '+22% organic matter addition',
      pestDiseaseBreak: 'Starves fall armyworm and maize stalk borer pupae',
      rootStructureBenefit: 'Dense branched root nodules prevent silt leaching'
    },
    fourSeasonCycle: [
      { season: 'Belg 2026', crop: 'Hybrid Maize (BH-661)', role: 'Exhaustive Heavy Feeder', status: 'Completed' },
      { season: 'Late Belg 2026', crop: 'Stubble Mulch', role: 'Residue Decomposition', status: 'Completed' },
      { season: 'Bega 2026/27', crop: 'Soybean (Clark 63k)', role: 'N-Fixing Oilseed', status: 'Recommended Next' },
      { season: 'Meher 2027', crop: 'Sweet Sorghum / Maize', role: 'High Yield Grain', status: 'Future Planned' }
    ],
    soilSuitabilityScore: 91,
    urgency: 'Scheduled'
  },
  {
    id: 'rot-04',
    plotId: 'plot-d',
    plotName: 'Vegetable Garden Bed #4',
    currentOrPreviousCrop: 'Roma Tomatoes (Solanaceae - Blight Risk)',
    previousHarvestDate: '2026-08-10',
    recommendedCrop: 'Red Bombay Onions & Sweet Carrots',
    recommendedVariety: 'Red Bombay Allium + Nantes Carrot',
    cropCategory: 'Root / Tuber',
    optimalPlantingWindow: 'Nov 04 – Nov 24, 2026 (Raised Bed Drip)',
    recommendedPlantingDate: '2026-11-12',
    expectedHarvestWindow: 'Feb 20 – Mar 12, 2027',
    growthDurationDays: 95,
    projectedYieldQtlHa: 85.0,
    projectedRevenueETB: 285000,
    rotationRationale:
      'CRITICAL DISEASE BREAK: Planting Solanaceae (tomato/potato/pepper) consecutively triggers devastating bacterial wilt and Alternaria blight. Rotating with Allium (Red Onion) releases natural bio-fumigant sulfur compounds that purge soil pathogens.',
    soilBenefits: {
      nitrogenFixationKgHa: 10,
      organicMatterBoost: '+14% humus conditioning',
      pestDiseaseBreak: 'Purges bacterial wilt (Ralstonia) & root knot nematodes by 92%',
      rootStructureBenefit: 'Bulb expansion loosens friable bed structure'
    },
    fourSeasonCycle: [
      { season: 'Belg 2026', crop: 'Roma Tomatoes', role: 'Solanaceae Heavy Feeder', status: 'Completed' },
      { season: 'Post-Harvest', crop: 'Solarization Tarp', role: 'Thermal Pathogen Cleanse', status: 'Completed' },
      { season: 'Bega 2026/27', crop: 'Red Bombay Onions', role: 'Allium Bio-fumigant Break', status: 'Recommended Next' },
      { season: 'Belg 2027', crop: 'Bush Snap Beans', role: 'N-Fixing Vegetable', status: 'Future Planned' }
    ],
    soilSuitabilityScore: 96,
    urgency: 'Immediate'
  },
  {
    id: 'rot-05',
    plotId: 'plot-e',
    plotName: 'East Orchard Slope',
    currentOrPreviousCrop: 'Hass Avocado & Fruit Terraces',
    previousHarvestDate: '2026-03-20',
    recommendedCrop: 'Perennial Crimson Clover & Lucerne',
    recommendedVariety: 'Multi-cut Inoculated Clover',
    cropCategory: 'Cover / Green Manure',
    optimalPlantingWindow: 'Nov 10 – Dec 01, 2026 (Understory Seeding)',
    recommendedPlantingDate: '2026-11-16',
    expectedHarvestWindow: 'Perennial Continuous / Cut Fodder',
    growthDurationDays: 75,
    projectedYieldQtlHa: 38.0,
    projectedRevenueETB: 95000,
    rotationRationale:
      'Orchard alleyways between avocado trees are prone to rain runoff and slope erosion. Sowing a living clover cover crop stops soil loss, fixes 42 kg/ha nitrogen straight into the avocado root zone, and attracts beneficial pollinators.',
    soilBenefits: {
      nitrogenFixationKgHa: 42,
      organicMatterBoost: '+28% continuous living mulch cover',
      pestDiseaseBreak: 'Suppresses Phytophthora root rot through mycorrhizal competition',
      rootStructureBenefit: 'Deep carpet roots stabilize 18% hillside slope gradient'
    },
    fourSeasonCycle: [
      { season: '2025/26', crop: 'Bare Orchard Alley', role: 'Unmanaged Alley', status: 'Completed' },
      { season: 'Meher 2026', crop: 'Terrace Bund Stabilizer', role: 'Erosion Barrier', status: 'Completed' },
      { season: 'Bega 2026/27', crop: 'Crimson Clover Living Mulch', role: 'Nitrogen-Fixing Cover', status: 'Recommended Next' },
      { season: 'Ongoing', crop: 'Alfalfa Fodder Harvest', role: 'Livestock Protein Feed', status: 'Future Planned' }
    ],
    soilSuitabilityScore: 93,
    urgency: 'Scheduled'
  }
];


