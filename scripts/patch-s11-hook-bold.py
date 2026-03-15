path = 'app/page.tsx'
c = open(path, encoding='utf-8').read()
old = '        <p className="font-serif italic text-mid-grey text-base leading-relaxed max-w-2xl mb-4">'
new = '        <p className="font-serif italic font-bold text-near-black text-base leading-relaxed max-w-2xl mb-4">'
if old in c:
    c = c.replace(old, new, 1)
    print('patched')
else:
    print('FAIL - target not found')
open(path, 'w', encoding='utf-8').write(c)
raw = open(path, 'rb').read(3)
print('BOM:', 'FAIL' if raw == b'\xef\xbb\xbf' else 'OK')
