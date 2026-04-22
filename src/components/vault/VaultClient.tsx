'use client';

import dynamic from 'next/dynamic';
import { VaultBeams } from './VaultBeams';
import type { PersonData } from './VaultDesktop';

const VaultDesktop = dynamic(
  () => import('./VaultDesktop').then(m => ({ default: m.VaultDesktop })),
  { ssr: false }
);
const VaultMobile = dynamic(
  () => import('./VaultMobile').then(m => ({ default: m.VaultMobile })),
  { ssr: false }
);

export function VaultClient({ person }: { person: PersonData }) {
  return (
    <>
      {/* DESKTOP */}
      <div className="vault-desktop-wrapper">
        <VaultBeams intensity="strong" style={{ zIndex: 1 }} />
        <div className="vault-stage">
          <VaultDesktop person={person} />
        </div>
      </div>

      {/* MOBILE */}
      <div className="vault-mobile-wrapper">
        <VaultBeams intensity="strong" style={{ zIndex: 1 }} />
        <VaultMobile person={person} />
      </div>
    </>
  );
}