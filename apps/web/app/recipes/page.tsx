import type { Ingredient, Recipe } from '@restaurant/shared';
import { Header } from '@/components/header';
import { PageHeading } from '@/components/page-heading';
import { RecipeBuilder } from '@/components/recipe-builder';
import { Card } from '@/components/ui';
import { api } from '@/lib/api';

type RecipeView = Omit<Recipe, 'ingredients'> & {
  ingredients: Array<Recipe['ingredients'][number] & { ingredient?: Ingredient }>;
};

export default async function RecipesPage() {
  const [recipes, ingredients] = await Promise.all([
    api<RecipeView[]>('/recipes'),
    api<Ingredient[]>('/ingredients'),
  ]);
  return (
    <>
      <Header />
      <PageHeading
        eyebrow="Recipe book"
        title="Recipes"
        detail="Create a recipe once, then use it whenever you plan kitchen prep."
      />
      <div className="grid items-start gap-6 xl:grid-cols-[.9fr_1.1fr]">
        <Card>
          <h2 className="text-lg font-bold">Create recipe</h2>
          <p className="mt-1 text-sm muted">Enter the batch yield and total ingredient amounts.</p>
          <RecipeBuilder ingredients={ingredients} />
        </Card>
        <div className="space-y-4">
          {recipes.map((recipe) => (
            <Card key={recipe.id}>
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-lg font-bold">{recipe.name}</h2>
                <span className="shrink-0 text-sm text-amber">Makes {recipe.yieldPortions}</span>
              </div>
              <div className="mt-4 border-t border-white/[.07] pt-3">
                {recipe.ingredients.map((item) => (
                  <div key={item.ingredientId} className="flex justify-between gap-4 py-1.5 text-sm">
                    <span className="muted">{item.ingredient?.name ?? item.ingredientId}</span>
                    <span>{item.quantity} {item.ingredient?.unit}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
