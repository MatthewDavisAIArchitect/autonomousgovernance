path = 'app/api/community/route.ts'
content = open(path, encoding='utf-8').read()

OLD_SELECT = '    .select("zenodo_id, doi, title, authors, abstract, affiliated_date, vote_count, community_rank")'
NEW_SELECT = '    .select("zenodo_id, doi, title, authors, abstract, affiliated_date, vote_count, community_rank, transformation_class, mcr_attached")'

OLD_MAP = '    communityRank: r.community_rank ?? 0,\n  }))'
NEW_MAP = '    communityRank: r.community_rank ?? 0,\n    transformationClass: r.transformation_class ?? \'Undefined_Transformation\',\n    mcrAttached: r.mcr_attached ?? false,\n  }))'

errors = []
if OLD_SELECT not in content: errors.append('SELECT target not found')
if OLD_MAP not in content: errors.append('MAP target not found')

if errors:
    for e in errors: print('ERROR:', e)
else:
    content = content.replace(OLD_SELECT, NEW_SELECT, 1)
    content = content.replace(OLD_MAP, NEW_MAP, 1)
    open(path, 'w', encoding='utf-8').write(content)
    print('PASS: community route updated with transformation_class + mcr_attached')
