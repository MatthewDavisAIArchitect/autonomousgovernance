path = 'components/NavShell.tsx'
c = open(path, encoding='utf-8').read()
old = "  { href: '/registry',    label: 'Registry'     },"
new = "  { href: '/',            label: 'Home'         },\n  { href: '/registry',    label: 'Registry'     },"
if old in c:
    c = c.replace(old, new, 1)
    print('patched')
else:
    print('FAIL - target not found')
open(path, 'w', encoding='utf-8').write(c)
raw = open(path, 'rb').read(3)
print('BOM:', 'FAIL' if raw == b'\xef\xbb\xbf' else 'OK')
print('Home present:', "href: '/'" in c)
