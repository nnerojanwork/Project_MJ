"""Extract Pricing_economics.docx into src/content/syllabus.json (verbatim text).

Usage: python3 scripts/extract_syllabus.py path/to/Pricing_economics.docx
Stdlib only. Re-running overwrites syllabus.json, so re-apply any manual edits.
"""
import json, re, sys, zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

W = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
R = '{http://schemas.openxmlformats.org/officeDocument/2006/relationships}'
OUT = Path(__file__).resolve().parent.parent / 'src' / 'content' / 'syllabus.json'

FORMULA_IDS = {
    'Gross margin percent': 'gross-margin-pct',
    'Markup percent': 'markup-pct',
    'Unit contribution': 'unit-contribution',
    'Break even volume': 'break-even-volume',
    'Price elasticity': 'price-elasticity',
    'Required new volume': 'required-new-volume',
    'Incremental profit': 'incremental-profit',
    'Pricing initiative ROI': 'initiative-roi',
}


def load(path):
    z = zipfile.ZipFile(path)
    rels = {r.get('Id'): r.get('Target') for r in ET.fromstring(z.read('word/_rels/document.xml.rels'))}
    body = ET.fromstring(z.read('word/document.xml')).find(W + 'body')
    return body, rels


def runs(p, rels):
    """Return list of (text, url_or_None, bold) segments for a paragraph."""
    segs = []
    for el in p:
        if el.tag == W + 'r':
            bold = el.find(W + 'rPr/' + W + 'b') is not None
            txt = ''
            for t in el.iter():
                if t.tag == W + 't':
                    txt += t.text or ''
                elif t.tag == W + 'tab':
                    txt += '\t'
                elif t.tag == W + 'br':
                    txt += '\n'
            segs.append((txt, None, bold))
        elif el.tag == W + 'hyperlink':
            txt = ''.join(t.text or '' for t in el.iter(W + 't'))
            segs.append((txt, rels.get(el.get(R + 'id')), False))
    return segs


def style(p):
    s = p.find(W + 'pPr/' + W + 'pStyle')
    return s.get(W + 'val') if s is not None else ''


def blocks(body, rels):
    """Flatten the body into ('p', style, segs) and ('table', rows) blocks."""
    out = []
    for el in body:
        if el.tag == W + 'p':
            segs = runs(el, rels)
            if ''.join(s[0] for s in segs).strip():
                out.append(('p', style(el), segs))
        elif el.tag == W + 'tbl':
            rows = []
            for tr in el.iter(W + 'tr'):
                cells = []
                for tc in tr.findall(W + 'tc'):
                    cells.append('\n'.join(
                        ''.join(s[0] for s in runs(p, rels)) for p in tc.iter(W + 'p')
                        if ''.join(s[0] for s in runs(p, rels)).strip()))
                rows.append(cells)
            out.append(('table', rows))
    return out


def text(b):
    return ''.join(s[0] for s in b[2])


def resource(b):
    """Bullet of form [link] - note."""
    link = next(s for s in b[2] if s[1])
    rest = ''.join(s[0] for s in b[2] if not s[1])
    return {'title': link[0], 'url': link[1], 'note': re.sub(r'^\s*-\s*', '', rest)}


def section(blks, i):
    """Collect blocks after heading i until the next Heading1/Heading2."""
    j = i + 1
    while j < len(blks) and not (blks[j][0] == 'p' and blks[j][1] in ('Heading1', 'Heading2')):
        j += 1
    return blks[i + 1:j]


def find(blks, heading, start=0, level=None):
    for i in range(start, len(blks)):
        b = blks[i]
        if b[0] == 'p' and b[1].startswith('Heading') and text(b) == heading and (level is None or b[1] == level):
            return i
    raise KeyError(heading)


def bullets(sec):
    return [text(b) for b in sec if b[0] == 'p' and b[1] == 'ListBullet']


def paras(sec):
    return [text(b) for b in sec if b[0] == 'p' and b[1] != 'ListBullet']


def table(sec):
    return next(b[1] for b in sec if b[0] == 'table')


def main(path):
    body, rels = load(path)
    blks = blocks(body, rels)
    warnings = []

    # Program intro: everything before the first heading
    first_h = next(i for i, b in enumerate(blks) if b[0] == 'p' and b[1].startswith('Heading'))
    intro = blks[:first_h]
    by_style = {b[1]: text(b) for b in intro if b[0] == 'p' and b[1]}
    plain = [text(b) for b in intro if b[0] == 'p' and not b[1]]
    facts = [{'label': r[0], 'value': r[1]} for r in table(intro)]
    for f in facts:
        if '  ' in f['value']:
            warnings.append(f"Double space in program fact '{f['label']}': {f['value']!r} (kept verbatim)")

    lo = section(blks, find(blks, 'Learning outcomes'))
    pm = table(section(blks, find(blks, 'Program map')))
    wr = table(section(blks, find(blks, 'Weekly rhythm')))

    weeks = []
    for n in range(1, 11):
        hi = next(i for i, b in enumerate(blks)
                  if b[0] == 'p' and b[1] == 'Heading1' and text(b).startswith(f'Week {n} '))
        title = text(blks[hi])[len(f'Week {n} '):]
        out_b = blks[hi + 1]
        lab = out_b[2][0]
        if not (lab[2] and lab[0].strip() == 'Outcome'):
            warnings.append(f'Week {n}: outcome label not found as bold run')
        outcome = ''.join(s[0] for s in out_b[2][1:])
        # sub-sections until next Heading1
        end = next((i for i in range(hi + 1, len(blks)) if blks[i][0] == 'p' and blks[i][1] == 'Heading1'), len(blks))

        def sub(name):
            return section(blks, find(blks, name, hi, 'Heading2'))

        concepts = bullets(sub('Core concepts'))
        sc = []
        for k, t in enumerate(bullets(sub('Self check')), 1):
            m = re.match(r'^\[ \]\s*', t)
            if not m:
                warnings.append(f'Week {n} self-check {k} has no [ ] marker')
            sc.append({'id': f'w{n}-sc{k}', 'text': t[m.end():] if m else t})
        week = {
            'week': n,
            'id': f'w{n}',
            'title': title,
            'programMapOutput': pm[n][2] if int(pm[n][0]) == n else None,
            'outcome': outcome,
            'coreConcepts': [{'id': f'w{n}-c{k}', 'text': t} for k, t in enumerate(concepts, 1)],
            'researchQuestions': [{'id': f'w{n}-rq{k}', 'text': t} for k, t in enumerate(bullets(sub('Research questions')), 1)],
            'resources': [resource(b) for b in sub('Learning resources') if b[0] == 'p'],
            'appliedExercise': ' '.join(paras(sub('Applied exercise'))),
            'portfolioOutput': ' '.join(paras(sub('Portfolio output'))),
            'selfCheck': sc,
        }
        if pm[n][1] != title:
            warnings.append(f'Week {n}: program map subject {pm[n][1]!r} != heading {title!r}')
        weeks.append(week)
        assert find(blks, 'Self check', hi, 'Heading2') < end

    cs = table(section(blks, find(blks, 'Capstone structure')))
    sg_i = find(blks, 'Capstone scoring guide')
    sg = table(section(blks, sg_i))
    passing = paras(section(blks, find(blks, 'Passing standard', sg_i)))
    fr_sec = section(blks, find(blks, 'Formula reference'))
    md_sec = section(blks, find(blks, 'Minimum dataset'))
    rl_sec = section(blks, find(blks, 'Research log template'))
    refl = paras(section(blks, find(blks, 'Weekly reflection template')))
    lib_i = find(blks, 'Recommended reference library')
    books = bullets(section(blks, find(blks, 'Books', lib_i)))
    courses = [resource(b) for b in section(blks, find(blks, 'Online courses and organizations', lib_i)) if b[0] == 'p']

    def split_book(t):
        m = re.match(r'^(.*) by (.*)$', t)
        return {'text': t, 'title': m.group(1), 'authors': m.group(2)} if m else {'text': t}

    reflection_prompts = []
    for k, t in enumerate(refl, 1):
        prompt = t.split('\n')[0].rstrip()
        reflection_prompts.append({'id': f'refl-{k}', 'prompt': prompt})

    rl_tbl = table(rl_sec)
    if any(any(c.strip() for c in r) for r in rl_tbl[1:]):
        warnings.append('Research log template has non-empty rows')

    data = {
        'meta': {
            'source': Path(path).name,
            'note': 'Verbatim text from the source docx. Do not mix generated content into this file.',
        },
        'program': {
            'label': by_style.get('SmallLabel'),
            'title': by_style.get('Title'),
            'subtitle': plain[0],
            'intro': plain[1],
            'facts': facts,
            'howToUse': bullets(section(blks, find(blks, 'How to use this syllabus'))),
        },
        'learningOutcomes': {'intro': paras(lo)[0], 'items': bullets(lo)},
        'programMap': [{'week': int(r[0]), 'subject': r[1], 'output': r[2]} for r in pm[1:]],
        'weeklyRhythm': [{'activity': r[0], 'time': r[1], 'whatToDo': r[2]} for r in wr[1:]],
        'studySetup': bullets(section(blks, find(blks, 'Study setup'))),
        'weeks': weeks,
        'capstone': {
            'structure': [{'number': int(r[0]), 'section': r[1], 'requiredContent': r[2]} for r in cs[1:]],
            'scoringGuide': {
                'areas': [{'area': r[0], 'points': int(r[1]), 'evidence': r[2]} for r in sg[1:]],
                'passingStandard': ' '.join(passing),
            },
        },
        'formulaReference': {
            'intro': paras(fr_sec)[0],
            'formulas': [{'id': FORMULA_IDS.get(r[0], re.sub(r'\W+', '-', r[0].lower())),
                          'measure': r[0], 'calculation': r[1], 'interpretation': r[2]}
                         for r in table(fr_sec)[1:]],
        },
        'minimumDataset': {
            'intro': paras(md_sec)[0],
            'groups': [{'group': r[0], 'fields': r[1].split(', ')} for r in table(md_sec)[1:]],
        },
        'dataQualityChecks': bullets(section(blks, find(blks, 'Data quality checks'))),
        'researchLogTemplate': {'intro': paras(rl_sec)[0], 'columns': rl_tbl[0]},
        'reflectionTemplate': {'prompts': reflection_prompts},
        'readingList': {
            'intro': paras(section(blks, lib_i))[0],
            'books': [split_book(t) for t in books],
            'coursesAndOrganizations': courses,
        },
        'completionStandard': ' '.join(paras(section(blks, find(blks, 'Completion standard')))),
    }

    OUT.write_text(json.dumps(data, indent=2, ensure_ascii=False) + '\n')
    print(f'Wrote {OUT}')
    for w in warnings:
        print('WARNING:', w)


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'Pricing_economics.docx')
