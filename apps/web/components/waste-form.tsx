'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, Input } from './ui';
import { clientApiBaseUrl } from '@/lib/client-api';
export function WasteForm() {
  const router = useRouter();
  const [quantity, setQuantity] = useState('1');
  return (
    <form
      className="grid gap-3 sm:grid-cols-4"
      onSubmit={async (e) => {
        e.preventDefault();
        await fetch(`${clientApiBaseUrl}/waste`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            ingredientId: 'salmon',
            quantity: Number(quantity),
            unit: 'lb',
            reason: 'spoilage',
            cost: Number(quantity) * 10,
          }),
        });
        router.refresh();
      }}
    >
      <select className="rounded-xl border border-white/10 bg-[#0f1211] px-3 text-white outline-none focus:border-amber/50">
        <option>Atlantic salmon</option>
      </select>
      <Input
        type="number"
        step=".1"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <select className="rounded-xl border border-white/10 bg-[#0f1211] px-3 text-white outline-none focus:border-amber/50">
        <option value="spoilage">Spoilage</option>
        <option value="overproduction">Overproduction</option>
      </select>
      <Button type="submit">Record waste</Button>
    </form>
  );
}
