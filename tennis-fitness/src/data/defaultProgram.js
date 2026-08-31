// Default 4-day program. `id`s are stable so logged history and diagram
// assignments keep referring to the right exercise even if the user edits
// the library later. `diagramId` looks up a pair of poses in diagrams.js;
// `formCue` is the one-line coaching cue shown with the diagram.
export const DEFAULT_PROGRAM = [
  {
    id: 'day1',
    name: 'Foot & Ankle Foundation',
    exercises: [
      { id: 'd1e1', name: 'Short foot / arch doming', prescription: '3 x 15 reps (5s hold)', diagramId: 'd1e1', formCue: 'Draw the ball of the foot toward the heel without curling the toes.' },
      { id: 'd1e2', name: 'Towel scrunches (toes)', prescription: '3 x 20', diagramId: 'd1e2', formCue: 'Scrunch with the toes only — keep the heel flat and still.' },
      { id: 'd1e3', name: 'Toe yoga', prescription: '2 x 10 each side', diagramId: 'd1e3', formCue: 'Lift the big toe alone, then just the other four — isolate each.' },
      { id: 'd1e4', name: 'Resistance band ankle eversion/inversion', prescription: '3 x 15 each side', diagramId: 'd1e4', formCue: 'Move slowly through the band tension; keep the shin still.' },
      { id: 'd1e5', name: 'Single-leg balance (eyes open → closed)', prescription: '3 x 30-45s each side', diagramId: 'd1e5', formCue: 'Soft knee, tall spine — only close your eyes once it feels stable.' },
      { id: 'd1e6', name: 'Calf raises (bilateral → single-leg)', prescription: '3 x 15', diagramId: 'd1e6', formCue: 'Rise straight up through the big toe, no rolling to the outside.' },
    ],
  },
  {
    id: 'day2',
    name: 'Core (Rotational, Tennis-Specific)',
    exercises: [
      { id: 'd2e1', name: 'Pallof press', prescription: '3 x 12 each side', diagramId: 'd2e1', formCue: 'Resist the band pulling you sideways — hips and shoulders stay square.' },
      { id: 'd2e2', name: 'Standing band rotation (woodchopper)', prescription: '3 x 12 each side', diagramId: 'd2e2', formCue: 'Rotate from the trunk, not the arms — let the hips follow through.' },
      { id: 'd2e3', name: 'Side plank with hip dip', prescription: '3 x 10 each side', diagramId: 'd2e3', formCue: 'Lower the hip with control and lift back to a straight line.' },
      { id: 'd2e4', name: 'Dead bug', prescription: '3 x 10 each side', diagramId: 'd2e4', formCue: 'Keep the low back pressed into the floor the whole rep.' },
      { id: 'd2e5', name: 'Russian twists', prescription: '3 x 16', diagramId: 'd2e5', formCue: 'Rotate from the ribs, not just the arms; keep the chest up.' },
      { id: 'd2e6', name: 'Front plank', prescription: '3 x 30-45s', diagramId: 'd2e6', formCue: 'Straight line from head to heels — don’t let the hips sag.' },
    ],
  },
  {
    id: 'day3',
    name: 'Integrated Ankle + Core Circuit',
    exercises: [
      { id: 'd3e1', name: 'Single-leg RDL', prescription: '3 x 10 each side', diagramId: 'd3e1', formCue: 'Hinge at the hip, keep a flat back, and let the back leg rise for balance.' },
      { id: 'd3e2', name: 'Lateral band walks', prescription: '3 x 15 steps each side', diagramId: 'd3e2', formCue: 'Stay low with tension on the band — don’t let the knees cave in.' },
      { id: 'd3e3', name: 'Copenhagen plank', prescription: '3 x 20-30s each side', diagramId: 'd3e3', formCue: 'Keep hips level and lifted — don’t let the top hip roll back.' },
      { id: 'd3e4', name: 'Bird dog', prescription: '3 x 10 each side', diagramId: 'd3e4', formCue: 'Keep hips level, don’t let the extended leg rotate open.' },
      { id: 'd3e5', name: 'Tibialis posterior raise', prescription: '3 x 15', diagramId: 'd3e5', formCue: 'Roll onto the outer edges of the feet, then lift the arches.' },
      { id: 'd3e6', name: 'Ankle alphabet', prescription: '2 rounds each side', diagramId: 'd3e6', formCue: 'Move only at the ankle — trace each letter slowly and fully.' },
    ],
  },
  {
    id: 'day4',
    name: 'Reactive / Tennis-Transfer',
    exercises: [
      { id: 'd4e1', name: 'Lateral bounds', prescription: '4 x 6 each direction', diagramId: 'd4e1', formCue: 'Land soft on a bent knee and stick it for a full second before repeating.' },
      { id: 'd4e2', name: 'Split-step + reaction drills', prescription: '4 x 6', diagramId: 'd4e2', formCue: 'Land light on the balls of the feet, ready to push off either way.' },
      { id: 'd4e3', name: 'Single-leg hop and stick', prescription: '3 x 8 each side', diagramId: 'd4e3', formCue: 'Absorb the landing quietly through the hip and knee, not the back.' },
      { id: 'd4e4', name: 'Standing rotational med-ball throw', prescription: '3 x 10 each side', diagramId: 'd4e4', formCue: 'Load through the hips first, then whip the arms through last.' },
      { id: 'd4e5', name: 'Hollow hold', prescription: '3 x 20-30s', diagramId: 'd4e5', formCue: 'Press the low back down and keep ribs tucked — don’t let the back arch.' },
    ],
  },
]
