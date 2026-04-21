// src/app/[locale]/om-oss/filip/layout.tsx
//
// CRITICAL: This file overrides the global layout for this page ONLY.
// It strips the Nav, footer, and any body padding from the parent layout.
// Without this file, the global layout will break the full-screen vault design.

export default function FilipLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      overflow: 'hidden',
      background: '#010101',
    }}>
      {children}
    </div>
  );
}
