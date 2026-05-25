import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@sanity/client";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);
const STORE_PATH = process.env.DATA_STORE_PATH || path.join(process.cwd(), "data_store.json");

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));

let stateLoadedPromise: Promise<void> | null = null;

function ensureStateLoaded(): Promise<void> {
  if (!stateLoadedPromise) {
    stateLoadedPromise = loadState();
  }
  return stateLoadedPromise;
}

// Middleware to block API requests until database is fully initialized
app.use("/api", async (req, res, next) => {
  try {
    await ensureStateLoaded();
  } catch (err) {
    console.error("Critical error in state loader middleware:", err);
  }
  next();
});

// Sanity Client Initialization
const isSanityConfigured = !!(process.env.SANITY_PROJECT_ID && process.env.SANITY_TOKEN);
let sanityClient: any = null;

if (isSanityConfigured) {
  try {
    sanityClient = createClient({
      projectId: process.env.SANITY_PROJECT_ID,
      dataset: process.env.SANITY_DATASET || "production",
      useCdn: false,
      apiVersion: process.env.SANITY_API_VERSION || "2024-01-01",
      token: process.env.SANITY_TOKEN,
    });
    console.log("Sanity Client initialized successfully!");
  } catch (err) {
    console.error("Failed to initialize Sanity client:", err);
  }
}

// In-Memory state store
let state = {
  products: [
    {
      id: "prod-1",
      name: "Imperial Golden Osetra Caviar Service",
      description: "Directly sourced premium Caspian Sea Osetra caviar served on ice over hand-carved mother-of-pearl spoons with traditional buckwheat blinis, crême fraîche, and chives.",
      price: 320,
      categoryId: "cat-3",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
      status: "available",
      rating: 4.9,
      ratingCount: 42,
      tags: ["Michelin Choice", "Rare Caviar", "Royal Pairings"],
      ingredients: ["Osetra Caviar (50g)", "Warm Blinis", "Egg White Mimosa", "Chives", "Crème Fraîche"],
      preparationTime: 12,
      nutrients: { calories: 240, proteins: "18g", fats: "15g", carbs: "4g" }
    },
    {
      id: "prod-2",
      name: "A5 Miyazaki Wagyu Sirloin Sizzle",
      description: "Ultra-marbleized authentic Japanese Wagyu beef, lightly seared on high-heat volcanic stone. Enhanced with roasted black truffle salt, dynamic shoyu glaze, and fresh wasabi.",
      price: 245,
      categoryId: "cat-4",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
      status: "available",
      rating: 5.0,
      ratingCount: 68,
      tags: ["Signature", "Imported Wagyu", "Chef Choice"],
      ingredients: ["Miyazaki Wagyu (200g)", "Volcanic Sea Salt", "Truffle Reduction", "Pickled Lotus Root"],
      preparationTime: 18,
      nutrients: { calories: 580, proteins: "34g", fats: "48g", carbs: "2g" }
    },
    {
      id: "prod-3",
      name: "Brittany Blue Lobster Thermidor",
      description: "Wild Brittany lobster caught off the pristine French coastline, poached in fine Chablis wine, combined with sliced porcini mushrooms and coated in a lavish Gruyère brandy crust.",
      price: 185,
      categoryId: "cat-3",
      image: "https://images.unsplash.com/photo-1534080391025-a77c7ec4403e?auto=format&fit=crop&w=800&q=80",
      status: "available",
      rating: 4.8,
      ratingCount: 31,
      tags: ["Ocean Classic", "Lobster", "Premium Cooked"],
      ingredients: ["French Blue Lobster", "Cognac VSOP", "Wild Porcini", "Aged Gruyère", "Tarragon Butter"],
      preparationTime: 25,
      nutrients: { calories: 420, proteins: "29g", fats: "22g", carbs: "9g" }
    },
    {
      id: "prod-4",
      name: "Piedmont White Truffle Agnolotti",
      description: "Delicate handmade pillows filled with slow-cooked veal breast, drenched in premium pasture butter, finished with heaps of fresh-shaved Autumn Piedmont white truffles.",
      price: 95,
      categoryId: "cat-2",
      image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80",
      status: "available",
      rating: 4.9,
      ratingCount: 54,
      tags: ["Handmade Pasta", "Autumn Truffles", "V"],
      ingredients: ["Agnolotti Pasta", "Veal Filling", "White Truffles", "Parietal Salt", "Eshire Butter"],
      preparationTime: 15,
      nutrients: { calories: 490, proteins: "16g", fats: "28g", carbs: "44g" }
    },
    {
      id: "prod-5",
      name: "Gold Leaf Valrhona Soufflé",
      description: "70% Valrhona Dark Guanaja chocolate soufflé, perfectly baked till billowing, dusted with edible 24-karat gold gold leaf, and injected with cold Grand Marnier crème anglaise.",
      price: 45,
      categoryId: "cat-5",
      image: "https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=800&q=80",
      status: "available",
      rating: 4.7,
      ratingCount: 89,
      tags: ["Gold Label", "Award Winning", "V"],
      ingredients: ["Valrhona Chocolate 70%", "Organic Eggs", "Grand Marnier liqueur", "24k Gold Leaf", "Tahitian Vanilla"],
      preparationTime: 20,
      nutrients: { calories: 350, proteins: "6g", fats: "18g", carbs: "38g" }
    },
    {
      id: "prod-6",
      name: "Royal Hibiscus Saffron Nectar",
      description: "Sensational mocktail brewed with Egyptian crimson hibiscus petals, organic saffron threads, dynamic botanicals, sparkling volcanic water, finished with a fresh wild mint crown.",
      price: 28,
      categoryId: "cat-6",
      image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
      status: "available",
      rating: 4.6,
      ratingCount: 19,
      tags: ["Elixir", "Organic Tonic", "Refreshing"],
      ingredients: ["Dried Hibiscus", "Saffron Strands", "Elderflower essence", "Sparkling Spring Water", "Mint"],
      preparationTime: 5,
      nutrients: { calories: 95, proteins: "0g", fats: "0g", carbs: "23g" }
    }
  ],
  categories: [
    { id: "cat-1", name: "Signatures", slug: "signatures", description: "Culinary masterpieces of luxury dining", image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80" },
    { id: "cat-2", name: "Appetizers", slug: "appetizers", description: "Curated sensory starters to ignite the journey", image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80" },
    { id: "cat-3", name: "Caviar & Seafood", slug: "seafood", description: "Exquisite delicacies harvested from deep waters", image: "https://images.unsplash.com/photo-1534080391025-a77c7ec4403e?auto=format&fit=crop&w=800&q=80" },
    { id: "cat-4", name: "Mains", slug: "mains", description: "Prime selection proteins and luxurious roasts", image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80" },
    { id: "cat-5", name: "Desserts", slug: "desserts", description: "Gilded confections and hand-spun chocolates", image: "https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=800&q=80" },
    { id: "cat-6", name: "Elixirs", slug: "elixirs", description: "Artisanal cocktails, botanical tonics and rare teas", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80" }
  ],
  orders: [
    {
      id: "ord-1042",
      userId: "user-cust-1",
      userName: "Baroness Charlotte DuPont",
      userEmail: "charlotte@luxe.com",
      items: [
        { productId: "prod-1", productName: "Imperial Golden Osetra Caviar Service", price: 320, quantity: 1, image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=150&q=80" },
        { productId: "prod-5", productName: "Gold Leaf Valrhona Soufflé", price: 45, quantity: 2, image: "https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=150&q=80" }
      ],
      subtotal: 410,
      discountAmount: 82,
      tax: 32.8,
      deliveryFee: 15,
      total: 375.8,
      status: "preparing",
      address: "Château de Sceaux, 92330 Sceaux, France",
      phone: "+33 602 444 888",
      paymentMethod: "Black Centurion Card",
      promoCodeUsed: "ROYAL20",
      trackingNumber: "TRK-98218129",
      createdAt: "2026-05-22T14:15:00Z"
    },
    {
      id: "ord-1041",
      userId: "user-cust-2",
      userName: "Sir Alexander Sterling",
      userEmail: "alex@sterling.com",
      items: [
        { productId: "prod-2", productName: "A5 Miyazaki Wagyu Sirloin Sizzle", price: 245, quantity: 2, image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=150&q=80" }
      ],
      subtotal: 490,
      discountAmount: 0,
      tax: 39.2,
      deliveryFee: 15,
      total: 544.2,
      status: "delivered",
      address: "Hôtel Ritz, 15 Place Vendôme, 75001 Paris",
      phone: "+1 (310) 555-0192",
      paymentMethod: "Apple Pay Platinum",
      createdAt: "2026-05-22T11:02:00Z"
    }
  ],
  reservations: [
    { id: "res-1", userId: "user-cust-1", userName: "Baroness Charlotte DuPont", userEmail: "charlotte@luxe.com", phone: "+33 602 444 888", date: "2026-05-24", time: "19:30", partySize: 4, area: "Chef's Table", notes: "Celebrating wedding anniversary. Requesting champagne bucket on arrival.", status: "confirmed", createdAt: "2026-05-20T11:21:00Z" },
    { id: "res-2", userId: "user-cust-2", userName: "Sir Alexander Sterling", userEmail: "alex@sterling.com", phone: "+1 (310) 555-0192", date: "2026-05-25", time: "20:00", partySize: 2, area: "Wine Cellar", notes: "Allergies to nuts. Private table preferred.", status: "pending", createdAt: "2026-05-21T09:12:00Z" },
    { id: "res-3", userId: "user-cust-1", userName: "Princess Alexandra of Monaco", userEmail: "alexandra@princely.mc", phone: "+377 98 12 34", date: "2026-05-23", time: "21:00", partySize: 6, area: "Main Salon", notes: "Royal entourage. Discretion is paramount.", status: "confirmed", createdAt: "2026-05-22T08:05:00Z" }
  ],
  settings: {
    restaurantName: "L’Olympe Paris",
    logoUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=200&h=200&q=80",
    contactPhone: "+33 (1) 40 55 90 90",
    contactEmail: "concierge@lolympe-paris.com",
    address: "Place de la Concorde, 75008 Paris, France",
    heroTitle: "Culinary Masterpieces Crafting Legendary Legacies",
    heroSubtitle: "Step into an exquisite sanctuary of sensory wonders, crafted with A5 Wagyu, golden caviar spoonfuls, and autumn Piedmont truffles.",
    heroImageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80",
    aboutNarrative: "Founded by three-starred Michelin legend Chef Alain Gauthier, L'Olympe Paris is a sacred union of contemporary chemistry and classic French culinary heritage. Named after the home of gods, our dining chamber offers grand gold glassmorphism arches, an ancient stone wine repository holding 14,000 vintage bottles, and a personalized tableside fire culinary theatre. Every dish is crafted as an oil painting, engineered for those who seek high-art gastronomy.",
    bannerText: "✦ MICHELIN STARS 2026: L’OLYMPE RETAINS ITS HISTORIC THREE STAR DISTINCTION ✦",
    seoKeywords: "Michelin Star Paris, Luxury Fine Dining Paris, A5 Wagyu Caviar Bordeaux, Private Chef Table, Concorde French Restaurant"
  }
};

// Persistence functions
function loadLocalState() {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const data = fs.readFileSync(STORE_PATH, "utf8");
      state = JSON.parse(data);
      console.log("Loaded default state from file repository.");
    } else {
      saveLocalState();
    }
  } catch (err) {
    console.error("Error loading local state:", err);
  }
}

function saveLocalState() {
  try {
    const dir = path.dirname(STORE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(state, null, 2), "utf8");
  } catch (err) {
    console.error("Error saving local state:", err);
  }
}

async function migrateLocalStateToSanity() {
  if (!sanityClient) return;
  try {
    console.log("Migrating starter state to Sanity content lake...");
    const tx = sanityClient.transaction();

    // 1. Settings
    tx.createOrReplace({
      _id: "restaurant-settings",
      _type: "settings",
      ...state.settings
    });

    // 2. Categories
    state.categories.forEach(cat => {
      tx.createOrReplace({
        _id: cat.id,
        _type: "category",
        ...cat
      });
    });

    // 3. Products
    state.products.forEach(prod => {
      tx.createOrReplace({
        _id: prod.id,
        _type: "product",
        ...prod
      });
    });

    // 4. Orders
    state.orders.forEach(order => {
      tx.createOrReplace({
        _id: order.id,
        _type: "order",
        ...order
      });
    });

    // 5. Reservations
    state.reservations.forEach(res => {
      tx.createOrReplace({
        _id: res.id,
        _type: "reservation",
        ...res
      });
    });

    await tx.commit();
    console.log("Migration to Sanity completed successfully!");
  } catch (err) {
    console.error("Migration to Sanity failed:", err);
  }
}

async function loadState() {
  if (isSanityConfigured && sanityClient) {
    try {
      console.log("Connecting to Sanity.io content lake...");

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Sanity query timed out after 3000ms")), 3000)
      );

      const [products, categories, orders, reservations, settingsDoc] = await Promise.race([
        Promise.all([
          sanityClient.fetch(`*[_type == "product"]`),
          sanityClient.fetch(`*[_type == "category"]`),
          sanityClient.fetch(`*[_type == "order"]`),
          sanityClient.fetch(`*[_type == "reservation"]`),
          sanityClient.fetch(`*[_type == "settings" && _id == "restaurant-settings"][0]`)
        ]),
        timeoutPromise
      ]);

      console.log(`Fetched from Sanity: ${products?.length || 0} products, ${categories?.length || 0} categories, ${orders?.length || 0} orders, ${reservations?.length || 0} reservations.`);

      if ((!products || products.length === 0) && (!categories || categories.length === 0)) {
        console.log("Sanity content lake is empty. Migrating default state to Sanity...");
        await migrateLocalStateToSanity();
        // Retry loading after completing the migration with a timeout as well
        const [retryProducts, retryCategories, retryOrders, retryReservations, retrySettings] = await Promise.race([
          Promise.all([
            sanityClient.fetch(`*[_type == "product"]`),
            sanityClient.fetch(`*[_type == "category"]`),
            sanityClient.fetch(`*[_type == "order"]`),
            sanityClient.fetch(`*[_type == "reservation"]`),
            sanityClient.fetch(`*[_type == "settings" && _id == "restaurant-settings"][0]`)
          ]),
          timeoutPromise
        ]);

        state.products = (retryProducts || []).map(({ _id, _type, _rev, _createdAt, _updatedAt, ...rest }: any) => ({ id: rest.id || _id, ...rest }));
        state.categories = (retryCategories || []).map(({ _id, _type, _rev, _createdAt, _updatedAt, ...rest }: any) => ({ id: rest.id || _id, ...rest }));
        state.orders = (retryOrders || []).map(({ _id, _type, _rev, _createdAt, _updatedAt, ...rest }: any) => ({ id: rest.id || _id, ...rest }));
        state.reservations = (retryReservations || []).map(({ _id, _type, _rev, _createdAt, _updatedAt, ...rest }: any) => ({ id: rest.id || _id, ...rest }));
        if (retrySettings) {
          const { _id, _type, _rev, _createdAt, _updatedAt, ...rest } = retrySettings;
          state.settings = rest;
        }
        return;
      }

      state.products = (products || []).map(({ _id, _type, _rev, _createdAt, _updatedAt, ...rest }: any) => ({ id: rest.id || _id, ...rest }));
      state.categories = (categories || []).map(({ _id, _type, _rev, _createdAt, _updatedAt, ...rest }: any) => ({ id: rest.id || _id, ...rest }));
      state.orders = (orders || []).map(({ _id, _type, _rev, _createdAt, _updatedAt, ...rest }: any) => ({ id: rest.id || _id, ...rest }));
      state.reservations = (reservations || []).map(({ _id, _type, _rev, _createdAt, _updatedAt, ...rest }: any) => ({ id: rest.id || _id, ...rest }));

      if (settingsDoc) {
        const { _id, _type, _rev, _createdAt, _updatedAt, ...rest } = settingsDoc;
        state.settings = rest;
      }
      console.log("State synchronized with Sanity.io successfully.");
    } catch (err) {
      console.error("Error loading state from Sanity, falling back to local JSON:", err);
      loadLocalState();
    }
  } else {
    loadLocalState();
  }
}

function saveState() {
  saveLocalState();
}

async function saveStateToSanity(docType: string, id: string, docData: any, isDelete = false) {
  if (!isSanityConfigured || !sanityClient) return;
  try {
    if (isDelete) {
      await sanityClient.delete(id);
      console.log(`Deleted document ${id} of type ${docType} from Sanity.`);
    } else {
      await sanityClient.createOrReplace({
        _id: id,
        _type: docType,
        ...docData
      });
      console.log(`Saved/Updated document ${id} of type ${docType} in Sanity.`);
    }
  } catch (err) {
    console.error(`Failed to save to Sanity for Type: ${docType}, ID: ${id}:`, err);
  }
}

// Initial state load
ensureStateLoaded();

// SSE Clients list
let clients: express.Response[] = [];

// SSE Registration endpoint
app.get("/api/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  
  res.write('data: {"type":"connected"}\n\n');
  
  clients.push(res);
  console.log(`New client connected. Active connections: ${clients.length}`);
  
  req.on("close", () => {
    clients = clients.filter(c => c !== res);
    console.log(`Client disconnected. Active connections: ${clients.length}`);
  });
});

// Broadcast standard event to all active clients
function sendBroadcastUpdate() {
  const payload = JSON.stringify({ type: "state-update", payload: Date.now() });
  clients.forEach(client => {
    client.write(`data: ${payload}\n\n`);
  });
}

// REST API Endpoints

// Get full current live state
app.get("/api/state", (req, res) => {
  res.json(state);
});

// Create Order
app.post("/api/orders", async (req, res) => {
  const order = req.body;
  state.orders = [order, ...state.orders];
  saveState();
  await saveStateToSanity("order", order.id, order);
  sendBroadcastUpdate();
  res.status(201).json({ success: true, order });
});

// Update Order Status
app.put("/api/orders/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  state.orders = state.orders.map(o => o.id === id ? { ...o, status } : o);
  saveState();
  const updatedOrder = state.orders.find(o => o.id === id);
  if (updatedOrder) {
    await saveStateToSanity("order", id, updatedOrder);
  }
  sendBroadcastUpdate();
  res.json({ success: true });
});

// Create Reservation
app.post("/api/reservations", async (req, res) => {
  const reservation = req.body;
  state.reservations = [reservation, ...state.reservations];
  saveState();
  await saveStateToSanity("reservation", reservation.id, reservation);
  sendBroadcastUpdate();
  res.status(201).json({ success: true, reservation });
});

// Update Reservation Status
app.put("/api/reservations/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  state.reservations = state.reservations.map(r => r.id === id ? { ...r, status } : r);
  saveState();
  const updatedRes = state.reservations.find(r => r.id === id);
  if (updatedRes) {
    await saveStateToSanity("reservation", id, updatedRes);
  }
  sendBroadcastUpdate();
  res.json({ success: true });
});

// Category Endpoints
app.post("/api/categories", async (req, res) => {
  const cat = req.body;
  state.categories.push(cat);
  saveState();
  await saveStateToSanity("category", cat.id, cat);
  sendBroadcastUpdate();
  res.json({ success: true, cat });
});

app.delete("/api/categories/:id", async (req, res) => {
  const { id } = req.params;
  state.categories = state.categories.filter(c => c.id !== id);
  saveState();
  await saveStateToSanity("category", id, null, true);
  sendBroadcastUpdate();
  res.json({ success: true });
});

// Product Endpoints
app.post("/api/products", async (req, res) => {
  const prod = req.body;
  state.products = [prod, ...state.products];
  saveState();
  await saveStateToSanity("product", prod.id, prod);
  sendBroadcastUpdate();
  res.json({ success: true, prod });
});

app.put("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  state.products = state.products.map(p => p.id === id ? { ...p, ...req.body } : p);
  saveState();
  const updatedProd = state.products.find(p => p.id === id);
  if (updatedProd) {
    await saveStateToSanity("product", id, updatedProd);
  }
  sendBroadcastUpdate();
  res.json({ success: true });
});

app.delete("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  state.products = state.products.filter(p => p.id !== id);
  saveState();
  await saveStateToSanity("product", id, null, true);
  sendBroadcastUpdate();
  res.json({ success: true });
});

// Settings Endpoint
app.put("/api/settings", async (req, res) => {
  state.settings = { ...state.settings, ...req.body };
  saveState();
  await saveStateToSanity("settings", "restaurant-settings", state.settings);
  sendBroadcastUpdate();
  res.json({ success: true, settings: state.settings });
});

// Sanity status API
app.get("/api/sanity-status", (req, res) => {
  res.json({
    configured: isSanityConfigured,
    projectId: process.env.SANITY_PROJECT_ID || null,
    dataset: process.env.SANITY_DATASET || "production",
    apiVersion: process.env.SANITY_API_VERSION || "2024-01-01"
  });
});

// Lazy Gemini Client and AI Concierge Chat Route
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not defined");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });
  }
  return aiClient;
}

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const ai = getGeminiClient();

    // Compile dynamic context from state
    const restaurantName = state.settings.restaurantName || "L'Olympe Paris";
    const contactInfo = `Phone: ${state.settings.contactPhone}, Email: ${state.settings.contactEmail}, Address: ${state.settings.address}`;
    const narrative = state.settings.aboutNarrative || "";
    const activeCategories = state.categories.map(c => `- ${c.name}: ${c.description}`).join("\n");
    const activeProducts = state.products.map(p => {
      const cat = state.categories.find(c => c.id === p.categoryId);
      const catName = cat ? cat.name : "Other";
      return `- [${p.name}] Price: $${p.price} | Category: ${catName} | Tags: ${p.tags?.join(", ") || "None"} | Ingredients: ${p.ingredients?.join(", ") || "N/A"}\n  Description: ${p.description}`;
    }).join("\n\n");

    const systemInstruction = `You are "Ambrosia", the elegant AI Concierge of ${restaurantName}. Speak with incredible prestige, grace, high-art luxury, and polite hospitality. You reflect our three-Michelin-starred distinction.

Context about ${restaurantName}:
Address, Phone, Contacts: ${contactInfo}
General Narrative of the Restaurant:
${narrative}

Our Fine Menu Categories:
${activeCategories}

Our Gilded Signature Dishes and Delicacies (Live Menu):
${activeProducts}

Your Instructions:
1. Speak with French gastronomic elegance but clear English prose.
2. Rely strictly on the Live Menu, settings, prices, and locations provided. Do not invent products or dishes we do not have. If asked for something not on the menu, graciously apologize and suggest one of our actual premium menu items (like A5 Wagyu, Caviar, Brittany Blue Lobster, Piedmont White Truffles, or Valrhona Soufflé) or custom culinary theater experiences!
3. Welcome guests warmly. Address them with premium hospitality.
4. Keep your responses engaging, beautifully formatted in Markdown paragraphs, relatively brief (within 150 words) so they look magnificent on a floating side widget. Feel free to use subtle gourmet descriptions!`;

    // Support chat history format if provided
    const contents = [];
    if (history && Array.isArray(history)) {
      for (const turn of history) {
        contents.push({
          role: turn.role,
          parts: [{ text: turn.text }]
        });
      }
    }

    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Concierge Chat error:", error);
    res.status(500).json({ error: error.message || "Ambrosia is currently attending other corporate dining lines." });
  }
});

// Vite Middleware integration for production/dev
async function startServer() {
  if (process.env.VERCEL) {
    console.log("On Vercel environment: Bypassing local server listener.");
    return;
  }

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`L'Olympe Paris full-stack server running on http://localhost:${PORT}`);
  });
}

startServer();

export default app;
