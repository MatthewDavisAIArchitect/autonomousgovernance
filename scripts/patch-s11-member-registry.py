path = 'app/api/auth/orcid/route.ts'
c = open(path, encoding='utf-8').read()

old = 'import { encryptSession, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/session"'
new = 'import { encryptSession, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/session"\nimport { createClient } from "@supabase/supabase-js"'

if old in c:
    c = c.replace(old, new, 1)
    print('import patched')
else:
    print('FAIL - import target not found')

old2 = '  const token = encryptSession({ orcidHash, eligible })'
new2 = (
    '  // Upsert member record ? first_seen preserved on conflict, last_active always updated\n'
    '  const supabase = createClient(\n'
    '    process.env.NEXT_PUBLIC_SUPABASE_URL!,\n'
    '    process.env.SUPABASE_SERVICE_ROLE_KEY!\n'
    '  )\n'
    '  await supabase.from("member_registry").upsert(\n'
    '    {\n'
    '      orcid_hash: orcidHash,\n'
    '      first_seen: new Date().toISOString(),\n'
    '      last_active: new Date().toISOString(),\n'
    '    },\n'
    '    { onConflict: "orcid_hash", ignoreDuplicates: false }\n'
    '  )\n'
    '  const token = encryptSession({ orcidHash, eligible })'
)

if old2 in c:
    c = c.replace(old2, new2, 1)
    print('upsert patched')
else:
    print('FAIL - token target not found')

open(path, 'w', encoding='utf-8').write(c)
raw = open(path, 'rb').read(3)
print('BOM:', 'FAIL' if raw == b'\xef\xbb\xbf' else 'OK')
c = open(path, encoding='utf-8').read()
print('upsert present:', 'member_registry' in c)
print('first_seen:', 'first_seen' in c)
print('last_active:', 'last_active' in c)
print('onConflict:', 'onConflict' in c)
