'use client';
import type { IngredientRequirement, Recipe } from '@restaurant/shared';
import { Check, TriangleAlert } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { clientApiBaseUrl } from '@/lib/client-api';
import { Button, Card, Input } from './ui';

export function ProductionPlanner({ recipes }: { recipes: Recipe[] }) {
  const router = useRouter();
  const [portions, setPortions] = useState<Record<string, string>>({});
  const [requirements, setRequirements] = useState<IngredientRequirement[] | null>(null);
  return (
    <div className="grid items-start gap-6 xl:grid-cols-[.8fr_1.2fr]">
      <Card>
        <h2 className="text-lg font-bold">What are you making?</h2>
        <div className="mt-4 space-y-3">
          {recipes.map((recipe) => (
            <label className="flex items-center justify-between gap-4 rounded-xl border border-white/[.07] bg-black/10 p-3" key={recipe.id}>
              <span><span className="block font-semibold">{recipe.name}</span><span className="text-xs muted">portions</span></span>
              <Input className="w-24" min="0" type="number" value={portions[recipe.id] ?? ''} onChange={(e) => setPortions((x) => ({ ...x, [recipe.id]: e.target.value }))} placeholder="0" />
            </label>
          ))}
        </div>
        <Button className="mt-5 w-full" onClick={async () => {
          const response = await fetch(`${clientApiBaseUrl}/plans/calculate`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ items: recipes.map((recipe) => ({ recipeId: recipe.id, portions: Number(portions[recipe.id] ?? 0) })) }),
          });
          setRequirements(await response.json());
          router.refresh();
        }}>Calculate ingredients</Button>
      </Card>
      <Card>
        <h2 className="text-lg font-bold">Ingredient needs</h2>
        {!requirements ? <p className="mt-3 text-sm muted">Your ingredient totals will appear here.</p> :
          requirements.length === 0 ? <p className="mt-3 text-sm muted">Enter at least one planned portion.</p> :
          <div className="mt-4">
            {requirements.map((item) => (
              <div className="table-row grid-cols-[1fr_auto] gap-3 sm:grid-cols-[1fr_.55fr_.55fr_.55fr]" key={item.ingredientId}>
                <div><p className="font-semibold">{item.name}</p><p className="text-xs muted">{item.unit}</p></div>
                <div className="text-right sm:text-left"><p className="text-xs muted">Need</p><p>{item.required}</p></div>
                <div><p className="text-xs muted">On hand</p><p>{item.onHand}</p></div>
                <div className={item.shortage ? 'text-red-300' : 'text-emerald-300'}>
                  <p className="flex items-center gap-1 text-xs">{item.shortage ? <TriangleAlert size={12} /> : <Check size={12} />}{item.shortage ? 'Short' : 'Remaining'}</p>
                  <p>{item.shortage || item.remaining}</p>
                </div>
              </div>
            ))}
          </div>}
      </Card>
    </div>
  );
}
