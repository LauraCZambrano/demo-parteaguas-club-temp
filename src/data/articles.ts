import article1 from "@/assets/article-1.jpg";
import article2 from "@/assets/article-2.jpg";
import article3 from "@/assets/article-3.jpg";
import article4 from "@/assets/article-4.jpg";
import article5 from "@/assets/article-5.jpg";
import article6 from "@/assets/article-6.jpg";

export type Article = {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  date: string;
  image: string;
  content: string;
  readingTime: number; // minutes
};

export const articles: Article[] = [
  {
    id: "1",
    title: "El arte de pensar en sistemas complejos",
    subtitle: "Cómo los modelos mentales transforman la toma de decisiones en la era de la información.",
    category: "Pensamiento",
    date: "28 Mar 2026",
    image: article1,
    readingTime: 7,
    content: `<p>En un mundo saturado de datos, la capacidad de pensar en sistemas complejos se ha convertido en la habilidad más valiosa del siglo XXI. No se trata simplemente de acumular información, sino de entender las conexiones invisibles que dan forma a nuestra realidad.</p>
<p>Los modelos mentales —esas representaciones simplificadas de cómo funciona el mundo— son las herramientas que utilizan los pensadores más efectivos para navegar la complejidad. Desde Charlie Munger hasta Elon Musk, los líderes que transforman industrias comparten una característica: piensan en redes, no en líneas rectas.</p>
<h2>La trampa del pensamiento lineal</h2>
<p>Nuestro cerebro está diseñado para buscar relaciones causa-efecto directas. Vemos A, esperamos B. Pero los sistemas complejos —desde la economía global hasta los ecosistemas digitales— operan con retroalimentación, retrasos y efectos emergentes que desafían la intuición.</p>
<p>Cuando un gobierno sube los impuestos, el efecto no es simplemente "menos dinero para la gente". Las empresas ajustan precios, los consumidores cambian hábitos, los mercados reaccionan, y el resultado final puede ser radicalmente diferente de lo esperado.</p>
<h2>Construyendo un arsenal de modelos mentales</h2>
<p>La solución no es abandonar la lógica, sino ampliar nuestro repertorio de herramientas cognitivas. Los modelos mentales más poderosos provienen de disciplinas diversas: la inversión de problemas de las matemáticas, los bucles de retroalimentación de la ingeniería, la selección natural de la biología.</p>
<p>El verdadero parteaguas intelectual ocurre cuando dejamos de ver el mundo a través de una sola lente y comenzamos a alternar entre múltiples marcos de referencia.</p>`,
  },
  {
    id: "2",
    title: "Tecnología y sociedad: el dilema de la atención",
    subtitle: "Las plataformas digitales compiten por tu recurso más escaso. ¿Cómo recuperar el control?",
    category: "Tecnología",
    date: "25 Mar 2026",
    image: article2,
    readingTime: 5,
    content: `<p>La economía de la atención no es un concepto nuevo, pero sus implicaciones nunca han sido tan profundas. Cada día, miles de ingenieros optimizan algoritmos diseñados para capturar tu mirada durante un segundo más. Y ese segundo se acumula.</p>
<h2>El costo invisible</h2>
<p>Investigadores de Stanford han demostrado que el cambio constante entre tareas —lo que hacemos cada vez que revisamos el teléfono— reduce nuestra capacidad de pensamiento profundo en un 40%. No es solo tiempo perdido; es capacidad cognitiva que nunca recuperamos.</p>
<p>La ironía es brutal: las herramientas diseñadas para hacernos más productivos nos están haciendo menos capaces de producir trabajo significativo.</p>`,
  },
  {
    id: "3",
    title: "Mercados emergentes: la próxima frontera",
    subtitle: "Por qué los inversores más sofisticados están mirando hacia el sur global.",
    category: "Economía",
    date: "22 Mar 2026",
    image: article3,
    readingTime: 4,
    content: `<p>Mientras los mercados desarrollados luchan contra la inflación y el estancamiento, una revolución silenciosa está ocurriendo en el sur global. África, el sudeste asiático y América Latina están experimentando un boom tecnológico que pocos en Wall Street están monitoreando.</p>
<h2>Los números no mienten</h2>
<p>El PIB combinado de los mercados emergentes superará al de las economías del G7 para 2030. La adopción móvil en África subsahariana crece un 8% anual, creando mercados digitales de cientos de millones de consumidores que saltaron directamente del efectivo al pago móvil.</p>`,
  },
  {
    id: "4",
    title: "Filosofía del diseño: menos es más (o no)",
    subtitle: "El minimalismo como ideología y sus críticos más incisivos.",
    category: "Cultura",
    date: "19 Mar 2026",
    image: article4,
    readingTime: 4,
    content: `<p>El minimalismo se ha convertido en la estética dominante de nuestra era. Desde las interfaces de Apple hasta la arquitectura de lujo, "menos es más" se repite como un mantra incuestionable. Pero, ¿qué ocurre cuando el minimalismo se convierte en dogma?</p>
<h2>La paradoja del minimalismo de lujo</h2>
<p>Es irónico que el minimalismo —originalmente una respuesta al consumismo— se haya convertido en su propia forma de consumo conspicuo. Un sofá "minimalista" de 5,000 dólares comunica estatus precisamente por su aparente simplicidad.</p>`,
  },
  {
    id: "5",
    title: "Innovación desde la periferia",
    subtitle: "Las mejores ideas no nacen en Silicon Valley. Nacen donde duele.",
    category: "Innovación",
    date: "16 Mar 2026",
    image: article5,
    readingTime: 5,
    content: `<p>La narrativa dominante de la innovación nos dice que las grandes ideas nacen en garajes de Palo Alto, financiadas por venture capital y escaladas por genios solitarios. La realidad es mucho más interesante.</p>
<h2>Innovación por necesidad</h2>
<p>M-Pesa nació en Kenia, no en San Francisco. El sistema de pagos móviles que transformó las finanzas de un continente entero fue creado porque los bancos tradicionales ignoraban a millones de personas. La necesidad, no el capital, fue el motor.</p>`,
  },
  {
    id: "6",
    title: "IA y el futuro del trabajo creativo",
    subtitle: "No van a reemplazarte. Pero alguien que sepa usar IA, sí.",
    category: "Tecnología",
    date: "13 Mar 2026",
    image: article6,
    readingTime: 4,
    content: `<p>La inteligencia artificial generativa ha pasado de ser una curiosidad técnica a una herramienta que redefine lo que significa "crear". Pero el debate público sigue atrapado en una dicotomía falsa: IA vs. humanos.</p>
<h2>El verdadero cambio</h2>
<p>La pregunta correcta no es "¿la IA reemplazará a los creativos?" sino "¿qué tipo de creativos prosperarán en un mundo con IA?" La respuesta, como siempre, favorece a los adaptables.</p>`,
  },
];

export const categories = ["Todos", "Pensamiento", "Tecnología", "Economía", "Cultura", "Innovación"];

export type PodcastEpisode = {
  id: string;
  title: string;
  description: string;
  duration: string;
  date: string;
  image: string;
  isNew?: boolean;
};

import podcastCover from "@/assets/podcast-cover.jpg";

export const podcastEpisodes: PodcastEpisode[] = [
  {
    id: "ep1",
    title: "Ep. 47 — ¿Por qué dejamos de leer?",
    description: "Conversamos sobre la crisis de la lectura profunda y cómo recuperar la capacidad de concentración.",
    duration: "42 min",
    date: "26 Mar 2026",
    image: podcastCover47,
    isNew: true,
  },
  {
    id: "ep2",
    title: "Ep. 46 — El mito del emprendedor solitario",
    description: "Desmontamos la narrativa del genio solitario y exploramos cómo realmente nacen las grandes empresas.",
    duration: "38 min",
    date: "19 Mar 2026",
    image: podcastCover46,
  },
  {
    id: "ep3",
    title: "Ep. 45 — América Latina y la revolución fintech",
    description: "Un análisis profundo del ecosistema fintech latinoamericano y su impacto en la inclusión financiera.",
    duration: "51 min",
    date: "12 Mar 2026",
    image: podcastCover45,
  },
];
