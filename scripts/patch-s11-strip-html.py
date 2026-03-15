path = 'app/api/community/route.ts'
c = open(path, encoding='utf-8').read()

old = '    abstract: r.abstract ?? "",'
new = '    abstract: stripHtml(r.abstract ?? ""),'

helper = '''
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&mdash;/g, "\u2014")
    .replace(/&ndash;/g, "\u2013")
    .replace(/&rsquo;/g, "\u2019")
    .replace(/&lsquo;/g, "\u2018")
    .replace(/&rdquo;/g, "\u201d")
    .replace(/&ldquo;/g, "\u201c")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

'''

if old in c:
    c = c.replace(old, new, 1)
    # Insert helper before the GET export
    c = c.replace('export async function GET()', helper + 'export async function GET()')
    print('patched')
else:
    print('FAIL - target not found')

open(path, 'w', encoding='utf-8').write(c)
raw = open(path, 'rb').read(3)
print('BOM:', 'FAIL' if raw == b'\xef\xbb\xbf' else 'OK')
c = open(path, encoding='utf-8').read()
print('stripHtml present:', 'stripHtml' in c)
print('abstract uses stripHtml:', 'abstract: stripHtml(' in c)
