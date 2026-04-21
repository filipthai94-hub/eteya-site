VAULT — FILIP THAI  |  Implementationsinstruktioner
=====================================================

STEG 1 — Kopiera komponent-filer
---------------------------------
Kopiera dessa 4 filer till:  src/components/vault/

  VaultBeams.tsx   →  src/components/vault/VaultBeams.tsx
  VaultLock.tsx    →  src/components/vault/VaultLock.tsx
  VaultDesktop.tsx →  src/components/vault/VaultDesktop.tsx
  VaultMobile.tsx  →  src/components/vault/VaultMobile.tsx


STEG 2 — Skapa sidan
---------------------
Kopiera:  page.tsx  →  src/app/[locale]/om-oss/filip/page.tsx


STEG 3 — Kopiera foto
----------------------
Kopiera Filip's foto till:  public/images/team/filip.png
(originalet heter assets/filip.png i designmappen)


STEG 4 — Kopiera vCard
-----------------------
Kopiera:  filip-thai.vcf  →  public/filip-thai.vcf


STEG 5 — Lägg till CSS för stage-skalning
------------------------------------------
Lägg till i globals.css (eller motsvarande):

  :root { --vault-scale: 1; }
  @media (max-width: 1500px) { :root { --vault-scale: 0.85; } }
  @media (max-width: 1300px) { :root { --vault-scale: 0.70; } }
  @media (max-width: 1050px) { :root { --vault-scale: 0.55; } }


STEG 6 — Lägg till Google Fonts (om de inte finns)
----------------------------------------------------
Kontrollera att dessa fonts laddas i layout.tsx eller _document:

  https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500&family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap


STEG 7 — Nav & Footer (valfritt)
----------------------------------
I page.tsx finns kommentarer där du kan lägga in din befintliga
<Nav /> och <FooterCTAClient /> om du vill ha dem på sidan.


KONTAKTDATA (verifierad)
------------------------
  Namn:      Filip Thai
  Telefon:   +46 73 982 39 62
  Email:     kontakt@eteya.ai
  Webb:      https://eteya.ai
  LinkedIn:  https://www.linkedin.com/in/filip-thai-10449a3b6/
  Cal.com:   https://cal.com/filip
  Foto:      /images/team/filip.png


DET ÄR ALLT. Inga npm-paket att installera, ingen konfiguration utöver ovan.
