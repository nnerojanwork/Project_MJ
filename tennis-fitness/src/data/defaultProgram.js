// Default 4-day program. `id`s are stable so logged history keeps referring
// to the right exercise even if the user edits the library later.
export const DEFAULT_PROGRAM = [
  {
    id: 'day1',
    name: 'Foot & Ankle Foundation',
    exercises: [
      { id: 'd1e1', name: 'Short foot / arch doming', prescription: '3 x 15 reps (5s hold)' },
      { id: 'd1e2', name: 'Towel scrunches (toes)', prescription: '3 x 20' },
      { id: 'd1e3', name: 'Toe yoga', prescription: '2 x 10 each side' },
      { id: 'd1e4', name: 'Resistance band ankle eversion/inversion', prescription: '3 x 15 each side' },
      { id: 'd1e5', name: 'Single-leg balance (eyes open → closed)', prescription: '3 x 30-45s each side' },
      { id: 'd1e6', name: 'Calf raises (bilateral → single-leg)', prescription: '3 x 15' },
    ],
  },
  {
    id: 'day2',
    name: 'Core (Rotational, Tennis-Specific)',
    exercises: [
      { id: 'd2e1', name: 'Pallof press', prescription: '3 x 12 each side' },
      { id: 'd2e2', name: 'Standing band rotation (woodchopper)', prescription: '3 x 12 each side' },
      { id: 'd2e3', name: 'Side plank with hip dip', prescription: '3 x 10 each side' },
      { id: 'd2e4', name: 'Dead bug', prescription: '3 x 10 each side' },
      { id: 'd2e5', name: 'Russian twists', prescription: '3 x 16' },
      { id: 'd2e6', name: 'Front plank', prescription: '3 x 30-45s' },
    ],
  },
  {
    id: 'day3',
    name: 'Integrated Ankle + Core Circuit',
    exercises: [
      { id: 'd3e1', name: 'Single-leg RDL', prescription: '3 x 10 each side' },
      { id: 'd3e2', name: 'Lateral band walks', prescription: '3 x 15 steps each side' },
      { id: 'd3e3', name: 'Copenhagen plank', prescription: '3 x 20-30s each side' },
      { id: 'd3e4', name: 'Bird dog', prescription: '3 x 10 each side' },
      { id: 'd3e5', name: 'Tibialis posterior raise', prescription: '3 x 15' },
      { id: 'd3e6', name: 'Ankle alphabet', prescription: '2 rounds each side' },
    ],
  },
  {
    id: 'day4',
    name: 'Reactive / Tennis-Transfer',
    exercises: [
      { id: 'd4e1', name: 'Lateral bounds', prescription: '4 x 6 each direction' },
      { id: 'd4e2', name: 'Split-step + reaction drills', prescription: '4 x 6' },
      { id: 'd4e3', name: 'Single-leg hop and stick', prescription: '3 x 8 each side' },
      { id: 'd4e4', name: 'Standing rotational med-ball throw', prescription: '3 x 10 each side' },
      { id: 'd4e5', name: 'Hollow hold', prescription: '3 x 20-30s' },
    ],
  },
]
