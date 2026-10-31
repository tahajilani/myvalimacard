"""Generates assets/img/og-image.png (1200x630 social share thumbnail)
and assets/img/favicon.png (512x512 monogram) for the Walima site.
Run with: python scripts/generate_og_image.py
"""
from PIL import Image, ImageDraw, ImageFont
import math
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "assets", "img")
os.makedirs(OUT_DIR, exist_ok=True)

EMERALD_900 = (10, 46, 34)
EMERALD_800 = (13, 61, 44)
EMERALD_700 = (20, 90, 66)
GOLD_500 = (201, 162, 75)
GOLD_400 = (221, 187, 108)
IVORY = (251, 246, 236)

FONTS_DIR = r"C:\Windows\Fonts"
SCRIPT_FONT = os.path.join(FONTS_DIR, "FRSCRIPT.TTF")
SERIF_FONT = os.path.join(FONTS_DIR, "pala.ttf")
SERIF_FONT_B = os.path.join(FONTS_DIR, "palab.ttf")


def font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except OSError:
        return ImageFont.load_default()


def centered_text(draw, cx, y, text, fnt, fill, letter_spacing=0):
    if letter_spacing:
        total_w = sum(draw.textlength(ch, font=fnt) + letter_spacing for ch in text) - letter_spacing
        x = cx - total_w / 2
        for ch in text:
            draw.text((x, y), ch, font=fnt, fill=fill)
            x += draw.textlength(ch, font=fnt) + letter_spacing
    else:
        w = draw.textlength(text, font=fnt)
        draw.text((cx - w / 2, y), text, font=fnt, fill=fill)


def radial_vignette(size, center, inner_color, outer_color, max_r):
    w, h = size
    overlay = Image.new("RGB", size, outer_color)
    cx, cy = center
    px = overlay.load()
    step = 2
    for yy in range(0, h, step):
        for xx in range(0, w, step):
            d = math.hypot(xx - cx, yy - cy) / max_r
            d = min(d, 1)
            r = int(inner_color[0] + (outer_color[0] - inner_color[0]) * d)
            g = int(inner_color[1] + (outer_color[1] - inner_color[1]) * d)
            b = int(inner_color[2] + (outer_color[2] - inner_color[2]) * d)
            for yy2 in range(yy, min(yy + step, h)):
                for xx2 in range(xx, min(xx + step, w)):
                    px[xx2, yy2] = (r, g, b)
    return overlay


def corner_flourish(draw, x, y, s, color, flip_x=1, flip_y=1):
    def pt(px, py):
        return (x + flip_x * px, y + flip_y * py)

    draw.arc([pt(4, 4)[0] - 0, pt(4, 4)[1], x + flip_x * 60, y + flip_y * 60] if flip_x > 0 and flip_y > 0 else
             [min(pt(4, 4)[0], pt(60, 60)[0]), min(pt(4, 4)[1], pt(60, 60)[1]),
              max(pt(4, 4)[0], pt(60, 60)[0]), max(pt(4, 4)[1], pt(60, 60)[1])],
             180 if (flip_x > 0 and flip_y > 0) else 0, 270, fill=color, width=max(1, s // 60))
    r = max(2, s // 30)
    draw.ellipse([pt(8, 8)[0] - r, pt(8, 8)[1] - r, pt(8, 8)[0] + r, pt(8, 8)[1] + r], fill=color)
    r2 = max(1, s // 45)
    draw.ellipse([pt(55, 55)[0] - r2, pt(55, 55)[1] - r2, pt(55, 55)[0] + r2, pt(55, 55)[1] + r2], fill=color)


def build_og_image():
    W, H = 1200, 630
    img = radial_vignette((W, H), (W // 2, int(H * 0.38)), EMERALD_700, EMERALD_900, max_r=760)
    draw = ImageDraw.Draw(img)

    margin = 26
    draw.rectangle([margin, margin, W - margin, H - margin], outline=GOLD_500, width=3)
    inner = margin + 14
    draw.rectangle([inner, inner, W - inner, H - inner], outline=GOLD_400, width=1)

    corner_s = 90
    corner_flourish(draw, inner + 6, inner + 6, corner_s, GOLD_500, 1, 1)
    corner_flourish(draw, W - inner - 6, inner + 6, corner_s, GOLD_500, -1, 1)
    corner_flourish(draw, inner + 6, H - inner - 6, corner_s, GOLD_500, 1, -1)
    corner_flourish(draw, W - inner - 6, H - inner - 6, corner_s, GOLD_500, -1, -1)

    cx = W // 2

    eyebrow_f = font(SERIF_FONT, 24)
    centered_text(draw, cx, 96, "TOGETHER WITH THEIR FAMILIES", eyebrow_f, GOLD_400, letter_spacing=6)

    script_f = font(SCRIPT_FONT, 110)
    centered_text(draw, cx, 128, "Walima", script_f, GOLD_400)

    name_f = font(SERIF_FONT_B, 34)
    amp_f = font(SERIF_FONT, 30)
    centered_text(draw, cx, 300, "Syed Muhammad Taha Jilani", name_f, IVORY)
    centered_text(draw, cx, 344, "&", amp_f, GOLD_400)
    centered_text(draw, cx, 382, "Syeda Noor Fatima Gilani", name_f, IVORY)

    draw.line([(cx - 130, 450), (cx - 18, 450)], fill=GOLD_500, width=1)
    draw.line([(cx + 18, 450), (cx + 130, 450)], fill=GOLD_500, width=1)
    draw.polygon([(cx - 8, 442), (cx + 8, 450), (cx - 8, 458), (cx - 18, 450)], fill=GOLD_500)

    date_f = font(SERIF_FONT, 30)
    centered_text(draw, cx, 470, "SUNDAY, 29TH NOVEMBER 2026 · LAHORE", date_f, GOLD_300 if False else GOLD_400, letter_spacing=2)

    venue_f = font(SERIF_FONT, 22)
    centered_text(draw, cx, 520, "Shershah Palace · 2:00 PM Lunch · 3:00 PM Walima", venue_f, IVORY)

    img.save(os.path.join(OUT_DIR, "og-image.png"), "PNG")
    print("Saved og-image.png")


def build_favicon():
    S = 512
    img = radial_vignette((S, S), (S // 2, S // 2), EMERALD_700, EMERALD_900, max_r=380)
    draw = ImageDraw.Draw(img)

    cx, cy = S // 2, S // 2
    r = S // 2 - 18
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=GOLD_500, width=8)
    r2 = r - 22
    draw.ellipse([cx - r2, cy - r2, cx + r2, cy + r2], outline=GOLD_400, width=2)

    mono_f = font(SERIF_FONT_B, 150)
    amp_f = font(SCRIPT_FONT, 110)

    t_w = draw.textlength("T", font=mono_f)
    n_w = draw.textlength("N", font=mono_f)
    amp_w = draw.textlength("&", font=amp_f)
    gap = 14
    total = t_w + gap + amp_w + gap + n_w
    x = cx - total / 2
    y = cy - 95

    draw.text((x, y), "T", font=mono_f, fill=IVORY)
    x += t_w + gap
    draw.text((x, y + 38), "&", font=amp_f, fill=GOLD_400)
    x += amp_w + gap
    draw.text((x, y), "N", font=mono_f, fill=IVORY)

    img.save(os.path.join(OUT_DIR, "favicon.png"), "PNG")

    icon_sizes = [16, 32, 48, 64]
    icons = [img.resize((s, s), Image.LANCZOS) for s in icon_sizes]
    icons[0].save(os.path.join(OUT_DIR, "favicon.ico"), format="ICO", sizes=[(s, s) for s in icon_sizes])
    print("Saved favicon.png / favicon.ico")


GOLD_300 = (233, 212, 160)

if __name__ == "__main__":
    build_og_image()
    build_favicon()
