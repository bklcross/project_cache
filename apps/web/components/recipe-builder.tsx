'use client';
import type { Ingredient } from '@restaurant/shared';
import { Plus, Trash2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { clientApiBaseUrl } from '@/lib/client-api';
import { Button, Input } from './ui';

type Row = { ingredientId: string; quantity: string };
const units = ['lb', 'oz', 'qt', 'gal', 'each', 'case', 'bag'];
const categories = ['Protein', 'Produce', 'Dairy', 'Dry goods', 'Bakery', 'Beverage', 'Other'];
const selectClass = 'w-full rounded-xl border border-white/10 bg-[#0f1211] px-3 py-2 text-white outline-none focus:border-amber/50';

export function RecipeBuilder({ ingredients: initialIngredients }: { ingredients: Ingredient[] }) {
  const router = useRouter();
  const [ingredients, setIngredients] = useState(initialIngredients);
  const [name, setName] = useState('');
  const [yieldPortions, setYield] = useState('10');
  const [rows, setRows] = useState<Row[]>([{ ingredientId: initialIngredients[0]?.id ?? '', quantity: '' }]);
  const [addingAt, setAddingAt] = useState<number | null>(null);
  const [newIngredient, setNewIngredient] = useState({ name: '', category: 'Produce', unit: 'lb', unitCost: '' });
  const [ingredientError, setIngredientError] = useState('');

  const update = (index: number, values: Partial<Row>) =>
    setRows((current) => current.map((row, i) => i === index ? { ...row, ...values } : row));

  const createIngredient = async () => {
    setIngredientError('');
    const response = await fetch(`${clientApiBaseUrl}/ingredients`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...newIngredient, unitCost: Number(newIngredient.unitCost) }),
    });
    const body = await response.json();
    if (!response.ok) {
      setIngredientError(Array.isArray(body.message) ? body.message.join(', ') : body.message);
      return;
    }
    const ingredient = body as Ingredient;
    setIngredients((current) => [...current, ingredient]);
    if (addingAt !== null) update(addingAt, { ingredientId: ingredient.id });
    setAddingAt(null);
    setNewIngredient({ name: '', category: 'Produce', unit: 'lb', unitCost: '' });
  };

  return (
    <form className="mt-5 space-y-5" onSubmit={async (event) => {
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
      setRows([{ ingredientId: ingredients[0]?.id ?? '', quantity: '' }]);
      router.refresh();
    }}>
      <label className="block text-sm font-medium">Recipe name<Input className="mt-1.5" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Example: Tomato soup" /></label>
      <label className="block text-sm font-medium">Batch makes<Input className="mt-1.5" required min="1" type="number" value={yieldPortions} onChange={(e) => setYield(e.target.value)} /></label>
      <div>
        <p className="mb-2 text-sm font-medium">Ingredients</p>
        <div className="space-y-3">
          {rows.map((row, index) => {
            const ingredient = ingredients.find((x) => x.id === row.ingredientId);
            return (
              <div key={index}>
                <div className="grid grid-cols-[1fr_7rem_auto] gap-2">
                  <select className={selectClass} value={row.ingredientId} onChange={(e) => {
                    if (e.target.value === 'new') setAddingAt(index);
                    else update(index, { ingredientId: e.target.value });
                  }}>
                    {ingredients.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
                    <option value="new">＋ Create new ingredient</option>
                  </select>
                  <Input aria-label="Quantity" required min=".01" step=".01" type="number" value={row.quantity} onChange={(e) => update(index, { quantity: e.target.value })} placeholder={ingredient?.unit ?? 'amount'} />
                  <button aria-label="Remove ingredient" className="px-2 text-white/35 hover:text-red-300" disabled={rows.length === 1} type="button" onClick={() => setRows((x) => x.filter((_, i) => i !== index))}><Trash2 size={17} /></button>
                </div>
                {addingAt === index && (
                  <div className="mt-2 rounded-xl border border-amber/25 bg-amber/[.06] p-3">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold">New ingredient</p>
                      <button aria-label="Cancel" className="text-white/45 hover:text-white" onClick={() => setAddingAt(null)} type="button"><X size={16} /></button>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-[1fr_.8fr_.55fr_.65fr_auto]">
                      <Input autoFocus placeholder="Ingredient name" value={newIngredient.name} onChange={(e) => setNewIngredient((x) => ({ ...x, name: e.target.value }))} />
                      <select className={selectClass} value={newIngredient.category} onChange={(e) => setNewIngredient((x) => ({ ...x, category: e.target.value }))}>{categories.map((x) => <option key={x}>{x}</option>)}</select>
                      <select className={selectClass} value={newIngredient.unit} onChange={(e) => setNewIngredient((x) => ({ ...x, unit: e.target.value }))}>{units.map((x) => <option key={x}>{x}</option>)}</select>
                      <Input min="0" placeholder="Cost / unit" step=".01" type="number" value={newIngredient.unitCost} onChange={(e) => setNewIngredient((x) => ({ ...x, unitCost: e.target.value }))} />
                      <Button disabled={!newIngredient.name.trim()} onClick={createIngredient} type="button">Add</Button>
                    </div>
                    {ingredientError && <p className="mt-2 text-sm text-red-300">{ingredientError}</p>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <button className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-amber" type="button" onClick={() => setRows((x) => [...x, { ingredientId: ingredients[0]?.id ?? '', quantity: '' }])}><Plus size={16} /> Add another ingredient</button>
      </div>
      <Button className="w-full" type="submit">Save recipe</Button>
    </form>
  );
}
