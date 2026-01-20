/* =======================
   🔢 HESAPLAMA YARDIMCILARI
======================= */

const activityMap = { low: 1.2, medium: 1.55, high: 1.75 };

const MEAL_RATIOS = {
  breakfast: 0.25,
  lunch: 0.4,
  dinner: 0.25,
  snack: 0.1,
};

const MEAL_MACRO_SPLIT = {
  breakfast: { protein: 0.3, carb: 0.45, fat: 0.2 },
  lunch: { protein: 0.4, carb: 0.4, fat: 0.2 },
  dinner: { protein: 0.45, carb: 0.3, fat: 0.2 },
  snack: { protein: 0.3, carb: 0.5, fat: 0.2 },
};

const SAFE_LIMITS = {
  lose: { minCalories: 1200, maxDailyDeficit: 1000 },
  gain: { maxCalories: 3800, maxDailySurplus: 700 },
};

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

/* =======================
   🍽️ FOOD POOL
======================= */

const FOOD_POOL = {
  breakfast: {
    protein: [
      { name: "Omlet", kcal: 1.6, p: 0.12, c: 0.02, f: 0.12 },
      { name: "Yumurta", kcal: 1.55, p: 0.13, c: 0.01, f: 0.11 },
      { name: "Peynir", kcal: 2.6, p: 0.18, c: 0.02, f: 0.2 },
    ],
    carb: [
      { name: "Tam buğday ekmeği", kcal: 2.4, p: 0.08, c: 0.45, f: 0.03 },
      { name: "Yulaf", kcal: 3.8, p: 0.13, c: 0.67, f: 0.07 },
    ],
    fat: [
      { name: "Zeytin", kcal: 1.45, p: 0.01, c: 0.04, f: 0.15 },
      { name: "Zeytinyağı", kcal: 9, p: 0, c: 0, f: 1 },
    ],
    veggie: [
      { name: "Domates", kcal: 0.18, p: 0.01, c: 0.04, f: 0 },
      { name: "Salatalık", kcal: 0.15, p: 0.01, c: 0.03, f: 0 },
    ],
  },

  lunch: {
    protein: [
      { name: "Tavuk göğsü", kcal: 1.65, p: 0.31, c: 0, f: 0.03 },
      { name: "Köfte", kcal: 2.5, p: 0.26, c: 0.05, f: 0.2 },
      { name: "Balık", kcal: 2.0, p: 0.22, c: 0, f: 0.12 },
    ],
    carb: [
      { name: "Pirinç pilavı", kcal: 1.3, p: 0.03, c: 0.28, f: 0.01 },
      { name: "Bulgur", kcal: 1.2, p: 0.04, c: 0.25, f: 0.01 },
    ],
    fat: [{ name: "Zeytinyağı", kcal: 9, p: 0, c: 0, f: 1 }],
    veggie: [{ name: "Salata", kcal: 0.25, p: 0.02, c: 0.05, f: 0 }],
  },

  dinner: {
    protein: [
      { name: "Izgara tavuk", kcal: 1.6, p: 0.3, c: 0, f: 0.04 },
      { name: "Et sote", kcal: 2.4, p: 0.25, c: 0.02, f: 0.18 },
      { name: "Balık (ızgara)", kcal: 2.0, p: 0.22, c: 0, f: 0.12 },
    ],
    carb: [
      { name: "Haşlanmış patates", kcal: 0.85, p: 0.02, c: 0.2, f: 0 },
      { name: "Bulgur", kcal: 1.2, p: 0.04, c: 0.25, f: 0.01 },
    ],
    fat: [{ name: "Zeytinyağı", kcal: 9, p: 0, c: 0, f: 1 }],
    veggie: [{ name: "Sebze yemeği", kcal: 0.6, p: 0.03, c: 0.08, f: 0.02 }],
  },

  snack: {
    protein: [
      { name: "Yoğurt", kcal: 0.6, p: 0.04, c: 0.05, f: 0.03 },
      { name: "Protein yoğurdu", kcal: 0.8, p: 0.1, c: 0.04, f: 0.02 },
    ],
    carb: [
      { name: "Muz", kcal: 0.89, p: 0.01, c: 0.23, f: 0 },
      { name: "Elma", kcal: 0.52, p: 0.003, c: 0.14, f: 0 },
    ],
    fat: [{ name: "Badem", kcal: 5.7, p: 0.21, c: 0.22, f: 0.49 }],
  },
};

/* =======================
   🍱 MENÜ OLUŞTURMA
======================= */

const calcFood = (food, grams) => ({
  name: food.name,
  grams,
  calories: Math.round(grams * food.kcal),
  protein: Math.round(grams * food.p),
  carb: Math.round(grams * food.c),
  fat: Math.round(grams * food.f),
});

const buildMealMenu = (meal, mealTarget, pool) => {
  const split = MEAL_MACRO_SPLIT[meal];
  const items = [];

  const protein = pickRandom(pool.protein);
  const carb = pickRandom(pool.carb);
  const fat = pool.fat ? pickRandom(pool.fat) : null;
  const veggie = pool.veggie ? pickRandom(pool.veggie) : null;

  items.push(
    calcFood(protein, Math.round((mealTarget * split.protein) / protein.kcal)),
  );
  items.push(calcFood(carb, Math.round((mealTarget * split.carb) / carb.kcal)));
  if (fat)
    items.push(calcFood(fat, Math.round((mealTarget * split.fat) / fat.kcal)));
  if (veggie) items.push(calcFood(veggie, 100));

  return items;
};

const buildDailyPlan = (targetCalories) => {
  const meals = {};
  let dailyTotal = 0;

  for (const meal of Object.keys(MEAL_RATIOS)) {
    const mealTarget = Math.round(targetCalories * MEAL_RATIOS[meal]);
    const items = buildMealMenu(meal, mealTarget, FOOD_POOL[meal]);
    meals[meal] = items;
    dailyTotal += items.reduce((s, i) => s + i.calories, 0);
  }

  return { meals, dailyTotal };
};

const generatePlan = (targetCalories, days) =>
  Array.from({ length: days }, (_, i) => {
    const { meals, dailyTotal } = buildDailyPlan(targetCalories);
    return { day: i + 1, total_calories: dailyTotal, meals };
  });

/* =======================
   🎯 ANA CONTROLLER
======================= */
const calculateMacrosByCalories = (calories, weight, goal) => {
  const proteinPerKg = goal === "lose" ? 2.2 : 2.0;
  const fatRatio = goal === "lose" ? 0.25 : 0.3;

  const protein = Math.round(weight * proteinPerKg);
  const proteinCal = protein * 4;

  const fatCal = Math.round(calories * fatRatio);
  const fat = Math.round(fatCal / 9);

  const carbCal = calories - (proteinCal + fatCal);
  const carb = Math.round(carbCal / 4);

  return { protein, fat, carb };
};

export const generateGoalBasedDietPlanFromUser = async (req, res) => {
  const { height, weight, age, gender, activity, goal, targetKg, months } =
    req.body;

  if (!height || !weight || !age || !gender || !activity || !goal) {
    return res.status(400).json({ error: "Eksik kullanıcı bilgisi" });
  }

  const bmr =
    gender === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

  const tdee = bmr * (activityMap[activity] || 1.2);

  let dailyCalories;
  let note;

  if (goal === "maintain") {
    dailyCalories = Math.round(tdee);
    note = "Kilo koruma planı";
  } else {
    if (!targetKg || !months) {
      return res.status(400).json({ error: "Hedef kilo ve ay zorunlu" });
    }

    const totalDays = months * 30;
    let dailyChange = (targetKg * 7700) / totalDays;

    if (goal === "lose") {
      dailyChange = Math.min(dailyChange, SAFE_LIMITS.lose.maxDailyDeficit);
      dailyCalories = Math.max(
        tdee - dailyChange,
        SAFE_LIMITS.lose.minCalories,
      );
      note = `Ayda ${targetKg / months} kg vermeye yönelik plan`;
    } else {
      dailyChange = Math.min(dailyChange, SAFE_LIMITS.gain.maxDailySurplus);
      dailyCalories = Math.min(
        tdee + dailyChange,
        SAFE_LIMITS.gain.maxCalories,
      );
      note = `Ayda ${targetKg / months} kg almaya yönelik plan`;
    }
  }

  const totalDays = goal === "maintain" ? 30 : months * 30;
  const plan = generatePlan(Math.round(dailyCalories), totalDays);

  const macros = calculateMacrosByCalories(
    Math.round(dailyCalories),
    weight,
    goal,
  );

  res.json({
    summary: {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      dailyCalories: Math.round(dailyCalories),
      goal,
      macros,
      targetKg: targetKg || null,
      months: months || null,
      note,
    },
    plan,
  });
};
