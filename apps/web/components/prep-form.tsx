'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, Input } from './ui';
import { clientApiBaseUrl } from '@/lib/client-api';
export function PrepForm() {
  const router = useRouter();
  const [raw, setRaw] = useState('10');
  const [usable, setUsable] = useState('7.4');
  return (
    <form
      className="grid gap-3 sm:grid-cols-4"
      onSubmit={async (e) => {
        e.preventDefault();
        await fetch(`${clientApiBaseUrl}/prep-sessions`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            ingredientId: 'chicken_breast',
            supplierId: 'supplier_market',
            rawWeight: Number(raw),
            usableWeight: Number(usable),
          }),
        });
        router.refresh();
      }}
    >
      <select className="rounded-xl border border-black/10 px-3">
        <option value="chicken_breast">Chicken breast</option>
      </select>
      <Input
        type="number"
        step=".1"
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        placeholder="Raw weight"
      />
      <Input
        type="number"
        step=".1"
        value={usable}
        onChange={(e) => setUsable(e.target.value)}
        placeholder="Usable weight"
      />
      <Button type="submit">Log prep yield</Button>
    </form>
  );
}
