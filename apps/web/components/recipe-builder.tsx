'use client';
import type { Ingredient } from '@restaurant/shared';
import { Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { clientApiBaseUrl } from '@/lib/client-api';
import { Button, Input } from './ui';

type Row = { ingredientId: string; quantity: string };

export function RecipeBuilder({ ingredients }: { ingredients: Ingredient[] }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [yieldPortions, setYield] = useState('10');
  const [rows, setRows] = useState<Row[]>([{ ingredientId: ingredients[0]?.id ?? '', quantity: '' }]);
  const selectClass = 'w-full rounded-xl border border-white/10 bg-[#0f1211] px-3 py-2 text-white outline-none focus:border-amber/50';
  const update = (index: number, values: Partial<Row>) =>
    setRows((current) => current.map((row, i) => i === index ? { ...row, ...values } : row));

  return (
    <form className="mt-5 space-y-4" onSubmit={async (event) => {
      event.preventDefault();
      await fetch(`${clientApiBaseUrl}/recipes`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name,
          yieldPortions: Number(yieldPortions),
          ingredients: rows.map((row) => ({ ...row, quantity: Number(row.quantity) })),
        }),
      });
      setName('');
      router.refresh();
    }}>
      <label className="block text-sm font-medium">Recipe name<Input className="mt-1.5" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Example: Tomato soup" /></label>
      <label className="block text-sm font-medium">Batch makes<Input className="mt-1.5" required min="1" type="number" value={yieldPortions} onChange={(e) => setYield(e.target.value)} /></label>
      <div>
        <p className="mb-2 text-sm font-medium">Ingredients</p>
        <div className="space-y-2">
          {rows.map((row, index) => {
            const ingredient = ingredients.find((x) => x.id === row.ingredientId);
            return (
              <div className="grid grid-cols-[1fr_7rem_auto] gap-2" key={index}>
                <select className={selectClass} value={row.ingredientId} onChange={(e) => update(index, { ingredientId: e.target.value })}>
                  {ingredients.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
                </select>
                <Input aria-label="Quantity" required min=".01" step=".01" type="number" value={row.quantity} onChange={(e) => update(index, { quantity: e.target.value })} placeholder={ingredient?.unit} />
                <button aria-label="Remove ingredient" className="px-2 text-white/35 hover:text-red-300" disabled={rows.length === 1} type="button" onClick={() => setRows((x) => x.filter((_, i) => i !== index))}><Trash2 size={17} /></button>
              </div>
            );
          })}
        </div>
        <button className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-amber" type="button" onClick={() => setRows((x) => [...x, { ingredientId: ingredients[0]?.id ?? '', quantity: '' }])}><Plus size={16} /> Add ingredient</button>
      </div>
      <Button className="w-full" type="submit">Save recipe</Button>
    </form>
  );
}
