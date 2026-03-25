import math, random, sys

random.seed(42)
W, H = 1920, 1080
nodes = []

# Generera noder
for _ in range(60):
    x = random.randint(50, W-50)
    y = random.randint(50, H-50)
    nodes.append((x, y))

lines = []
dots = []
circles = []

# Koppla noder inom räckhåll
for i, (x1, y1) in enumerate(nodes):
    for j, (x2, y2) in enumerate(nodes):
        if i >= j:
            continue
        dist = math.hypot(x2-x1, y2-y1)
        if dist < 280:
            lines.append((x1, y1, x2, y2, dist))

# Rita SVG
svg = f'<svg width="{W}" height="{H}" viewBox="0 0 {W} {H}" fill="none" xmlns="http://www.w3.org/2000/svg">\n'

# Linjer
for x1, y1, x2, y2, dist in lines:
    op = max(0.03, 0.12 - dist/3000)
    svg += f'  <line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="white" stroke-width="0.8" stroke-opacity="{op:.3f}"/>\n'

# Noder — liten prick + ring
for x, y in nodes:
    svg += f'  <circle cx="{x}" cy="{y}" r="2" fill="white" fill-opacity="0.18"/>\n'
    svg += f'  <circle cx="{x}" cy="{y}" r="5" stroke="white" stroke-width="0.6" stroke-opacity="0.09"/>\n'

# Några större "hub" noder
for x, y in random.sample(nodes, 8):
    svg += f'  <circle cx="{x}" cy="{y}" r="3.5" fill="white" fill-opacity="0.25"/>\n'
    svg += f'  <circle cx="{x}" cy="{y}" r="10" stroke="white" stroke-width="0.8" stroke-opacity="0.12"/>\n'
    svg += f'  <circle cx="{x}" cy="{y}" r="18" stroke="white" stroke-width="0.5" stroke-opacity="0.06"/>\n'

svg += '</svg>'
print(svg)
