'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { clientApiBaseUrl } from '@/lib/client-api';
import { Button, Input } from './ui';

const units = ['lb', 'oz', 'qt', 'gal', 'each', 'case', 'bag'];
const categories = ['Protein', 'Produce', 'Dairy', 'Dry goods', 'Bakery', 'Beverage', 'Other'];

export function IngredientForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const selectClass = 'w-full rounded-xl border border-white/10 bg-[#0f1211] px-3 py-2 text-white outline-none focus:border-amber/50';

  return (
    <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={async (event) => {
      event.preventDefault();
      setBusy(true);
      setError('');
      const values = Object.fromEntries(new FormData(event.currentTarget));
      const response = await fetch(`${clientApiBaseUrl}/ingredients`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: values.name,
          category: values.category,
          unit: values.unit,
          quantity: Number(values.quantity),
          parLevel: Number(values.parLevel),
          unitCost: Number(values.unitCost),
        }),
      });
      if (!response.ok) {
        const body = await response.json();
        setError(Array.isArray(body.message) ? body.message.join(', ') : body.message);
      } else {
        event.currentTarget.reset();
        router.refresh();
      }
      setBusy(false);
    }}>
      <label className="text-sm font-medium sm:col-span-2">Ingredient name<Input className="mt-1.5" name="name" placeholder="Example: Roma tomatoes" required /></label>
      <label className="text-sm font-medium">Category<select className={`${selectClass} mt-1.5`} name="category">{categories.map((x) => <option key={x}>{x}</option>)}</select></label>
      <label className="text-sm font-medium">Measurement unit<select className={`${selectClass} mt-1.5`} name="unit">{units.map((x) => <option key={x}>{x}</option>)}</select></label>
      <label className="text-sm font-medium">Starting quantity<Input className="mt-1.5" min="0" name="quantity" step=".01" type="number" defaultValue="0" required /></label>
      <label className="text-sm font-medium">Target stock level<Input className="mt-1.5" min="0" name="parLevel" step=".01" type="number" defaultValue="0" required /></label>
      <label className="text-sm font-medium sm:col-span-2">Cost per unit<Input className="mt-1.5" min="0" name="unitCost" step=".01" type="number" defaultValue="0" required /></label>
      {error && <p className="text-sm text-red-300 sm:col-span-2">{error}</p>}
      <Button className="sm:col-span-2" disabled={busy} type="submit">{busy ? 'Adding…' : 'Add ingredient'}</Button>
    </form>
  );
}
