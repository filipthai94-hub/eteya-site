# Page Transitions — Eteya Site

## Stack
- `next-transition-router` — hanterar route-bytet
- `GSAP` (redan installerat) — driver animationerna
- `TransitionProvider` — wrapper-komponent i `[locale]/layout.tsx`

## Hur det fungerar

1. Klick på intern länk → `leave`-callback triggas
2. Svart overlay (`#080808`) glider NED och täcker sidan (`scaleY: 0 → 1`, `expo.inOut`)
3. Next.js byter route i bakgrunden (sidan är dold)
4. `enter`-callback triggas — ny sida är redo
5. Overlay glider UPP (`scaleY: 1 → 0`, `expo.inOut`)
6. Sidans innehåll glider IN (`opacity: 0 → 1`, `y: 24 → 0`, `power3.out`)

## Regel: Sidstruktur (OBLIGATORISK)

**Varje ny sida MÅSTE följa detta mönster:**

```tsx
export default function MyPage() {
  return (
    <>
      <Nav />                          {/* ← UTANFÖR page-content */}
      <main className="page-content">  {/* ← GSAP animerar detta */}
        <MyContent />
      </main>
    </>
  )
}
```

### ⚠️ VIKTIGT
- `Nav` ska ALLTID vara **utanför** `<main className="page-content">`
- Annars försvinner sticky header under transitionen (GSAP sätter `opacity: 0` på allt inuti)
- `page-content` är CSS-klassen GSAP targear — ändra den INTE

## Befintliga sidor (korrekt implementerade)

| Sida | Fil |
|------|-----|
| Startsidan `/sv` | `src/app/[locale]/page.tsx` |
| AI-besparing `/sv/ai-besparing` | `src/app/[locale]/ai-besparing/page.tsx` |
| Telestore case `/sv/kundcase/telestore` | `src/app/[locale]/kundcase/telestore/page.tsx` |

## Lägg till en ny sida

1. Skapa `src/app/[locale]/din-sida/page.tsx`
2. Följ sidstrukturen ovan (`<Nav />` utanför, `<main className="page-content">` inuti)
3. Det är allt — transitionen fungerar automatiskt

## Filer

| Fil | Vad den gör |
|-----|-------------|
| `src/components/animations/TransitionProvider.tsx` | GSAP leave/enter callbacks |
| `src/app/globals.css` | `.page-transition-overlay` + `.page-content` CSS |
| `src/app/[locale]/layout.tsx` | Wrappas av `TransitionProvider` |

## Timing & Easing

| Fas | Duration | Ease |
|-----|----------|------|
| Leave (overlay in) | 0.5s | `expo.inOut` |
| Enter (overlay ut) | 0.55s | `expo.inOut` |
| Enter (sida in) | 0.5s | `power3.out` |
| Overlap | -0.2s | sida startar 0.2s innan overlay är klar |
