import os, re, pathlib
root = pathlib.Path('.').resolve()
files = [root/'index.html', root/'shop-collection.html', root/'script.js', root/'product-detail.html']
pattern = re.compile(r'(?:src|image|images)\s*=\s*["\']([^"\']+)')
for path in files:
    text = path.read_text(encoding='utf-8', errors='ignore')
    for m in pattern.finditer(text):
        value = m.group(1)
        if value.startswith(('http://','https://','data:','mailto:')):
            continue
        if value.startswith('assets/'):
            continue
        if any(value.lower().endswith(ext) for ext in ['.png','.jpg','.jpeg','.webp','.gif','.svg']):
            name = value.split('/')[-1]
            if not (root / name).exists():
                print(f'MISSING {path.name}: {value}')
