import { Product } from './types';

export const CATEGORIES = ['All', 'Vessels', 'Rituals', 'Textiles', 'Objects'];

export const PRODUCTS: Product[] = [
  {
    id: 'ves-01',
    name: 'Ceramic Brewing Vessel',
    price: 64,
    category: 'Vessels',
    tagline: 'Hand-thrown clay teapot with raw tactile slip.',
    description: 'A quiet companion for your morning ritual. Each teapot is slowly spun on a kick-wheel in Kyoto, left unglazed on the exterior to showcase the direct, earthly texture of iron-rich clay. The micro-porous interior mellows water and softens bitter notes over time.',
    details: [
      'Micro-porous local unglazed clay',
      'Holds approximately 380ml of extraction water',
      'Integrated hand-pierced clay filter',
      'Wipe clean with warm water, avoid soaps to preserve natural seasoning'
    ],
    colorName: 'Muted Ochre',
    bgClass: 'bg-[#F2ECE4]', // Soft warm warm-beige
    accentClass: 'text-[#C07F5F]', // Terracotta accent
    dimensions: '14cm × 9.5cm × 8cm',
    material: 'Natural Iron-rich Clay'
  },
  {
    id: 'rit-02',
    name: 'Basalt Aroma Diffuser Set',
    price: 48,
    category: 'Rituals',
    tagline: 'Raw volcanic rock plate paired with pure Hinoki leaf oil.',
    description: 'A silent, heatless scent experience. Place 3–5 drops of the wildcrafted mountain Hinoki oil directly onto the porous volcanic basalt disc. The slow, ambient evaporation naturally releases a woody, grounding aroma that anchors your immediate breathing space.',
    details: [
      'Includes one raw-cut Icelandic basalt rock slab',
      'Pairing bottle of 10ml pure steam-distilled Cypress/Hinoki oil',
      'No power cord, completely passive, safe, and flame-free diffuser',
      'Encourages micro-mindfulness during daily setup'
    ],
    colorName: 'Charcoal Basalt',
    bgClass: 'bg-[#ECE8E1]', // Soft gray sand
    accentClass: 'text-[#4A5D4E]', // Cypress green accent
    dimensions: '11cm diameter slabs',
    material: 'Volcanic Basalt & Pure Hinoki Essential Oil'
  },
  {
    id: 'tex-03',
    name: 'Undyed Linen Meditation Journal',
    price: 36,
    category: 'Textiles',
    tagline: 'Hand-press linen binding with FSC cotton-rag pages.',
    description: 'Designed as a physical container for unhurried thoughts. Bound in coarse, organic unbleached flax linen that softens with handling. Pages are completely blank and thick enough to hold light ink wash or charcoal sketches without bleed-through.',
    details: [
      '160 pages of heavyweight 120gsm cotton-rag paper',
      'Flat-lay exposure thread binding prevents spine stiffening',
      'Cover wrapped in undyed, water-retted organic flax linen',
      'Subtle woven bookmark ribbon in dry grass tone'
    ],
    colorName: 'Flax Beige',
    bgClass: 'bg-[#F5F1EB]', // Light ivory beige
    accentClass: 'text-[#A07B5C]', // Wheat brown accent
    dimensions: '13cm × 19cm (Standard A5)',
    material: '100% Belgian Flax & Recycled Cotton Rag'
  },
  {
    id: 'obj-04',
    name: 'Volcanic Sand Timer',
    price: 42,
    category: 'Objects',
    tagline: 'A physical metric of 15 minutes of uninterrupted focus.',
    description: 'Step away from screen-based alerts. This seamless glass gravity timer houses pure, dark volcanic sand. Watch the gentle, continuous flow representing 15 minutes of visual silence. The slow, rhythmic descent operates without a single digital ping.',
    details: [
      'Mouth-blown borosilicate glass bulb',
      'Naturally sifted Black volcanic sand from Honshū shores',
      'Sized precisely for a single meditation or tea-steeping interval',
      'Whisper-quiet movement avoids sudden mechanical alarms'
    ],
    colorName: 'Soothing Silica',
    bgClass: 'bg-[#EAE4DB]', // Slightly cooler beige
    accentClass: 'text-[#7D766E]', // Dark stone accent
    dimensions: '6.5cm × 16cm',
    material: 'Borosilicate Glass & Sifted Volcanic Sand'
  },
  {
    id: 'ves-05',
    name: 'Terracotta Bud Vase',
    price: 38,
    category: 'Vessels',
    tagline: 'An earthen pedestal for a single sprig of wildflower.',
    description: 'Celebrate singular beauty. Inspired by rustic Roman artifacts, this clay bud vase is finished with a thin wash of dry ash glaze. Designed intentionally narrow to support just one delicate bloom, wild grass, or simple seeding branch picked on a walk.',
    details: [
      'Wood-fired kiln terracotta with wood-ash slip finish',
      'Narrow neck keeps individual botanicals standing tall and proud',
      'Heavy weighted base prevents tipping under water weight',
      'Each piece is unique with subtle flame-flashed markings'
    ],
    colorName: 'Burnt Clay',
    bgClass: 'bg-[#F2EAE0]', // Warm earthy background
    accentClass: 'text-[#B86E53]', // Warm terracotta accent
    dimensions: '7.5cm × 12.5cm',
    material: 'Coarse Earth Terracotta'
  },
  {
    id: 'tex-06',
    name: 'Waffle Organic Cotton Throw',
    price: 90,
    category: 'Textiles',
    tagline: 'Light, textured cotton-linen blend for quiet moments.',
    description: 'A comforting, tactile layer of warmth. Woven on slow looms, the double-waffle pattern creates insulated air pockets that provide lightweight warmth. Softened of any industrial stiffness using an ancient spring-water wash technique.',
    details: [
      'GOTS-certified 80% Organic Cotton and 20% Field Linen',
      'Generous waffle structure creates high-density micro-shadows',
      'Breathable and cozy, perfect for drafting or evening journaling',
      'Pre-shrunk, machine-washable in soft, cool cycles'
    ],
    colorName: 'Lichen Moss',
    bgClass: 'bg-[#EAEAEA]', // Muted gray-white
    accentClass: 'text-[#64705F]', // Lichen green accent
    dimensions: '140cm × 200cm',
    material: 'Organic Cotton & Dry Flax Linen'
  },
  {
    id: 'rit-07',
    name: 'Wild Cypress Incense Brick Pack',
    price: 24,
    category: 'Rituals',
    tagline: 'Slow burn incense hand-formed of pure hinoki leaf wood.',
    description: 'An invitation to clear the air. These slow-burning small blocks are hand-mixed from raw, powdered mountain cypress wood and tree-sap binders. Burning one brick releases a pure, resinous woody fog that replicates the humid silence of deep old-growth forests.',
    details: [
      'Includes 18 slow-burn compressed wooden cubes',
      'Packaged in an elegant, biodegradable pressed-paper box',
      'Includes one small fired stoneware coin incense stand',
      'Average burn time of 22 minutes per individual brick'
    ],
    colorName: 'Hinoki Green',
    bgClass: 'bg-[#E3DFD5]', // Sage sand background
    accentClass: 'text-[#505D4E]', // Forest green accent
    dimensions: '18 bricks + ceramic coin stand',
    material: 'Powdered Hinoki Moss, Cypress Sap, and Pine Resin'
  },
  {
    id: 'obj-08',
    name: 'Raw Brass Presentation Tray',
    price: 55,
    category: 'Objects',
    tagline: 'An elevated, unpolished catchall plate for personal relics.',
    description: 'A home for your grounding items. Cut from solid, unlacquered brass plate, this resting dish will slowly darken over months, capturing a unique, golden-brown oxidized trace of your daily placements. Perfect for keys, a watch, or burning incense.',
    details: [
      '1.5mm thick pure solid raw unlacquered brass plate',
      'Smoothly hand-filed rounded corners and shallow, elegant lip',
      'Untreated finish will patina beautifully and uniquely with age',
      'Restores easily to bright shine using simple citrus acid polish'
    ],
    colorName: 'Aged Brass',
    bgClass: 'bg-[#EFEAE2]', // Warm grain background
    accentClass: 'text-[#967C46]', // Subtle gold/mustard accent
    dimensions: '18cm × 9cm × 0.8cm',
    material: '100% Solid Raw Brass'
  }
];
