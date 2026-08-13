'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from './ui';
import { clientApiBaseUrl } from '@/lib/client-api';
export function CreatePo({ ids }: { ids: string[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <Button
      disabled={!ids.length || busy}
      onClick={async () => {
        setBusy(true);
        await fetch(`${clientApiBaseUrl}/purchase-orders`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ recommendationIds: ids }),
        });
        router.push('/purchase-orders');
        router.refresh();
      }}
    >
      {busy ? 'Creating…' : `Create PO from approved (${ids.length})`}
    </Button>
  );
}
