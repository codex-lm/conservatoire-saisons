#!/usr/bin/env python3
from pathlib import Path
from math import cos, pi, sin
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
W, H = 1280, 720
SCALE = 2


def font(size, serif=False):
    names = ["georgia.ttf", "Georgia.ttf"] if serif else ["segoeui.ttf", "trebuc.ttf", "arial.ttf"]
    for name in names:
        try:
            return ImageFont.truetype(name, size * SCALE)
        except OSError:
            pass
    return ImageFont.load_default(size=size * SCALE)


def diamond(draw, x, y, width, height, fill, outline=None, line=1):
    points = [(x, y - height / 2), (x + width / 2, y), (x, y + height / 2), (x - width / 2, y)]
    draw.polygon(points, fill=fill)
    if outline:
        draw.line(points + [points[0]], fill=outline, width=line * SCALE, joint="curve")


def flower(draw, x, y, size, color):
    for petal in range(7):
        angle = petal * 2 * pi / 7
        px = x + cos(angle) * size * .8
        py = y + sin(angle) * size * .8
        draw.ellipse((px - size * .55, py - size * .4, px + size * .55, py + size * .4), fill=color)
    draw.ellipse((x - size * .4, y - size * .4, x + size * .4, y + size * .4), fill="#8a6334")


def main():
    image = Image.new("RGB", (W * SCALE, H * SCALE))
    pixels = image.load()
    top = (245, 231, 182)
    bottom = (63, 113, 91)
    for y in range(H * SCALE):
        amount = y / (H * SCALE - 1)
        color = tuple(round(top[i] * (1 - amount) + bottom[i] * amount) for i in range(3))
        for x in range(W * SCALE):
            pixels[x, y] = color
    draw = ImageDraw.Draw(image, "RGBA")
    for index in range(8):
        x = (index + .3) * 180 * SCALE
        draw.arc((x - 110 * SCALE, -90 * SCALE, x + 110 * SCALE, 500 * SCALE), 180, 360, fill=(38, 86, 69, 70), width=2 * SCALE)
        draw.line((x, 0, x, 550 * SCALE), fill=(38, 86, 69, 55), width=2 * SCALE)
    glow = Image.new("RGBA", image.size, (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse((700 * SCALE, -250 * SCALE, 1350 * SCALE, 450 * SCALE), fill=(255, 247, 192, 120))
    glow = glow.filter(ImageFilter.GaussianBlur(80 * SCALE))
    image = Image.alpha_composite(image.convert("RGBA"), glow)
    draw = ImageDraw.Draw(image, "RGBA")

    draw.text((74 * SCALE, 66 * SCALE), "A LITTLE GARDENER. FOUR SEASONS. SEVEN GARDENS.", font=font(13), fill=(40, 78, 63, 220))
    draw.text((70 * SCALE, 106 * SCALE), "The Conservatory", font=font(54, True), fill=(27, 67, 56, 255))
    draw.text((70 * SCALE, 169 * SCALE), "of Seasons", font=font(54, True), fill=(27, 67, 56, 255))
    draw.line((74 * SCALE, 249 * SCALE, 235 * SCALE, 249 * SCALE), fill=(173, 127, 59, 220), width=2 * SCALE)
    draw.text((74 * SCALE, 273 * SCALE), "Change the season.", font=font(23, True), fill=(50, 88, 68, 240))
    draw.text((74 * SCALE, 310 * SCALE), "Find a new path.", font=font(23, True), fill=(50, 88, 68, 240))

    labels = [("WINTER", "#d7eef0"), ("SPRING", "#e3efc7"), ("SUMMER", "#ffdb7c"), ("AUTUMN", "#efb080")]
    for index, (label, color) in enumerate(labels):
        x = 74 + index * 118
        draw.rounded_rectangle((x * SCALE, 367 * SCALE, (x + 102) * SCALE, 399 * SCALE), radius=16 * SCALE, fill=(28, 72, 60, 185))
        draw.text(((x + 13) * SCALE, 376 * SCALE), label, font=font(10), fill=color)

    islands = [
        (720, 350, "#a9c8c7", "#607f7b", "winter"),
        (955, 330, "#9dbc78", "#5e7e52", "spring"),
        (815, 520, "#aabd69", "#667b47", "summer"),
        (1080, 490, "#b38a5a", "#765942", "autumn")
    ]
    for cx, cy, top_color, side_color, season in islands:
        cx *= SCALE
        cy *= SCALE
        width, height = 280 * SCALE, 140 * SCALE
        draw.polygon([(cx - width / 2, cy), (cx, cy + height / 2), (cx, cy + height / 2 + 22 * SCALE), (cx - width / 2, cy + 22 * SCALE)], fill=side_color)
        draw.polygon([(cx + width / 2, cy), (cx, cy + height / 2), (cx, cy + height / 2 + 22 * SCALE), (cx + width / 2, cy + 22 * SCALE)], fill="#3e5e48")
        diamond(draw, cx, cy, width, height, top_color, "#e5e1ad", SCALE)
        for offset in (-55, 0, 55):
            draw.line((cx - 105 * SCALE, cy + offset * .25 * SCALE, cx + 105 * SCALE, cy + (70 + offset * .25) * SCALE), fill=(255, 248, 211, 50), width=SCALE)
        if season == "winter":
            diamond(draw, cx, cy, 155 * SCALE, 77 * SCALE, "#dceeed", "#ffffff", SCALE)
            draw.line((cx - 45 * SCALE, cy - 18 * SCALE, cx + 20 * SCALE, cy + 20 * SCALE, cx + 50 * SCALE, cy - 8 * SCALE), fill="#8cb9c1", width=2 * SCALE)
            for sx in (-70, 50, 85):
                draw.ellipse((cx + sx * SCALE, cy - 65 * SCALE, cx + (sx + 4) * SCALE, cy - 61 * SCALE), fill="#ffffff")
        elif season == "spring":
            for offset in (-45, 35):
                draw.line((cx + offset * SCALE, cy + 15 * SCALE, cx + (offset + 8) * SCALE, cy - 45 * SCALE), fill="#4e7747", width=3 * SCALE)
                flower(draw, cx + (offset + 8) * SCALE, cy - 48 * SCALE, 7 * SCALE, "#f1b3c2")
            draw.arc((cx - 80 * SCALE, cy - 10 * SCALE, cx + 80 * SCALE, cy + 45 * SCALE), 190, 345, fill="#668c4e", width=7 * SCALE)
        elif season == "summer":
            for offset in (-65, 50):
                draw.line((cx + offset * SCALE, cy + 12 * SCALE, cx + offset * SCALE, cy - 52 * SCALE), fill="#527946", width=4 * SCALE)
                flower(draw, cx + offset * SCALE, cy - 57 * SCALE, 12 * SCALE, "#f7cc57")
            draw.ellipse((cx - 12 * SCALE, cy - 8 * SCALE, cx + 12 * SCALE, cy + 4 * SCALE), fill="#f5dd88")
        else:
            draw.line((cx, cy + 8 * SCALE, cx, cy - 70 * SCALE), fill="#654b34", width=8 * SCALE)
            for ox, oy, radius in [(-28, -68, 30), (15, -83, 35), (40, -57, 26)]:
                draw.ellipse((cx + (ox - radius) * SCALE, cy + (oy - radius * .65) * SCALE, cx + (ox + radius) * SCALE, cy + (oy + radius * .65) * SCALE), fill="#b9653f")
            draw.ellipse((cx - 47 * SCALE, cy - 5 * SCALE, cx - 23 * SCALE, cy + 17 * SCALE), fill="#d88442")
            draw.line((cx - 35 * SCALE, cy - 5 * SCALE, cx - 30 * SCALE, cy - 13 * SCALE), fill="#5c5a35", width=3 * SCALE)

    rx, ry = 690 * SCALE, 520 * SCALE
    draw.ellipse((rx - 25 * SCALE, ry + 7 * SCALE, rx + 25 * SCALE, ry + 20 * SCALE), fill=(26, 53, 42, 80))
    draw.line((rx - 13 * SCALE, ry - 2 * SCALE, rx - 16 * SCALE, ry + 12 * SCALE), fill="#4c4d40", width=5 * SCALE)
    draw.line((rx + 13 * SCALE, ry - 2 * SCALE, rx + 16 * SCALE, ry + 12 * SCALE), fill="#4c4d40", width=5 * SCALE)
    draw.ellipse((rx - 25 * SCALE, ry - 52 * SCALE, rx + 25 * SCALE, ry + 2 * SCALE), fill="#b58950", outline="#65563e", width=2 * SCALE)
    draw.ellipse((rx - 9 * SCALE, ry - 34 * SCALE, rx + 12 * SCALE, ry - 12 * SCALE), fill="#3e665b")
    draw.pieslice((rx - 32 * SCALE, ry - 99 * SCALE, rx + 32 * SCALE, ry - 35 * SCALE), 180, 360, fill="#c6e5d5", outline="#756345", width=2 * SCALE)
    draw.ellipse((rx - 27 * SCALE, ry - 70 * SCALE, rx + 27 * SCALE, ry - 48 * SCALE), fill="#34554c")
    draw.ellipse((rx - 14 * SCALE, ry - 63 * SCALE, rx - 7 * SCALE, ry - 56 * SCALE), fill="#fff0a5")
    draw.ellipse((rx + 7 * SCALE, ry - 63 * SCALE, rx + 14 * SCALE, ry - 56 * SCALE), fill="#fff0a5")
    draw.line((rx, ry - 97 * SCALE, rx + 10 * SCALE, ry - 115 * SCALE), fill="#527449", width=3 * SCALE)
    draw.ellipse((rx + 5 * SCALE, ry - 121 * SCALE, rx + 26 * SCALE, ry - 110 * SCALE), fill="#9bc576")

    sx, sy = 1170 * SCALE, 150 * SCALE
    draw.ellipse((sx - 65 * SCALE, sy - 65 * SCALE, sx + 65 * SCALE, sy + 65 * SCALE), fill=(255, 238, 151, 45))
    points = []
    for index in range(16):
        angle = -pi / 2 + index * pi / 8
        radius = (48 if index % 2 == 0 else 19) * SCALE
        points.append((sx + cos(angle) * radius, sy + sin(angle) * radius))
    draw.polygon(points, fill="#fff1a2")
    draw.ellipse((sx - 13 * SCALE, sy - 13 * SCALE, sx + 13 * SCALE, sy + 13 * SCALE), fill="#dea34b")

    draw.text((74 * SCALE, 633 * SCALE), "A GENTLE ISOMETRIC PUZZLE", font=font(12), fill=(236, 229, 184, 220))
    draw.text((1000 * SCALE, 633 * SCALE), "KIMI GAMES", font=font(12), fill=(236, 229, 184, 220))
    image = image.convert("RGB").resize((W, H), Image.Resampling.LANCZOS)
    output = ROOT / "art" / "cover.png"
    image.save(output, optimize=True)
    print(f"Created {output} ({output.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
