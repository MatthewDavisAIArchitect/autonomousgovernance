path = 'app/api/auth/orcid/route.ts'
c = open(path, encoding='utf-8').read()

old = (
    '  await supabase.from("member_registry").upsert(\n'
    '    {\n'
    '      orcid_hash: orcidHash,\n'
    '      first_seen: new Date().toISOString(),\n'
    '      last_active: new Date().toISOString(),\n'
    '    },\n'
    '    { onConflict: "orcid_hash", ignoreDuplicates: false }\n'
    '  )'
)
new = (
    '  await supabase.rpc("upsert_member", { p_orcid_hash: orcidHash })'
)

if old in c:
    c = c.replace(old, new, 1)
    print('rpc patched')
else:
    print('FAIL - target not found')

open(path, 'w', encoding='utf-8').write(c)
raw = open(path, 'rb').read(3)
print('BOM:', 'FAIL' if raw == b'\xef\xbb\xbf' else 'OK')
c = open(path, encoding='utf-8').read()
print('rpc present:', 'upsert_member' in c)
print('old upsert absent:', 'ignoreDuplicates' not in c)
