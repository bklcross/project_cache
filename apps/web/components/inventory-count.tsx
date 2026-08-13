'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, Input } from './ui';
import { clientApiBaseUrl } from '@/lib/client-api';
export function InventoryCount({
  ingredientId,
  quantity,
}: {
  ingredientId: string;
  quantity: number;
}) {
  const router = useRouter();
  const [value, setValue] = useState(String(quantity));
  return (
    <form
      className="flex w-full gap-2"
      onSubmit={async (e) => {
        e.preventDefault();
        await fetch(`${clientApiBaseUrl}/inventory/counts`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ ingredientId, quantity: Number(value) }),
        });
        router.refresh();
      }}
    >
      <Input
        aria-label="Count quantity"
        className="min-w-0 flex-1 md:w-24 md:flex-none"
        type="number"
        step=".1"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button type="submit" className="px-3">
        Save
      </Button>
    </form>
  );
}
