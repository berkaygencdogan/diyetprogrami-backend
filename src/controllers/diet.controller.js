export const calculatePlan = (req, res) => {
  const { height, weight, age, gender, activity, goal } = req.body;

  if (!height || !weight || !age || !gender || !activity || !goal) {
    return res.status(400).json({ error: "Eksik veri" });
  }

  // BMI
  const bmi = weight / Math.pow(height / 100, 2);

  // BMR (Mifflin)
  const bmr =
    gender === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

  // Aktivite katsayısı
  const activityMap = {
    low: 1.2,
    medium: 1.55,
    high: 1.75,
  };

  const tdee = bmr * (activityMap[activity] || 1.2);

  // Hedef kalori
  let targetCalories = tdee;
  if (goal === "lose") targetCalories -= 500;
  if (goal === "gain") targetCalories += 500;

  targetCalories = Math.round(targetCalories);

  // Makrolar
  const proteinGr = Math.round(weight * 2.2);
  const proteinCal = proteinGr * 4;

  const fatCal = Math.round(targetCalories * 0.25);
  const fatGr = Math.round(fatCal / 9);

  const carbCal = targetCalories - (proteinCal + fatCal);
  const carbGr = Math.round(carbCal / 4);

  // Kurallar / öneriler
  const advice = [];

  if (goal === "lose" && bmi > 30) {
    advice.push("Şekerli içecekleri azalt");
    advice.push("Akşam karbonhidratı düşür");
  }

  if (goal === "gain" && bmi < 20) {
    advice.push("Karbonhidrat artır");
    advice.push("Haftada 3 gün direnç egzersizi");
  }

  res.json({
    bmi: Number(bmi.toFixed(1)),
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    targetCalories,
    macros: {
      protein: proteinGr,
      fat: fatGr,
      carb: carbGr,
    },
    advice,
  });
};

// BMR hesaplama (Mifflin–St Jeor)
export const calcBmr = async (req, res) => {
  const { kilo, boy, yas, cinsiyet } = req.body;

  if (!kilo || !boy || !yas || !cinsiyet) {
    return res.status(400).json({ error: "Eksik parametre" });
  }

  let bmr;

  if (cinsiyet === "erkek") {
    bmr = 10 * kilo + 6.25 * boy - 5 * yas + 5;
  } else if (cinsiyet === "kadin") {
    bmr = 10 * kilo + 6.25 * boy - 5 * yas - 161;
  } else {
    return res.status(400).json({ error: "Geçersiz cinsiyet" });
  }

  return res.json({
    bmr: Math.round(bmr),
  });
};

// TDEE hesaplama
export const calcTdee = async (req, res) => {
  const { bmr, aktivite } = req.body;

  if (!bmr || !aktivite) {
    return res.status(400).json({ error: "Eksik parametre" });
  }

  const activityMap = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  const factor = activityMap[aktivite];

  if (!factor) {
    return res.status(400).json({ error: "Geçersiz aktivite seviyesi" });
  }

  const tdee = bmr * factor;

  return res.json({
    tdee: Math.round(tdee),
  });
};

export const calcGoalCalories = async (req, res) => {
  const { tdee, kilo, boy, hedef } = req.body;

  if (!tdee || !kilo || !boy || !hedef) {
    return res.status(400).json({ error: "Eksik parametre" });
  }

  // BMI
  const boyMetre = boy / 100;
  const bmi = kilo / (boyMetre * boyMetre);

  let targetCalories = tdee;
  let note = "";

  if (hedef === "kilo_ver") {
    let deficit = 500;

    if (bmi < 22) deficit = 300;
    if (bmi > 30) deficit = 700;

    targetCalories = tdee - deficit;
    note = "Kilo verme hedefi için kalori açığı oluşturuldu.";
  }

  if (hedef === "kilo_al") {
    let surplus = 500;

    if (bmi < 20) surplus = 700;
    if (bmi > 25) surplus = 300;

    targetCalories = tdee + surplus;
    note = "Kilo alma hedefi için kalori fazlası oluşturuldu.";
  }

  if (hedef === "koru") {
    targetCalories = tdee;
    note = "Mevcut kilonuzu korumak için ideal kalori.";
  }

  return res.json({
    hedef,
    bmi: Number(bmi.toFixed(1)),
    target_calories: Math.round(targetCalories),
    note,
  });
};

export const calcMacros = async (req, res) => {
  const { kilo, hedef, target_calories } = req.body;

  if (!kilo || !hedef || !target_calories) {
    return res.status(400).json({ error: "Eksik parametre" });
  }

  // 🎯 Protein (g/kg)
  let proteinPerKg = 1.8;

  if (hedef === "kilo_ver") proteinPerKg = 2.2;
  if (hedef === "kilo_al") proteinPerKg = 2.0;
  if (hedef === "koru") proteinPerKg = 1.8;

  const proteinGr = kilo * proteinPerKg;
  const proteinCal = proteinGr * 4;

  // 🥑 Yağ (%)
  let fatRatio = 0.3;
  if (hedef === "kilo_ver") fatRatio = 0.25;

  const fatCal = target_calories * fatRatio;
  const fatGr = fatCal / 9;

  // 🍞 Karbonhidrat (kalan)
  const remainingCal = target_calories - (proteinCal + fatCal);
  const carbGr = remainingCal / 4;

  return res.json({
    hedef,
    target_calories,
    macros: {
      protein: Math.round(proteinGr),
      fat: Math.round(fatGr),
      carbs: Math.round(carbGr),
    },
    calories: {
      protein: Math.round(proteinCal),
      fat: Math.round(fatCal),
      carbs: Math.round(remainingCal),
    },
  });
};

export const calculateFood = async (req, res) => {
  const { name, grams } = req.body;

  if (!name || !grams) {
    return res.status(400).json({ error: "Eksik veri" });
  }

  // 1️⃣ USDA search
  const searchRes = await fetch(
    `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(
      name,
    )}&pageSize=1&api_key=${process.env.USDA_API_KEY}`,
  );

  const searchData = await searchRes.json();

  if (!searchData.foods?.length) {
    return res.status(404).json({ error: "Besin bulunamadı" });
  }

  const food = searchData.foods[0];
  const nutrients = food.foodNutrients;

  // 2️⃣ 100g değerleri al
  const get = (id) => nutrients.find((n) => n.nutrientId === id)?.value || 0;

  const per100 = {
    calories: get(1008), // Energy
    protein: get(1003),
    carb: get(1005),
    fat: get(1004),
  };

  // 3️⃣ Gramla çarp
  const factor = grams / 100;

  const result = {
    name: food.description,
    grams,
    calories: Math.round(per100.calories * factor),
    protein: Number((per100.protein * factor).toFixed(1)),
    carb: Number((per100.carb * factor).toFixed(1)),
    fat: Number((per100.fat * factor).toFixed(1)),
  };

  res.json(result);
};

const fetchFood = async (name, grams) => {
  const res = await fetch(
    `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(
      name,
    )}&pageSize=1&api_key=${process.env.USDA_API_KEY}`,
  );

  const data = await res.json();
  if (!data.foods?.length) return null;

  const food = data.foods[0];
  const n = food.foodNutrients;

  const get = (id) => n.find((x) => x.nutrientId === id)?.value || 0;

  const per100 = {
    calories: get(1008),
    protein: get(1003),
    carb: get(1005),
    fat: get(1004),
  };

  const factor = grams / 100;

  return {
    name: food.description,
    grams,
    calories: Math.round(per100.calories * factor),
    protein: +(per100.protein * factor).toFixed(1),
    carb: +(per100.carb * factor).toFixed(1),
    fat: +(per100.fat * factor).toFixed(1),
  };
};

export const calculateMultipleFoods = async (req, res) => {
  const { foods } = req.body;

  if (!Array.isArray(foods) || !foods.length) {
    return res.status(400).json({ error: "Besin listesi boş" });
  }

  const results = await Promise.all(
    foods.map((f) => fetchFood(f.name, f.grams)),
  );

  const valid = results.filter(Boolean);

  const total = valid.reduce(
    (acc, f) => ({
      calories: acc.calories + f.calories,
      protein: acc.protein + f.protein,
      carb: acc.carb + f.carb,
      fat: acc.fat + f.fat,
    }),
    { calories: 0, protein: 0, carb: 0, fat: 0 },
  );

  res.json({
    items: valid,
    total: {
      calories: Math.round(total.calories),
      protein: +total.protein.toFixed(1),
      carb: +total.carb.toFixed(1),
      fat: +total.fat.toFixed(1),
    },
  });
};

// 🔎 PLAN + BESİN UYUM KONTROLÜ
export const checkPlanCompatibility = async (req, res) => {
  const { plan, foods } = req.body;

  if (!plan || !foods || !Array.isArray(foods)) {
    return res.status(400).json({ error: "Eksik veya hatalı veri" });
  }

  // 1️⃣ Besinleri hesapla (helper'ı kullanıyoruz)
  const results = await Promise.all(
    foods.map((f) => fetchFood(f.name, f.grams)),
  );

  const valid = results.filter(Boolean);

  if (!valid.length) {
    return res.status(400).json({ error: "Besinler hesaplanamadı" });
  }

  // 2️⃣ Toplamları çıkar
  const total = valid.reduce(
    (acc, f) => ({
      calories: acc.calories + f.calories,
      protein: acc.protein + f.protein,
      carb: acc.carb + f.carb,
      fat: acc.fat + f.fat,
    }),
    { calories: 0, protein: 0, carb: 0, fat: 0 },
  );

  // 3️⃣ Farkları hesapla
  const diff = {
    calories: Math.round(plan.targetCalories - total.calories),
    protein: Math.round(plan.macros.protein - total.protein),
    carb: Math.round(plan.macros.carb - total.carb),
    fat: Math.round(plan.macros.fat - total.fat),
  };

  // 4️⃣ Basit yorumlar
  const feedback = [];

  if (diff.calories > 150) feedback.push("Kalori hedefinin altındasın.");
  if (diff.calories < -150) feedback.push("Kalori hedefini aştın.");

  if (diff.protein > 15) feedback.push("Protein artırılabilir.");
  if (diff.fat < -15) feedback.push("Yağ fazla.");

  if (!feedback.length) feedback.push("Seçilen besinler hedefinle uyumlu.");

  return res.json({
    items: valid,
    total: {
      calories: Math.round(total.calories),
      protein: +total.protein.toFixed(1),
      carb: +total.carb.toFixed(1),
      fat: +total.fat.toFixed(1),
    },
    diff,
    feedback,
  });
};

export const suggestFoodsByMacro = async (req, res) => {
  const { diff } = req.body;

  if (!diff) {
    return res.status(400).json({ error: "Makro farkı yok" });
  }

  const suggestions = [];

  // 🥩 PROTEİN
  if (diff.protein > 15) {
    suggestions.push({
      macro: "protein",
      need: diff.protein,
      options: SUGGESTIONS.protein,
    });
  }

  // 🍞 KARBONHİDRAT
  if (diff.carb > 30) {
    suggestions.push({
      macro: "carb",
      need: diff.carb,
      options: SUGGESTIONS.carb,
    });
  }

  // 🥑 YAĞ
  if (diff.fat > 10) {
    suggestions.push({
      macro: "fat",
      need: diff.fat,
      options: SUGGESTIONS.fat,
    });
  }

  if (!suggestions.length) {
    return res.json({
      message: "Makrolar hedefinle uyumlu, ek besine gerek yok.",
    });
  }

  return res.json({
    suggestions,
  });
};

const SUGGESTIONS = {
  protein: [
    { name: "chicken breast", grams: 100, protein: 31 },
    { name: "egg", grams: 2, protein: 12 },
    { name: "greek yogurt", grams: 200, protein: 20 },
    { name: "tuna", grams: 100, protein: 26 },
  ],
  carb: [
    { name: "rice", grams: 100, carb: 28 },
    { name: "oats", grams: 60, carb: 40 },
    { name: "banana", grams: 120, carb: 27 },
  ],
  fat: [
    { name: "olive oil", grams: 10, fat: 9 },
    { name: "avocado", grams: 100, fat: 15 },
    { name: "nuts", grams: 30, fat: 18 },
  ],
};

export const evaluateDiet = async (req, res) => {
  const { user, foods } = req.body;

  if (!user || !foods) {
    return res.status(400).json({ error: "Eksik veri" });
  }

  /* 1️⃣ PLAN */
  const { height, weight, age, gender, activity, goal } = user;

  const bmi = weight / Math.pow(height / 100, 2);

  const bmr =
    gender === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

  const activityMap = { low: 1.2, medium: 1.55, high: 1.75 };
  const tdee = bmr * (activityMap[activity] || 1.2);

  let targetCalories = tdee;
  if (goal === "lose") targetCalories -= 500;
  if (goal === "gain") targetCalories += 500;

  targetCalories = Math.round(targetCalories);

  const protein = Math.round(weight * (goal === "lose" ? 2.2 : 2));
  const fat = Math.round((targetCalories * 0.25) / 9);
  const carb = Math.round((targetCalories - (protein * 4 + fat * 9)) / 4);

  const plan = {
    bmi: Number(bmi.toFixed(1)),
    targetCalories,
    macros: { protein, fat, carb },
  };

  /* 2️⃣ YENEN BESİNLER */
  const items = await Promise.all(foods.map((f) => fetchFood(f.name, f.grams)));

  const valid = items.filter(Boolean);

  const total = valid.reduce(
    (acc, f) => ({
      calories: acc.calories + f.calories,
      protein: acc.protein + f.protein,
      fat: acc.fat + f.fat,
      carb: acc.carb + f.carb,
    }),
    { calories: 0, protein: 0, fat: 0, carb: 0 },
  );

  /* 3️⃣ FARK */
  const diff = {
    calories: plan.targetCalories - total.calories,
    protein: plan.macros.protein - total.protein,
    fat: plan.macros.fat - total.fat,
    carb: plan.macros.carb - total.carb,
  };

  /* 4️⃣ ÖNERİ */
  const suggestions = [];

  if (diff.protein > 15)
    suggestions.push({ macro: "protein", need: diff.protein });
  if (diff.carb > 30) suggestions.push({ macro: "carb", need: diff.carb });
  if (diff.fat > 10) suggestions.push({ macro: "fat", need: diff.fat });

  return res.json({
    plan,
    eaten: {
      items: valid,
      total,
    },
    diff,
    suggestions,
  });
};
