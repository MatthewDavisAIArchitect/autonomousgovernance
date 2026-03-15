path = 'app/corpus/page.tsx'
content = open(path, encoding='utf-8-sig').read()
open(path, 'w', encoding='utf-8').write(content)

verify = open(path, 'rb').read(3)
if verify == b'\xef\xbb\xbf':
    print('FAIL: BOM still present')
else:
    print('PASS: BOM stripped from', path)
