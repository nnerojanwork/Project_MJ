"""Merge the study pack (content-sources/pricing_course.json) into src/content/generated.json.

Swaps: concept explainers and flashcards come from the pack; weekly summaries/worked examples and
extra formulas are added; the pack's quiz is appended under renamed IDs (wN-pK) so existing quiz
stats stay attached to the original questions. Harbour Lane worked examples, the case, formula notes
and the original quiz are kept. syllabus.json is never touched.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PACK = ROOT / 'content-sources' / 'pricing_course.json'
GEN = ROOT / 'src' / 'content' / 'generated.json'

# Pack quiz → concept IDs (the pack has week only). Used for weak-topic tracking.
QUIZ_CONCEPTS = {
    'w1-q1': [2], 'w1-q2': [3], 'w1-q3': [4], 'w1-q4': [3], 'w1-q5': [1], 'w1-q6': [5], 'w1-q7': [3], 'w1-q8': [5], 'w1-q9': [2],
    'w2-q1': [2], 'w2-q2': [3], 'w2-q3': [1, 5], 'w2-q4': [2], 'w2-q5': [5], 'w2-q6': [5], 'w2-q7': [2], 'w2-q8': [2],
    'w3-q1': [3], 'w3-q2': [3], 'w3-q3': [4], 'w3-q4': [1], 'w3-q5': [1], 'w3-q6': [1],
    'w4-q1': [2], 'w4-q2': [3], 'w4-q3': [4], 'w4-q4': [1], 'w4-q5': [3], 'w4-q6': [3],
    'w5-q1': [2], 'w5-q2': [5], 'w5-q3': [4], 'w5-q4': [3], 'w5-q5': [4], 'w5-q6': [4],
    'w6-q1': [3], 'w6-q2': [4], 'w6-q3': [5], 'w6-q4': [1], 'w6-q5': [4], 'w6-q6': [2],
    'w7-q1': [1], 'w7-q2': [2], 'w7-q3': [4], 'w7-q4': [1], 'w7-q5': [5], 'w7-q6': [3],
    'w8-q1': [4], 'w8-q2': [3], 'w8-q3': [5], 'w8-q4': [2], 'w8-q5': [4], 'w8-q6': [5], 'w8-q7': [5],
    'w9-q1': [5], 'w9-q2': [4], 'w9-q3': [1], 'w9-q4': [4], 'w9-q5': [2],
    'w10-q1': [1], 'w10-q2': [4], 'w10-q3': [1], 'w10-q4': [2], 'w10-q5': [2], 'w10-q6': [2],
}


def main():
    pack = json.loads(PACK.read_text())
    gen = json.loads(GEN.read_text())

    concepts = {}
    weeks = {}
    for w in pack['weeks']:
        for c in w['concepts']:
            old = gen['concepts'].get(c['id'], {})
            concepts[c['id']] = {
                'title': c['title'],
                'oneLiner': c['one_liner'],
                'explainer': c['explainer'],
                'quickExample': c.get('example'),
                'lendingLens': c.get('lending_lens'),
                'example': old.get('example'),
            }
        we = w['worked_example']
        weeks[f"w{w['week']}"] = {
            'summary': w['summary'],
            'workedExample': {'title': we['title'], 'setup': we['setup'], 'steps': we['steps'], 'takeaway': we['takeaway']},
        }

    flashcards = [
        {'id': f['id'], 'kind': f['type'], 'week': f['week'] or 0, 'front': f['front'], 'back': f['back'],
         'source': f['source'], 'difficulty': f['difficulty']}
        for f in pack['flashcards']
    ]

    quiz = {k: [q for q in v if '-p' not in q['id']] for k, v in gen['quiz'].items()}
    for q in pack['quiz']:
        wk = f"w{q['week']}"
        new_id = q['id'].replace('-q', '-p')
        base = {'id': new_id, 'packId': q['id'], 'conceptIds': [f"{wk}-c{n}" for n in QUIZ_CONCEPTS[q['id']]],
                'question': q['question'], 'explanation': q['explanation']}
        if q['type'] == 'mcq':
            base.update(type='mcq', options=q['options'], answerIndex=q['answer_index'])
        else:
            base.update(type='numeric', answer=q['answer'], tolerance=q['tolerance'], unit=q['unit'])
        quiz.setdefault(wk, []).append(base)

    extra = [
        {'id': f['id'], 'name': f['name'], 'formula': f['formula'], 'interpretation': f['interpretation'],
         'example': f['example'], 'week': f['week']}
        for f in pack['reference']['formulas'] if f['source'] == 'generated'
    ]

    out = {
        'meta': {
            **gen['meta'],
            'note': 'Generated study content keyed by IDs in syllabus.json. Not part of the original syllabus. '
                    'Concept explainers, weekly summaries/worked examples, flashcards, extra formulas and the wN-pK quiz '
                    'questions come from the study pack (content-sources/pricing_course.json); the Harbour Lane case, '
                    'its worked examples and the wN-qK quiz were written for this app. Verify before relying on them.',
        },
        'case': gen['case'],
        'concepts': concepts,
        'weeks': weeks,
        'quiz': quiz,
        'flashcards': flashcards,
        'formulaNotes': gen['formulaNotes'],
        'extraFormulas': extra,
    }
    GEN.write_text(json.dumps(out, indent=2, ensure_ascii=False) + '\n')
    print(f"concepts {len(concepts)}, weeks {len(weeks)}, flashcards {len(flashcards)}, "
          f"quiz {sum(len(v) for v in quiz.values())}, extra formulas {len(extra)}")


if __name__ == '__main__':
    main()
