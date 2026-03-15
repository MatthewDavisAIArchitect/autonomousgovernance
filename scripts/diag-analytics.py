content = open('app/analytics/page.tsx', encoding='utf-8').read()
lines = content.split('\n')
bad = [
    ('\u00e2\u20ac\u201d', 'em-dash-v1 (E2 80 94)'),
    ('\u00e2\u20ac\u00a6', 'ellipsis  (E2 80 A6)'),
    ('\u00e2\u20ac\u201c', 'em-dash-v2 (E2 80 9C)'),
]
found = False
for seq, label in bad:
    for i, line in enumerate(lines, 1):
        if seq in line:
            print(f'Line {i:4d} [{label}]: {repr(line.strip()[:100])}')
            found = True
if not found:
    print('No mojibake found -- scan trigger may be a false positive')
