export interface Ingredient {
  id: string;
  name: string;
  unit: string;
  category: string;
}
export interface InventoryItem {
  ingredientId: string;
  quantity: number;
  lastCountedAt: string;
}
export interface RecipeIngredient {
  ingredientId: string;
  quantity: number;
}
export interface Recipe {
  id: string;
  name: string;
  yieldPortions: number;
  ingredients: RecipeIngredient[];
}
export interface InventoryCount {
  id: string;
  ingredientId: string;
  quantity: number;
  countedAt: string;
}
export interface ProductionPlanItem {
  recipeId: string;
  portions: number;
}
export interface IngredientRequirement {
  ingredientId: string;
  name: string;
  unit: string;
  required: number;
  onHand: number;
  remaining: number;
  shortage: number;
}
