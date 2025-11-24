import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Categorías base del sistema
const CATEGORIAS = [
  'Ascensor',
  'Electricidad',
  'Plomería',
  'Filtraciones',
  'Seguridad',
  'Limpieza',
  'Otros'
];

// Reglas de prioridad
const PRIORIDAD_RULES = {
  'Ascensor': 'alta',
  'Filtraciones': 'alta',
  'Electricidad': 'media',
  'Plomería': 'media',
  'Seguridad': 'alta',
  'Limpieza': 'baja',
  'Otros': 'baja'
};

// Clasificador simple basado en palabras clave (fallback)
const clasificarSimple = (texto) => {
  const textoLower = texto.toLowerCase();

  // Palabras clave por categoría
  const keywords = {
    'Ascensor': ['ascensor', 'elevador', 'montacargas', 'no funciona', 'atascado'],
    'Electricidad': ['luz', 'electricidad', 'cortocircuito', 'interruptor', 'cable', 'corriente', 'lámpara'],
    'Plomería': ['agua', 'caño', 'cañería', 'grifo', 'llave', 'inodoro', 'baño', 'cocina', 'desagüe'],
    'Filtraciones': ['filtración', 'goteo', 'humedad', 'agua', 'techo', 'pared', 'mancha'],
    'Seguridad': ['seguridad', 'portero', 'cerradura', 'puerta', 'cámara', 'alarma'],
    'Limpieza': ['limpieza', 'basura', 'sucio', 'barrido', 'limpiar']
  };

  // Contar coincidencias
  const scores = {};
  for (const [categoria, palabras] of Object.entries(keywords)) {
    scores[categoria] = palabras.filter(palabra => textoLower.includes(palabra)).length;
  }

  // Encontrar categoría con mayor score
  const categoria = Object.keys(scores).reduce((a, b) => 
    scores[a] > scores[b] ? a : b
  );

  // Si no hay coincidencias, usar "Otros"
  if (scores[categoria] === 0) {
    return { categoria: 'Otros', confianza: 0.5 };
  }

  const confianza = Math.min(scores[categoria] / 3, 1);

  return { categoria, confianza };
};

// Clasificar usando OpenAI (si está disponible)
const clasificarConIA = async (texto) => {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const prompt = `Clasifica la siguiente incidencia de un edificio en una de estas categorías: ${CATEGORIAS.join(', ')}.
    
Incidencia: "${texto}"

Responde SOLO con el nombre de la categoría más apropiada, sin explicaciones.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 10
    });

    const categoriaIA = response.choices[0].message.content.trim();
    
    // Verificar que la categoría es válida
    const categoria = CATEGORIAS.find(c => 
      c.toLowerCase() === categoriaIA.toLowerCase()
    ) || 'Otros';

    return { categoria, confianza: 0.9 };
  } catch (error) {
    console.error('Error en clasificación IA:', error);
    return null;
  }
};

// Función principal de clasificación
export const clasificarIncidencia = async (texto) => {
  if (!texto || texto.trim().length === 0) {
    return {
      categoria: 'Otros',
      prioridad: 'baja',
      confianza: 0
    };
  }

  // Intentar con IA primero
  let resultado = await clasificarConIA(texto);

  // Fallback a clasificador simple
  if (!resultado) {
    resultado = clasificarSimple(texto);
  }

  const { categoria, confianza } = resultado;
  const prioridad = PRIORIDAD_RULES[categoria] || 'baja';

  return {
    categoria,
    prioridad,
    confianza
  };
};

