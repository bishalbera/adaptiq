
import { Question, Subject } from "@/types";

// Auto-increment ID generator
let questionId = 0;
const generateId = () => `jee-${++questionId}`;

const physicsQuestions: Question[] = [
  // KINEMATICS - Medium/Hard (Real JEE Questions)
  {
    id: generateId(),
    subject: "physics",
    topic: "Kinematics",
    subtopic: "Motion in 1D",
    difficulty: 3,
    text: "A piece of wood of mass 0.03 kg is dropped from the top of a 100 m height building. At the same time, a bullet of mass 0.02 kg is fired vertically upward with a velocity 100 m/s from the ground. The bullet gets embedded in the wood. The maximum height to which the combined system reaches above the top of the building before falling below is: (g = 10 m/s²)",
    options: {
      a: "10 m",
      b: "30 m",
      c: "20 m",
      d: "40 m",
    },
    correctAnswer: "d",
    explanation:
      "Using conservation of momentum at collision point and kinematic equations, the combined system rises 40 m above the building top.",
    commonMistake:
      "Students forget to account for the velocities of both objects at the collision point.",
  },
  {
    id: generateId(),
    subject: "physics",
    topic: "Kinematics",
    subtopic: "Relative Motion",
    difficulty: 2,
    text: "A passenger train of length 60 m travels at a speed of 80 km/hr. Another freight train of length 120 m travels at a speed of 30 km/hr. The ratio of times taken by the passenger train to completely cross the freight train when: (i) they are moving in the same direction, and (ii) in the opposite direction is:",
    options: {
      a: "25/11",
      b: "3/2",
      c: "5/2",
      d: "11/5",
    },
    correctAnswer: "d",
    explanation:
      "Total length = 180m. Same direction: relative speed = 50 km/hr. Opposite: relative speed = 110 km/hr. Ratio = 110/50 = 11/5.",
    commonMistake:
      "Students often forget to add both train lengths for the total distance to cross.",
  },
  {
    id: generateId(),
    subject: "physics",
    topic: "Kinematics",
    subtopic: "Motion in 1D",
    difficulty: 2,
    text: "A car travelling at 40 km/h can stop in 40 m by applying brakes. If the same car is travelling at 80 km/h, the minimum stopping distance is:",
    options: {
      a: "100 m",
      b: "75 m",
      c: "160 m",
      d: "150 m",
    },
    correctAnswer: "c",
    explanation:
      "Stopping distance ∝ v². When speed doubles, stopping distance quadruples: 40 × 4 = 160 m.",
    commonMistake:
      "Students think stopping distance doubles with speed, but it actually quadruples (v² relationship).",
  },
  {
    id: generateId(),
    subject: "physics",
    topic: "Kinematics",
    subtopic: "Motion in 1D",
    difficulty: 3,
    text: "A parachutist after bailing out falls 50 m without friction. When parachute opens, it decelerates at 2 m/s². He reaches the ground with a speed of 3 m/s. At what height did he bail out? (g = 10 m/s²)",
    options: {
      a: "293 m",
      b: "111 m",
      c: "91 m",
      d: "182 m",
    },
    correctAnswer: "a",
    explanation:
      "After 50m free fall: v = √(2×10×50) = √1000 m/s. Then using v² = u² + 2as with deceleration to find remaining height, total = 293 m.",
    commonMistake:
      "Students forget the parachutist is decelerating (not accelerating) after the parachute opens.",
  },
  {
    id: generateId(),
    subject: "physics",
    topic: "Kinematics",
    subtopic: "Motion in 1D",
    difficulty: 2,
    text: "An automobile travelling with a speed of 60 km/h can brake to stop within a distance of 20 m. If the car is going twice as fast (120 km/h), the stopping distance will be:",
    options: {
      a: "20 m",
      b: "40 m",
      c: "60 m",
      d: "80 m",
    },
    correctAnswer: "d",
    explanation:
      "Stopping distance ∝ v². Double the speed means 4× the distance: 20 × 4 = 80 m.",
  },
  {
    id: generateId(),
    subject: "physics",
    topic: "Kinematics",
    subtopic: "Free Fall",
    difficulty: 2,
    text: "A ball is released from the top of a tower of height h metres. It takes T seconds to reach the ground. What is the position of the ball at T/3 seconds?",
    options: {
      a: "h/9 metres from the ground",
      b: "7h/9 metres from the ground",
      c: "8h/9 metres from the ground",
      d: "17h/18 metres from the ground",
    },
    correctAnswer: "c",
    explanation:
      "Distance fallen in T/3 = ½g(T/3)² = h/9. Position from ground = h - h/9 = 8h/9.",
    commonMistake:
      "Students calculate distance fallen but forget to subtract from total height.",
  },
  {
    id: generateId(),
    subject: "physics",
    topic: "Circular Motion",
    subtopic: "Uniform Circular Motion",
    difficulty: 2,
    text: "For a particle in uniform circular motion, which statement is FALSE?",
    options: {
      a: "The velocity vector is tangent to the circle",
      b: "The acceleration vector is tangent to the circle",
      c: "The acceleration vector points to the centre of the circle",
      d: "The velocity and acceleration vectors are perpendicular",
    },
    correctAnswer: "b",
    explanation:
      "In uniform circular motion, acceleration is centripetal (towards center), not tangential. Tangential acceleration only exists when speed changes.",
  },
  {
    id: generateId(),
    subject: "physics",
    topic: "Kinematics",
    subtopic: "Projectile Motion",
    difficulty: 2,
    text: "Two balls are thrown simultaneously from the top of a tower, one vertically upwards and another vertically downwards with the same speed. If they reach the ground with velocities vA and vB respectively, then:",
    options: {
      a: "vB > vA",
      b: "vA = vB",
      c: "vA > vB",
      d: "The answer depends on the mass of the balls",
    },
    correctAnswer: "b",
    explanation:
      "By energy conservation, both balls have the same speed when reaching ground level. The upward ball will return to tower height with the same speed it was thrown.",
  },
  {
    id: generateId(),
    subject: "physics",
    topic: "Kinematics",
    subtopic: "Motion in 1D",
    difficulty: 2,
    text: "A body loses half its velocity on penetrating 3 cm in a wooden block. How much will it penetrate more before coming to rest?",
    options: {
      a: "1 cm",
      b: "2 cm",
      c: "3 cm",
      d: "4 cm",
    },
    correctAnswer: "a",
    explanation:
      "Using v² = u² - 2as: After losing half velocity, (u/2)² = u² - 2a(3). For remaining: 0 = (u/2)² - 2a(x). Solving: x = 1 cm.",
    commonMistake:
      "Students assume linear relationship between velocity and distance.",
  },
  {
    id: generateId(),
    subject: "physics",
    topic: "Kinematics",
    subtopic: "Free Fall",
    difficulty: 1,
    text: "A student drops a pebble from the edge of a vertical cliff. The pebble hits the ground 4s after it was dropped. What is the velocity when it hits the ground? (g = 10 m/s²)",
    options: {
      a: "10 m/s",
      b: "20 m/s",
      c: "30 m/s",
      d: "40 m/s",
    },
    correctAnswer: "d",
    explanation: "Using v = u + gt = 0 + 10 × 4 = 40 m/s.",
  },
  {
    id: generateId(),
    subject: "physics",
    topic: "Kinematics",
    subtopic: "Displacement",
    difficulty: 1,
    text: "Can an object's average velocity be zero when the object's speed is greater than zero?",
    options: {
      a: "No, because velocity magnitude always equals speed",
      b: "Yes, when the object moves in a straight line at constant rate",
      c: "Yes, when the object returns to its original position",
      d: "No, they are always equal",
    },
    correctAnswer: "c",
    explanation:
      "Average velocity = displacement/time. If an object returns to its starting point, displacement is zero, making average velocity zero even though speed was non-zero throughout.",
  },
  {
    id: generateId(),
    subject: "physics",
    topic: "Kinematics",
    subtopic: "Free Fall",
    difficulty: 1,
    text: "On a planet with no air resistance, a police officer drops a pair of handcuffs and a handkerchief from the same height at the same time. Which one will reach the ground first?",
    options: {
      a: "The handcuffs",
      b: "The handkerchief",
      c: "They will both hit the ground at the same time",
      d: "It depends on the height",
    },
    correctAnswer: "c",
    explanation:
      "Without air resistance, all objects fall at the same rate regardless of mass (Galileo's principle). Both hit ground simultaneously.",
  },
  {
    id: generateId(),
    subject: "physics",
    topic: "Vectors",
    subtopic: "Scalars and Vectors",
    difficulty: 1,
    text: "Which one of the following physical quantities cannot be represented by a scalar?",
    options: {
      a: "Mass",
      b: "Momentum",
      c: "Length",
      d: "Magnitude of acceleration",
    },
    correctAnswer: "b",
    explanation:
      "Momentum is a vector quantity (has both magnitude and direction). Mass, length, and magnitude of acceleration are all scalars.",
  },
  {
    id: generateId(),
    subject: "physics",
    topic: "Kinematics",
    subtopic: "Motion in 1D",
    difficulty: 1,
    text: "If a particle has negative velocity and negative acceleration, its speed:",
    options: {
      a: "Is zero",
      b: "Increases",
      c: "Decreases",
      d: "Remains the same",
    },
    correctAnswer: "b",
    explanation:
      "When velocity and acceleration have the same sign (both negative), they are in the same direction, so speed increases.",
    commonMistake:
      "Students think negative acceleration always means slowing down, but it depends on the direction of velocity.",
  },
];

/**
 * CHEMISTRY QUESTIONS
 * Topics: Organic Chemistry, Periodic Table, Atomic Structure
 */
const chemistryQuestions: Question[] = [
  // ORGANIC CHEMISTRY
  {
    id: generateId(),
    subject: "chemistry",
    topic: "Organic Chemistry",
    subtopic: "Carboxylic Acids",
    difficulty: 2,
    text: "The vapour of a carboxylic acid HA when passed over MnO₂ at 573 K yields propanone. What is the acid HA?",
    options: {
      a: "Methanoic acid",
      b: "Propanoic acid",
      c: "Ethanoic acid",
      d: "Butanoic acid",
    },
    correctAnswer: "c",
    explanation:
      "Ethanoic acid (CH₃COOH) when passed over MnO₂ at high temperature undergoes ketonization to form propanone (acetone).",
  },
  {
    id: generateId(),
    subject: "chemistry",
    topic: "Organic Chemistry",
    subtopic: "Nucleophilic Substitution",
    difficulty: 2,
    text: "The correct order of increasing nucleophilicity is:",
    options: {
      a: "Br⁻ < Cl⁻ < I⁻",
      b: "Cl⁻ < Br⁻ < I⁻",
      c: "I⁻ < Br⁻ < Cl⁻",
      d: "I⁻ < Cl⁻ < Br⁻",
    },
    correctAnswer: "b",
    explanation:
      "In polar protic solvents, larger anions are better nucleophiles because they are less solvated. Size: I⁻ > Br⁻ > Cl⁻, so nucleophilicity: Cl⁻ < Br⁻ < I⁻.",
    commonMistake:
      "Students confuse nucleophilicity with basicity. In polar protic solvents, the trend reverses.",
  },
  {
    id: generateId(),
    subject: "chemistry",
    topic: "Organic Chemistry",
    subtopic: "Aromatic Compounds",
    difficulty: 1,
    text: "Para-xylene is the same as:",
    options: {
      a: "1,2-dimethylbenzene",
      b: "1,3-dimethylbenzene",
      c: "1,3-diethylbenzene",
      d: "1,4-dimethylbenzene",
    },
    correctAnswer: "d",
    explanation:
      "Para (p-) indicates substituents at positions 1 and 4. Xylene is dimethylbenzene. So para-xylene = 1,4-dimethylbenzene.",
  },
  {
    id: generateId(),
    subject: "chemistry",
    topic: "Organic Chemistry",
    subtopic: "Alcohols and Phenols",
    difficulty: 2,
    text: "Which is NOT a physical property of alcohols or phenols?",
    options: {
      a: "Phenols are generally only slightly soluble in water",
      b: "The hydroxyl group of an alcohol is nonpolar",
      c: "Solubilities of primary alcohols decrease with molecular weight",
      d: "Boiling points increase with molecular weight",
    },
    correctAnswer: "b",
    explanation:
      "The hydroxyl (-OH) group is polar due to the electronegativity difference between O and H, forming hydrogen bonds. It is NOT nonpolar.",
  },
  {
    id: generateId(),
    subject: "chemistry",
    topic: "Organic Chemistry",
    subtopic: "Separation Techniques",
    difficulty: 1,
    text: "Which method best separates a naphthalene and benzoic acid mixture?",
    options: {
      a: "Crystallisation",
      b: "Sublimation",
      c: "Chromatography",
      d: "Distillation",
    },
    correctAnswer: "b",
    explanation:
      "Naphthalene sublimes (converts directly from solid to gas) while benzoic acid does not sublime readily at the same conditions. Sublimation separates them efficiently.",
  },

  // PERIODIC TABLE & PERIODICITY
  {
    id: generateId(),
    subject: "chemistry",
    topic: "Periodic Table",
    subtopic: "Periodic Classification",
    difficulty: 1,
    text: "Which of the following forms the basis of the modern periodic table?",
    options: {
      a: "Number of nucleons",
      b: "Atomic mass",
      c: "Atomic number",
      d: "All of these",
    },
    correctAnswer: "c",
    explanation:
      "The modern periodic table is arranged by increasing atomic number (number of protons), not atomic mass as in Mendeleev's original table.",
  },
  {
    id: generateId(),
    subject: "chemistry",
    topic: "Periodic Table",
    subtopic: "Periodic Trends",
    difficulty: 2,
    text: "Which one is the most acidic among these oxides?",
    options: {
      a: "Na₂O",
      b: "MgO",
      c: "CaO",
      d: "Al₂O₃",
    },
    correctAnswer: "d",
    explanation:
      "Al₂O₃ is amphoteric but shows more acidic character compared to the basic oxides Na₂O, MgO, and CaO. Acidity of oxides increases across a period.",
  },
  {
    id: generateId(),
    subject: "chemistry",
    topic: "Periodic Table",
    subtopic: "Atomic Radius",
    difficulty: 1,
    text: "On moving from left to right in a periodic table, size of an atom:",
    options: {
      a: "Decreases",
      b: "Increases",
      c: "Does not change",
      d: "First increases then decreases",
    },
    correctAnswer: "a",
    explanation:
      "Across a period, nuclear charge increases but electrons are added to the same shell. Increased nuclear attraction pulls electrons closer, decreasing atomic radius.",
  },
  {
    id: generateId(),
    subject: "chemistry",
    topic: "Periodic Table",
    subtopic: "History",
    difficulty: 1,
    text: "The properties of eka-aluminium predicted by Mendeleev are the same as the properties of later discovered element:",
    options: {
      a: "Germanium",
      b: "Scandium",
      c: "Gallium",
      d: "Aluminium",
    },
    correctAnswer: "c",
    explanation:
      "Mendeleev predicted eka-aluminium (below aluminium). When Gallium was discovered in 1875, its properties matched Mendeleev's predictions remarkably well.",
  },
  {
    id: generateId(),
    subject: "chemistry",
    topic: "Periodic Table",
    subtopic: "Group Properties",
    difficulty: 1,
    text: "What is the other name for Group 18 elements?",
    options: {
      a: "Alkali earth metals",
      b: "Halogens",
      c: "Noble gases",
      d: "Alkali metals",
    },
    correctAnswer: "c",
    explanation:
      "Group 18 elements (He, Ne, Ar, Kr, Xe, Rn) are called noble gases due to their very low reactivity caused by their complete valence shells.",
  },
  {
    id: generateId(),
    subject: "chemistry",
    topic: "Periodic Table",
    subtopic: "Electron Affinity",
    difficulty: 2,
    text: "Which among the following has the lowest electron affinity?",
    options: {
      a: "Fluorine",
      b: "Chlorine",
      c: "Bromine",
      d: "Argon",
    },
    correctAnswer: "d",
    explanation:
      "Noble gases like Argon have complete valence shells and do not tend to gain electrons. Their electron affinity is essentially zero or slightly positive.",
  },
  {
    id: generateId(),
    subject: "chemistry",
    topic: "Periodic Table",
    subtopic: "Electronegativity",
    difficulty: 1,
    text: "The ability of an atom in a chemical compound to attract shared electrons is termed as:",
    options: {
      a: "Electron affinity",
      b: "Ionization enthalpy",
      c: "Atomic attraction",
      d: "Electronegativity",
    },
    correctAnswer: "d",
    explanation:
      "Electronegativity is the tendency of an atom to attract shared electrons in a chemical bond. It differs from electron affinity which is for isolated atoms.",
  },
  {
    id: generateId(),
    subject: "chemistry",
    topic: "Periodic Table",
    subtopic: "Periodic Trends",
    difficulty: 2,
    text: "Which of the following properties is inversely related to electronegativity?",
    options: {
      a: "Non-metallic properties",
      b: "Metalloid properties",
      c: "Ionic properties",
      d: "Metallic properties",
    },
    correctAnswer: "d",
    explanation:
      "Metals tend to lose electrons (low electronegativity) while non-metals gain electrons (high electronegativity). So metallic character is inversely related to electronegativity.",
  },
  {
    id: generateId(),
    subject: "chemistry",
    topic: "Periodic Table",
    subtopic: "Position of Elements",
    difficulty: 1,
    text: "In the Periodic Table, metallic elements appear:",
    options: {
      a: "In the left-hand columns",
      b: "In the top rows",
      c: "In the right-hand columns",
      d: "In the bottom rows",
    },
    correctAnswer: "a",
    explanation:
      "Metals are located on the left side and center of the periodic table. Non-metals are on the right side (except hydrogen).",
  },
  {
    id: generateId(),
    subject: "chemistry",
    topic: "Periodic Table",
    subtopic: "Group Trends",
    difficulty: 2,
    text: "The reactivity of non-metals within a group in the Periodic Table:",
    options: {
      a: "Increases down the group",
      b: "Decreases down the group",
      c: "First increases then decreases",
      d: "First decreases then increases",
    },
    correctAnswer: "b",
    explanation:
      "Non-metal reactivity depends on ability to gain electrons. Down a group, atomic size increases and electron gain becomes harder, so reactivity decreases.",
    commonMistake:
      "Students confuse this with metals, where reactivity increases down the group.",
  },
  {
    id: generateId(),
    subject: "chemistry",
    topic: "Periodic Table",
    subtopic: "Reactivity Series",
    difficulty: 2,
    text: "Which one among the following is the correct order of reactivity?",
    options: {
      a: "Cu > Mg > Zn > Na",
      b: "Na > Zn > Mg > Cu",
      c: "Cu > Zn > Mg > Na",
      d: "Na > Mg > Zn > Cu",
    },
    correctAnswer: "d",
    explanation:
      "Metal reactivity follows the reactivity series: Na (most reactive) > Mg > Zn > Cu (least reactive among these).",
  },
  {
    id: generateId(),
    subject: "chemistry",
    topic: "Periodic Table",
    subtopic: "Alkali Metals",
    difficulty: 1,
    text: "Which is the most reactive metal among these?",
    options: {
      a: "Sodium",
      b: "Calcium",
      c: "Iron",
      d: "Potassium",
    },
    correctAnswer: "d",
    explanation:
      "Among alkali metals, reactivity increases down the group. Potassium is below sodium in Group 1, making it more reactive.",
  },
  {
    id: generateId(),
    subject: "chemistry",
    topic: "Periodic Table",
    subtopic: "Alkali Metals",
    difficulty: 2,
    text: "The alkali metals have relatively low melting points. Which alkali metal is expected to have the highest melting point?",
    options: {
      a: "Li",
      b: "Na",
      c: "K",
      d: "Rb",
    },
    correctAnswer: "a",
    explanation:
      "Melting point decreases down Group 1 due to increasing atomic size and weaker metallic bonding. Lithium, being smallest, has the highest melting point.",
  },
  {
    id: generateId(),
    subject: "chemistry",
    topic: "Periodic Table",
    subtopic: "Diagonal Relationship",
    difficulty: 2,
    text: "Lithium's chemistry is similar to magnesium despite being in different groups because:",
    options: {
      a: "Both have the same ionic size",
      b: "The ratio of their charge to size is the same",
      c: "Both have the same electronic configuration",
      d: "Both are found in their native state",
    },
    correctAnswer: "b",
    explanation:
      "This is called the diagonal relationship. Li⁺ and Mg²⁺ have similar charge-to-radius ratios, giving them similar chemical properties.",
  },
  {
    id: generateId(),
    subject: "chemistry",
    topic: "Periodic Table",
    subtopic: "Ionic Size",
    difficulty: 2,
    text: "What effect on atom size occurs when an electron is removed versus when an electron is added?",
    options: {
      a: "Size increases and decreases respectively",
      b: "Size decreases and increases respectively",
      c: "Size increases in both cases",
      d: "Size decreases in both cases",
    },
    correctAnswer: "b",
    explanation:
      "Removing an electron forms a cation (smaller due to less electron-electron repulsion). Adding an electron forms an anion (larger due to more repulsion).",
  },
];

/**
 * MATHEMATICS QUESTIONS
 * Topics: Algebra, Calculus, Trigonometry, Coordinate Geometry
 */
const mathQuestions: Question[] = [
  // ALGEBRA - Quadratic Equations
  {
    id: generateId(),
    subject: "math",
    topic: "Algebra",
    subtopic: "Quadratic Equations",
    difficulty: 1,
    text: "If α and β are roots of the equation x² - 5x + 6 = 0, then the value of α + β is:",
    options: {
      a: "6",
      b: "5",
      c: "-5",
      d: "-6",
    },
    correctAnswer: "b",
    explanation:
      "For ax² + bx + c = 0, sum of roots = -b/a. Here, α + β = -(-5)/1 = 5.",
  },
  {
    id: generateId(),
    subject: "math",
    topic: "Algebra",
    subtopic: "Quadratic Equations",
    difficulty: 1,
    text: "The product of roots of the quadratic equation x² - 5x + 6 = 0 is:",
    options: {
      a: "5",
      b: "6",
      c: "-6",
      d: "-5",
    },
    correctAnswer: "b",
    explanation:
      "For ax² + bx + c = 0, product of roots = c/a. Here, αβ = 6/1 = 6.",
  },
  {
    id: generateId(),
    subject: "math",
    topic: "Algebra",
    subtopic: "Quadratic Equations",
    difficulty: 2,
    text: "If the roots of x² + px + q = 0 are in the ratio 2:3, which relation holds?",
    options: {
      a: "6p² = 25q",
      b: "6q² = 25p",
      c: "p² = 6q",
      d: "q² = 6p",
    },
    correctAnswer: "a",
    explanation:
      "Let roots be 2k and 3k. Sum = 5k = -p, Product = 6k² = q. From these: k = -p/5, so q = 6(p²/25) = 6p²/25. Thus 6p² = 25q.",
    commonMistake:
      "Students often set up the ratio incorrectly or make algebraic errors in elimination.",
  },
  {
    id: generateId(),
    subject: "math",
    topic: "Algebra",
    subtopic: "Quadratic Equations",
    difficulty: 2,
    text: "For what value of k does the equation x² - 4x + k = 0 have equal roots?",
    options: {
      a: "2",
      b: "4",
      c: "-4",
      d: "16",
    },
    correctAnswer: "b",
    explanation:
      "For equal roots, discriminant = 0. b² - 4ac = 0 → 16 - 4k = 0 → k = 4.",
  },
  {
    id: generateId(),
    subject: "math",
    topic: "Algebra",
    subtopic: "Quadratic Equations",
    difficulty: 3,
    text: "If one root of x² - 6x + k = 0 is double the other, find k:",
    options: {
      a: "4",
      b: "6",
      c: "8",
      d: "9",
    },
    correctAnswer: "c",
    explanation:
      "Let roots be α and 2α. Sum = 3α = 6, so α = 2. Product = 2α² = k = 2(4) = 8.",
  },

  // CALCULUS - Differentiation
  {
    id: generateId(),
    subject: "math",
    topic: "Calculus",
    subtopic: "Differentiation",
    difficulty: 1,
    text: "The derivative of x⁵ with respect to x is:",
    options: {
      a: "5x⁴",
      b: "x⁴",
      c: "5x⁵",
      d: "4x⁵",
    },
    correctAnswer: "a",
    explanation: "Using power rule: d/dx(xⁿ) = nxⁿ⁻¹. So d/dx(x⁵) = 5x⁴.",
  },
  {
    id: generateId(),
    subject: "math",
    topic: "Calculus",
    subtopic: "Differentiation",
    difficulty: 1,
    text: "The derivative of sin x with respect to x is:",
    options: {
      a: "-cos x",
      b: "cos x",
      c: "-sin x",
      d: "tan x",
    },
    correctAnswer: "b",
    explanation: "d/dx(sin x) = cos x is a fundamental derivative formula.",
  },
  {
    id: generateId(),
    subject: "math",
    topic: "Calculus",
    subtopic: "Differentiation",
    difficulty: 2,
    text: "If y = e^(3x), then dy/dx equals:",
    options: {
      a: "e^(3x)",
      b: "3e^(3x)",
      c: "e^(3x)/3",
      d: "3e^x",
    },
    correctAnswer: "b",
    explanation:
      "Using chain rule: d/dx(e^(ax)) = ae^(ax). Here, dy/dx = 3e^(3x).",
  },
  {
    id: generateId(),
    subject: "math",
    topic: "Calculus",
    subtopic: "Differentiation",
    difficulty: 2,
    text: "The derivative of log(sin x) is:",
    options: {
      a: "cot x",
      b: "tan x",
      c: "1/sin x",
      d: "cos x/sin x",
    },
    correctAnswer: "a",
    explanation:
      "Using chain rule: d/dx[log(sin x)] = (1/sin x) × cos x = cos x/sin x = cot x. Note: Options a and d are equivalent.",
  },
  {
    id: generateId(),
    subject: "math",
    topic: "Calculus",
    subtopic: "Differentiation",
    difficulty: 3,
    text: "If y = x^x, then dy/dx equals:",
    options: {
      a: "x^x",
      b: "x · x^(x-1)",
      c: "x^x(1 + log x)",
      d: "x^x · log x",
    },
    correctAnswer: "c",
    explanation:
      "Take log: log y = x log x. Differentiate: (1/y)(dy/dx) = log x + 1. So dy/dx = y(1 + log x) = x^x(1 + log x).",
    commonMistake:
      "Students try to use power rule directly, but x^x requires logarithmic differentiation.",
  },

  // CALCULUS - Integration
  {
    id: generateId(),
    subject: "math",
    topic: "Calculus",
    subtopic: "Integration",
    difficulty: 1,
    text: "∫x³ dx equals:",
    options: {
      a: "3x² + C",
      b: "x⁴/4 + C",
      c: "x⁴ + C",
      d: "4x⁴ + C",
    },
    correctAnswer: "b",
    explanation: "∫xⁿ dx = x^(n+1)/(n+1) + C. So ∫x³ dx = x⁴/4 + C.",
  },
  {
    id: generateId(),
    subject: "math",
    topic: "Calculus",
    subtopic: "Integration",
    difficulty: 1,
    text: "∫cos x dx equals:",
    options: {
      a: "-sin x + C",
      b: "sin x + C",
      c: "-cos x + C",
      d: "tan x + C",
    },
    correctAnswer: "b",
    explanation: "∫cos x dx = sin x + C (since d/dx(sin x) = cos x).",
  },
  {
    id: generateId(),
    subject: "math",
    topic: "Calculus",
    subtopic: "Integration",
    difficulty: 2,
    text: "∫e^(2x) dx equals:",
    options: {
      a: "e^(2x) + C",
      b: "2e^(2x) + C",
      c: "e^(2x)/2 + C",
      d: "e^x + C",
    },
    correctAnswer: "c",
    explanation: "∫e^(ax) dx = e^(ax)/a + C. Here, ∫e^(2x) dx = e^(2x)/2 + C.",
  },
  {
    id: generateId(),
    subject: "math",
    topic: "Calculus",
    subtopic: "Definite Integration",
    difficulty: 2,
    text: "The value of ∫₀¹ x² dx is:",
    options: {
      a: "1",
      b: "1/2",
      c: "1/3",
      d: "1/4",
    },
    correctAnswer: "c",
    explanation:
      "∫x² dx = x³/3. Evaluating from 0 to 1: [1³/3] - [0³/3] = 1/3 - 0 = 1/3.",
  },

  // TRIGONOMETRY
  {
    id: generateId(),
    subject: "math",
    topic: "Trigonometry",
    subtopic: "Trigonometric Ratios",
    difficulty: 1,
    text: "The value of sin²θ + cos²θ is:",
    options: {
      a: "0",
      b: "1",
      c: "2",
      d: "Depends on θ",
    },
    correctAnswer: "b",
    explanation:
      "sin²θ + cos²θ = 1 is the fundamental Pythagorean identity, true for all values of θ.",
  },
  {
    id: generateId(),
    subject: "math",
    topic: "Trigonometry",
    subtopic: "Standard Angles",
    difficulty: 1,
    text: "The value of tan 45° is:",
    options: {
      a: "0",
      b: "1",
      c: "√3",
      d: "1/√3",
    },
    correctAnswer: "b",
    explanation: "tan 45° = sin 45°/cos 45° = (1/√2)/(1/√2) = 1.",
  },
  {
    id: generateId(),
    subject: "math",
    topic: "Trigonometry",
    subtopic: "Standard Angles",
    difficulty: 1,
    text: "The value of sin 30° is:",
    options: {
      a: "1/2",
      b: "√3/2",
      c: "1/√2",
      d: "1",
    },
    correctAnswer: "a",
    explanation: "sin 30° = 1/2 is a standard value that should be memorized.",
  },
  {
    id: generateId(),
    subject: "math",
    topic: "Trigonometry",
    subtopic: "Trigonometric Identities",
    difficulty: 2,
    text: "The value of (1 + tan²θ) equals:",
    options: {
      a: "sin²θ",
      b: "cos²θ",
      c: "sec²θ",
      d: "cosec²θ",
    },
    correctAnswer: "c",
    explanation:
      "1 + tan²θ = sec²θ is another Pythagorean identity derived from sin²θ + cos²θ = 1.",
  },
  {
    id: generateId(),
    subject: "math",
    topic: "Trigonometry",
    subtopic: "Compound Angles",
    difficulty: 2,
    text: "sin(A + B) is equal to:",
    options: {
      a: "sin A cos B + cos A sin B",
      b: "sin A cos B - cos A sin B",
      c: "cos A cos B + sin A sin B",
      d: "cos A cos B - sin A sin B",
    },
    correctAnswer: "a",
    explanation:
      "sin(A + B) = sin A cos B + cos A sin B is the addition formula for sine.",
  },

  // COORDINATE GEOMETRY
  {
    id: generateId(),
    subject: "math",
    topic: "Coordinate Geometry",
    subtopic: "Straight Lines",
    difficulty: 1,
    text: "The slope of a line passing through points (2, 3) and (4, 7) is:",
    options: {
      a: "1",
      b: "2",
      c: "3",
      d: "4",
    },
    correctAnswer: "b",
    explanation: "Slope = (y₂ - y₁)/(x₂ - x₁) = (7 - 3)/(4 - 2) = 4/2 = 2.",
  },
  {
    id: generateId(),
    subject: "math",
    topic: "Coordinate Geometry",
    subtopic: "Distance Formula",
    difficulty: 1,
    text: "The distance between points (0, 0) and (3, 4) is:",
    options: {
      a: "3",
      b: "4",
      c: "5",
      d: "7",
    },
    correctAnswer: "c",
    explanation:
      "Distance = √[(3-0)² + (4-0)²] = √[9 + 16] = √25 = 5. This is a 3-4-5 right triangle.",
  },
  {
    id: generateId(),
    subject: "math",
    topic: "Coordinate Geometry",
    subtopic: "Straight Lines",
    difficulty: 2,
    text: "The equation of a line with slope 2 passing through (1, 3) is:",
    options: {
      a: "y = 2x + 1",
      b: "y = 2x - 1",
      c: "y = 2x + 3",
      d: "y = 2x - 3",
    },
    correctAnswer: "a",
    explanation:
      "Using point-slope form: y - 3 = 2(x - 1) → y = 2x - 2 + 3 → y = 2x + 1.",
    commonMistake: "Students sometimes forget to simplify or make sign errors.",
  },
  {
    id: generateId(),
    subject: "math",
    topic: "Coordinate Geometry",
    subtopic: "Circles",
    difficulty: 2,
    text: "The equation of a circle with center (2, 3) and radius 5 is:",
    options: {
      a: "(x - 2)² + (y - 3)² = 5",
      b: "(x + 2)² + (y + 3)² = 25",
      c: "(x - 2)² + (y - 3)² = 25",
      d: "(x - 2)² + (y - 3)² = 10",
    },
    correctAnswer: "c",
    explanation:
      "Circle equation: (x - h)² + (y - k)² = r². With center (2,3) and r=5: (x - 2)² + (y - 3)² = 25.",
    commonMistake:
      "Students forget to square the radius (using 5 instead of 25).",
  },
];

/**
 * Combined question bank
 */
export const allQuestions: Question[] = [
  ...physicsQuestions,
  ...chemistryQuestions,
  ...mathQuestions,
];

/**
 * Get questions filtered by criteria
 */
export function getQuestions(options?: {
  subject?: Subject;
  topic?: string;
  difficulty?: 1 | 2 | 3;
  limit?: number;
  excludeIds?: string[];
}): Question[] {
  let filtered = [...allQuestions];

  if (options?.subject) {
    filtered = filtered.filter((q) => q.subject === options.subject);
  }

  if (options?.topic) {
    filtered = filtered.filter((q) =>
      q.topic.toLowerCase().includes(options.topic!.toLowerCase()),
    );
  }

  if (options?.difficulty) {
    filtered = filtered.filter((q) => q.difficulty === options.difficulty);
  }

  if (options?.excludeIds?.length) {
    filtered = filtered.filter((q) => !options.excludeIds!.includes(q.id));
  }

  // Shuffle for variety
  filtered = filtered.sort(() => Math.random() - 0.5);

  if (options?.limit) {
    filtered = filtered.slice(0, options.limit);
  }

  return filtered;
}

/**
 * Get a single question by ID
 */
export function getQuestionById(id: string): Question | undefined {
  return allQuestions.find((q) => q.id === id);
}

/**
 * Get all available topics for a subject
 */
export function getTopicsForSubject(subject: Subject): string[] {
  const topics = new Set<string>();
  allQuestions
    .filter((q) => q.subject === subject)
    .forEach((q) => topics.add(q.topic));
  return Array.from(topics);
}

/**
 * Get question counts by difficulty and subject
 */
export function getQuestionStats(): {
  total: number;
  bySubject: Record<Subject, number>;
  byDifficulty: Record<1 | 2 | 3, number>;
} {
  const bySubject: Record<Subject, number> = {
    physics: 0,
    chemistry: 0,
    math: 0,
  };
  const byDifficulty: Record<1 | 2 | 3, number> = { 1: 0, 2: 0, 3: 0 };

  for (const q of allQuestions) {
    bySubject[q.subject]++;
    byDifficulty[q.difficulty]++;
  }

  return {
    total: allQuestions.length,
    bySubject,
    byDifficulty,
  };
}
