path = 'app/page.tsx'
c = open(path, encoding='utf-8').read()
old = '        <p className="font-serif text-lg text-near-black leading-[1.75] max-w-2xl">'
new = '        <p className="font-serif italic text-mid-grey text-sm leading-relaxed max-w-2xl mb-4">The field is early. Contributions that extend, challenge, or apply this doctrine \u2014 from architecture, policy, formal methods, or adjacent disciplines \u2014 are welcomed and indexed as part of the permanent record.</p>\n        <p className="font-serif text-lg text-near-black leading-[1.75] max-w-2xl">'
if old in c:
    c = c.replace(old, new, 1)
    print('patched')
else:
    print('FAIL - target not found')
open(path, 'w', encoding='utf-8').write(c)
raw = open(path, 'rb').read(3)
print('BOM:', 'FAIL' if raw == b'\xef\xbb\xbf' else 'OK')
print('sentence present:', 'The field is early' in c)
