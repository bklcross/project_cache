export type Risk = 'low' | 'medium' | 'high';
export type RecommendationStatus = 'pending' | 'approved' | 'modified' | 'rejected' | 'ordered';

export interface Restaurant {
  id: string;
  name: string;
  location: string;
}
export interface Ingredient {
  id: string;
  name: string;
  unit: string;
  baselineYield: number;
  safetyStock: number;
  shelfLifeDays: number;
  category: string;
}
export interface InventoryItem {
  ingredientId: string;
  quantity: number;
  incomingQuantity: number;
  parLevel: number;
  lastCountedAt: string;
  theoreticalQuantity: number;
}
export interface RecipeIngredient {
  kind: 'ingredient' | 'prep';
  id: string;
  quantity: number;
}
export interface Recipe {
  id: string;
  menuItemId?: string;
  name: string;
  yieldPortions: number;
  ingredients: RecipeIngredient[];
}
export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  recipeId: string;
}
export interface MenuSale {
  date: string;
  menuItemId: string;
  quantity: number;
}
export interface YieldObservation {
  ingredientId: string;
  supplierId: string;
  date: string;
  rawWeight: number;
  usableWeight: number;
}
export interface PrepSession extends YieldObservation {
  id: string;
  note?: string;
}
export interface Supplier {
  id: string;
  name: string;
  leadTimeDays: number;
  minimumOrder: number;
}
export interface SupplierItem {
  id: string;
  supplierId: string;
  ingredientId: string;
  packageQuantity: number;
  packageUnit: string;
  price: number;
}
export interface Forecast {
  menuItemId: string;
  menuItemName: string;
  date: string;
  expected: number;
  low: number;
  high: number;
  confidence: number;
}
export interface YieldPrediction {
  ingredientId: string;
  baselineYield: number;
  historicalYield: number;
  recentYield: number;
  predictedYield: number;
  confidence: number;
  supplierYields: Record<string, number>;
}
export interface RecommendationExplanation {
  usableDemand: number;
  predictedYield: number;
  rawRequirement: number;
  currentInventory: number;
  incomingInventory: number;
  safetyStock: number;
  recommendedQuantity: number;
}
export interface PurchaseRecommendation {
  id: string;
  ingredientId: string;
  ingredientName: string;
  supplierId: string;
  supplierName: string;
  recommendedQuantity: number;
  packageCount: number;
  unit: string;
  estimatedCost: number;
  risk: Risk;
  confidence: number;
  status: RecommendationStatus;
  explanation: RecommendationExplanation;
}
export interface PurchaseOrderItem {
  ingredientId: string;
  quantity: number;
  unit: string;
  unitCost: number;
}
export interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  status: 'draft' | 'sent' | 'received';
  createdAt: string;
  expectedAt: string;
  items: PurchaseOrderItem[];
  total: number;
}
export interface WasteRecord {
  id: string;
  ingredientId: string;
  quantity: number;
  unit: string;
  reason: string;
  occurredAt: string;
  cost: number;
}
export interface ReceivingRecord {
  id: string;
  purchaseOrderId: string;
  receivedAt: string;
  items: Array<{ ingredientId: string; quantity: number }>;
}
export interface InventoryCount {
  id: string;
  ingredientId: string;
  quantity: number;
  countedAt: string;
}
export interface Dashboard {
  summary: {
    inventoryValue: number;
    openRecommendations: number;
    stockoutRisks: number;
    forecastedCovers: number;
    wasteCost: number;
  };
  recommendations: PurchaseRecommendation[];
  risks: Array<{ ingredientId: string; name: string; daysRemaining: number; risk: Risk }>;
  forecast: Forecast[];
  waste: { totalCost: number; totalQuantity: number; topReason: string };
  yieldAlerts: Array<{
    ingredientId: string;
    name: string;
    predictedYield: number;
    baselineYield: number;
  }>;
  inventoryVariance: number;
}
