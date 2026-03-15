path = 'app/api/cron/zenodo-ingest/route.ts'
c = open(path, encoding='utf-8').read()

# Fix 1: URL to new Zenodo InvenioRDM communities endpoint
old_url = '  const url = `https://zenodo.org/api/records?communities=${ZENODO_COMMUNITY}&size=200&sort=mostrecent`'
new_url = '  const url = `https://zenodo.org/api/communities/${ZENODO_COMMUNITY}/records?size=200&sort=newest`'
if old_url in c:
    c = c.replace(old_url, new_url, 1)
    print('URL patched')
else:
    print('FAIL - URL target not found')

# Fix 2: Remove debug console.log lines added this session
lines = c.split('\n')
clean = [l for l in lines if 'ZENODO_FETCH_FAIL' not in l and 'ZENODO_HITS' not in l]
removed = len(lines) - len(clean)
print('debug lines removed:', removed)
c = '\n'.join(clean)

open(path, 'w', encoding='utf-8').write(c)
raw = open(path, 'rb').read(3)
print('BOM:', 'FAIL' if raw == b'\xef\xbb\xbf' else 'OK')

c = open(path, encoding='utf-8').read()
print('new URL present:', 'communities/${ZENODO_COMMUNITY}/records' in c)
print('old URL absent:', 'api/records?communities=' not in c)
print('debug lines absent:', 'ZENODO_FETCH_FAIL' not in c and 'ZENODO_HITS' not in c)
