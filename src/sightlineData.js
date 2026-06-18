// Sightline dataset — London theatres seating 250+
// Section-level ratings (1.0–5.0) with seat-specific guidance.
// Venue keys are lowercase; use getSightlineData(venueName) for lookup.

export const SIGHTLINE_DATA = {

  // ── MAJOR WEST END ─────────────────────────────────────────────────────────

  "adelphi theatre": {
    overall: 3.9, capacity: 1500,
    sections: {
      "Stalls Centre (Rows A–M)":  { score: 4.6, notes: "Rows D–J centre are the sweet spot — close enough for facial expressions, far enough for full staging. Good rake keeps all centre rows clear throughout." },
      "Stalls Side (Rows A–M)":    { score: 3.4, notes: "Seats past the sixth position from the aisle risk losing the opposite side of the stage. Avoid A1–A5 and A28–A32 — pillar obstructions are severe in the front corners." },
      "Stalls Rear (Rows N–T)":    { score: 3.8, notes: "Elevated on a steeper rake so views are actually clear, but you are roughly 30 m from the stage. No obstructions, just distance." },
      "Royal Circle Centre":       { score: 4.3, notes: "Row A is one of the best-value seats in the house — close, elevated, and centred. The gentle curve puts all centre seats facing directly at the stage." },
      "Royal Circle Side":         { score: 3.2, notes: "Beyond seat 8 or 9 on either side the angle becomes steep. Some positions lose sight of one wing entirely due to the circle overhang below." },
      "Grand Circle Centre":       { score: 3.9, notes: "High but well-raked. Clear birds-eye view of the full stage from centre seats. Front row gives the best angle; rear rows feel remote for dialogue-heavy drama." },
      "Grand Circle Side":         { score: 2.9, notes: "Sharply angled and some seats have restricted views. Check SeatPlan.com for specific positions before booking the outer grand circle." },
      "Boxes":                     { score: 3.0, notes: "You will see one side of the stage clearly and lose the other. Fine for spectacle musicals with centre staging; poor for dialogue-heavy drama." },
    }
  },

  "apollo theatre": {
    overall: 3.8, capacity: 750,
    sections: {
      "Stalls Centre (Rows A–L)":  { score: 4.5, notes: "Intimate house with an excellent rake. Rows D–H centre feel perfectly placed — close and involving. The slight curve keeps all centre seats facing the stage." },
      "Stalls Side":               { score: 3.3, notes: "Side aisle seats past the third position from the wall can lose up to 20% of the opposite side of the stage." },
      "Stalls Rear (Rows M–R)":    { score: 3.7, notes: "Rear stalls sit under the dress circle overhang. Rows P–R feel a low ceiling and the stage seems further away, but sightlines are unobstructed." },
      "Dress Circle Centre":       { score: 4.2, notes: "Row A dress circle is one of the best-value seats in the house — close, elevated, and centred." },
      "Dress Circle Side":         { score: 3.0, notes: "Seats at the very end of rows angle sharply away; some lose sight of one side of the stage entirely." },
      "Upper Circle Centre":       { score: 3.7, notes: "Steep rake but clear views for the centre block. Front row can feel vertiginous — not recommended for those uncomfortable with heights." },
      "Upper Circle Side":         { score: 2.8, notes: "Steep rake combined with a sharp angle to the stage makes these the weakest seats in the house." },
      "Boxes":                     { score: 2.9, notes: "Heavily restricted — heavily angled to the stage. Only suitable for musicals where the action is centred rather than spread across the full stage." },
    }
  },

  "apollo victoria": {
    overall: 3.4, capacity: 2500,
    sections: {
      "Stalls Centre (Rows A–P)":  { score: 4.3, notes: "Rows G–M centre are the prime positions. Front rows A–C can strain the neck for aerial staging. The wide stage is fully visible from centre throughout." },
      "Stalls Side":               { score: 3.1, notes: "Very wide house — seats more than six from the centre aisle can miss significant staging on the opposite side." },
      "Stalls Rear":               { score: 3.3, notes: "Long auditorium; rear stalls are quite far. Binoculars recommended beyond Row R. Clear sightlines, just distant." },
      "Dress Circle Centre":       { score: 3.8, notes: "Good elevated view of the full stage; height helps appreciate aerial and large-scale staging." },
      "Dress Circle Side":         { score: 2.8, notes: "Side positions curve sharply; the stage appears heavily foreshortened in the outer seats. Among the weakest sightlines in any large West End house." },
      "Upper Circle Centre":       { score: 3.4, notes: "Very high and distant. Unobstructed but the scale of the production is lost. Binoculars essential." },
      "Upper Circle Side":         { score: 2.4, notes: "Extreme angles combined with height and distance. Not recommended unless very inexpensive." },
    }
  },

  "cambridge theatre": {
    overall: 4.0, capacity: 1200,
    sections: {
      "Stalls Centre (Rows A–L)":  { score: 4.6, notes: "One of the better stalls in the West End. The house narrows elegantly and all centre positions have excellent sightlines. Rows E–J are most coveted." },
      "Stalls Side":               { score: 3.5, notes: "Some restriction at the very ends of rows, but the modest width makes these less severe than in larger theatres." },
      "Stalls Rear":               { score: 3.9, notes: "Good rake keeps sightlines clear. Final rows sit under the circle overhang, which can feel claustrophobic but sightlines remain clear." },
      "Dress Circle Centre":       { score: 4.4, notes: "Row A is outstanding — close, elevated, and with a perfect angle. Highly recommended for drama and musicals alike." },
      "Dress Circle Side":         { score: 3.3, notes: "Seats beyond the central block angle away. Perspective is off at the extremes of rows but not fully restricted." },
      "Upper Circle Centre":       { score: 4.0, notes: "Well-raked with clear centre views. The front row of the upper circle is surprisingly close and gives a clear angle." },
      "Upper Circle Side":         { score: 3.1, notes: "Angled views; some restricted sightlines to the far side of the stage in the outer positions." },
    }
  },

  "dominion theatre": {
    overall: 3.2, capacity: 2000,
    sections: {
      "Stalls Centre (Rows A–N)":  { score: 4.0, notes: "Good rake for rows D–L. Front rows involve a craned neck for large-scale staging. Wide staging is well seen from the centre throughout." },
      "Stalls Side":               { score: 2.8, notes: "Very wide venue. Outer third of the stalls can miss staging on the opposite side entirely." },
      "Stalls Rear":               { score: 3.0, notes: "Long auditorium; binoculars strongly recommended beyond Row O. Clear sightline, significant distance." },
      "Circle Centre":             { score: 3.5, notes: "Elevated view helps in this large house. Centre circle gives a panoramic view but the distance is significant." },
      "Circle Side":               { score: 2.5, notes: "Poor. Width, height, and angle combine badly. Restricted sightlines to the far side of the stage." },
      "Upper Circle / Balcony":    { score: 2.8, notes: "Very high and distant. Only for spectacle shows where the overview matters. Binoculars essential." },
    }
  },

  "duke of york's theatre": {
    overall: 3.9, capacity: 650,
    sections: {
      "Stalls Centre":             { score: 4.5, notes: "Intimate Victorian house with a good rake. Rows D–H are the sweet spot — close and engaged with the stage." },
      "Stalls Side":               { score: 3.4, notes: "Some Victorian pillar obstructions at the very outer positions. Check SeatPlan.com for specific restricted seats." },
      "Stalls Rear":               { score: 3.8, notes: "Elevated well and clear sightlines. Intimate house means even rear stalls aren't far from the stage." },
      "Dress Circle Centre":       { score: 4.3, notes: "Row A dress circle is among the best seats in the house — close, elevated, and perfectly centred." },
      "Dress Circle Side":         { score: 3.1, notes: "The circle curves away at the sides; some positions lose a portion of the stage at the extremes." },
      "Upper Circle":              { score: 3.5, notes: "Small upper circle with a steep rake. Views clear from the centre but the height feels steep. Good value for the brave." },
    }
  },

  "garrick theatre": {
    overall: 3.9, capacity: 656,
    sections: {
      "Stalls Centre (Rows A–K)":  { score: 4.5, notes: "Charming intimate house. Good rake and all centre positions feel close to the action. Rows E–I are ideal for both drama and comedy." },
      "Stalls Side":               { score: 3.4, notes: "Victorian pillars can affect the outermost side seats. Check individual seat maps for obstructions." },
      "Stalls Rear":               { score: 3.7, notes: "Good rake maintained. Clear views but the low ceiling under the circle can feel enclosed in the very last rows." },
      "Dress Circle Centre":       { score: 4.4, notes: "The gentle curve puts all centre seats in an ideal position. Row A is excellent." },
      "Dress Circle Side":         { score: 3.2, notes: "Side seats angle significantly at dress circle level. Outer positions can lose sightlines to the back of the stage." },
      "Upper Circle":              { score: 3.6, notes: "Well-raked small upper circle. Centre seats are good value — steep but unobstructed views." },
      "Balcony":                   { score: 3.0, notes: "Very high and steep. Clear views from centre but extremely far from the stage. Best for operatic-scale productions." },
    }
  },

  "gielgud theatre": {
    overall: 4.0, capacity: 889,
    sections: {
      "Stalls Centre (Rows A–M)":  { score: 4.6, notes: "Excellent mid-size house. Good rake and all centre positions within Rows A–M are within 20 m of the stage. Rows F–K are outstanding." },
      "Stalls Side":               { score: 3.5, notes: "Narrower house than many West End theatres means side restrictions are less severe. Moderate angle only at the very outer positions." },
      "Stalls Rear":               { score: 3.9, notes: "Good rake continues through the rear stalls. Rows N–R are elevated and clear. Some seats sit under the dress circle overhang." },
      "Dress Circle Centre":       { score: 4.5, notes: "One of the best dress circles in the West End. Well-raked and close to the stage. Row A is exceptional." },
      "Dress Circle Side":         { score: 3.3, notes: "Side positions curve away and can feel angled in the outer seats. Acceptable but not ideal." },
      "Grand Circle Centre":       { score: 4.0, notes: "Surprisingly good views. Well-raked and the angle to the stage is manageable. Good value seats." },
      "Grand Circle Side":         { score: 2.9, notes: "Height and angle combine to restrict views to the far side of the stage from outer grand circle positions." },
      "Boxes":                     { score: 2.8, notes: "Atmospheric but you will miss significant staging on the opposite side." },
    }
  },

  "gillian lynne theatre": {
    overall: 3.5, capacity: 2052,
    sections: {
      "Stalls Centre (Rows A–O)":  { score: 4.3, notes: "Rows G–L centre are the prime positions. Front rows A–D require neck strain for shows with aerial elements. The wide stage is fully seen from the centre." },
      "Stalls Side":               { score: 3.0, notes: "Very wide house. Outer columns and the breadth of staging mean restricted views from the outermost side seats." },
      "Stalls Rear":               { score: 3.2, notes: "House is long — rear rows P onward require binoculars for facial detail. Good rake keeps sightlines clear." },
      "Dress Circle Centre":       { score: 3.9, notes: "Good elevated views. Particularly useful for shows with elaborate set design where seeing the full stage picture matters." },
      "Dress Circle Side":         { score: 2.8, notes: "Significantly restricted. Outer extremes of the dress circle rows can lose one entire side of the stage." },
      "Upper Circle Centre":       { score: 3.4, notes: "High but unobstructed centre views. Good for spectacle musicals. Binoculars helpful for detail." },
      "Upper Circle Side":         { score: 2.5, notes: "Poor sightlines. Not recommended unless extremely inexpensive." },
      "Grand Circle / Balcony":    { score: 3.0, notes: "Very high and steep. Centre seats only — not recommended for those uncomfortable with heights or with distance from the stage." },
    }
  },

  "harold pinter theatre": {
    overall: 4.1, capacity: 786,
    sections: {
      "Stalls Centre (Rows A–L)":  { score: 4.7, notes: "One of the finest stalls in the West End. Intimate house, excellent rake, and every centre position feels close to the action. Rows E–I are outstanding." },
      "Stalls Side":               { score: 3.6, notes: "Moderate restrictions only at the very ends of rows. The house's moderate width keeps these manageable." },
      "Stalls Rear":               { score: 4.0, notes: "Well-raked rear stalls with clear views. Intimate scale means rear stalls are still quite close relative to larger West End venues." },
      "Dress Circle Centre":       { score: 4.5, notes: "Excellent dress circle with a strong rake. Row A centre is among the best seats in the West End for intimate drama." },
      "Dress Circle Side":         { score: 3.4, notes: "Some restriction at the extreme sides but the narrower form makes this less of an issue than in wider theatres." },
      "Grand Circle Centre":       { score: 4.1, notes: "Well-raked and elevated. Clear views of the full stage from the centre. Better than many grand circles in the West End." },
      "Grand Circle Side":         { score: 3.0, notes: "Side positions work best for spectacle rather than intimate drama due to the angle and height." },
      "Balcony":                   { score: 3.3, notes: "Small but steep balcony. Centre positions have clear if distant views. The intimate house scale makes the balcony less remote than in larger theatres." },
    }
  },

  "her majesty's theatre": {
    overall: 3.7, capacity: 1216,
    sections: {
      "Stalls Centre (Rows A–M)":  { score: 4.4, notes: "Well-configured with a good rake. Rows F–K are the classic prime seats. Centre stalls mid-stalls are the ideal position to see the famous chandelier drop in Phantom." },
      "Stalls Side":               { score: 3.2, notes: "Victorian theatre design means some pillars affect outer side seats. Some restricted seats in the side columns." },
      "Stalls Rear":               { score: 3.6, notes: "Good elevation at the rear. The theatre's moderate length means rear stalls aren't excessively distant. Some seats under the circle overhang." },
      "Royal Circle Centre":       { score: 4.3, notes: "Well-positioned with excellent views of the full stage. Row A is outstanding for productions with aerial staging." },
      "Royal Circle Side":         { score: 3.0, notes: "Horseshoe layout means the very ends of rows lose sight of one side of the stage." },
      "Grand Circle Centre":       { score: 3.8, notes: "Elevated but clear views. Good for seeing the full production design. Comfortable for spectacle musicals." },
      "Grand Circle Side":         { score: 2.7, notes: "Horseshoe layout combined with height creates angled views that lose much of the stage from the outer positions." },
      "Upper Circle / Balcony":    { score: 3.2, notes: "Very steep and high. Centre positions have clear if distant views. The chandelier is almost level here — a different perspective on Phantom." },
      "Boxes":                     { score: 2.8, notes: "Atmospheric but restricted. Best for Phantom where centre staging dominates; poor for shows with wide staging." },
    }
  },

  "lyceum theatre": {
    overall: 3.7, capacity: 2100,
    sections: {
      "Stalls Centre (Rows A–P)":  { score: 4.4, notes: "Large Victorian house but centre stalls are well-configured. Rows G–M centre are the classic prime seats. Front rows A–D require neck strain for aerial staging. The wide thrust stage (Lion King) is fully visible from centre." },
      "Stalls Side":               { score: 3.0, notes: "Lyceum is wide. Outer seats past the sixth from the aisle can miss significant staging on the far side. Avoid the very back side seats." },
      "Stalls Rear":               { score: 3.4, notes: "Elevated and reasonably clear but the distance is significant. Rows Q onward benefit from the steep rake." },
      "Dress Circle Centre":       { score: 4.0, notes: "Good elevated views. The spectacle of large shows is enhanced by the elevated perspective. Row A is particularly strong." },
      "Dress Circle Side":         { score: 2.9, notes: "Victorian horseshoe layout means side seats angle sharply. Outer positions lose significant portions of the stage." },
      "Upper Circle Centre":       { score: 3.5, notes: "High but well-raked. Full stage picture visible. Better for spectacle. Binoculars helpful for facial detail." },
      "Upper Circle Side":         { score: 2.5, notes: "Extreme angle and height combined. Not recommended." },
      "Balcony":                   { score: 3.0, notes: "Very high and steep. Centre balcony seats have a birds-eye panoramic view. Steep rake can feel vertiginous." },
    }
  },

  "noel coward theatre": {
    overall: 4.0, capacity: 902,
    sections: {
      "Stalls Centre (Rows A–L)":  { score: 4.6, notes: "Excellent intimate house. Lovely rake and all centre positions feel engaged with the stage. Rows E–I are the sweet spot." },
      "Stalls Side":               { score: 3.5, notes: "Moderate restrictions in this well-designed house. The narrower form means side seats are less affected than in wider theatres." },
      "Stalls Rear":               { score: 3.9, notes: "Good rake continues through the rear stalls. Rows M–Q have clear views. Some positions in the very back sit under the dress circle." },
      "Dress Circle Centre":       { score: 4.5, notes: "One of the best dress circles in the West End. Well-raked and close to the stage. Row A is outstanding." },
      "Dress Circle Side":         { score: 3.3, notes: "Side positions angle away in the outer rows but the moderate width makes this manageable." },
      "Grand Circle Centre":       { score: 4.0, notes: "Good value elevated views. Well-raked and centre positions have clear views of the full stage." },
      "Grand Circle Side":         { score: 3.0, notes: "Worth checking individual seat plans before booking the outer positions — restriction increases toward the ends of rows." },
    }
  },

  "novello theatre": {
    overall: 3.9, capacity: 1053,
    sections: {
      "Stalls Centre (Rows A–L)":  { score: 4.5, notes: "Refurbished house with a good rake. All centre positions within Rows A–L are strong. Rows E–J are most popular." },
      "Stalls Side":               { score: 3.4, notes: "Restrictions present but moderate. The Novello's design keeps most seats in a reasonable range." },
      "Stalls Rear":               { score: 3.8, notes: "Well-raked rear stalls with clear views. Some seats under the dress circle overhang can feel low-ceilinged." },
      "Dress Circle Centre":       { score: 4.4, notes: "Strong dress circle. Centre positions give a perfect elevated angle. Row A is particularly recommended for musicals with big choreography." },
      "Dress Circle Side":         { score: 3.2, notes: "Outer positions can miss one side of staging. Angle increases noticeably past the midpoint of each row." },
      "Upper Circle Centre":       { score: 3.8, notes: "Well-raked upper circle with clear centre views. Front row upper circle is particularly strong for the price." },
      "Upper Circle Side":         { score: 2.9, notes: "Angle and height combine to create restricted views from the outer upper circle." },
    }
  },

  "palace theatre": {
    overall: 3.6, capacity: 1400,
    sections: {
      "Stalls Centre (Rows A–N)":  { score: 4.3, notes: "Solid rake. Rows G–L centre are the recommended positions. Front rows A–C require looking up for raised staging." },
      "Stalls Side":               { score: 3.0, notes: "Wide house means outer seats lose significant portions of the opposite side of the stage." },
      "Stalls Rear":               { score: 3.4, notes: "Well-elevated rear but quite distant. Clear sightlines but binoculars needed for facial detail." },
      "Royal Circle Centre":       { score: 4.0, notes: "Elevated views from the centre. Good for seeing the full stage picture in large musicals." },
      "Royal Circle Side":         { score: 2.9, notes: "Victorian horseshoe design — outer positions lose one side of the stage." },
      "Grand Circle Centre":       { score: 3.6, notes: "High but clear views from centre. Good for spectacle musicals. Binoculars recommended for detail." },
      "Grand Circle Side":         { score: 2.6, notes: "Poor views from the outer grand circle. Combination of height and angle creates heavily restricted sightlines." },
      "Upper Circle / Balcony":    { score: 3.0, notes: "Very high and steep. Only centre positions are worth considering. Binoculars essential." },
    }
  },

  "phoenix theatre": {
    overall: 4.0, capacity: 1012,
    sections: {
      "Stalls Centre (Rows A–L)":  { score: 4.5, notes: "Good mid-size house with a solid rake. All centre positions within Rows A–L are strong. Rows E–J are most popular." },
      "Stalls Side":               { score: 3.5, notes: "Moderate restrictions. The Phoenix's proportions are better than many large West End venues." },
      "Stalls Rear":               { score: 3.9, notes: "Good rake continues through the rear stalls. Rows M–R are clear with minimal obstruction." },
      "Dress Circle Centre":       { score: 4.4, notes: "Well-positioned dress circle. Centre positions give a strong elevated angle. Row A is excellent." },
      "Dress Circle Side":         { score: 3.2, notes: "Side positions angle away from the stage. Outer dress circle seats can miss the far side of the stage." },
      "Upper Circle Centre":       { score: 3.9, notes: "Well-raked upper circle with clear centre views. Front row is particularly strong for the price." },
      "Upper Circle Side":         { score: 2.9, notes: "Angle and height create restricted views from outer upper circle positions." },
    }
  },

  "prince edward theatre": {
    overall: 3.6, capacity: 1716,
    sections: {
      "Stalls Centre (Rows A–O)":  { score: 4.2, notes: "Large modern house well-configured for musicals. Rows G–L centre are the prime positions. Refurbished for Hamilton." },
      "Stalls Side":               { score: 3.1, notes: "Large house and wide stage mean outer side stalls lose significant portions of the stage." },
      "Stalls Rear":               { score: 3.3, notes: "Long auditorium — good rake but binoculars recommended for Rows P and beyond." },
      "Dress Circle Centre":       { score: 3.9, notes: "Good elevated views. Central section gives a panoramic view — particularly good for shows with elaborate scenic design." },
      "Dress Circle Side":         { score: 2.8, notes: "Wide house combined with the circle angle creates poor sightlines. Outer positions significantly restricted." },
      "Grand Circle Centre":       { score: 3.5, notes: "High but the centre gives a clear full-stage view. Best for spectacle shows. Binoculars helpful." },
      "Grand Circle Side":         { score: 2.5, notes: "Poor sightlines. Not recommended. The combination of height, width, and angle creates very restricted views." },
    }
  },

  "prince of wales theatre": {
    overall: 3.9, capacity: 1160,
    sections: {
      "Stalls Centre (Rows A–L)":  { score: 4.5, notes: "Well-proportioned house with excellent centre stalls. Good rake and all centre positions within Rows A–L are strong. Rows E–J particularly recommended." },
      "Stalls Side":               { score: 3.4, notes: "Moderate restrictions. The house's proportions keep this manageable compared with wider theatres." },
      "Stalls Rear":               { score: 3.8, notes: "Good rake continues through the rear stalls. Clear views from elevated rear positions." },
      "Dress Circle Centre":       { score: 4.3, notes: "Strong dress circle with clear elevated views. Well-raked and all centre positions face the stage directly." },
      "Dress Circle Side":         { score: 3.1, notes: "Side dress circle seats angle away. Outer positions can lose one side of the stage." },
      "Upper Circle Centre":       { score: 3.7, notes: "Good value elevated views from the centre upper circle. Well-raked with clear sightlines." },
      "Upper Circle Side":         { score: 2.8, notes: "Angle and height create restricted views from outer upper circle positions." },
    }
  },

  "savoy theatre": {
    overall: 3.9, capacity: 1158,
    sections: {
      "Stalls Centre (Rows A–L)":  { score: 4.5, notes: "Beautifully restored Edwardian house with excellent centre stalls. Good rake and all centre positions within Rows A–L are strong." },
      "Stalls Side":               { score: 3.4, notes: "Moderate restrictions. Some Victorian pillar obstructions can affect the outermost positions." },
      "Stalls Rear":               { score: 3.8, notes: "Well-raked rear stalls. Clear views from elevated rear positions. Some seats under the dress circle overhang." },
      "Dress Circle Centre":       { score: 4.4, notes: "Excellent dress circle views. The restored auditorium is elegant and well-proportioned throughout." },
      "Dress Circle Side":         { score: 3.2, notes: "Side positions angle away from the stage. Outer seats can feel removed from the action." },
      "Upper Circle Centre":       { score: 3.8, notes: "Good value elevated views. Well-raked upper circle with clear centre sightlines." },
      "Upper Circle Side":         { score: 2.9, notes: "Angle and height create restricted views from outer upper circle positions." },
      "Boxes":                     { score: 2.9, notes: "Traditional boxes with restricted views. Atmospheric but expect to see only a portion of the staging." },
    }
  },

  "shaftesbury theatre": {
    overall: 3.8, capacity: 1408,
    sections: {
      "Stalls Centre (Rows A–N)":  { score: 4.4, notes: "Good large house. Solid rake and all centre positions are strong. Rows F–L are the prime positions." },
      "Stalls Side":               { score: 3.2, notes: "Wide house means side stalls suffer from restricted views to the opposite side of the stage." },
      "Stalls Rear":               { score: 3.5, notes: "Good rake continues through the rear stalls but distance increases significantly. Binoculars recommended for Rows O and beyond." },
      "Dress Circle Centre":       { score: 4.1, notes: "Good elevated views. Well-raked and the centre rows give a clear panoramic view of the full stage." },
      "Dress Circle Side":         { score: 2.9, notes: "Width and circle angle create poor sightlines at the outer extremes of the dress circle." },
      "Upper Circle Centre":       { score: 3.7, notes: "Elevated centre views. Good for spectacle shows. Well-raked with clear centre sightlines." },
      "Upper Circle Side":         { score: 2.7, notes: "Poor sightlines from the outer upper circle. Combination of height, width, and angle creates very restricted views." },
      "Balcony":                   { score: 3.0, notes: "Very steep and high. Centre balcony seats have clear if distant views. Not recommended for those uncomfortable with heights." },
    }
  },

  "theatre royal drury lane": {
    overall: 3.9, capacity: 2196,
    sections: {
      "Stalls Centre (Rows A–Q)":  { score: 4.4, notes: "Britain's largest West End theatre with surprisingly good centre stalls. Famous deep auditorium is well-raked. Rows H–N centre are the classic prime positions. Front rows A–E involve neck strain." },
      "Stalls Side":               { score: 3.1, notes: "Immense width means side stalls suffer significantly. Victorian pillar obstructions affect some outer side column positions." },
      "Stalls Rear":               { score: 3.3, notes: "Very long auditorium — binoculars recommended beyond Row P. Good rake but the distance is significant." },
      "Royal Circle Centre":       { score: 4.1, notes: "Well-positioned royal circle with good elevated views. Centre positions give a panoramic view of the full stage." },
      "Royal Circle Side":         { score: 2.9, notes: "Horseshoe design means side positions angle significantly. Outer seats lose one side of the stage." },
      "Grand Circle Centre":       { score: 3.7, notes: "High but clear views from the centre. Good for spectacle shows. Binoculars helpful." },
      "Grand Circle Side":         { score: 2.6, notes: "Poor views from the outer grand circle. Not recommended." },
      "Upper Circle / Balcony":    { score: 3.2, notes: "Very high and distant. Centre positions have clear views but the stage appears small. Budget-conscious option only." },
      "Boxes":                     { score: 2.7, notes: "Atmospheric and historically famous, but the viewing experience is limited to one side of the stage." },
    }
  },

  "vaudeville theatre": {
    overall: 4.0, capacity: 690,
    sections: {
      "Stalls Centre (Rows A–K)":  { score: 4.6, notes: "Intimate Victorian house with excellent centre stalls. Good rake and all centre positions feel close to the stage. Rows D–H are particularly strong." },
      "Stalls Side":               { score: 3.5, notes: "Modest restrictions at the outer sides. The intimate house scale makes these less severe than in larger theatres." },
      "Stalls Rear":               { score: 3.9, notes: "Well-raked rear stalls with clear views. Intimate house means rear stalls remain relatively close to the stage." },
      "Dress Circle Centre":       { score: 4.4, notes: "Excellent dress circle with clear elevated views. Well-raked and all centre positions face the stage directly." },
      "Dress Circle Side":         { score: 3.3, notes: "Some restriction at the outer sides. The modest width keeps this manageable." },
      "Upper Circle":              { score: 3.8, notes: "Small but well-raked upper circle. Centre positions give clear if elevated views. Good value seats." },
      "Slips":                     { score: 2.8, notes: "Extreme side positions are significantly restricted at every level. Only suitable for those comfortable with a partial view." },
    }
  },

  "victoria palace theatre": {
    overall: 3.9, capacity: 1565,
    sections: {
      "Stalls Centre (Rows A–N)":  { score: 4.5, notes: "Beautifully refurbished house (home of Hamilton). Well-configured with a solid rake. Rows F–L centre are the prime positions. The thrust configuration gives good views from centre positions throughout." },
      "Stalls Side":               { score: 3.4, notes: "Recent refurbishment improved sightlines but the width still creates challenges for the outermost seats." },
      "Stalls Rear":               { score: 3.8, notes: "Good rake continues through the rear stalls. Rows O and beyond are quite far but well-elevated." },
      "Dress Circle Centre":       { score: 4.4, notes: "Excellent dress circle. Well-raked and the centre positions face the stage directly. Row A dress circle is exceptional." },
      "Dress Circle Side":         { score: 3.2, notes: "Side positions angle away from the stage. Outer seats can miss one side of the staging." },
      "Grand Circle Centre":       { score: 4.0, notes: "Good elevated views. The well-raked auditorium makes the grand circle more comfortable than in many houses." },
      "Grand Circle Side":         { score: 2.9, notes: "Outer grand circle positions are restricted. Height and angle create viewing challenges." },
      "Upper Slips / Balcony":     { score: 3.1, notes: "Very high but centre positions have clear if distant views. Steep rake can feel vertiginous." },
    }
  },

  "wyndham's theatre": {
    overall: 4.0, capacity: 759,
    sections: {
      "Stalls Centre (Rows A–L)":  { score: 4.6, notes: "Intimate Edwardian house with excellent centre stalls. Good rake and all centre positions feel close and engaged. Rows E–I are the sweet spot." },
      "Stalls Side":               { score: 3.5, notes: "Modest restrictions at the outer sides. The moderate width keeps these manageable." },
      "Stalls Rear":               { score: 3.9, notes: "Well-raked rear stalls with clear views. Intimate scale means rear stalls remain reasonably close to the stage." },
      "Dress Circle Centre":       { score: 4.5, notes: "Outstanding dress circle. Well-raked and all centre positions face the stage directly. Row A is one of the best seats for intimate drama." },
      "Dress Circle Side":         { score: 3.4, notes: "Some restriction at the outer sides but the moderate width keeps this manageable." },
      "Upper Circle Centre":       { score: 4.0, notes: "Well-raked upper circle with good centre views. Better value than many comparable West End venues." },
      "Upper Circle Side":         { score: 3.0, notes: "Angle and height create restricted views from outer upper circle positions." },
      "Balcony":                   { score: 3.3, notes: "Small steep balcony. Centre positions have clear if distant views. Good value for the budget-conscious." },
    }
  },

  // ── NATIONAL / SUBSIDISED ──────────────────────────────────────────────────

  "national theatre": {
    overall: 4.3, capacity: 1160,
    sections: {
      "Olivier — Stalls Centre (Rows A–L)":  { score: 4.7, notes: "The Olivier's open-stage fan configuration means centre stalls are excellent throughout. Rows D–J feel close and immersed. The fan shape ensures good sightlines from a wide central area with no proscenium to interrupt." },
      "Olivier — Stalls Side":               { score: 3.9, notes: "More forgiving of side positions than a traditional proscenium. Good sightlines from side stalls, though the angled stage perspective is different from centre. Very outer positions beyond Row E can feel slightly removed." },
      "Olivier — Stalls Rear":               { score: 4.1, notes: "Steep rake keeps rear positions clear. Rows M–R benefit from the excellent elevation and the open stage is still seen in full from the rear." },
      "Olivier — Circle Centre":             { score: 4.5, notes: "Well-raked with a clear panoramic view of the open stage from centre positions. The absence of a proscenium arch means the full stage picture is visible without obstruction." },
      "Olivier — Circle Side":               { score: 3.8, notes: "Height increases the angle but the open stage means less blocking than in a traditional proscenium house. Still manageable from most positions." },
      "Olivier — Upper Circle Centre":       { score: 4.2, notes: "High but well-raked. The open-stage design means the full picture is visible. Good panoramic overview and good value." },
      "Olivier — Upper Circle Side":         { score: 3.3, notes: "Combination of height and angle can restrict views of one side of the open stage. Less severe than in a proscenium house but still noticeable." },
    }
  },

  "lyttelton theatre": {
    overall: 4.3, capacity: 890,
    sections: {
      "Stalls Centre (Rows A–K)":  { score: 4.7, notes: "Proscenium stage perfectly configured for the stalls. Excellent rake and all centre positions within Rows A–K are outstanding. The intimate scale creates a close, engaged feeling." },
      "Stalls Side":               { score: 3.8, notes: "Good design mitigates side restriction well. The outer stalls positions are more forgiving than in many proscenium theatres." },
      "Stalls Rear":               { score: 4.1, notes: "Well-raked rear stalls with clear views. The NT's excellent acoustic means dialogue carries well to rear positions." },
      "Circle Centre":             { score: 4.5, notes: "Excellent circle views. Well-raked and all centre positions face the stage directly. Row A circle is among the best seats in London for drama." },
      "Circle Side":               { score: 3.6, notes: "Some restriction in the outer extremes but the house's good proportions keep this less severe than in many theatres." },
      "Rear Circle":               { score: 4.0, notes: "Better than many upper circles. Clear views from centre positions with a panoramic angle over the full stage." },
    }
  },

  "dorfman theatre": {
    overall: 4.5, capacity: 400,
    sections: {
      "Flexible Stalls":  { score: 4.6, notes: "Flexible studio space that reconfigures for each production. In standard configurations all positions are within 15 m of the stage. Sightlines are invariably excellent across thrust, traverse, and in-the-round configurations." },
      "Gallery":          { score: 4.3, notes: "The gallery wraps around in some configurations. Views are typically excellent and the intimate scale ensures proximity to the performance throughout." },
      "Side Positions":   { score: 4.0, notes: "In traverse and in-the-round configurations side positions are integral to the design — engaged and central to the action. In proscenium configurations some side restriction applies." },
    }
  },

  "barbican theatre": {
    overall: 4.0, capacity: 1156,
    sections: {
      "Stalls Centre (Rows A–L)":  { score: 4.5, notes: "Wide proscenium stage well-served by the centre stalls. Excellent rake keeps all positions clear. Rows E–J are the prime positions for drama and opera." },
      "Stalls Side":               { score: 3.5, notes: "Wide stage means outer side seats can lose portions of the stage on the far side." },
      "Stalls Rear":               { score: 4.0, notes: "Well-raked rear stalls with excellent views. Rows M–Q are clear and well-elevated. Good acoustic design means dialogue carries well." },
      "Circle Centre":             { score: 4.4, notes: "Good elevated views. Well-raked and all centre positions face the stage directly. Particularly good for opera and large-scale drama." },
      "Circle Side":               { score: 3.3, notes: "Concrete pillars obstruct some outer circle positions. Check individual seat maps — some outer positions have significant obstructions." },
      "Upper Circle Centre":       { score: 4.0, notes: "Well-raked upper circle with clear centre views. Better than many comparable venues. Good value." },
      "Upper Circle Side":         { score: 3.0, notes: "Pillar obstructions affect some outer upper circle positions. Check seat plans carefully before booking." },
    }
  },

  "almeida theatre": {
    overall: 4.6, capacity: 325,
    sections: {
      "Stalls Centre (Rows A–I)":  { score: 4.9, notes: "One of London's finest small theatres. The intimate studio space means virtually every stalls seat is outstanding. Rows B–F are the sweet spot — close, centred, and immersive. Excellent rake ensures clear views from all positions." },
      "Stalls Side":               { score: 4.4, notes: "Even side stalls are excellent in this intimate house. The small scale keeps all positions within a close range and the viewing angle is entirely manageable." },
      "Stalls Rear":               { score: 4.3, notes: "Elevated and clear. The intimate house means rear stalls are still very close to the stage relative to larger venues." },
      "Circle Centre":             { score: 4.5, notes: "Small circle with excellent elevated views. Close to the stage and well-raked. All centre positions are excellent." },
      "Circle Side":               { score: 4.0, notes: "Even side circle positions are strong in this intimate house. No position is very far from the action." },
    }
  },

  "donmar warehouse": {
    overall: 4.7, capacity: 251,
    sections: {
      "Stalls Centre (Rows A–G)":  { score: 4.9, notes: "One of the most intimate theatrical experiences in London. Virtually every seat is excellent. Centre stalls feel extremely close to the performers — almost claustrophobically so in intense productions. Row A is outstanding." },
      "Stalls Side":               { score: 4.6, notes: "Even the side stalls are excellent in this tiny house. The small scale means all positions remain within close range of the stage. No seat here is a poor one." },
      "Gallery":                   { score: 4.3, notes: "Narrow gallery wraps around the stage. Views are good — slightly elevated and still close. Steep rake means clear sightlines throughout." },
      "Front Bench":               { score: 4.7, notes: "When available, the front bench is the most intimate seating in the house. Extremely close to the performers but requires looking upward and may miss overhead lighting effects." },
    }
  },

  "young vic": {
    overall: 4.5, capacity: 420,
    sections: {
      "Main House Stalls (Thrust)": { score: 4.7, notes: "Thrust stage configuration means audiences on all three sides have an engaged, close experience. Rows A–E are particularly intimate and immersive." },
      "Main House Circle":          { score: 4.4, notes: "Elevated circle wraps around the thrust stage. Views are excellent from all circle positions — the proximity and elevation create a strong overview of the full production." },
      "Side Rows (Stalls)":         { score: 4.3, notes: "Three-sided staging means side positions are engaged and central to the action rather than marginalised. A distinctive and immersive perspective." },
      "Rear Stalls":                { score: 4.2, notes: "Elevated and the thrust stage ensures the action comes toward the audience. Good views from all rear positions." },
    }
  },

  "old vic": {
    overall: 4.2, capacity: 1000,
    sections: {
      "Stalls Centre (Rows A–L)":  { score: 4.7, notes: "One of the finest stalls experiences in London. The Old Vic's horseshoe design with steep rake creates intimate views from centre stalls throughout. Rows D–J are particularly strong." },
      "Stalls Side":               { score: 3.7, notes: "The horseshoe design handles side stalls better than many Victorian theatres. Side positions are still engaging." },
      "Stalls Rear":               { score: 4.0, notes: "Good steep rake. Intimate house means rear stalls are still relatively close to the stage." },
      "Dress Circle Centre":       { score: 4.6, notes: "Exceptional dress circle. Steep horseshoe rake puts all centre positions in an ideal position. Row A dress circle is one of the best seats in London." },
      "Dress Circle Side":         { score: 3.5, notes: "The horseshoe curves sharply at the sides. Outer positions can feel removed from the action." },
      "Upper Circle Centre":       { score: 4.2, notes: "Well-raked upper circle with an imposing but clear view of the full stage. Steep rake is vertiginous but views are excellent from centre." },
      "Upper Circle Side":         { score: 3.3, notes: "The horseshoe shape means outer upper circle seats face significantly across the stage." },
      "Balcony / Gallery":         { score: 3.5, notes: "Very steep and high. Centre positions have surprisingly good views for the price. The Old Vic's steep rake makes the gallery more manageable than in many theatres." },
    }
  },

  "royal court theatre": {
    overall: 4.4, capacity: 400,
    sections: {
      "Stalls Centre (Rows A–J)":  { score: 4.8, notes: "The Royal Court's intimate proscenium stage makes the stalls outstanding. Front rows feel extremely close and immersive. Rows C–G are the prime positions. Excellent rake means clear views from all stalls positions." },
      "Stalls Side":               { score: 4.0, notes: "Even side stalls are strong in this intimate house. The small auditorium keeps all seats within a close range and the viewing angle is manageable throughout." },
      "Dress Circle Centre":       { score: 4.5, notes: "Excellent elevated views from the centre dress circle. The intimate house scale makes the circle feel close to the stage. Row A is exceptional." },
      "Dress Circle Side":         { score: 3.7, notes: "The intimate house means side dress circle positions are more forgiving than in larger theatres." },
      "Upper Slips":               { score: 3.2, notes: "Heavily angled — views are restricted to one side of the stage. Very cheap but only suitable for those comfortable with a partial view." },
    }
  },

  "hackney empire": {
    overall: 3.9, capacity: 1280,
    sections: {
      "Stalls Centre (Rows A–L)":  { score: 4.5, notes: "Beautifully restored Victorian music hall with excellent centre stalls. Good rake and the ornate auditorium creates a wonderful atmosphere. Rows E–J are the prime positions." },
      "Stalls Side":               { score: 3.3, notes: "Victorian horseshoe design means side stalls have some restriction. Outer positions angle toward the stage but the extremes can lose one side of the stage picture." },
      "Stalls Rear":               { score: 3.7, notes: "Good rake with clear views. Intimate house scale means rear stalls are still relatively close to the stage." },
      "Dress Circle Centre":       { score: 4.3, notes: "A highlight of this Victorian house. Well-raked and centre positions give excellent elevated views. The ornate circle rail adds to the atmosphere." },
      "Dress Circle Side":         { score: 3.2, notes: "The horseshoe shape means side dress circle positions angle significantly. Outer seats can lose one side of the stage." },
      "Upper Circle Centre":       { score: 3.8, notes: "Well-raked upper circle with clear centre views. Victorian rake is steep but the views are good from centre positions." },
      "Upper Circle Side":         { score: 2.9, notes: "Horseshoe and height combine to create poor sightlines at the outer extremes." },
      "Gallery":                   { score: 3.4, notes: "Very steep and high. Centre gallery positions have clear if distant views. The Hackney Empire's steep rake makes the gallery more manageable than many Victorian houses." },
    }
  },

  "lyric hammersmith": {
    overall: 4.2, capacity: 550,
    sections: {
      "Stalls Centre (Rows A–J)":  { score: 4.6, notes: "Good mid-size house with excellent centre stalls. Well-proportioned auditorium with a solid rake. Rows D–H are the prime positions." },
      "Stalls Side":               { score: 3.7, notes: "Moderate restrictions at the outer sides. The house's proportions keep this manageable." },
      "Stalls Rear":               { score: 4.0, notes: "Good rake continues through the rear stalls with clear views from all elevated rear positions." },
      "Circle Centre":             { score: 4.4, notes: "Excellent elevated views from the centre circle. Well-raked and all centre positions face the stage directly. Row A is particularly recommended." },
      "Circle Side":               { score: 3.5, notes: "Some restriction at the outer sides. The moderate width keeps this manageable." },
    }
  },

  // ── OPERA / CLASSICAL ─────────────────────────────────────────────────────

  "royal opera house": {
    overall: 4.0, capacity: 2256,
    sections: {
      "Stalls Centre (Rows A–P)":  { score: 4.5, notes: "Well-raked with perfect sightlines from the centre. Rows F–N are the classic prime seats. Front rows A–D are close but the orchestra pit means singers are elevated — can cause neck strain." },
      "Stalls Side":               { score: 3.2, notes: "Wide house — outer positions can miss the far side of the stage. Victorian pillar obstructions affect some outer side seats." },
      "Stalls Rear":               { score: 3.7, notes: "Good rake in the rear stalls with clear views. Some back-row seats sit under the amphitheatre overhang." },
      "Grand Tier / Amphitheatre Centre": { score: 4.3, notes: "Excellent elevated views of the full stage. Well-raked and the centre positions give a panoramic perspective perfect for ballet where the floor patterns matter." },
      "Grand Tier Side / Slips":   { score: 3.0, notes: "Famous ROH side slips — some positions see only a narrow portion of the stage. Check individual seat plans before booking any slip position." },
      "Balcony Centre":            { score: 3.8, notes: "Good elevated view of the full stage — particularly valuable for ballet. Well-raked centre positions are clear." },
      "Balcony Side":              { score: 2.6, notes: "Extreme angle and height create heavily restricted views. Not recommended." },
      "Boxes (Grand Tier)":        { score: 3.2, notes: "Partial view of the stage but excellent atmosphere. Front box positions are significantly better than rear box positions." },
      "Boxes (Balcony Level)":     { score: 2.8, notes: "More restricted than grand tier boxes. Good for atmosphere and seeing the audience; poor for production sightlines." },
      "Side Slips (All Levels)":   { score: 2.4, notes: "The most restricted seats in the house. Visibility is limited to a narrow portion of the stage. Only suitable as a last resort or for audio-focused listening." },
    }
  },

  "london coliseum": {
    overall: 3.9, capacity: 2350,
    sections: {
      "Stalls Centre (Rows A–P)":  { score: 4.4, notes: "One of London's largest theatres. Well-configured centre stalls with a good rake. Rows G–M are the classic prime positions. Front rows A–D have a close view of the orchestra pit." },
      "Stalls Side":               { score: 3.1, notes: "Immense width means outer stalls suffer significantly. Victorian pillar obstructions in the outer columns." },
      "Stalls Rear":               { score: 3.3, notes: "Very long auditorium — binoculars strongly recommended beyond Row Q." },
      "Dress Circle Centre":       { score: 4.2, notes: "Good elevated views. Well-raked and centre positions give a clear panoramic perspective. Good for opera where the full stage picture matters." },
      "Dress Circle Side":         { score: 2.8, notes: "Wide house combined with the circle angle creates poor sightlines from side dress circle positions." },
      "Upper Circle Centre":       { score: 3.7, notes: "Elevated centre views. Better than many large opera houses. Good value seats with clear sightlines." },
      "Upper Circle Side":         { score: 2.5, notes: "Side upper circle positions are poor. Width, angle, and height combine badly." },
      "Balcony Centre":            { score: 3.3, notes: "Very high but centre positions have clear views. The Coliseum's excellent acoustic makes this a popular choice for audio-first opera-goers." },
      "Balcony Side":              { score: 2.2, notes: "The worst seats in the house. Extreme angle and height with very restricted sightlines. Avoid." },
    }
  },

  // ── DANCE & SPECIALIST ─────────────────────────────────────────────────────

  "sadler's wells": {
    overall: 4.1, capacity: 1571,
    sections: {
      "Stalls Centre (Rows A–M)":  { score: 4.6, notes: "Purpose-built dance theatre with excellent centre stalls. Dance-optimised sightlines ensure the stage floor is clearly visible from centre — essential for seeing footwork and floor-based choreography. Rows E–J are the prime positions." },
      "Stalls Side":               { score: 3.5, notes: "The wider stage (designed for dance) means outer positions are more affected than in a compact drama theatre. Side stalls can miss width of the dance floor." },
      "Stalls Rear":               { score: 3.9, notes: "Good rake. Elevated rear positions are good for seeing the full stage picture and the floor patterns of dance choreography." },
      "Circle Centre":             { score: 4.4, notes: "Excellent elevated views. The height is ideal for seeing the full choreographic picture — particularly valuable for contemporary dance and ballet." },
      "Circle Side":               { score: 3.3, notes: "Side circle positions lose some of the width of the stage. For dance this can mean missing important choreography at the extremes." },
      "Upper Circle Centre":       { score: 4.0, notes: "Dance-optimised design means the stage floor is visible even from the upper circle — a major advantage for ballet and contemporary dance." },
      "Upper Circle Side":         { score: 2.9, notes: "Combination of height and angle creates poor sightlines for dance from the outer upper circle." },
    }
  },

  "peacock theatre": {
    overall: 3.9, capacity: 1000,
    sections: {
      "Stalls Centre (Rows A–K)":  { score: 4.5, notes: "Good mid-size house with excellent centre stalls. Well-raked with clear sightlines. Rows D–I are the prime positions." },
      "Stalls Side":               { score: 3.5, notes: "Moderate restrictions at the outer sides. The house's proportions keep this manageable." },
      "Stalls Rear":               { score: 3.9, notes: "Good rake continues through the rear stalls with clear views from elevated rear positions." },
      "Circle Centre":             { score: 4.3, notes: "Well-positioned circle with clear elevated views. All centre positions face the stage directly." },
      "Circle Side":               { score: 3.2, notes: "Some restriction at the outer sides of the circle. Worth checking individual seat plans." },
      "Upper Circle":              { score: 3.7, notes: "Well-raked upper circle with clear centre views. Good value for money." },
    }
  },

  // ── OUTDOOR ────────────────────────────────────────────────────────────────

  "regent's park open air theatre": {
    overall: 4.3, capacity: 1240,
    sections: {
      "Stalls Centre (Rows A–L)":  { score: 4.7, notes: "Magical setting. Centre stalls are excellent — well-raked with clear sightlines and close proximity to the stage. The outdoor setting and overhanging trees create an unmatchable atmosphere. Rows D–I are the sweet spot." },
      "Stalls Side":               { score: 4.0, notes: "The theatre's gentle curvature keeps most side positions engaged. The wider rows create a less confined experience than in an indoor theatre." },
      "Stalls Rear":               { score: 4.1, notes: "Good rake with clear views. The open-air setting means rear stalls don't feel claustrophobic. Bring layers — it can get cold after dark even in summer." },
      "Circle Centre":             { score: 4.4, notes: "Elevated circle gives excellent views of the full stage and the park setting beyond. Well-raked with clear sightlines from centre positions." },
      "Circle Side":               { score: 3.7, notes: "Side circle positions have moderate restrictions. The open-air setting and the curved design keep most positions engaged." },
      "Rear Circle / Exposed Area": { score: 3.8, notes: "Fully exposed to the elements. Clear views but weather-dependent. Binoculars helpful for facial detail at this distance." },
    }
  },

  // ── OUTER LONDON ───────────────────────────────────────────────────────────

  "richmond theatre": {
    overall: 4.0, capacity: 855,
    sections: {
      "Stalls Centre (Rows A–K)":  { score: 4.5, notes: "Beautiful Victorian theatre with excellent centre stalls. Good rake and the intimate scale creates an engaging atmosphere. Rows D–H are the prime positions." },
      "Stalls Side":               { score: 3.5, notes: "Some Victorian pillar restrictions at the outer sides. The intimate scale keeps this manageable." },
      "Dress Circle Centre":       { score: 4.4, notes: "Excellent dress circle views. Well-raked and the centre positions give a clear elevated angle. Row A is outstanding." },
      "Dress Circle Side":         { score: 3.3, notes: "Side dress circle seats angle away. Some restriction at the outer extremes." },
      "Upper Circle Centre":       { score: 3.9, notes: "Good views from the upper circle centre. Well-raked with clear sightlines. Good value." },
      "Upper Circle Side":         { score: 3.0, notes: "Some restriction at the outer sides. Less severe than in larger Victorian theatres." },
    }
  },

  "rose theatre kingston": {
    overall: 4.3, capacity: 840,
    sections: {
      "Stalls Centre (Rows A–J)":  { score: 4.7, notes: "Modern purpose-built theatre with excellent sightlines. The rake is well-designed and all centre positions within Rows A–J are strong. Rows D–H are the sweet spot." },
      "Stalls Side":               { score: 4.0, notes: "Modern design means side stalls are better than in many Victorian houses. Designed with excellent sight lines throughout." },
      "Stalls Rear":               { score: 4.2, notes: "Good rake continues through the rear stalls with clear views from all elevated rear positions." },
      "Circle Centre":             { score: 4.5, notes: "Well-designed circle with clear elevated views. Modern rake and proportions make the circle excellent throughout the centre." },
      "Circle Side":               { score: 3.8, notes: "Modern design keeps circle side restrictions to a minimum. Still some angle at the extremes but manageable." },
    }
  },

  "eventim apollo": {
    overall: 3.0, capacity: 5039,
    sections: {
      "Stalls Centre (Rows A–N)":  { score: 3.9, notes: "For a large venue the centre stalls are reasonable. The gentle slope keeps rear rows visible, but the low rake means rows behind L can have obstructed views from tall audience members in front." },
      "Stalls Side":               { score: 2.8, notes: "Wide venue with a low rake. Side stalls suffer from poor angles and sightline obstructions. Avoid for any production requiring detailed staging." },
      "Stalls Rear":               { score: 2.7, notes: "Very shallow rake means rear stalls are significantly affected by people in front. The back ten rows have poor sightlines and significant distance. Binoculars essential." },
      "Circle Centre":             { score: 3.5, notes: "Elevated views help in this large venue. Centre circle gives a good overview but the distance and scale of the production is reduced." },
      "Circle Side":               { score: 2.5, notes: "Poor sightlines. Width and angle combine badly. Not recommended." },
      "Balcony":                   { score: 2.8, notes: "Very high and distant. Only for concerts where audio is the priority. Not suitable for theatre productions requiring visual detail." },
    }
  },

};

// ── Lookup helper ─────────────────────────────────────────────────────────────
// Returns the sightline data object for a venue name, or null if not found.
export function getSightlineData(venueName) {
  if (!venueName) return null;
  const v = venueName.toLowerCase().trim();

  // 1. Direct match
  if (SIGHTLINE_DATA[v]) return SIGHTLINE_DATA[v];

  // 2. Key is contained in venue name or vice versa
  for (const key of Object.keys(SIGHTLINE_DATA)) {
    if (v.includes(key) || key.includes(v)) return SIGHTLINE_DATA[key];
  }

  // 3. Word overlap — share at least one meaningful word
  const STOP = new Set(["theatre","the","london","royal","new","old"]);
  const vWords = v.split(/\s+/).filter(w => w.length > 3 && !STOP.has(w));
  for (const key of Object.keys(SIGHTLINE_DATA)) {
    const kWords = key.split(/\s+/).filter(w => w.length > 3 && !STOP.has(w));
    if (vWords.length > 0 && vWords.some(w => kWords.includes(w))) {
      return SIGHTLINE_DATA[key];
    }
  }

  return null;
}

// Returns the best-matching section for a given seat type string, or null.
export function getSectionForSeatType(sightlineData, seatType) {
  if (!sightlineData || !seatType || seatType === "Any") return null;
  const st = seatType.toLowerCase();
  const sections = Object.keys(sightlineData.sections);
  for (const s of sections) {
    const sl = s.toLowerCase();
    if (st.includes("stalls") && sl.includes("stalls") && sl.includes("centre")) return s;
    if (st.includes("circle") && !st.includes("upper") && sl.includes("circle") && sl.includes("centre")) return s;
    if (st.includes("upper") && sl.includes("upper")) return s;
    if (st.includes("balcony") && sl.includes("balcony")) return s;
    if (st.includes("gallery") && sl.includes("gallery")) return s;
    if (st.includes("box") && sl.includes("box")) return s;
    if (st.includes("pit") && sl.includes("pit")) return s;
  }
  return null;
}
