import re
from pathlib import Path

base = Path(r"C:\Users\13521\fox-spring-tea-website")
html = (base / "index.html").read_text(encoding="utf-8")
links = re.findall(r'href="([^"]+)"', html)

for link in links:
    if link.startswith("http"):
        continue
    target = base / link
    exists = target.exists()
    print(f"{link}: {'OK' if exists else 'MISSING'}")

print("Link check done")
