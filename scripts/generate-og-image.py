#!/usr/bin/env python3
"""
Generate OG images for all pages × locales.

Same background (public/og/og-home-bg.jpg) + ETEYA© logo + per-page title/subtitle.
Outputs to public/images/og/og-[page]-[locale].jpg (20 images total).
Plus public/images/og-image.jpg = home-sv as the universal fallback.

Fonts (download once — see setup-og-fonts.sh):
  /tmp/og-fonts/DMSans-{Bold,Medium,Regular}.ttf
  /tmp/og-fonts/BarlowCondensed-ExtraBold.ttf

Run: python3 scripts/generate-og-image.py
"""
from PIL import Image, ImageDraw, ImageFont
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BG = os.path.join(ROOT, 'public/og/og-home-bg.jpg')
OUT_DIR = os.path.join(ROOT, 'public/images/og')
F = '/tmp/og-fonts/'

# ──────────────────────────────────────────────────────────────
# Per-page + per-locale copy. Title lines are explicit arrays so
# we control exactly where line breaks fall.
# ──────────────────────────────────────────────────────────────
PAGES = {
    'home': {
        'sv': {
            'title': ['AI som driver', 'ditt företag.'],
            'sub': ['Skräddarsydda AI-lösningar', 'för svenska SMB.'],
        },
        'en': {
            'title': ['AI that drives', 'your business.'],
            'sub': ['Custom AI solutions', 'for Swedish SMBs.'],
        },
    },
    'om-oss': {
        'sv': {
            'title': ['Människorna', 'bakom Eteya.'],
            'sub': ['AI-konsulter med', 'mätbara resultat.'],
        },
        'en': {
            'title': ['The people', 'behind Eteya.'],
            'sub': ['AI consultants with', 'measurable results.'],
        },
    },
    'kontakt': {
        'sv': {
            'title': ['Låt oss prata.'],
            'sub': ['Boka en kostnadsfri', 'analys med oss.'],
        },
        'en': {
            'title': ["Let's talk."],
            'sub': ['Book a free analysis', 'with our team.'],
        },
    },
    'ai-besparing': {
        'sv': {
            'title': ['Beräkna din', 'AI-besparing.'],
            'sub': ['Transparent ROI-kalkylator', 'baserad på verifierad data.'],
        },
        'en': {
            'title': ['Calculate your', 'AI savings.'],
            'sub': ['Transparent ROI calculator', 'based on verified data.'],
        },
    },
    'kundcase': {
        'sv': {
            'title': ['Våra case.'],
            'sub': ['Verkliga kunder.', 'Verkliga besparingar.'],
        },
        'en': {
            'title': ['Our case studies.'],
            'sub': ['Real customers.', 'Real savings.'],
        },
    },
    'telestore': {
        'sv': {
            'title': ['Telestore.'],
            'sub': ['390 000 kr/år i', 'verifierad besparing.'],
        },
        'en': {
            'title': ['Telestore.'],
            'sub': ['SEK 390,000/year in', 'verified savings.'],
        },
    },
    'nordicrank': {
        'sv': {
            'title': ['Nordicrank.'],
            'sub': ['50% mer organisk trafik', '+ 18 automationer.'],
        },
        'en': {
            'title': ['Nordicrank.'],
            'sub': ['50% more organic traffic', '+ 18 automations.'],
        },
    },
    'sannegarden': {
        'sv': {
            'title': ['Sannegården.'],
            'sub': ['Aldrig ett missat samtal', 'under rusning.'],
        },
        'en': {
            'title': ['Sannegården.'],
            'sub': ['Never miss a call', 'during rush hour.'],
        },
    },
    'trainwithalbert': {
        'sv': {
            'title': ['TrainWithAlbert.'],
            'sub': ['3× fler bokningar', '+ 45% återbokning.'],
        },
        'en': {
            'title': ['TrainWithAlbert.'],
            'sub': ['3× more bookings', '+ 45% rebooking.'],
        },
    },
    'skg-stockholm': {
        'sv': {
            'title': ['SKG Stockholm.'],
            'sub': ['12 timmar/vecka befriade', 'för VD:n.'],
        },
        'en': {
            'title': ['SKG Stockholm.'],
            'sub': ['12 hours/week freed', 'for the CEO.'],
        },
    },
}

# ──────────────────────────────────────────────────────────────
# Verify fonts exist
# ──────────────────────────────────────────────────────────────
required = [
    'BarlowCondensed-ExtraBold.ttf',
    'DMSans-Bold.ttf',
    'DMSans-Regular.ttf',
    'DMSans-Medium.ttf',
]
for fname in required:
    if not os.path.exists(F + fname):
        print(f'ERROR: Missing {F + fname}. Run scripts/setup-og-fonts.sh first.',
              file=sys.stderr)
        sys.exit(1)

os.makedirs(OUT_DIR, exist_ok=True)

# ──────────────────────────────────────────────────────────────
# Fonts (pre-loaded, multiple title sizes for long words)
# ──────────────────────────────────────────────────────────────
font_logo = ImageFont.truetype(F + 'BarlowCondensed-ExtraBold.ttf', 86)
font_logo_c = ImageFont.truetype(F + 'BarlowCondensed-ExtraBold.ttf', 19)
font_title_l = ImageFont.truetype(F + 'DMSans-Bold.ttf', 70)   # 2-line titles
font_title_m = ImageFont.truetype(F + 'DMSans-Bold.ttf', 78)   # 1-line medium
font_title_s = ImageFont.truetype(F + 'DMSans-Bold.ttf', 64)   # 1-line longer brand names
font_sub = ImageFont.truetype(F + 'DMSans-Regular.ttf', 26)
font_domain = ImageFont.truetype(F + 'DMSans-Medium.ttf', 20)

PAD_L = 80
TEXT_MAX_W = 1200 - PAD_L - 560  # leave right 560px for 3D element

# ──────────────────────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────────────────────
def draw_logo(d, pos, color=(255, 255, 255)):
    """ETEYA with per-letter kerning matching Nav.tsx inline styles."""
    x, y = pos
    letters = ['E', 'T', 'E', 'Y', 'A']
    margins_em = [0.04, 0.02, 0.02, -0.06, 0.0]
    global_track_em = -0.03
    size = font_logo.size
    for ch, margin in zip(letters, margins_em):
        d.text((x, y), ch, font=font_logo, fill=color)
        bbox = font_logo.getbbox(ch)
        advance = (bbox[2] - bbox[0]) + (global_track_em + margin) * size
        x += advance
    return x

def pick_title_font(lines):
    """Choose font size so the widest line fits in TEXT_MAX_W."""
    for font in (font_title_l, font_title_m, font_title_s):
        widest = max(font.getbbox(line)[2] for line in lines)
        if widest <= TEXT_MAX_W:
            return font
    return font_title_s  # fallback (will clip; check your copy)

# ──────────────────────────────────────────────────────────────
# Render one image
# ──────────────────────────────────────────────────────────────
def render(bg, out_path, title_lines, sub_lines):
    img = bg.copy()
    d = ImageDraw.Draw(img)
    W, H = img.size

    title_font = pick_title_font(title_lines)
    title_line_h = title_font.size * 1.05
    title_block_h = title_line_h * len(title_lines)
    sub_line_h = font_sub.size * 1.35
    sub_block_h = sub_line_h * len(sub_lines)

    logo_visual_h = int(font_logo.size * 0.72)
    gap_logo_title = 40
    gap_title_sub = 28
    total_h = logo_visual_h + gap_logo_title + title_block_h + gap_title_sub + sub_block_h
    y_start = int((H - total_h) / 2) - 70  # upward bias to match home layout

    # Logo + ©
    end_x = draw_logo(d, (PAD_L, y_start))
    d.text((end_x + 4, y_start + 8), '©', font=font_logo_c, fill=(255, 255, 255))

    # Title
    ty = y_start + logo_visual_h + gap_logo_title
    for line in title_lines:
        d.text((PAD_L, ty), line, font=title_font, fill=(245, 245, 245))
        ty += title_line_h

    # Subtitle
    sy = y_start + logo_visual_h + gap_logo_title + title_block_h + gap_title_sub
    for line in sub_lines:
        d.text((PAD_L, sy), line, font=font_sub, fill=(176, 176, 176))
        sy += sub_line_h

    # Domain
    d.text((PAD_L, H - 48 - font_domain.size), 'eteya.ai',
           font=font_domain, fill=(140, 140, 140))

    img.save(out_path, format='JPEG', quality=92, optimize=True, progressive=True)
    return os.path.getsize(out_path)

# ──────────────────────────────────────────────────────────────
# Main
# ──────────────────────────────────────────────────────────────
bg = Image.open(BG).convert('RGB')
total = 0
total_size = 0

for page, locales in PAGES.items():
    for locale, copy in locales.items():
        out_name = f'og-{page}-{locale}.jpg'
        out_path = os.path.join(OUT_DIR, out_name)
        size = render(bg, out_path, copy['title'], copy['sub'])
        total += 1
        total_size += size
        print(f'  {out_name:42s} {size/1024:6.1f} KB')

# Backwards-compat: home-sv is also the universal fallback at /images/og-image.jpg
fallback_src = os.path.join(OUT_DIR, 'og-home-sv.jpg')
fallback_dst = os.path.join(ROOT, 'public/images/og-image.jpg')
import shutil
shutil.copy(fallback_src, fallback_dst)
print(f'\n  (fallback) public/images/og-image.jpg ← og-home-sv.jpg')
print(f'\n{total} images, {total_size/1024/1024:.1f} MB total')
