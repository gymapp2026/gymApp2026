import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

const UserSchema = new mongoose.Schema({ name: String, email: String, password: String, role: String, plan: String }, { timestamps: true });
const ExerciseSchema = new mongoose.Schema({ name: String, category: String, muscleGroup: [String], description: String, videoUrl: String, gifUrl: String, difficulty: String }, { timestamps: true });
const RoutineExerciseSchema = new mongoose.Schema({ exerciseId: mongoose.Schema.Types.ObjectId, sets: Number, reps: Number, rest: Number, notes: String });
const RoutineDaySchema = new mongoose.Schema({ day: String, exercises: [RoutineExerciseSchema] });
const RoutineSchema = new mongoose.Schema(
  { userId: mongoose.Schema.Types.ObjectId, name: String, description: String, days: [RoutineDaySchema], isPublic: Boolean },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Exercise = mongoose.models.Exercise || mongoose.model("Exercise", ExerciseSchema);
const Routine = mongoose.models.Routine || mongoose.model("Routine", RoutineSchema);

const ex = (id: any, sets = 3, reps = 12, rest = 60) => ({ exerciseId: id, sets, reps, rest });

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Conectado a Atlas");

  const german = await User.findOne({ email: "german@gymapp.com" });
  const carlos = await User.findOne({ email: "carlos@gymapp.com" });

  if (!german || !carlos) {
    console.log("❌ Usuarios no encontrados. Corré primero test-users.ts");
    await mongoose.disconnect();
    return;
  }

  const exercises = await Exercise.find({});
  const by = (cat: string) => exercises.filter((e: any) => e.category === cat);

  const pecho = by("Pecho");
  const espalda = by("Espalda");
  const piernas = by("Piernas");
  const hombros = by("Hombros");
  const brazos = by("Brazos");
  const core = by("Core");
  const cardio = by("Cardio");

  // ── RUTINAS GERMAN (5 nuevas) ──────────────────────────────────────────
  const germanRoutines = [
    {
      name: "Fuerza Máxima",
      description: "Rutina de powerlifting enfocada en sentadilla, press banca y peso muerto",
      isPublic: false,
      days: [
        { day: "Lunes", exercises: [ex(piernas[0]._id, 5, 5, 180), ex(espalda[2]._id, 3, 5, 180), ex(core[0]._id, 3, 60, 30)] },
        { day: "Miércoles", exercises: [ex(pecho[0]._id, 5, 5, 180), ex(espalda[0]._id, 4, 6, 120), ex(brazos[1]._id, 3, 10, 60)] },
        { day: "Viernes", exercises: [ex(piernas[0]._id, 5, 5, 180), ex(espalda[2]._id, 4, 4, 180), ex(hombros[0]._id, 3, 8, 90)] },
      ],
    },
    {
      name: "Hipertrofia Pecho & Espalda",
      description: "Día enfocado en volumen para pecho y espalda con superseries",
      isPublic: true,
      days: [
        { day: "Lunes", exercises: [ex(pecho[0]._id, 4, 10, 75), ex(espalda[1]._id, 4, 10, 75), ex(pecho[2]._id, 3, 15, 60), ex(espalda[0]._id, 3, 10, 60)] },
        { day: "Jueves", exercises: [ex(pecho[1]._id, 4, 20, 45), ex(espalda[0]._id, 4, 10, 75), ex(pecho[0]._id, 3, 12, 60), ex(brazos[0]._id, 3, 12, 60)] },
      ],
    },
    {
      name: "Piernas Completo",
      description: "Sesión dedicada 100% a piernas y glúteos",
      isPublic: false,
      days: [
        { day: "Martes", exercises: [ex(piernas[0]._id, 5, 8, 120), ex(piernas[1]._id, 4, 12, 90), ex(piernas[2]._id, 3, 15, 60), ex(core[0]._id, 3, 45, 30), ex(core[1]._id, 3, 25, 45)] },
        { day: "Sábado", exercises: [ex(piernas[0]._id, 4, 12, 90), ex(espalda[2]._id, 3, 8, 120), ex(piernas[2]._id, 4, 12, 60), ex(cardio[0]._id, 1, 20, 0)] },
      ],
    },
    {
      name: "Cardio & Core",
      description: "Rutina de acondicionamiento cardiovascular y trabajo de núcleo",
      isPublic: true,
      days: [
        { day: "Miércoles", exercises: [ex(cardio[0]._id, 1, 30, 0), ex(core[0]._id, 4, 60, 30), ex(core[1]._id, 4, 30, 45), ex(cardio[1]._id, 3, 5, 60)] },
        { day: "Sábado", exercises: [ex(cardio[1]._id, 5, 3, 30), ex(core[0]._id, 3, 45, 30), ex(core[1]._id, 3, 25, 45)] },
      ],
    },
    {
      name: "Brazos Especialización",
      description: "Volumen específico para bíceps, tríceps y hombros",
      isPublic: false,
      days: [
        { day: "Jueves", exercises: [ex(brazos[0]._id, 4, 12, 60), ex(brazos[1]._id, 4, 12, 60), ex(hombros[1]._id, 3, 15, 45), ex(hombros[0]._id, 3, 12, 60)] },
        { day: "Domingo", exercises: [ex(brazos[0]._id, 5, 10, 60), ex(brazos[1]._id, 5, 10, 60), ex(hombros[1]._id, 4, 15, 45), ex(core[0]._id, 3, 45, 30)] },
      ],
    },
  ];

  // ── RUTINAS CARLOS (5 nuevas) ──────────────────────────────────────────
  const carlosRoutines = [
    {
      name: "Entrenamiento en Casa",
      description: "Rutina sin equipamiento para hacer desde casa",
      isPublic: true,
      days: [
        { day: "Lunes", exercises: [ex(pecho[1]._id, 4, 20, 60), ex(core[0]._id, 3, 60, 30), ex(piernas[2]._id, 3, 15, 60), ex(core[1]._id, 3, 20, 45)] },
        { day: "Miércoles", exercises: [ex(pecho[1]._id, 5, 15, 45), ex(piernas[2]._id, 4, 12, 60), ex(core[0]._id, 4, 45, 30), ex(cardio[1]._id, 3, 3, 30)] },
        { day: "Viernes", exercises: [ex(pecho[1]._id, 4, 20, 60), ex(core[1]._id, 4, 25, 45), ex(piernas[2]._id, 3, 15, 60), ex(cardio[1]._id, 5, 2, 30)] },
      ],
    },
    {
      name: "Iniciación al Gym",
      description: "Rutina para principiantes enfocada en aprender los movimientos básicos",
      isPublic: true,
      days: [
        { day: "Lunes", exercises: [ex(piernas[0]._id, 3, 10, 90), ex(pecho[1]._id, 3, 10, 60), ex(core[0]._id, 3, 30, 30)] },
        { day: "Miércoles", exercises: [ex(espalda[1]._id, 3, 10, 75), ex(hombros[1]._id, 3, 12, 45), ex(core[1]._id, 3, 15, 45)] },
        { day: "Viernes", exercises: [ex(piernas[1]._id, 3, 12, 75), ex(brazos[0]._id, 3, 10, 60), ex(brazos[1]._id, 3, 10, 60)] },
      ],
    },
    {
      name: "Resistencia Muscular",
      description: "Alta repetición, bajo descanso para mejorar la resistencia",
      isPublic: false,
      days: [
        { day: "Lunes", exercises: [ex(pecho[1]._id, 4, 25, 30), ex(piernas[2]._id, 4, 20, 30), ex(espalda[0]._id, 3, 15, 30), ex(core[1]._id, 3, 30, 30)] },
        { day: "Jueves", exercises: [ex(piernas[0]._id, 4, 20, 45), ex(pecho[2]._id, 4, 20, 30), ex(hombros[1]._id, 4, 20, 30), ex(cardio[1]._id, 3, 3, 30)] },
      ],
    },
    {
      name: "Upper Body",
      description: "Trabajo completo de tren superior en una sesión",
      isPublic: false,
      days: [
        { day: "Martes", exercises: [ex(pecho[0]._id, 3, 10, 75), ex(espalda[1]._id, 3, 10, 75), ex(hombros[0]._id, 3, 10, 75), ex(brazos[0]._id, 3, 12, 60), ex(brazos[1]._id, 3, 12, 60)] },
        { day: "Viernes", exercises: [ex(pecho[2]._id, 3, 15, 60), ex(espalda[0]._id, 3, 8, 90), ex(hombros[1]._id, 3, 15, 45), ex(brazos[0]._id, 4, 10, 60)] },
      ],
    },
    {
      name: "Fin de Semana Activo",
      description: "Sesión larga para el fin de semana mezclando fuerza y cardio",
      isPublic: true,
      days: [
        { day: "Sábado", exercises: [ex(piernas[0]._id, 4, 10, 90), ex(pecho[0]._id, 4, 10, 75), ex(espalda[2]._id, 3, 6, 120), ex(cardio[0]._id, 1, 20, 0), ex(core[0]._id, 3, 60, 30)] },
        { day: "Domingo", exercises: [ex(cardio[0]._id, 1, 40, 0), ex(core[0]._id, 4, 45, 30), ex(core[1]._id, 3, 20, 45), ex(piernas[2]._id, 3, 15, 60)] },
      ],
    },
  ];

  console.log("\n── Cargando rutinas de German ──");
  for (const r of germanRoutines) {
    const created = await Routine.create({ userId: german._id, ...r });
    console.log(`  ✅ "${created.name}" — ${created.days.length} días`);
  }

  console.log("\n── Cargando rutinas de Carlos ──");
  for (const r of carlosRoutines) {
    const created = await Routine.create({ userId: carlos._id, ...r });
    console.log(`  ✅ "${created.name}" — ${created.days.length} días`);
  }

  const gTotal = await Routine.countDocuments({ userId: german._id });
  const cTotal = await Routine.countDocuments({ userId: carlos._id });

  console.log(`\n✅ Listo! German: ${gTotal} rutinas | Carlos: ${cTotal} rutinas`);
  await mongoose.disconnect();
}

main().catch(console.error);
