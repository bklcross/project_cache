import type { Recipe } from '@restaurant/shared';
import { Header } from '@/components/header';
import { PageHeading } from '@/components/page-heading';
import { ProductionPlanner } from '@/components/production-planner';
import { api } from '@/lib/api';

export default async function PlannerPage() {
  const recipes = await api<Recipe[]>('/recipes');
  return (
    <>
      <Header />
      <PageHeading
        eyebrow="Kitchen prep"
        title="Production planner"
        detail="Enter how many portions you plan to make. We will total the ingredients and compare them with inventory."
      />
      <ProductionPlanner recipes={recipes} />
    </>
  );
}
