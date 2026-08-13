'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, Input } from './ui';
import { clientApiBaseUrl } from '@/lib/client-api';
export function RecommendationActions({
  id,
  quantity,
  status,
}: {
  id: string;
  quantity: number;
  status: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(String(quantity));
  const send = async (action: string, body?: object) => {
    await fetch(`${clientApiBaseUrl}/purchasing/${id}/${action}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    router.refresh();
  };
  if (status === 'ordered' || status === 'rejected')
    return <span className="text-sm capitalize muted">{status}</span>;
  return (
    <div className="flex w-full flex-wrap gap-2 lg:w-auto">
      <Input
        className="min-w-20 flex-1 lg:flex-none"
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button
        onClick={() =>
          send(
            Number(value) === quantity ? 'approve' : 'modify',
            Number(value) === quantity ? undefined : { quantity: Number(value) },
          )
        }
      >
        {Number(value) === quantity ? 'Approve' : 'Update'}
      </Button>
      <Button
        className="bg-transparent text-white/40 hover:bg-red-400/10 hover:text-red-300"
        onClick={() => send('reject')}
      >
        Reject
      </Button>
    </div>
  );
}
