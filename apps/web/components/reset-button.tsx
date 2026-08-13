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
      className="hidden border border-white/10 bg-white/[.05] text-white/65 shadow-none hover:bg-white/10 hover:text-white sm:block"
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
