import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Define __dirname in ES Modules safely
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initial product catalog with inventory, ratings, and reviews
let productsDb = [
  {
    id: "ves-01",
    name: "Ceramic Brewing Vessel",
    price: 64,
    category: "Vessels",
    tagline: "Hand-thrown clay teapot with raw tactile slip.",
    description: "A quiet companion for your morning ritual. Each teapot is slowly spun on a kick-wheel in Kyoto, left unglazed on the exterior to showcase the direct, earthly texture of iron-rich clay. The micro-porous interior mellows water and softens bitter notes over time.",
    details: [
      "Micro-porous local unglazed clay",
      "Holds approximately 380ml of extraction water",
      "Integrated hand-pierced clay filter",
      "Wipe clean with warm water, avoid soaps to preserve natural seasoning"
    ],
    colorName: "Muted Ochre",
    bgClass: "bg-[#F2ECE4]",
    accentClass: "text-[#C07F5F]",
    dimensions: "14cm × 9.5cm × 8cm",
    material: "Natural Iron-rich Clay",
    stock: 8,
    reviews: [
      { id: "rev-1", author: "Yuki M.", rating: 5, comment: "Brings absolute stillness to my afternoons. Beautiful finish.", verified: true, date: "2026-05-12" },
      { id: "rev-2", author: "David K.", rating: 4, comment: "Lovely texture, handles temperature beautifully. Authentic piece.", verified: true, date: "2026-05-18" }
    ]
  },
  {
    id: "rit-02",
    name: "Basalt Aroma Diffuser Set",
    price: 48,
    category: "Rituals",
    tagline: "Raw volcanic rock plate paired with pure Hinoki leaf oil.",
    description: "A silent, heatless scent experience. Place 3–5 drops of the wildcrafted mountain Hinoki oil directly onto the porous volcanic basalt disc. The slow, ambient evaporation naturally releases a woody, grounding aroma that anchors your immediate breathing space.",
    details: [
      "Includes one raw-cut Icelandic basalt rock slab",
      "Pairing bottle of 10ml pure steam-distilled Cypress/Hinoki oil",
      "No power cord, completely passive, safe, and flame-free diffuser",
      "Encourages micro-mindfulness during daily setup"
    ],
    colorName: "Charcoal Basalt",
    bgClass: "bg-[#ECE8E1]",
    accentClass: "text-[#4A5D4E]",
    dimensions: "11cm diameter slabs",
    material: "Volcanic Basalt & Pure Hinoki Essential Oil",
    stock: 12,
    reviews: [
      { id: "rev-3", author: "Lina R.", rating: 5, comment: "Such a gentle scent. Passive diffusion is much calmer than humidifiers.", verified: true, date: "2026-05-10" }
    ]
  },
  {
    id: "tex-03",
    name: "Undyed Linen Meditation Journal",
    price: 36,
    category: "Textiles",
    tagline: "Hand-press linen binding with FSC cotton-rag pages.",
    description: "Designed as a physical container for unhurried thoughts. Bound in coarse, organic unbleached flax linen that softens with handling. Pages are completely blank and thick enough to hold light ink wash or charcoal sketches without bleed-through.",
    details: [
      "160 pages of heavyweight 120gsm cotton-rag paper",
      "Flat-lay exposure thread binding prevents spine stiffening",
      "Cover wrapped in undyed, water-retted organic flax linen",
      "Subtle woven bookmark ribbon in dry grass tone"
    ],
    colorName: "Flax Beige",
    bgClass: "bg-[#F5F1EB]",
    accentClass: "text-[#A07B5C]",
    dimensions: "13cm × 19cm (Standard A5)",
    material: "100% Belgian Flax & Recycled Cotton Rag",
    stock: 15,
    reviews: [
      { id: "rev-4", author: "Marcus S.", rating: 5, comment: "I write here on screen-free Sundays. The paper feels incredibly rich.", verified: true, date: "2026-05-20" }
    ]
  },
  {
    id: "obj-04",
    name: "Volcanic Sand Timer",
    price: 42,
    category: "Objects",
    tagline: "A physical metric of 15 minutes of uninterrupted focus.",
    description: "Step away from screen-based alerts. This seamless glass gravity timer houses pure, dark volcanic sand. Watch the gentle, continuous flow representing 15 minutes of visual silence. The slow, rhythmic descent operates without a single digital ping.",
    details: [
      "Mouth-blown borosilicate glass bulb",
      "Naturally sifted Black volcanic sand from Honshū shores",
      "Sized precisely for a single meditation or tea-steeping interval",
      "Whisper-quiet movement avoids sudden mechanical alarms"
    ],
    colorName: "Soothing Silica",
    bgClass: "bg-[#EAE4DB]",
    accentClass: "text-[#7D766E]",
    dimensions: "6.5cm × 16cm",
    material: "Borosilicate Glass & Sifted Volcanic Sand",
    stock: 4, // low stock indicator trigger!
    reviews: []
  },
  {
    id: "ves-05",
    name: "Terracotta Bud Vase",
    price: 38,
    category: "Vessels",
    tagline: "An earthen pedestal for a single sprig of wildflower.",
    description: "Celebrate singular beauty. Inspired by rustic Roman artifacts, this clay bud vase is finished with a thin wash of dry ash glaze. Designed intentionally narrow to support just one delicate bloom, wild grass, or simple seeding branch picked on a walk.",
    details: [
      "Wood-fired kiln terracotta with wood-ash slip finish",
      "Narrow neck keeps individual botanicals standing tall and proud",
      "Heavy weighted base prevents tipping under water weight",
      "Each piece is unique with subtle flame-flashed markings"
    ],
    colorName: "Burnt Clay",
    bgClass: "bg-[#F2EAE0]",
    accentClass: "text-[#B86E53]",
    dimensions: "7.5cm × 12.5cm",
    material: "Coarse Earth Terracotta",
    stock: 10,
    reviews: [
      { id: "rev-5", author: "Elena P.", rating: 5, comment: "A single piece of barley on my table. Beautiful and modest.", verified: true, date: "2026-05-25" }
    ]
  },
  {
    id: "tex-06",
    name: "Waffle Organic Cotton Throw",
    price: 90,
    category: "Textiles",
    tagline: "Light, textured cotton-linen blend for quiet moments.",
    description: "A comforting, tactile layer of warmth. Woven on slow looms, the double-waffle pattern creates insulated air pockets that provide lightweight warmth. Softened of any industrial stiffness using an ancient spring-water wash technique.",
    details: [
      "GOTS-certified 80% Organic Cotton and 20% Field Linen",
      "Generous waffle structure creates high-density micro-shadows",
      "Breathable and cozy, perfect for drafting or evening journaling",
      "Pre-shrunk, machine-washable in soft, cool cycles"
    ],
    colorName: "Lichen Moss",
    bgClass: "bg-[#EAEAEA]",
    accentClass: "text-[#64705F]",
    dimensions: "140cm × 200cm",
    material: "Organic Cotton & Dry Flax Linen",
    stock: 6,
    reviews: []
  },
  {
    id: "rit-07",
    name: "Wild Cypress Incense Brick Pack",
    price: 24,
    category: "Rituals",
    tagline: "Slow burn incense hand-formed of pure hinoki leaf wood.",
    description: "An invitation to clear the air. These slow-burning small blocks are hand-mixed from raw, powdered mountain cypress wood and tree-sap binders. Burning one brick releases a pure, resinous woody fog that replicates the humid silence of deep old-growth forests.",
    details: [
      "Includes 18 slow-burn compressed wooden cubes",
      "Packaged in an elegant, biodegradable pressed-paper box",
      "Includes one small fired stoneware coin incense stand",
      "Average burn time of 22 minutes per individual brick"
    ],
    colorName: "Hinoki Green",
    bgClass: "bg-[#E3DFD5]",
    accentClass: "text-[#505D4E]",
    dimensions: "18 bricks + ceramic coin stand",
    material: "Powdered Hinoki Moss, Cypress Sap, and Pine Resin",
    stock: 22,
    reviews: [
      { id: "rev-6", author: "Hiroshi I.", rating: 4, comment: "Smells of rain in Kyoto forest. Takes away heavy digital fatigue.", verified: true, date: "2026-05-15" }
    ]
  },
  {
    id: "obj-08",
    name: "Raw Brass Presentation Tray",
    price: 55,
    category: "Objects",
    tagline: "An elevated, unpolished catchall plate for personal relics.",
    description: "A home for your grounding items. Cut from solid, unlacquered brass plate, this resting dish will slowly darken over months, capturing a unique, golden-brown oxidized trace of your daily placements. Perfect for keys, a watch, or burning incense.",
    details: [
      "1.5mm thick pure solid raw unlacquered brass plate",
      "Smoothly hand-filed rounded corners and shallow, elegant lip",
      "Untreated finish will patina beautifully and uniquely with age",
      "Restores easily to bright shine using simple citrus acid polish"
    ],
    colorName: "Aged Brass",
    bgClass: "bg-[#EFEAE2]",
    accentClass: "text-[#967C46]",
    dimensions: "18cm × 9cm × 0.8cm",
    material: "100% Solid Raw Brass",
    stock: 9,
    reviews: []
  }
];

// Orders DB (in-memory persistent list for admin and profiles)
let ordersDb: any[] = [
  {
    id: "SLW-948123",
    items: [
      { product: productsDb[0], quantity: 1 }
    ],
    total: 64,
    shippingAddress: {
      fullName: "Sven Lindqvist",
      email: "sven@visualsilence.org",
      addressLine: "Fjordgatan 12A",
      city: "Portland",
      postalCode: "97201",
      country: "United States"
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    status: "dispatched",
    deliveryStatus: "shipped", // processing, shipped, delivered
    trackingCode: "TRK-SLW-8821",
    carrier: "GreenPost Bicycle Curation"
  },
  {
    id: "SLW-441221",
    items: [
      { product: productsDb[1], quantity: 1 },
      { product: productsDb[6], quantity: 2 }
    ],
    total: 96,
    shippingAddress: {
      fullName: "Anna Sterling",
      email: "anna@calmstudio.co",
      addressLine: "Whisper Lane 7",
      city: "Seattle",
      postalCode: "98101",
      country: "United States"
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    status: "confirmed",
    deliveryStatus: "processing", // processing, shipped, delivered
    trackingCode: "TRK-SLW-9911",
    carrier: "Eco-Freight Postal Curation"
  }
];

// Real-time Analytics Logs & Heatmap state
let activeSessions = 4;
let conversionRate = 2.4; 
let visitorLogs: any[] = [
  { id: 1, action: "Viewed Ceramic Brewing Vessel", time: "2 mins ago", path: "/details/ves-01" },
  { id: 2, action: "Added Volcanic Sand Timer to Crate", time: "5 mins ago", path: "/shop" },
  { id: 3, action: "Inspected Lichen Cotton Throw", time: "9 mins ago", path: "/details/tex-06" },
  { id: 4, action: "Browsed Rituals collection", time: "11 mins ago", path: "/shop?cat=Rituals" },
];

// Simple coordinate-based heatmap grid (representing main sections)
let coordinateHeatmap: { [key: string]: number } = {
  "hero-banner": 84,
  "product-grid-ves-01": 67,
  "product-grid-rit-02": 52,
  "product-grid-tex-03": 45,
  "product-grid-obj-04": 78,
  "ai-assistant-toggle": 92,
  "calm-mode-toggle": 114,
  "checkout-complete": 28
};

// Lazy initialize Gemini API Client with Telemetry User-Agent
let aiClient: GoogleGenAI | null = null;
const isGeminiEnabled = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

  app.use(express.json());

  // Log incoming hits for Real-Time Analytics Dashboard
  app.use((req, res, next) => {
    // Basic hit logger for user telemetry simulation
    if (req.method === "POST" && req.url.startsWith("/api/ai")) {
      activeSessions = Math.max(1, activeSessions + (Math.random() > 0.5 ? 1 : -1));
    }
    next();
  });

  // --- API ROUTE: Products Admin CRUD ---
  
  app.get("/api/products", (req, res) => {
    res.json(productsDb);
  });

  app.post("/api/products", (req, res) => {
    const { name, price, category, tagline, description, details, colorName, bgClass, accentClass, dimensions, material, stock } = req.body;
    
    if (!name || !price || !category) {
      return res.status(400).json({ error: "Product name, price, and category are required." });
    }

    const newId = `${category.toLowerCase().slice(0, 3)}-${Math.floor(10 + Math.random() * 90)}`;
    const newProduct = {
      id: newId,
      name,
      price: Number(price),
      category,
      tagline: tagline || "Hand-formed aesthetic artifact.",
      description: description || "A quiet piece celebrating natural grain.",
      details: Array.isArray(details) ? details : [details || "Natural sustainable manufacturing"],
      colorName: colorName || "Earth Muted",
      bgClass: bgClass || "bg-[#F5F2EB]",
      accentClass: accentClass || "text-charcoal-700",
      dimensions: dimensions || "Various",
      material: material || "Sustainable Materials",
      stock: Number(stock) || 10,
      reviews: []
    };

    productsDb.push(newProduct);
    
    // Add visitor log
    visitorLogs.unshift({
      id: Date.now(),
      action: `Admin added product: "${name}"`,
      time: "Just now",
      path: "/admin"
    });

    res.status(201).json(newProduct);
  });

  app.put("/api/products/:id", (req, res) => {
    const { id } = req.params;
    const findIndex = productsDb.findIndex(p => p.id === id);

    if (findIndex === -1) {
      return res.status(404).json({ error: "Product not found." });
    }

    const existing = productsDb[findIndex];
    const updated = {
      ...existing,
      ...req.body,
      price: req.body.price !== undefined ? Number(req.body.price) : existing.price,
      stock: req.body.stock !== undefined ? Number(req.body.stock) : existing.stock,
    };

    productsDb[findIndex] = updated;
    res.json(updated);
  });

  app.delete("/api/products/:id", (req, res) => {
    const { id } = req.params;
    const initialLen = productsDb.length;
    productsDb = productsDb.filter(p => p.id !== id);

    if (productsDb.length === initialLen) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.json({ success: true, message: "Product deleted successfully." });
  });

  // --- API ROUTE: Adding product reviews with AI moderation ---
  app.post("/api/products/:id/reviews", async (req, res) => {
    const { id } = req.params;
    const { author, rating, comment } = req.body;
    
    const product = productsDb.find(p => p.id === id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (!author || !rating || !comment) {
      return res.status(400).json({ error: "Review fields author, rating, comment are required" });
    }

    // AI/Regex based double moderate check
    let ratingScore = Number(rating);
    let isSpam = false;
    let moderationStatus = "Approved";

    const normalizedComment = comment.toLowerCase();

    // Soft local rule check before calling Gemini
    if (normalizedComment.includes("buy cheap sex") || normalizedComment.includes("crypto scam") || normalizedComment.includes("casino free money")) {
      isSpam = true;
      moderationStatus = "Rejected (Spam)";
    }

    if (!isSpam && isGeminiEnabled) {
      try {
        const ai = getGeminiClient();
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: `Evaluate this customer review for spam, extreme profanity, or toxic behavior. Return a JSON object with two fields: "isSpam" (boolean) and "status" ("Approved" or "Rejected"). Keep context of visual-silence storefront. Review comment: "${comment}"`,
          config: {
            responseMimeType: "application/json"
          }
        });
        
        const resJson = JSON.parse(response.text || "{}");
        if (resJson.isSpam) {
          isSpam = true;
          moderationStatus = resJson.status || "Rejected (Spam)";
        }
      } catch (e) {
        console.error("AI moderation error, continuing with local rules", e);
      }
    }

    if (isSpam) {
      return res.status(400).json({ error: `Review was filtered by AI moderation. Reason: ${moderationStatus}` });
    }

    const newReview = {
      id: `rev-${Date.now()}`,
      author,
      rating: ratingScore,
      comment,
      verified: true,
      date: new Date().toISOString().split("T")[0]
    };

    product.reviews.push(newReview);
    
    // Update live visitor activities
    visitorLogs.unshift({
      id: Date.now(),
      action: `Guest submitted review for ${product.name}`,
      time: "Just now",
      path: `/details/${id}`
    });

    res.json({ success: true, reviews: product.reviews });
  });

  // --- API ROUTE: Orders Admin ---
  app.get("/api/orders", (req, res) => {
    res.json(ordersDb);
  });

  app.post("/api/orders", (req, res) => {
    const { items, total, shippingAddress } = req.body;
    if (!items || items.length === 0 || !shippingAddress) {
      return res.status(400).json({ error: "Incomplete order specifications." });
    }

    // Calculate actual total
    const computedTotal = items.reduce((acc: number, item: any) => {
      const match = productsDb.find(p => p.id === item.product.id);
      if (match) {
        // Decrement actual stock
        match.stock = Math.max(0, match.stock - item.quantity);
        return acc + match.price * item.quantity;
      }
      return acc;
    }, 0);

    const newOrder = {
      id: `SLW-${Math.floor(100000 + Math.random() * 900000)}`,
      items,
      total: computedTotal || total,
      shippingAddress,
      createdAt: new Date().toISOString(),
      status: "confirmed",
      deliveryStatus: "processing", // processing, shipped, delivered
      trackingCode: `TRK-SLW-${Math.floor(1000 + Math.random() * 9000)}`,
      carrier: "Eco-Freight Postal Curation"
    };

    ordersDb.unshift(newOrder);

    // Track analytics conversion
    visitorLogs.unshift({
      id: Date.now(),
      action: `Placed order for $${newOrder.total}`,
      time: "Just now",
      path: "/checkout"
    });
    
    // Increment conversion rate slightly
    conversionRate = Number((2.4 + ordersDb.length * 0.15).toFixed(2));

    res.json(newOrder);
  });

  app.put("/api/orders/:id", (req, res) => {
    const { id } = req.params;
    const { deliveryStatus } = req.body;
    
    const findIndex = ordersDb.findIndex(o => o.id === id);
    if (findIndex === -1) {
      return res.status(404).json({ error: "Order not found." });
    }

    ordersDb[findIndex] = {
      ...ordersDb[findIndex],
      deliveryStatus,
      status: deliveryStatus === "delivered" ? "confirmed" : ordersDb[findIndex].status
    };

    res.json(ordersDb[findIndex]);
  });

  // --- API ROUTE: Real-time Analytics Feed & Telemetry logging ---
  app.get("/api/analytics", (req, res) => {
    res.json({
      activeSessions,
      conversionRate,
      visitorLogs,
      coordinateHeatmap
    });
  });

  app.post("/api/analytics/track", (req, res) => {
    const { elementId, action, path } = req.body;
    if (elementId && coordinateHeatmap[elementId] !== undefined) {
      coordinateHeatmap[elementId] += 1;
    } else if (elementId) {
      coordinateHeatmap[elementId] = 1;
    }

    if (action) {
      visitorLogs.unshift({
        id: Date.now(),
        action,
        time: "Just now",
        path: path || "/"
      });
      if (visitorLogs.length > 20) {
        visitorLogs.pop();
      }
    }
    res.json({ success: true });
  });


  // --- API ROUTE: AI PERSONAL STYLIST / SHOPPING ASSISTANT ---
  app.post("/api/ai/chat", async (req, res) => {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Missing message payload." });
    }

    // Format products catalog context
    const productsContext = productsDb.map(p => `- ID: ${p.id}, ${p.name}, Price: $${p.price}, Category: ${p.category}, Description: ${p.description}`).join("\n");

    const systemPrompt = `You are the thoughtful, slow, and calming AI Stylist and Curator of "BLANX Store". 
The store champions visual silence, raw basalt, undyed linen, organic terracotta, unlacquered solid brass, Kyoto brewing vessels, and unhurried meditation rituals. 
Speak in a highly polite, peaceful, authentic, and deliberate voice. Keep paragraphs short (maximum 2-3 paragraphs). 
You recommend combinations, select outfits or objects based on specific moods (e.g. anxiety relief, visual calm, tactile tea ceremony), and help visitors finding quiet grounding objects.
If they ask for products under a certain price (like $50), filter the catalog for them and make precise suggestions. Do not recommend products that aren't in our catalog!

Our products catalog:
${productsContext}

Provide a thoughtful, serene response matching this visual tranquility.`;

    if (isGeminiEnabled) {
      try {
        const ai = getGeminiClient();
        
        // Reassemble structured chat context or history if provided
        const messageParts: any[] = [];
        if (history && Array.isArray(history)) {
          history.forEach(h => {
            messageParts.push({ text: `${h.role === "user" ? "Visitor" : "Curator"}: ${h.text}` });
          });
        }
        messageParts.push({ text: `Visitor: ${message}` });

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: messageParts.map(p => p.text).join("\n"),
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.7
          }
        });

        return res.json({ text: response.text });
      } catch (e: any) {
        console.error("Gemini API error in /api/ai/chat", e);
        return res.status(500).json({ error: `Gemini API invocation failed: ${e.message}` });
      }
    } else {
      // Return beautiful, smart static curated rule answers corresponding to the request to avoid failing the user list!
      const userMsg = message.toLowerCase();
      let responseText = "Greetings. In this quiet corner, let us consider what brings genuine grounding to your space.\n\n";

      if (userMsg.includes("50") || userMsg.includes("under")) {
        responseText += "Under $50, I highly suggest centering your morning routines around our **Basalt Aroma Diffuser Set ($48)** or stepping away from screens with our **Volcanic Sand Timer ($42)**. Alternatively, you can clear the air cleanly with our **Wild Cypress Incense Brick Pack ($24)**. These objects ask for very little, needing no cables, and providing a subtle passive sensory space.";
      } else if (userMsg.includes("outfit") || userMsg.includes("apparel") || userMsg.includes("wear") || userMsg.includes("clothe") || userMsg.includes("linen")) {
        responseText += "For an elegant, restful posture, matching the **Waffle Organic Cotton Throw ($90)** wrapped softly around you, paired with the unbleached texture of the **Undyed Linen Meditation Journal ($36)** creates an tactile cocoon which encourages soft reflective breathing.";
      } else if (userMsg.includes("tea") || userMsg.includes("brew") || userMsg.includes("drink") || userMsg.includes("vessel")) {
        responseText += "To anchor your afternoons, consider pairing the wood-fired **Ceramic Brewing Vessel ($64)** with a single wild grass sprig in our **Terracotta Bud Vase ($38)** on your desk. The feel of hot unglazed raw Kyoto iron clay brings immediate focus to your hands.";
      } else {
        responseText += "Our complete curation is built of raw linen, wood-fired clay, passivated volcanic rock, and hand-filed unlacquered brass. Tell me what kind of energy you are trying to anchor in your room right now (e.g. calming focus, morning ritual, passive wood scent) and let me guide you gently.";
      }

      return res.json({ text: responseText });
    }
  });


  // --- API ROUTE: AI STYLE MATCHER & curated visual grids ---
  app.post("/api/ai/style-match", async (req, res) => {
    const { phrase } = req.body;
    if (!phrase) {
      return res.status(400).json({ error: "Missing phrase to match style." });
    }

    const catalogsList = productsDb.map(p => `* id: "${p.id}", name: "${p.name}", price: $${p.price}, category: "${p.category}", tagline: "${p.tagline}", colors: "${p.colorName}"`).join("\n");

    const sysPrompt = `You are the Master of Aesthetic Harmony for the BLANX Store.
Given an design intent, vibe, description, or mood (such as "minimal beige calm outfit" or "dark volcanic stone focus desk"), you select 2-3 matching products from our list, outputting a JSON object.
Do NOT recommend unavailable items. Return EXACTLY a JSON structure with:
{
  "themeName": "A brief, aesthetic name for the visual style matching this",
  "commentary": "A serene poetic styling commentary of 2 sentences max explaining the pairing's connection.",
  "matchedProductIds": ["id-1", "id-2"] // Must be exact IDs from the catalog list!
}

Products:
${catalogsList}`;

    if (isGeminiEnabled) {
      try {
        const ai = getGeminiClient();
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: `Select curated items matching this vibe: "${phrase}"`,
          config: {
            systemInstruction: sysPrompt,
            responseMimeType: "application/json"
          }
        });

        const outputMatch = JSON.parse(response.text || "{}");
        return res.json(outputMatch);
      } catch (e) {
        console.error("Gemini API error in /api/ai/style-match, fallbacking", e);
      }
    }

    // Smart Local Rule Matching Fallback
    const norm = phrase.toLowerCase();
    let themeName = "Natural Earth Study";
    let commentary = "We have paired pure volcanic passive diffusion together with Kyoto iron-thrown teapots to align tactile focus and aromatic clarity.";
    let matchedProductIds = ["ves-01", "rit-02"];

    if (norm.includes("beige") || norm.includes("linen") || norm.includes("journal") || norm.includes("light")) {
      themeName = "Flaxen Solitude Study";
      commentary = "A delicate grouping of natural unbleached linen journals paired with raw solid brass plates to anchor daily writings with shifting golden copper patinas.";
      matchedProductIds = ["tex-03", "obj-08"];
    } else if (norm.includes("stone") || norm.includes("dark") || norm.includes("lava") || norm.includes("focus")) {
      themeName = "Volcanic Basalt Sanctuary";
      commentary = "Centering on sifted Japanese shore sand gravity timers with passive Icelandic rock scent blocks, creating a screen-free focus timer.";
      matchedProductIds = ["rit-02", "obj-04"];
    } else if (norm.includes("plant") || norm.includes("vase") || norm.includes("flower") || norm.includes("clay")) {
      themeName = "Earthen Wildflowers Sanctuary";
      commentary = "Wood-ash slip clay teapots combined with rustic terracotta single sprig bud vases, designed to celebrate simple Kyoto floral textures.";
      matchedProductIds = ["ves-01", "ves-05"];
    }

    res.json({ themeName, commentary, matchedProductIds });
  });


  // --- API ROUTE: AI INTELLIGENT SEARCH (Aesthetic semantics & intent filters) ---
  app.post("/api/ai/search", async (req, res) => {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Missing query parameter." });
    }

    const catalogsList = productsDb.map(p => `* ID: "${p.id}", Name: "${p.name}", Price: $${p.price}, Category: "${p.category}", Tagline: "${p.tagline}", Description: "${p.description}"`).join("\n");

    const sysPrompt = `You are the Search Curation Engine of the BLANX Store.
Instead of dumb text keyword matches, you analyze user queries (which may contain budgets e.g., "pot under 70$", colors, or abstract visual descriptions like " Kyoto morning tea experience") and find matching items.
Return a JSON object containing matching item IDs and a short semantic reason.

Return exactly this JSON format:
{
  "semanticAnalysis": "Brief explanation of what the user is looking for (maximum 1 sentence)",
  "matchedProductIds": ["id-1", "id-2"], // Ordered list of exact IDs that match. Empty if nothing fits.
  "budgetLimit": 120 // Parsed budget limit if any detected, or null
}

Our items database:
${catalogsList}`;

    if (isGeminiEnabled) {
      try {
        const ai = getGeminiClient();
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: `Analyze and search the catalog for: "${query}"`,
          config: {
            systemInstruction: sysPrompt,
            responseMimeType: "application/json"
          }
        });

        const outputSearch = JSON.parse(response.text || "{}");
        return res.json(outputSearch);
      } catch (e) {
        console.error("Gemini API error in semantic search, fallbacking", e);
      }
    }

    // Smart Local Rule Search fallback
    const norm = query.toLowerCase();
    let semanticAnalysis = `Seeking calm products related to "${query}" in our visual curation.`;
    let matchedProductIds: string[] = [];
    let budgetLimit: number | null = null;

    // Detect budget
    const moneyMatch = norm.match(/(\d+)\s*\$?|\$?\s*(\d+)/);
    if (moneyMatch) {
      budgetLimit = Number(moneyMatch[1] || moneyMatch[2]);
    }

    // Match keywords semantic categories
    if (norm.includes("tea") || norm.includes("brew") || norm.includes("kyoto") || norm.includes("clay") || norm.includes("pot")) {
      matchedProductIds.push("ves-01");
    }
    if (norm.includes("stone") || norm.includes("diffuser") || norm.includes("scent") || norm.includes("oil") || norm.includes("rock") || norm.includes("hinoki")) {
      matchedProductIds.push("rit-02");
    }
    if (norm.includes("journal") || norm.includes("write") || norm.includes("linen") || norm.includes("paper") || norm.includes("sketch")) {
      matchedProductIds.push("tex-03");
    }
    if (norm.includes("timer") || norm.includes("sand") || norm.includes("clock") || norm.includes("time") || norm.includes("minute")) {
      matchedProductIds.push("obj-04");
    }
    if (norm.includes("vase") || norm.includes("flower") || norm.includes("clay") || norm.includes("rose") || norm.includes("bud")) {
      matchedProductIds.push("ves-05");
    }
    if (norm.includes("throw") || norm.includes("blanket") || norm.includes("cotton") || norm.includes("warm") || norm.includes("fabric") || norm.includes("sofa")) {
      matchedProductIds.push("tex-06");
    }
    if (norm.includes("incense") || norm.includes("smoke") || norm.includes("brick") || norm.includes("cypress") || norm.includes("burn")) {
      matchedProductIds.push("rit-07");
    }
    if (norm.includes("tray") || norm.includes("brass") || norm.includes("gold") || norm.includes("dish") || norm.includes("plate") || norm.includes("catchall")) {
      matchedProductIds.push("obj-08");
    }

    // Default if everything empty, search description substrings
    if (matchedProductIds.length === 0) {
      productsDb.forEach(p => {
        if (p.name.toLowerCase().includes(norm) || p.description.toLowerCase().includes(norm) || p.category.toLowerCase().includes(norm)) {
          matchedProductIds.push(p.id);
        }
      });
    }

    // Filter by budget if present
    if (budgetLimit !== null) {
      semanticAnalysis = `Parsed a maximum budget constraint of $${budgetLimit}. Displaying affordable matches.`;
      matchedProductIds = matchedProductIds.filter(id => {
        const prod = productsDb.find(p => p.id === id);
        return prod ? prod.price <= (budgetLimit as number) : false;
      });
    }

    res.json({ semanticAnalysis, matchedProductIds, budgetLimit });
  });


  // --- API ROUTE: AI CART OPTIMIZER (Companion upsells, bundle offers & pricing tricks) ---
  app.post("/api/ai/cart-optimizer", async (req, res) => {
    const { cartItems } = req.body;
    if (!cartItems || !Array.isArray(cartItems)) {
      return res.status(400).json({ error: "Missing cartItems array." });
    }

    const cartTotal = cartItems.reduce((sum, item: any) => sum + (item.product.price * item.quantity), 0);
    const dbSummary = productsDb.map(p => `* ID: "${p.id}", Name: "${p.name}", Price: $${p.price}, category: "${p.category}"`).join("\n");
    const cartSummary = cartItems.map((item: any) => `- ${item.product.name} (Qty ${item.quantity})`).join("\n");

    const sysPrompt = `You are the Cart optimizer and Companion Companion of "BLANX Store".
The storefront offers FREE eco-friendly dispatch and compostable giftwrapping for curated crates totaling $150 or more.
Given a list of items currently in the cart (totaling $${cartTotal}), analyze and recommend a single highly aligned item to reach the $150 limit, or a lovely complementary object.
Speak concisely, in exactly 2-3 gentle sentences.

Return EXACTLY a JSON structure with:
{
  "cartFeedback": "Personalized gentle feedback suggesting how they can improve their crate, mentioning free shipping if applicable.",
  "recommendedItemId": "ID of recommended product",
  "qualifiesForFreeShipping": ${cartTotal >= 150}
}

Our catalog:
${dbSummary}`;

    if (isGeminiEnabled) {
      try {
        const ai = getGeminiClient();
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: `Optimize cart having total price $${cartTotal} and these items: \n${cartSummary}`,
          config: {
            systemInstruction: sysPrompt,
            responseMimeType: "application/json"
          }
        });

        const outputOpt = JSON.parse(response.text || "{}");
        return res.json(outputOpt);
      } catch (e) {
        console.error("Gemini API error in cart optimization, fallback", e);
      }
    }

    // Smart Local Rule Fallback
    const threshold = 150;
    const diff = threshold - cartTotal;
    let feedback = "";
    let recommendedItemId = "rit-02"; // default diffuser

    if (cartTotal === 0) {
      feedback = "Your morning ritual folder is blank. Begin by centering your desk with our Basalt Aroma Diffuser Set ($48) which passive disperses cypress steam wild Hinoki.";
      recommendedItemId = "rit-02";
    } else if (cartTotal < threshold) {
      // Find a product that fits the gap or is nearby
      const bestFit = productsDb.find(p => p.price >= diff && p.price <= diff + 30) || productsDb[4]; // Terracotta pot or similar
      feedback = `You are just $${diff} away from our complimentary compostable parcel shipping (threshold $150). Pairing your current curation with a wood-fired ${bestFit.name} ($${bestFit.price}) will elevate your layout beautifully while crossing the threshold.`;
      recommendedItemId = bestFit.id;
    } else {
      // Already over threshold
      const uniqueCatsInCart = new Set(cartItems.map((i: any) => i.product.category));
      let suggested = productsDb.find(p => !uniqueCatsInCart.has(p.category)) || productsDb[2]; // Journal
      feedback = `Sensational curation! Your crate exceeds $150, qualifying for free zero-emission dispatch. To complement your selection, we recommend adding our hand-bound ${suggested.name} ($${suggested.price}) for calm weekend journaling.`;
      recommendedItemId = suggested.id;
    }

    res.json({
      cartFeedback: feedback,
      recommendedItemId,
      qualifiesForFreeShipping: cartTotal >= threshold
    });
  });


  // Serve frontend files
  if (process.env.NODE_ENV !== "production") {
    // Vite Dev Server middleware mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    // Production static files service
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Slow Store Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
