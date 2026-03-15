import re

path = 'app/analytics/page.tsx'
BAD  = '\u00e2\u20ac\u201d'
GOOD = '\u2014'

content = open(path, encoding='utf-8').read()

if BAD not in content:
    print('Nothing to patch -- BAD sequence not found')
else:
    count = content.count(BAD)
    patched = content.replace(BAD, GOOD)
    open(path, 'w', encoding='utf-8').write(patched)
    print(f'Patched {count} occurrence(s) of em-dash-v1 in {path}')

# Verify
verify = open(path, encoding='utf-8').read()
remaining = [
    ('\u00e2\u20ac\u201d', 'em-dash-v1'),
    ('\u00e2\u20ac\u00a6', 'ellipsis'),
    ('\u00e2\u20ac\u201c', 'em-dash-v2'),
]
clean = True
for seq, label in remaining:
    if seq in verify:
        print(f'RESIDUAL: {label} still present')
        clean = False
if clean:
    print('Verification PASS -- no mojibake sequences remain')
