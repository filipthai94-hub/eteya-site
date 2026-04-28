#!/usr/bin/env python3
"""
generate-hero.py — Skapa Eteya blog hero-bild med konsekvent text-overlay.

Tar en bas-bild (genererad i ChatGPT/Midjourney, bara visuellt subject)
och lägger på Eteya-styled text-overlay enligt BLOG_AUTHORING.md.

Användning:
    python3 scripts/generate-hero.py \\
        --base ~/Downloads/image.png \\
        --slug ai-agenter-2026 \\
        --title "AI-agenter 2026 — vart är vi på väg?" \\
        --kicker "ARTIKEL · TREND"

Resultat: /public/images/blog/[slug]-hero.webp (1600×900, < 250KB)

Layout (matchar Eteya DNA):
  - Right-weighted: text-box på vänster halva (~45% bredd),
    bas-bildens subject visas på höger halva
  - Sharp corners (vår DNA, inte rounded)
  - Translucent black bg rgba(8,8,8,0.85) + backdrop-blur-känsla
  - 1px lime border #C8FF00 + subtle glow
  - Mono kicker överst ("ARTIKEL · KATEGORI")
  - Title i Barlow Condensed weight 500 (Eteya signature)
  - "ETEYA®" wordmark bottom-left, utanför text-box
"""

import argparse
import os
import sys
import textwrap
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

# ─── KONSTANTER ─────────────────────────────────────────────────────
ETEYA_BG = (8, 8, 8)              # #080808
ETEYA_LIME = (200, 255, 0)        # #C8FF00
WHITE = (255, 255, 255)
WHITE_DIM = (220, 220, 220)
WHITE_MONO = (255, 255, 255, 220)

# Final image dimensions
FINAL_W = 1600
FINAL_H = 900

# Text-box layout
TEXT_BOX_LEFT = 80                # offset från vänster kant
TEXT_BOX_WIDTH = 700              # ~45% av 1600
TEXT_BOX_PADDING = 48
TEXT_BOX_BG_OPACITY = 217         # 0.85 * 255

# Brand wordmark
BRAND_BOTTOM_OFFSET = 60
BRAND_LEFT_OFFSET = 80

# Font paths
FONTS_DIR = Path(__file__).parent / 'fonts'
BARLOW = FONTS_DIR / 'BarlowCondensed-Medium.ttf'
MONO = FONTS_DIR / 'JetBrainsMono-Regular.ttf'

# Font sizes
TITLE_SIZE = 68                   # Barlow Condensed för titel
KICKER_SIZE = 14                  # Mono uppercase för kicker
BRAND_SIZE = 28                   # Barlow Condensed för "ETEYA®"


# ─── HELPERS ────────────────────────────────────────────────────────

def load_base_image(path: str) -> Image.Image:
    """Ladda bas-bild, crop till 16:9, resize till 1600x900."""
    img = Image.open(path)
    # Konvertera till RGB (handle RGBA)
    if img.mode in ('RGBA', 'LA', 'P'):
        bg = Image.new('RGB', img.size, ETEYA_BG)
        bg.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
        img = bg
    elif img.mode != 'RGB':
        img = img.convert('RGB')

    # Crop till 16:9 om nödvändigt
    target_ratio = 16 / 9
    src_ratio = img.size[0] / img.size[1]
    if abs(src_ratio - target_ratio) > 0.01:
        if src_ratio > target_ratio:
            new_w = int(img.size[1] * target_ratio)
            left = (img.size[0] - new_w) // 2
            img = img.crop((left, 0, left + new_w, img.size[1]))
        else:
            new_h = int(img.size[0] / target_ratio)
            top = (img.size[1] - new_h) // 2
            img = img.crop((0, top, img.size[0], top + new_h))

    # Resize till final
    if img.size != (FINAL_W, FINAL_H):
        img = img.resize((FINAL_W, FINAL_H), Image.LANCZOS)

    return img


def wrap_text(text: str, font: ImageFont.FreeTypeFont, max_width: int) -> list:
    """Wrap text i flera rader baserat på pixel-width."""
    words = text.split()
    lines = []
    current = []
    for word in words:
        test = ' '.join(current + [word])
        bbox = font.getbbox(test)
        width = bbox[2] - bbox[0]
        if width <= max_width:
            current.append(word)
        else:
            if current:
                lines.append(' '.join(current))
            current = [word]
    if current:
        lines.append(' '.join(current))
    return lines


def draw_text_box(
    img: Image.Image,
    title: str,
    kicker: str = None,
) -> Image.Image:
    """Lägg på text-box med kicker + title på vänster halva."""

    # Ladda fonts
    title_font = ImageFont.truetype(str(BARLOW), TITLE_SIZE)
    kicker_font = ImageFont.truetype(str(MONO), KICKER_SIZE)

    # Beräkna text-dimensioner
    inner_width = TEXT_BOX_WIDTH - TEXT_BOX_PADDING * 2
    title_lines = wrap_text(title.upper() if False else title, title_font, inner_width)

    # Höjd-beräkning
    line_height = int(TITLE_SIZE * 1.05)
    title_height = line_height * len(title_lines)

    kicker_height = 0
    kicker_gap = 0
    if kicker:
        kicker_bbox = kicker_font.getbbox(kicker)
        kicker_height = kicker_bbox[3] - kicker_bbox[1]
        kicker_gap = 24

    box_inner_height = kicker_height + kicker_gap + title_height
    box_height = box_inner_height + TEXT_BOX_PADDING * 2

    # Position (vertikalt centrerat på halva höger del + lite upp)
    box_top = (FINAL_H - box_height) // 2 - 20
    box_bottom = box_top + box_height
    box_left = TEXT_BOX_LEFT
    box_right = box_left + TEXT_BOX_WIDTH

    # ── 1. Translucent bg ────────────────────────────────────────
    overlay = Image.new('RGBA', img.size, (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    overlay_draw.rectangle(
        [box_left, box_top, box_right, box_bottom],
        fill=(*ETEYA_BG, TEXT_BOX_BG_OPACITY),
    )
    img = Image.alpha_composite(img.convert('RGBA'), overlay).convert('RGB')

    # ── 2. Subtle glow runt boxen (lime) ─────────────────────────
    glow_layer = Image.new('RGBA', img.size, (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow_layer)
    glow_padding = 8
    glow_draw.rectangle(
        [box_left - glow_padding, box_top - glow_padding,
         box_right + glow_padding, box_bottom + glow_padding],
        outline=(*ETEYA_LIME, 80),
        width=4,
    )
    glow_blurred = glow_layer.filter(ImageFilter.GaussianBlur(radius=8))
    img = Image.alpha_composite(img.convert('RGBA'), glow_blurred).convert('RGB')

    # ── 3. Tunn lime border ───────────────────────────────────────
    draw = ImageDraw.Draw(img)
    draw.rectangle(
        [box_left, box_top, box_right, box_bottom],
        outline=ETEYA_LIME,
        width=1,
    )

    # ── 4. Kicker (mono uppercase) ───────────────────────────────
    text_x = box_left + TEXT_BOX_PADDING
    text_y = box_top + TEXT_BOX_PADDING
    if kicker:
        draw.text(
            (text_x, text_y),
            kicker,
            font=kicker_font,
            fill=WHITE_DIM,
        )
        text_y += kicker_height + kicker_gap

    # ── 5. Title (Barlow Condensed) ──────────────────────────────
    for line in title_lines:
        draw.text(
            (text_x, text_y),
            line,
            font=title_font,
            fill=WHITE,
        )
        text_y += line_height

    return img


def draw_brand(img: Image.Image, locale: str = 'sv') -> Image.Image:
    """Lägg på 'ETEYA®' wordmark bottom-left."""
    brand_font = ImageFont.truetype(str(BARLOW), BRAND_SIZE)
    draw = ImageDraw.Draw(img)

    # Position bottom-left
    brand_text = "ETEYA"
    sup_text = "®"
    bbox = brand_font.getbbox(brand_text)
    brand_w = bbox[2] - bbox[0]
    brand_h = bbox[3] - bbox[1]

    x = BRAND_LEFT_OFFSET
    y = FINAL_H - BRAND_BOTTOM_OFFSET - brand_h

    # ETEYA huvudtext
    draw.text((x, y), brand_text, font=brand_font, fill=WHITE)

    # ® superscript (mindre, ovan)
    sup_font = ImageFont.truetype(str(BARLOW), int(BRAND_SIZE * 0.5))
    draw.text((x + brand_w + 4, y - 2), sup_text, font=sup_font, fill=ETEYA_LIME)

    return img


def save_webp(img: Image.Image, dest_path: str, quality: int = 85) -> int:
    """Spara som WebP, returnera filstorlek i KB."""
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    img.save(dest_path, 'WEBP', quality=quality, method=6)
    return os.path.getsize(dest_path) // 1024


# ─── CLI ────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description='Generate Eteya blog hero image')
    parser.add_argument('--base', required=True, help='Path till bas-bild från ChatGPT')
    parser.add_argument('--slug', required=True, help='Article slug (t.ex. ai-agenter-2026)')
    parser.add_argument('--title', required=True, help='Article title')
    parser.add_argument('--kicker', default='', help='Kicker text (t.ex. "ARTIKEL · TREND")')
    parser.add_argument('--output-dir', default='/tmp/eteya-site/public/images/blog',
                        help='Output mapp')
    parser.add_argument('--quality', type=int, default=85, help='WebP quality')

    args = parser.parse_args()

    if not os.path.exists(args.base):
        print(f'✗ Bas-bild saknas: {args.base}', file=sys.stderr)
        sys.exit(1)

    if not BARLOW.exists() or not MONO.exists():
        print(f'✗ Fonts saknas i {FONTS_DIR}', file=sys.stderr)
        sys.exit(1)

    # Kicker-default
    kicker = args.kicker or 'ARTIKEL'

    # Pipeline
    print(f'  Laddar bas-bild: {args.base}')
    img = load_base_image(args.base)
    print(f'  Bas-bild ready: {img.size[0]}×{img.size[1]}')

    print(f'  Lägger på text-overlay...')
    img = draw_text_box(img, args.title, kicker)

    print(f'  Lägger på ETEYA brand...')
    img = draw_brand(img)

    dest = os.path.join(args.output_dir, f'{args.slug}-hero.webp')
    size_kb = save_webp(img, dest, args.quality)
    status = '✓' if size_kb < 250 else '⚠ stor'
    print(f'  {status} Sparat: {dest} ({size_kb}KB)')

    # Auto-lower kvalitet om för stor
    if size_kb > 250:
        for q in [80, 75, 70]:
            size_kb = save_webp(img, dest, q)
            if size_kb < 250:
                print(f'  ✓ Re-encoded vid q={q}: {size_kb}KB')
                break


if __name__ == '__main__':
    main()
