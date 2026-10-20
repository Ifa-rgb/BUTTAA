export type UserRole = 'farmer' | 'buyer' | 'supplier' | 'expert' | 'admin';

export type Language = 'EN' | 'OM' | 'AM'; // English, Afaan Oromoo, Amharic

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  location: string;
  profilePic?: string;
  bio?: string;
  businessName?: string;
  farmInfo?: {
    farmName: string;
    sizeHectares: number;
    mainCrops: string[];
    locationCoords?: { lat: number; lng: number };
  };
  buyerInfo?: {
    companyName: string;
    purchaseCategories: string[];
    businessType: string;
  };
  supplierInfo?: {
    companyName: string;
    supplyCategories: string[];
    tinNumber?: string;
  };
  adminInfo?: {
    department: string;
    accessLevel: string;
  };
  earningsTotal?: number;
}

export type ProductCategory =
  | 'Fruits'
  | 'Vegetables'
  | 'Cereals'
  | 'Coffee'
  | 'Livestock'
  | 'Dairy Products'
  | 'Poultry'
  | 'Honey'
  | 'Flowers'
  | 'Fish'
  | 'Spices';

export interface ProductReview {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  title: string;
  category: ProductCategory;
  price: number; // in ETB / currency
  unit: string; // e.g., kg, quintal, head, liter, jar
  availableQuantity: number;
  location: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  isOrganic?: boolean;
  reviews?: ProductReview[];
}

export type EquipmentCategory =
  | 'Tractor'
  | 'Water Pump'
  | 'Harvester'
  | 'Sprayer'
  | 'Generator'
  | 'Irrigation System'
  | 'Greenhouse Equipment';

export interface EquipmentItem {
  id: string;
  title: string;
  category: EquipmentCategory;
  buyPrice: number;
  rentPricePerDay: number;
  supplierName: string;
  supplierPhone: string;
  location: string;
  image: string;
  specifications: string;
  availableForRent: boolean;
  availableForBuy: boolean;
}

export type CropType =
  | 'Maize'
  | 'Wheat'
  | 'Barley'
  | 'Coffee'
  | 'Tomato'
  | 'Onion'
  | 'Potato'
  | 'Pepper'
  | 'Bean'
  | 'Teff';

export interface SeedItem {
  id: string;
  title: string;
  cropType: CropType;
  pricePerKg: number;
  supplier: string;
  supplierPhone: string;
  growingGuide: string;
  availabilityStatus: 'In Stock' | 'Limited Stock' | 'Pre-order';
  description: string;
  image: string;
  germinationRate: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type PaymentMethod =
  | 'Cash on Delivery'
  | 'Telebirr'
  | 'CBE Birr'
  | 'M-Pesa'
  | 'Bank Transfer';

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  farmerId?: string;
  items: {
    productId: string;
    productTitle: string;
    unitPrice: number;
    unit: string;
    quantity: number;
    image: string;
  }[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  status: 'Pending' | 'Accepted' | 'In Transit' | 'Delivered' | 'Rejected';
  orderDate: string;
  deliveryAddress: string;
  trackingCode: string;
}

export interface MarketPrice {
  id: string;
  commodity: string;
  category: string;
  unit: string; // e.g. Quintal (100kg), Kg, Head
  currentPrice: number;
  previousPrice: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
  primaryMarkets: string[]; // e.g., Adama, Jimma, Addis Ababa, Hawassa, Bahir Dar
  updatedAt: string;
}

export interface WeatherData {
  city: string;
  region: string;
  tempC: number;
  condition: string;
  humidity: number;
  windKmH: number;
  rainProbability: number;
  forecast7Days: {
    day: string;
    highC: number;
    lowC: number;
    condition: string;
    rainProb: number;
    icon: string;
  }[];
  farmingTips: string[];
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  imageUrl?: string;
  isPlantDiagnosis?: boolean;
}

export interface DiseaseDetectionResult {
  cropName: string;
  diseaseName: string;
  confidenceScore: number; // e.g., 94%
  severity: 'Mild' | 'Moderate' | 'Severe' | 'Healthy';
  possibleCause: string;
  chemicalTreatment: string[];
  organicTreatment: string[];
  preventionSteps: string[];
  recommendedProducts?: string[];
}

export interface LearningContent {
  id: string;
  title: string;
  category: 'Modern Agriculture' | 'Livestock Care' | 'Organic Farming' | 'Best Practices';
  type: 'Video' | 'Article' | 'Guide';
  author: string;
  durationOrReadTime: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  videoUrl?: string;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface NearbyLocation {
  id: string;
  name: string;
  type: 'Buyer' | 'Supplier' | 'Equipment Shop' | 'Veterinary Clinic' | 'Cooperative';
  distanceKm: number;
  address: string;
  phone: string;
  lat: number;
  lng: number;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  type: 'order' | 'weather' | 'market' | 'alert' | 'general';
}

export type FarmActivityType =
  | 'Planting'
  | 'Watering'
  | 'Harvesting'
  | 'Fertilizing'
  | 'Pest Control'
  | 'Pruning'
  | 'Tilling'
  | 'Weeding'
  | 'Soil Treatment'
  | 'General Inspection';

export type TaskStatus = 'Completed' | 'In Progress' | 'Scheduled';

export type TaskPriority = 'High' | 'Medium' | 'Low';

export interface FarmTaskLog {
  id: string;
  farmerId: string;
  activityType: FarmActivityType;
  crop: string;
  plotName: string;
  date: string; // YYYY-MM-DD
  time?: string;
  status: TaskStatus;
  priority: TaskPriority;
  durationHours: number;
  workersCount: number;
  quantityOrMetric?: string; // e.g. "8 Quintals", "3 Hectares", "3,500 L"
  costETB?: number;
  weather?: string;
  notes: string;
  isOrganicCertified?: boolean;
  photoUrl?: string; // Captured photo proof of work
  photoTimestamp?: string; // Date-time of capture
  photoVerified?: boolean; // True if photo attached
  photoVerificationNote?: string; // Optional caption
}

export interface SoilMoistureSensor {
  id: string;
  plotId: string;
  plotName: string;
  crop: string;
  moisturePercent: number; // 0 - 100%
  thresholdMinPercent: number; // e.g. 35%
  thresholdMaxPercent: number; // e.g. 75%
  soilTempC: number;
  rootDepthCm: number;
  soilType: string;
  batteryPercent: number;
  lastUpdated: string;
  valveStatus: 'Closed' | 'Open (Irrigating)' | 'Standby';
}

export interface IrrigationAlert {
  id: string;
  plotName: string;
  crop: string;
  urgency: 'Critical' | 'Warning' | 'Optimal' | 'Rain Postponed';
  optimalTimeWindow: string; // e.g. "06:00 AM – 08:30 AM"
  secondaryTimeWindow?: string; // e.g. "05:45 PM – 07:30 PM"
  recommendedDurationHours: number;
  recommendedLiters: number;
  waterMethod: 'Drip Irrigation' | 'Furrow Flooding' | 'Micro-Sprinkler';
  evaporationLossPercent: number;
  reasoning: string;
  savingsEtb: number;
}

export interface SoilDataProfile {
  plotId: string;
  plotName: string;
  soilType: string;
  ph: number;
  nitrogenKgHa: number;
  nitrogenStatus: 'Depleted' | 'Moderate' | 'Optimal' | 'Surplus';
  phosphorusPpm: number;
  potassiumPpm: number;
  organicMatterPercent: number;
  moisturePercent: number;
  compactionRisk: 'Low' | 'Moderate' | 'High';
  biologicalHealthScore: number; // 0 - 100
  lastTestedDate: string;
}

export interface HarvestHistoryRecord {
  id: string;
  plotId: string;
  plotName: string;
  season: string;
  crop: string;
  yieldQuintals: number;
  harvestDate: string;
  familyCategory: 'Heavy Feeder' | 'Legume / Nitrogen Fixer' | 'Light Feeder / Grain' | 'Root / Tuber';
  nutrientDepletion: 'High' | 'Medium' | 'Low';
  pestRisksObserved: string[];
}

export interface CropRotationPlanRecommendation {
  id: string;
  plotId: string;
  plotName: string;
  currentOrPreviousCrop: string;
  previousHarvestDate: string;
  recommendedCrop: string;
  recommendedVariety: string;
  cropCategory: 'Legume / Nitrogen Fixer' | 'Heavy Feeder' | 'Light Feeder / Grain' | 'Root / Tuber' | 'Cover / Green Manure';
  optimalPlantingWindow: string;
  recommendedPlantingDate: string; // YYYY-MM-DD
  expectedHarvestWindow: string;
  growthDurationDays: number;
  projectedYieldQtlHa: number;
  projectedRevenueETB: number;
  rotationRationale: string;
  soilBenefits: {
    nitrogenFixationKgHa: number;
    organicMatterBoost: string;
    pestDiseaseBreak: string;
    rootStructureBenefit: string;
  };
  fourSeasonCycle: {
    season: string;
    crop: string;
    role: string;
    status: 'Completed' | 'Current' | 'Recommended Next' | 'Future Planned';
  }[];
  soilSuitabilityScore: number; // 0 - 100
  urgency: 'Immediate' | 'Scheduled' | 'Upcoming';
}

export type ScreenId =
  | 'splash'
  | 'onboarding'
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'home'
  | 'categories'
  | 'product-details'
  | 'cart'
  | 'checkout'
  | 'orders'
  | 'farmer-dashboard'
  | 'farm-task-logs'
  | 'add-product'
  | 'edit-product'
  | 'equipment'
  | 'seeds'
  | 'weather'
  | 'ai-assistant'
  | 'disease-detection'
  | 'market-prices'
  | 'learning-center'
  | 'chat'
  | 'notifications'
  | 'profile'
  | 'settings'
  | 'help-center'
  | 'admin-login'
  | 'admin-dashboard';
