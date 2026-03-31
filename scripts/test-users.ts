import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI!;
const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

// ── Schemas (inline para no depender de USE_MEMORY_DB) ──────────────────────
const UserSchema = new mongoose.Schema(
  { name: String, email: String, password: String, role: String, plan: String, avatar: String, resetToken: String, resetTokenExpiry: Date },
  { timestamps: true }
);
const ExerciseSchema = new mongoose.Schema(
  { name: String, category: String, muscleGroup: [String], description: String, videoUrl: String, gifUrl: String, difficulty: String },
  { timestamps: true }
);
const RoutineExerciseSchema = new mongoose.Schema({ exerciseId: mongoose.Schema.Types.ObjectId, sets: Number, reps: Number, rest: Number, notes: String });
const RoutineDaySchema = new mongoose.Schema({ day: String, exercises: [RoutineExerciseSchema] });
const RoutineSchema = new mongoose.Schema(
  { userId: mongoose.Schema.Types.ObjectId, name: String, description: String, days: [RoutineDaySchema], isPublic: Boolean },
  { timestamps: true }
);
const GymSessionSchema = new mongoose.Schema(
  { userId: mongoose.Schema.Types.ObjectId, date: Date, routineId: mongoose.Schema.Types.ObjectId },
  { timestamps: { createdAt: true, updatedAt: false } }
);
GymSessionSchema.index({ userId: 1, date: 1 }, { unique: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Exercise = mongoose.models.Exercise || mongoose.model("Exercise", ExerciseSchema);
const Routine = mongoose.models.Routine || mongoose.model("Routine", RoutineSchema);
const GymSession = mongoose.models.GymSession || mongoose.model("GymSession", GymSessionSchema);

// ── Helpers ──────────────────────────────────────────────────────────────────
const log = (msg: string) => console.log(`  ${msg}`);
const ok = (msg: string) => console.log(`  ✅ ${msg}`);
const fail = (msg: string) => console.log(`  ❌ ${msg}`);
const section = (msg: string) => console.log(`\n${"─".repeat(50)}\n🔷 ${msg}\n${"─".repeat(50)}`);

async function testApiEndpoint(path: string, options: RequestInit = {}, label = "") {
  const url = `${BASE_URL}${path}`;
  try {
    const res = await fetch(url, { ...options, headers: { "Content-Type": "application/json", ...(options.headers || {}) } });
    const text = await res.text();
    let body: any;
    try { body = JSON.parse(text); } catch { body = text; }
    return { ok: res.ok, status: res.status, body };
  } catch (e: any) {
    return { ok: false, status: 0, body: { error: e.message } };
  }
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  section("CONEXIÓN A MONGODB");
  await mongoose.connect(MONGODB_URI);
  ok(`Conectado a Atlas`);

  // ── 1. LIMPIAR usuarios de test anteriores ──────────────────────────────
  section("LIMPIEZA DE DATOS ANTERIORES");
  const testEmails = ["german@gymapp.com", "carlos@gymapp.com"];
  const oldUsers = await User.find({ email: { $in: testEmails } });
  for (const u of oldUsers) {
    await Routine.deleteMany({ userId: u._id });
    await GymSession.deleteMany({ userId: u._id });
    await User.deleteOne({ _id: u._id });
  }
  ok(`Usuarios de test anteriores eliminados`);

  // ── 2. CARGAR EJERCICIOS ────────────────────────────────────────────────
  section("EJERCICIOS EN BD");
  const exercises = await Exercise.find({});
  if (exercises.length === 0) {
    fail("No hay ejercicios en la BD — corriendo seed primero...");
    console.log("  Ejecutá: npx tsx scripts/seed.ts");
    await mongoose.disconnect();
    return;
  }
  ok(`${exercises.length} ejercicios encontrados`);
  const byCategory = (cat: string) => exercises.filter((e: any) => e.category === cat);

  const pecho = byCategory("Pecho");
  const espalda = byCategory("Espalda");
  const piernas = byCategory("Piernas");
  const hombros = byCategory("Hombros");
  const brazos = byCategory("Brazos");
  const core = byCategory("Core");
  const cardio = byCategory("Cardio");

  const exRef = (ex: any, sets = 3, reps = 12, rest = 60) => ({
    exerciseId: ex._id,
    sets,
    reps,
    rest,
  });

  // ── 3. CREAR USUARIOS ───────────────────────────────────────────────────
  section("CREANDO USUARIOS: GERMAN y CARLOS");
  const passwordHash = await bcrypt.hash("Password123!", 12);

  const german = await User.create({
    name: "German",
    email: "german@gymapp.com",
    password: passwordHash,
    role: "user",
    plan: "pro",
  });
  ok(`German creado — ID: ${german._id}`);

  const carlos = await User.create({
    name: "Carlos",
    email: "carlos@gymapp.com",
    password: passwordHash,
    role: "user",
    plan: "basic",
  });
  ok(`Carlos creado — ID: ${carlos._id}`);

  // ── 4. RUTINAS GERMAN (Push/Pull/Legs — 6 días) ─────────────────────────
  section("RUTINAS: GERMAN (Push/Pull/Legs)");

  const germanRoutine = await Routine.create({
    userId: german._id,
    name: "Push Pull Legs PPL",
    description: "Rutina clásica de fuerza e hipertrofia — 6 días a la semana",
    isPublic: false,
    days: [
      {
        day: "Lunes",
        exercises: [
          exRef(pecho[0], 4, 8, 90),   // Press de banca
          exRef(pecho[2], 3, 12, 60),  // Aperturas
          exRef(hombros[0], 4, 8, 90), // Press militar
          exRef(hombros[1], 3, 15, 45),// Elevaciones laterales
          exRef(brazos[1], 3, 12, 60), // Tríceps polea
        ],
      },
      {
        day: "Martes",
        exercises: [
          exRef(espalda[0], 4, 8, 90), // Dominadas
          exRef(espalda[1], 4, 10, 75),// Remo
          exRef(espalda[2], 3, 5, 120),// Peso muerto
          exRef(brazos[0], 3, 12, 60), // Curl bíceps
          exRef(core[0], 3, 60, 30),   // Plancha (reps = segundos)
        ],
      },
      {
        day: "Miércoles",
        exercises: [
          exRef(piernas[0], 4, 8, 120), // Sentadilla
          exRef(piernas[1], 3, 12, 75), // Prensa
          exRef(piernas[2], 3, 12, 60), // Zancadas
          exRef(core[0], 3, 45, 30),    // Plancha
          exRef(core[1], 3, 20, 45),    // Abdominales
        ],
      },
      {
        day: "Jueves",
        exercises: [
          exRef(pecho[1], 4, 15, 60),  // Flexiones
          exRef(pecho[0], 3, 10, 75),  // Press banca
          exRef(hombros[0], 3, 10, 75),
          exRef(hombros[1], 3, 15, 45),
          exRef(brazos[1], 4, 12, 60),
        ],
      },
      {
        day: "Viernes",
        exercises: [
          exRef(espalda[0], 4, 8, 90),
          exRef(espalda[1], 3, 12, 75),
          exRef(brazos[0], 4, 10, 60),
          exRef(core[1], 3, 25, 45),
        ],
      },
      {
        day: "Sábado",
        exercises: [
          exRef(piernas[0], 5, 5, 150), // Sentadilla pesada
          exRef(espalda[2], 4, 5, 120), // Peso muerto pesado
          exRef(cardio[0], 1, 20, 60),  // Bici
        ],
      },
    ],
  });
  ok(`Rutina "Push Pull Legs" creada — ${germanRoutine.days.length} días, ${germanRoutine.days.reduce((a: number, d: any) => a + d.exercises.length, 0)} ejercicios totales`);

  // ── 5. RUTINAS CARLOS (Full Body — 3 días) ──────────────────────────────
  section("RUTINAS: CARLOS (Full Body x3)");

  const carlosRoutine = await Routine.create({
    userId: carlos._id,
    name: "Full Body 3 días",
    description: "Rutina funcional completa para 3 días semanales",
    isPublic: true,
    days: [
      {
        day: "Lunes",
        exercises: [
          exRef(piernas[0], 3, 10, 90), // Sentadilla
          exRef(pecho[0], 3, 10, 75),   // Press banca
          exRef(espalda[1], 3, 10, 75), // Remo
          exRef(hombros[1], 3, 12, 45), // Elevaciones
          exRef(core[0], 3, 40, 30),    // Plancha
        ],
      },
      {
        day: "Miércoles",
        exercises: [
          exRef(piernas[1], 3, 12, 75), // Prensa
          exRef(pecho[1], 3, 15, 60),   // Flexiones
          exRef(espalda[0], 3, 8, 90),  // Dominadas
          exRef(brazos[0], 3, 12, 60),  // Curl
          exRef(brazos[1], 3, 12, 60),  // Tríceps
        ],
      },
      {
        day: "Viernes",
        exercises: [
          exRef(piernas[2], 3, 12, 60), // Zancadas
          exRef(espalda[2], 3, 5, 120), // Peso muerto
          exRef(hombros[0], 3, 10, 75), // Press militar
          exRef(core[1], 3, 20, 45),    // Abdominales
          exRef(cardio[1], 1, 5, 30),   // Comba
        ],
      },
    ],
  });
  ok(`Rutina "Full Body 3 días" creada — ${carlosRoutine.days.length} días, ${carlosRoutine.days.reduce((a: number, d: any) => a + d.exercises.length, 0)} ejercicios totales`);

  // ── 6. SIMULAR 10 DÍAS DE ENTRENAMIENTOS ───────────────────────────────
  section("SIMULANDO 10 DÍAS DE ENTRENAMIENTOS");

  const today = new Date();
  today.setHours(12, 0, 0, 0);

  const datesBack = (days: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() - days);
    return d;
  };

  // German entrena 6 de los últimos 10 días (descansa día 3 y 7)
  const germanDays = [0, 1, 2, 4, 5, 6, 8, 9].slice(0, 10);
  let germanSessions = 0;
  for (const daysAgo of [9, 8, 7, 6, 4, 3, 2, 1, 0]) {
    if (germanSessions >= 10) break;
    try {
      await GymSession.create({
        userId: german._id,
        date: datesBack(daysAgo),
        routineId: germanRoutine._id,
      });
      germanSessions++;
    } catch {
      // Skip duplicado
    }
  }
  ok(`German: ${germanSessions} sesiones creadas en los últimos 10 días`);

  // Carlos entrena 3 días por semana (Lunes, Miércoles, Viernes pattern)
  let carlosSessions = 0;
  for (const daysAgo of [10, 8, 6, 3, 1]) {
    if (carlosSessions >= 10) break;
    try {
      await GymSession.create({
        userId: carlos._id,
        date: datesBack(daysAgo),
        routineId: carlosRoutine._id,
      });
      carlosSessions++;
    } catch {
      // Skip duplicado
    }
  }
  ok(`Carlos: ${carlosSessions} sesiones creadas en los últimos 10 días`);

  // ── 7. VERIFICAR DATOS EN BD ────────────────────────────────────────────
  section("VERIFICACIÓN EN BASE DE DATOS");

  const germanCheck = await User.findById(german._id);
  const carlosCheck = await User.findById(carlos._id);
  const germanRoutines = await Routine.find({ userId: german._id });
  const carlosRoutines = await Routine.find({ userId: carlos._id });
  const germanSessionCount = await GymSession.countDocuments({ userId: german._id });
  const carlosSessionCount = await GymSession.countDocuments({ userId: carlos._id });

  ok(`German — usuario: ${germanCheck?.name}, plan: ${germanCheck?.plan}, rutinas: ${germanRoutines.length}, sesiones: ${germanSessionCount}`);
  ok(`Carlos — usuario: ${carlosCheck?.name}, plan: ${carlosCheck?.plan}, rutinas: ${carlosRoutines.length}, sesiones: ${carlosSessionCount}`);

  // ── 8. TEST DE ENDPOINTS API ────────────────────────────────────────────
  section(`TEST DE API EN ${BASE_URL}`);

  // 8.1 Registro (debería fallar — usuarios ya existen)
  log("Testeando POST /api/register (email duplicado)...");
  const regDup = await testApiEndpoint("/api/register", {
    method: "POST",
    body: JSON.stringify({ name: "German", email: "german@gymapp.com", password: "Password123!" }),
  });
  if (!regDup.ok && (regDup.status === 409 || regDup.body?.error)) {
    ok(`Registro duplicado rechazado correctamente (${regDup.status})`);
  } else {
    fail(`Registro duplicado NO fue rechazado — status: ${regDup.status}, body: ${JSON.stringify(regDup.body)}`);
  }

  // 8.2 Registro usuario nuevo
  log("Testeando POST /api/register (usuario nuevo)...");
  const regNew = await testApiEndpoint("/api/register", {
    method: "POST",
    body: JSON.stringify({ name: "Test Temporal", email: `test_temp_${Date.now()}@gymapp.com`, password: "Password123!" }),
  });
  if (regNew.ok || regNew.status === 201) {
    ok(`Registro nuevo usuario OK (${regNew.status})`);
    // Limpiar usuario temporal
    if (regNew.body?._id || regNew.body?.id) {
      await User.deleteOne({ email: regNew.body?.email });
    }
  } else {
    fail(`Registro nuevo falló — status: ${regNew.status}, body: ${JSON.stringify(regNew.body)}`);
  }

  // 8.3 Ejercicios públicos
  log("Testeando GET /api/exercises...");
  const exRes = await testApiEndpoint("/api/exercises");
  if (exRes.ok && Array.isArray(exRes.body)) {
    ok(`GET /api/exercises devuelve ${exRes.body.length} ejercicios`);
  } else {
    fail(`GET /api/exercises falló — status: ${exRes.status}, body: ${JSON.stringify(exRes.body).slice(0, 100)}`);
  }

  // 8.4 Reset password (email inexistente)
  log("Testeando POST /api/forgot-password (email inexistente)...");
  const forgotRes = await testApiEndpoint("/api/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email: "noexiste@ejemplo.com" }),
  });
  ok(`Forgot password respondió (${forgotRes.status}) — ${JSON.stringify(forgotRes.body).slice(0, 80)}`);

  // 8.5 Endpoints protegidos sin auth
  log("Testeando endpoints protegidos sin autenticación...");
  const protectedRoutes = [
    "/api/routines",
    "/api/gym-sessions",
    "/api/settings",
  ];
  for (const route of protectedRoutes) {
    const res = await testApiEndpoint(route);
    if (res.status === 401 || res.status === 403 || res.body?.error) {
      ok(`GET ${route} rechaza sin auth (${res.status})`);
    } else {
      fail(`GET ${route} NO protegido — status: ${res.status}`);
    }
  }

  // ── 9. RESUMEN FINAL ────────────────────────────────────────────────────
  section("RESUMEN FINAL");
  console.log(`
  👤 USUARIOS DE TEST CREADOS:
     German  → german@gymapp.com  / Password123!  (plan: pro)
     Carlos  → carlos@gymapp.com  / Password123!  (plan: basic)

  📋 RUTINAS:
     German  → "Push Pull Legs PPL" (6 días/semana, 25 ejercicios)
     Carlos  → "Full Body 3 días"   (3 días/semana, 15 ejercicios)

  📅 SESIONES SIMULADAS:
     German  → ${germanSessionCount} sesiones en los últimos 10 días
     Carlos  → ${carlosSessionCount} sesiones en los últimos 10 días

  🔐 PODÉS LOGUEARTE EN:
     ${BASE_URL}/login
  `);

  await mongoose.disconnect();
  console.log("✅ Script completado sin errores críticos\n");
}

main().catch((e) => {
  console.error("\n❌ ERROR FATAL:", e.message);
  mongoose.disconnect();
  process.exit(1);
});
