'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from './ui';
import { clientApiBaseUrl } from '@/lib/client-api';
export function ResetButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <Button
      className="hidden bg-white text-ink shadow-sm hover:bg-mint sm:block"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await fetch(`${clientApiBaseUrl}/demo/reset`, { method: 'POST' });
        router.refresh();
        setBusy(false);
      }}
    >
      {busy ? 'Resetting…' : 'Reset demo data'}
    </Button>
  );
}
