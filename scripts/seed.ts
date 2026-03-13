import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/gymapp";

const UserSchema = new mongoose.Schema({ name: String, email: String, password: String, role: String, plan: String }, { timestamps: true });
const ExerciseSchema = new mongoose.Schema({ name: String, category: String, muscleGroup: [String], description: String, videoUrl: String, gifUrl: String, difficulty: String }, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Exercise = mongoose.models.Exercise || mongoose.model("Exercise", ExerciseSchema);

const exercises = [
  { name: "Press de banca", category: "Pecho", muscleGroup: ["Pectoral mayor", "Tríceps", "Deltoides anterior"], description: "Acostado en el banco, bajá la barra al pecho y empujá hacia arriba con control.", videoUrl: "https://www.youtube.com/watch?v=rT7DgCr-3pg", difficulty: "intermediate" },
  { name: "Flexiones", category: "Pecho", muscleGroup: ["Pectoral", "Tríceps", "Core"], description: "En posición de plancha, bajá el cuerpo hasta casi tocar el suelo y empujá hacia arriba.", difficulty: "beginner" },
  { name: "Aperturas con mancuernas", category: "Pecho", muscleGroup: ["Pectoral mayor", "Deltoides anterior"], description: "Acostado, con los brazos extendidos bajalos en arco hasta la altura del pecho.", difficulty: "beginner" },
  { name: "Dominadas", category: "Espalda", muscleGroup: ["Dorsal ancho", "Bíceps", "Romboides"], description: "Colgado de la barra, subí el cuerpo hasta que el mentón supere la barra.", videoUrl: "https://www.youtube.com/watch?v=eGo4IYlbE5g", difficulty: "intermediate" },
  { name: "Remo con barra", category: "Espalda", muscleGroup: ["Dorsal ancho", "Romboides", "Bíceps"], description: "Inclinado hacia adelante, llevá la barra al abdomen manteniendo la espalda recta.", difficulty: "intermediate" },
  { name: "Peso muerto", category: "Espalda", muscleGroup: ["Erector espinal", "Glúteos", "Isquiotibiales", "Trapecio"], description: "Con la barra en el suelo, empujá con las piernas y extendé cadera manteniendo la espalda neutra.", videoUrl: "https://www.youtube.com/watch?v=op9kVnSso6Q", difficulty: "advanced" },
  { name: "Sentadilla", category: "Piernas", muscleGroup: ["Cuádriceps", "Glúteos", "Isquiotibiales"], description: "Con los pies al ancho de hombros, bajá como si fueses a sentarte manteniendo el pecho arriba.", videoUrl: "https://www.youtube.com/watch?v=ultWZbUMPL8", difficulty: "beginner" },
  { name: "Prensa de piernas", category: "Piernas", muscleGroup: ["Cuádriceps", "Glúteos", "Isquiotibiales"], description: "Sentado en la máquina, empujá la plataforma con los pies hasta extender las rodillas.", difficulty: "beginner" },
  { name: "Zancadas", category: "Piernas", muscleGroup: ["Cuádriceps", "Glúteos", "Isquiotibiales"], description: "Da un paso al frente y bajá la rodilla trasera cerca del suelo, luego alternando piernas.", difficulty: "beginner" },
  { name: "Press militar", category: "Hombros", muscleGroup: ["Deltoides", "Tríceps", "Trapecio"], description: "De pie o sentado, empujá la barra desde los hombros hasta arriba de la cabeza.", difficulty: "intermediate" },
  { name: "Elevaciones laterales", category: "Hombros", muscleGroup: ["Deltoides lateral"], description: "Con mancuernas a los lados, levantá los brazos hasta la altura de los hombros.", difficulty: "beginner" },
  { name: "Curl de bíceps", category: "Brazos", muscleGroup: ["Bíceps braquial"], description: "Con mancuernas o barra, flexioná los codos levantando el peso hacia los hombros.", difficulty: "beginner" },
  { name: "Extensión de tríceps en polea", category: "Brazos", muscleGroup: ["Tríceps"], description: "De pie frente a la polea, empujá la barra hacia abajo extendiendo los codos.", difficulty: "beginner" },
  { name: "Plancha", category: "Core", muscleGroup: ["Recto abdominal", "Oblicuos", "Transverso"], description: "En posición de empuje sobre los antebrazos, mantené el cuerpo recto durante el tiempo indicado.", difficulty: "beginner" },
  { name: "Abdominales", category: "Core", muscleGroup: ["Recto abdominal"], description: "Acostado boca arriba, flexioná el tronco llevando los hombros hacia las rodillas.", difficulty: "beginner" },
  { name: "Bicicleta estática", category: "Cardio", muscleGroup: ["Piernas", "Cardiovascular"], description: "Pedaleo continuo en bicicleta estática para trabajo aeróbico.", difficulty: "beginner" },
  { name: "Salto a la comba", category: "Cardio", muscleGroup: ["Pantorrillas", "Cardiovascular"], description: "Saltá la cuerda con ambos pies juntos o alternando. Excelente cardio de alta intensidad.", difficulty: "intermediate" },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Conectado a:", MONGODB_URI.substring(0, 40) + "...");

  await Exercise.deleteMany({});
  await Exercise.insertMany(exercises);
  console.log(`${exercises.length} ejercicios insertados`);

  const existing = await User.findOne({ email: "superadmin@gymapp.com" });
  if (!existing) {
    const hashed = await bcrypt.hash("superadmin123", 12);
    await User.create({ name: "German", email: "superadmin@gymapp.com", password: hashed, role: "superadmin", plan: "pro" });
    console.log("Super admin creado: superadmin@gymapp.com / superadmin123");
  }

  await mongoose.disconnect();
  console.log("Seed completado!");
}

seed().catch(console.error);
