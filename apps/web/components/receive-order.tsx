'use client';
import { useRouter } from 'next/navigation';
import { Button } from './ui';
import { clientApiBaseUrl } from '@/lib/client-api';
export function ReceiveOrder({
  id,
  items,
}: {
  id: string;
  items: Array<{ ingredientId: string; quantity: number }>;
}) {
  const router = useRouter();
  return (
    <Button
      onClick={async () => {
        await fetch(`${clientApiBaseUrl}/receiving`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ purchaseOrderId: id, items }),
        });
        router.refresh();
      }}
    >
      Receive all
    </Button>
  );
}
