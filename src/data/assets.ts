export type ArtworkCategory = 'painting' | 'sketch';

export interface LightArtwork {
  id: string;
  title: string;
  description: string;
  src: string;
  theme: string;
  category: ArtworkCategory;
  medium: string;
  isColorSketch?: boolean;
}

export const LIGHT_ARTWORKS: LightArtwork[] = [
  // --- 1. Inspiring Nature Color & Graphite Sketches (14 Total) ---
  {
    id: 'sketch-hummingbird',
    title: 'Hummingbird & Wild Cherry Blossoms',
    description: 'Delicate watercolor pencil & fine ink sketch of an iridescent hummingbird sipping blossom nectar',
    src: '/src/assets/images/sketch_hummingbird_blossoms_1790658318255.jpg',
    theme: 'Joy & Renewal',
    category: 'sketch',
    medium: 'Watercolor Pencil & Ink Wash',
    isColorSketch: true
  },
  {
    id: 'sketch-waterfall',
    title: 'Mountain Waterfall & Emerald Ferns',
    description: 'Atmospheric colored charcoal and cyan watercolor wash of a cascading forest waterfall',
    src: '/src/assets/images/sketch_misty_waterfall_1790658328650.jpg',
    theme: 'Living Waters',
    category: 'sketch',
    medium: 'Colored Charcoal & Emerald Wash',
    isColorSketch: true
  },
  {
    id: 'sketch-sunset-lake',
    title: 'Golden Sunset Lake & Rustic Pier',
    description: 'Warm colored pencil and amber sepia sketch of calm evening water and sunset reflections',
    src: '/src/assets/images/sketch_golden_sunset_lake_1790658341375.jpg',
    theme: 'Evening Solace',
    category: 'sketch',
    medium: 'Colored Pencil & Amber Wash',
    isColorSketch: true
  },
  {
    id: 'sketch-deer',
    title: 'Gentle Deer in Sunlit Morning Mist',
    description: 'Tender colored pencil drawing of a mother deer and fawn grazing quietly among meadow flowers',
    src: '/src/assets/images/sketch_deer_morning_mist_1790658352737.jpg',
    theme: 'Tender Care',
    category: 'sketch',
    medium: 'Colored Pencil & Fine Graphite',
    isColorSketch: true
  },
  {
    id: 'sketch-birch-path',
    title: 'Golden Autumn Birch Trail',
    description: 'Vibrant autumn colored pencil and gouache sketch of a sun-dappled winding path of fallen leaves',
    src: '/src/assets/images/sketch_autumn_birch_path_1790658363635.jpg',
    theme: 'Seasonal Seasons',
    category: 'sketch',
    medium: 'Colored Pencil & Soft Gouache',
    isColorSketch: true
  },
  {
    id: 'sketch-lavender-bee',
    title: 'Provence Lavender & Honeybee Dew',
    description: 'Exquisite botanical colored pencil and soft violet watercolor sketch of lavender in morning sun',
    src: '/src/assets/images/sketch_lavender_bee_1790658375152.jpg',
    theme: 'Sweet Stillness',
    category: 'sketch',
    medium: 'Botanical Colored Pencil & Wash',
    isColorSketch: true
  },
  {
    id: 'sketch-alpine-wildflowers',
    title: 'Alpine Wildflowers & Snow Peaks',
    description: 'Inspiring colored pencil sketch of blue gentians and edelweiss blooming on high mountain ridges',
    src: '/src/assets/images/sketch_alpine_wildflower_peak_1790658385162.jpg',
    theme: 'Unshakable Heights',
    category: 'sketch',
    medium: 'Colored Pencil & Soft Pastel',
    isColorSketch: true
  },
  {
    id: 'sketch-cypress-cliffs',
    title: 'Coastal Cypress & Turquoise Waves',
    description: 'Pen, ink and sea-green watercolor wash of windswept coastal trees overlooking ocean cliffs',
    src: '/src/assets/images/sketch_coastal_cypress_cliffs_1790658397008.jpg',
    theme: 'Deep Peace',
    category: 'sketch',
    medium: 'Ink & Marine Watercolor Wash',
    isColorSketch: true
  },
  {
    id: 'sketch-cherry-blossom',
    title: 'Cherry Blossoms on Whispering Brook',
    description: 'Serene colored pencil and blush pink wash sketch of floating blossom petals on clear ripples',
    src: '/src/assets/images/sketch_cherry_blossom_stream_1790658409929.jpg',
    theme: 'Spring Awakening',
    category: 'sketch',
    medium: 'Colored Pencil & Rose Wash',
    isColorSketch: true
  },
  {
    id: 'sketch-sunflower',
    title: 'Morning Sunflowers of Joy',
    description: 'Warm colored pencil and golden yellow wash sketch of radiant sunflowers greeting dawn',
    src: '/src/assets/images/sketch_sunflower_dawn_1790658419796.jpg',
    theme: 'Radiant Praise',
    category: 'sketch',
    medium: 'Colored Pencil & Golden Wash',
    isColorSketch: true
  },
  {
    id: 'sketch-forest',
    title: 'Sunlit Forest & Whispering Stream',
    description: 'Delicate pencil and charcoal drawing of a clear forest stream with morning light filtering through pines',
    src: '/src/assets/images/sketch_forest_stream_1790657111880.jpg',
    theme: 'Nature & Renewal',
    category: 'sketch',
    medium: 'Charcoal & Fine Pencil on Cotton'
  },
  {
    id: 'sketch-lighthouse',
    title: 'Beacon Shore & Sunrise Horizon',
    description: 'Fine pen and sepia wash sketch of tranquil coastal dunes, ocean waves, and a distant lighthouse',
    src: '/src/assets/images/sketch_ocean_lighthouse_1790657123396.jpg',
    theme: 'Guidance & Stillness',
    category: 'sketch',
    medium: 'Fountain Pen & Sepia Wash'
  },
  {
    id: 'sketch-meadow',
    title: 'Wildflower Meadow & Gentle Breeze',
    description: 'Botanical graphite drawing of summer daisies, sweet lavender, and swallowtail butterflies',
    src: '/src/assets/images/sketch_wildflower_meadow_1790657134481.jpg',
    theme: 'Joy of Creation',
    category: 'sketch',
    medium: 'Delicate Botanical Graphite'
  },
  {
    id: 'sketch-eagle',
    title: 'Soaring Above the Mountain Peaks',
    description: 'Atmospheric charcoal landscape drawing of an eagle soaring high above misty mountain summits',
    src: '/src/assets/images/sketch_soaring_eagle_1790657143357.jpg',
    theme: 'Strength & Elevation',
    category: 'sketch',
    medium: 'Charcoal Landscape on Textured Linen'
  },

  // --- 2. Devotional Faith Sketches (8 Total) ---
  {
    id: 'sketch-prayer',
    title: 'Hands in Quiet Prayer',
    description: 'Delicate pencil and charcoal drawing of gentle prayerful hands holding an olive branch',
    src: '/src/assets/images/sketch_prayer_hands_1790603871589.jpg',
    theme: 'Quiet Devotion',
    category: 'sketch',
    medium: 'Fine-Line Pencil & Charcoal on Linen'
  },
  {
    id: 'sketch-shepherd',
    title: 'The Good Shepherd & Gentle Lamb',
    description: 'Tender fine-line graphite and charcoal sketch of the Good Shepherd carrying a young lamb',
    src: '/src/assets/images/sketch_good_shepherd_1790656481067.jpg',
    theme: 'Gentle Protection',
    category: 'sketch',
    medium: 'Pencil & Soft Wash on Cotton'
  },
  {
    id: 'sketch-cathedral',
    title: 'Cathedral Arch & Morning Sunbeams',
    description: 'Architectural pen, ink, and sepia wash sketch of historic sanctuary windows and dawn rays',
    src: '/src/assets/images/sketch_cathedral_dawn_1790603884562.jpg',
    theme: 'Holy Sanctuary',
    category: 'sketch',
    medium: 'Fountain Pen & Sepia Wash'
  },
  {
    id: 'sketch-cross',
    title: 'Botanical Cross & Wild Lilies',
    description: 'Delicate graphite pencil sketch of tender olive leaves and lilies draped on a cross',
    src: '/src/assets/images/sketch_botanical_cross_1790603897596.jpg',
    theme: 'Eternal Hope',
    category: 'sketch',
    medium: 'Botanical Graphite Sketch'
  },
  {
    id: 'sketch-olive',
    title: 'Ancient Olive Grove of Peace',
    description: 'Exquisite fine ink and charcoal pencil sketch of ancient gnarled olive trees at sunrise',
    src: '/src/assets/images/sketch_olive_grove_1790656495630.jpg',
    theme: 'Still Waters',
    category: 'sketch',
    medium: 'Pen, Ink & Charcoal on Cream'
  },
  {
    id: 'sketch-anchor',
    title: 'Anchor of Steadfast Hope',
    description: 'Delicate botanical graphite drawing of an anchor intertwined with blooming lilies (Hebrews 6:19)',
    src: '/src/assets/images/sketch_anchor_hope_1790656506548.jpg',
    theme: 'Unshakeable Trust',
    category: 'sketch',
    medium: 'Archival Graphite Drawing'
  },
  {
    id: 'sketch-path',
    title: 'Path of the Faithful Ascent',
    description: 'Atmospheric charcoal landscape drawing of a winding trail toward the sunlit dawn crest',
    src: '/src/assets/images/sketch_mountain_path_1790603909105.jpg',
    theme: 'Pilgrim’s Journey',
    category: 'sketch',
    medium: 'Charcoal on Textured Vintage Paper'
  },
  {
    id: 'sketch-bible',
    title: 'Devotional Bible & Candlelight',
    description: 'Fine-line graphite drawing of an open Bible beside a softly glowing candle and wild rose',
    src: '/src/assets/images/sketch_bible_candle_1790656517599.jpg',
    theme: 'Sacred Word',
    category: 'sketch',
    medium: 'Graphite & Sepia Wash on Aged Linen'
  },

  // --- 3. Impressionist Fine Art Paintings (8 Total) ---
  {
    id: 'monet-water-lilies',
    title: 'Monet Garden & Water Lilies',
    description: 'Impressionist oil painting of tranquil pond water lilies, weeping willows, and soft cloud reflections',
    src: '/src/assets/images/painting_monet_water_lilies_1790658434425.jpg',
    theme: 'Still Waters',
    category: 'painting',
    medium: 'Impressionist Oil on Canvas'
  },
  {
    id: 'provence-poppies',
    title: 'Provencal Hills & Red Poppies',
    description: 'Vibrant sunlit oil painting of rolling hills covered in scarlet wildflowers and golden wheat',
    src: '/src/assets/images/painting_provence_poppies_1790658445765.jpg',
    theme: 'Joy of Creation',
    category: 'painting',
    medium: 'Vibrant Impressionist Oil'
  },
  {
    id: 'celestial-dawn',
    title: 'Celestial Dawn & Golden Light',
    description: 'Radiant atmospheric oil painting of divine golden light breaking through lavender clouds',
    src: '/src/assets/images/painting_celestial_dawn_1790658456218.jpg',
    theme: 'Morning Grace',
    category: 'painting',
    medium: 'Atmospheric Luminous Oil'
  },
  {
    id: 'chapel-meadow',
    title: 'Stone Chapel in Wildflower Dusk',
    description: 'Quaint historic stone chapel in a blooming meadow with warm glowing stained glass at sunset',
    src: '/src/assets/images/painting_quiet_chapel_meadow_1790658466796.jpg',
    theme: 'Sanctuary of Peace',
    category: 'painting',
    medium: 'Fine Art Oil & Watercolor'
  },
  {
    id: 'hero',
    title: 'Morning Sunbeams & Wildflower Light',
    description: 'Golden dawn illumination breaking through soft pastel clouds over a peaceful meadow',
    src: '/src/assets/images/daily_light_hero_1790594897369.jpg',
    theme: 'Morning Grace',
    category: 'painting',
    medium: 'Soft Oil & Filmic Pastel'
  },
  {
    id: 'sanctuary',
    title: 'Peaceful Sanctuary & Lavender Hills',
    description: 'Serene rolling lavender hills with streaming sun rays of quiet spiritual solace',
    src: '/src/assets/images/peaceful_sanctuary_1790594909516.jpg',
    theme: 'Still Waters',
    category: 'painting',
    medium: 'Impressionist Watercolor'
  },
  {
    id: 'blooms',
    title: 'Gratitude Peonies in Gentle Dawn',
    description: 'Soft botanical blush peonies and eucalyptus beside an open morning journal',
    src: '/src/assets/images/gratitude_blooms_1790594920758.jpg',
    theme: 'Thankfulness',
    category: 'painting',
    medium: 'Botanical Still Life'
  },
  {
    id: 'mountain',
    title: 'Mount of Steadfast Faith',
    description: 'Majestic mountain sunrise with misty soft peach and periwinkle horizons',
    src: '/src/assets/images/faith_mountain_1790594931568.jpg',
    theme: 'Unshakeable Trust',
    category: 'painting',
    medium: 'Atmospheric Landscape'
  }
];

export const DEFAULT_HERO_IMAGE = LIGHT_ARTWORKS[0].src;
