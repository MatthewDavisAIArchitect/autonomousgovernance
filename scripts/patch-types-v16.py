path = 'lib/types.ts'
OLD = '  voteCount: number;\n  communityRank: number;\n}'
NEW = '  voteCount: number;\n  communityRank: number;\n  transformationClass: string;\n  mcrAttached: boolean;\n}'
content = open(path, encoding='utf-8').read()
if OLD not in content:
    print('ERROR: target string not found -- check types.ts manually')
else:
    open(path, 'w', encoding='utf-8').write(content.replace(OLD, NEW, 1))
    print('PASS: CommunitySubmission updated with transformationClass + mcrAttached')
