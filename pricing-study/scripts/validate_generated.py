"""Check generated.json against syllabus.json: IDs, limits, and recomputed calc answers."""
import json, re, sys
from pathlib import Path

C = Path(__file__).resolve().parent.parent / 'src' / 'content'
syl = json.loads((C / 'syllabus.json').read_text())
gen = json.loads((C / 'generated.json').read_text())
errors = []

concept_ids = {c['id'] for w in syl['weeks'] for c in w['coreConcepts']}
formula_ids = {f['id'] for f in syl['formulaReference']['formulas']}

missing = concept_ids - set(gen['concepts'])
extra = set(gen['concepts']) - concept_ids
if missing: errors.append(f'concepts missing explainers: {sorted(missing)}')
if extra: errors.append(f'explainers for unknown concepts: {sorted(extra)}')
for cid, c in gen['concepts'].items():
    n = len(c['explainer'].split())
    if n > 125: errors.append(f'{cid} explainer {n} words')

# Independent recomputation of every calc question
CHECK = {
    'w1-q1': (5000 - 3500) / 5000 * 100,
    'w1-q2': (5000 - 3500) / 3500 * 100,
    'w1-q3': (1 - 1500 / 1750) * 100,
    'w1-q4': 1000 * 0.93 * (5250 - 3500),
    'w1-q7': (1 - 1500 / (5250 - 3600)) * 100,
    'w2-q1': ((900 - 1000) / 950) / ((6000 - 5000) / 5500),
    'w2-q4': -1.5 * 4,
    'w3-q1': 4000 + 900 + 800 - 200,
    'w3-q4': 60 * 0.6,
    'w4-q2': 300 + 10000 * 0.235,
    'w4-q3': 200 * (5000 - 4400),
    'w4-q6': 280 * 600,
    'w5-q1': 20000 * 0.25 - (20000 * 0.22 + 400),
    'w5-q5': 0.03 * 20000 * 1000,
    'w6-q1': 6000 - 500 - 300 - 200 - 3500,
    'w6-q2': 200 * (5400 - 4700),
    'w6-q3': 1 + (3500 + 500) / 20000,
    'w7-q1': 100 * (20000 * 0.28 - 3500) - min(120, 100) * 1500,
    'w7-q3': 180 * 60 + 20 * 10,
    'w7-q4': 900 * (5500 - 3500) - 1200 * (4500 - 3500),
    'w8-q1': (36 - 40) - (41 - 42),
    'w8-q4': 0.37 * 1750 - 0.40 * 1500,
    'w9-q2': (5150 - 5000) / (5250 - 5000) * 100,
    'w10-q1': 970 * 1750 - 1500000 - 60000,
    'w10-q2': (970 * 1750 - 1500000 - 60000) / 60000 * 100,
    'w10-q3': (1 - (1500000 + 60000) / 1750 / 1000) * 100,
    'w10-q4': 880 * 1750 - 1500000 - 60000,
    # Study-pack numeric questions (typed answers, checked against their tolerance)
    'w1-p7': 9300 * 45 / 1000,
    'w1-p8': 100 - 8 - 3 - 1.5 - 2 - 1.5,
    'w1-p9': 65 / (1 - 0.35),
    'w2-p7': (-40 / 480) / (2 / 21),
    'w2-p8': -(0.10 / (0.30 + 0.10)) / 0.10,
    'w3-p6': 50 + 20 - 5,
    'w4-p6': max(p * sum(v >= p for v in (10 + 2, 6 + 7)) for p in (10 + 2, 6 + 7)),
    'w5-p6': (1 - (20000 * (45 - 35)) / (50 - 35) / 20000) * 100,
    'w6-p5': 0.10 / (0.30 - 0.10) * 100,
    'w6-p6': 50000 * 0.30 - 50000 * 0.08 - 0.05 * 65000 - 1875 - 500,
    'w7-p6': 95 * 35 - 60 * 50,
    'w8-p5': (18 - 20) - (20 - 21),
    'w8-p6': 16 * 0.1 * 0.9 / 0.02 ** 2,
    'w8-p7': 170 * 50 - 200 * 40,
    'w10-p5': 5 * 9300,
    'w10-p6': -700 * 40,
}


def num(s):
    return float(re.sub(r'[^0-9.\-]', '', s.replace('−', '-')))


all_concepts_used = set()
for w in syl['weeks']:
    qs = gen['quiz'].get(w['id'], [])
    if len(qs) < 5: errors.append(f"{w['id']} has only {len(qs)} quiz questions")
    for q in qs:
        all_concepts_used |= set(q['conceptIds'])
        if not set(q['conceptIds']) <= concept_ids: errors.append(f"{q['id']} bad conceptIds")
        if q['type'] == 'numeric':
            exp = CHECK.get(q['id'])
            if exp is None:
                errors.append(f"{q['id']} has no independent check")
            elif abs(exp - q['answer']) > q['tolerance'] + 1e-9:
                errors.append(f"{q['id']} answer {q['answer']} != recomputed {exp}")
            continue
        if not 0 <= q['answerIndex'] < len(q['options']): errors.append(f"{q['id']} answerIndex out of range")
        if len(set(q['options'])) != len(q['options']): errors.append(f"{q['id']} duplicate options")
        if q['type'] == 'calc':
            exp = CHECK.get(q['id'])
            if exp is None:
                errors.append(f"{q['id']} has no independent check"); continue
            if abs(exp - q['answer']) > max(0.01, abs(exp) * 0.001):
                errors.append(f"{q['id']} answer {q['answer']} != recomputed {exp}")
            shown = num(q['options'][q['answerIndex']])
            if abs(round(exp, q['decimals']) - shown) > 10 ** -q['decimals'] * 0.6:
                errors.append(f"{q['id']} correct option {q['options'][q['answerIndex']]!r} != {exp:.4f}")
            for i, o in enumerate(q['options']):
                if i != q['answerIndex'] and abs(num(o) - shown) < 1e-9:
                    errors.append(f"{q['id']} distractor equals answer")

ids = [x['id'] for x in gen['flashcards']] + [q['id'] for qs in gen['quiz'].values() for q in qs]
dupes = {i for i in ids if ids.count(i) > 1}
if dupes: errors.append(f'duplicate ids: {dupes}')
KINDS = {'term', 'contrast', 'formula', 'calc', 'explain', 'apply'}
for f in gen['flashcards']:
    if f['kind'] not in KINDS: errors.append(f"{f['id']} unknown kind {f['kind']}")
    if not 0 <= f['week'] <= len(syl['weeks']): errors.append(f"{f['id']} bad week")
if set(gen['formulaNotes']) != formula_ids: errors.append('formulaNotes do not match formula ids')
week_ids = {w['id'] for w in syl['weeks']}
if set(gen['weeks']) != week_ids: errors.append('weekly summaries do not cover every week')

wc = [len(c['explainer'].split()) for c in gen['concepts'].values()]
print(f"concepts: {len(gen['concepts'])}/{len(concept_ids)}, explainer words max {max(wc)} avg {sum(wc)//len(wc)}, "
      f"with examples {sum(1 for c in gen['concepts'].values() if c['example'])}")
print('quiz per week:', {k: len(v) for k, v in gen['quiz'].items()},
      'calc:', sum(q['type'] == 'calc' for qs in gen['quiz'].values() for q in qs),
      'numeric:', sum(q['type'] == 'numeric' for qs in gen['quiz'].values() for q in qs),
      'concepts quizzed:', len(all_concepts_used))
from collections import Counter
print(f"flashcards: {len(gen['flashcards'])} {dict(Counter(f['kind'] for f in gen['flashcards']))}, extra formulas: {len(gen['extraFormulas'])}")
for e in errors: print('ERROR:', e)
sys.exit(1 if errors else 0)
