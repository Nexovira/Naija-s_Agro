import express from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { DEFAULT_CMS_DATA } from './src/data/defaultCMSData';
import { AppCMSData, RFQRecord } from './src/types';

const STORE_PATH = path.join(process.cwd(), 'data', 'cms-store.json');
const AUTH_STORE_PATH = path.join(process.cwd(), 'data', 'auth-store.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'), { recursive: true });
}

// Helper to read/write store
function getCMSData(): AppCMSData {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading cms-store.json, falling back to default:', err);
  }
  // Initialize with default
  saveCMSData(DEFAULT_CMS_DATA);
  return DEFAULT_CMS_DATA;
}

function saveCMSData(data: AppCMSData) {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving cms-store.json:', err);
  }
}

interface AuthCredentials {
  email: string;
  passwordHash: string; // In production this would be hashed; here simple check or stored string
  tokenSecret: string;
}

function getAuthCredentials(): AuthCredentials {
  try {
    if (fs.existsSync(AUTH_STORE_PATH)) {
      const raw = fs.readFileSync(AUTH_STORE_PATH, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (e) {
    // fallback
  }
  const defaultAuth: AuthCredentials = {
    email: 'admin@naijaglobalagro.com',
    passwordHash: 'AgroExport2026!',
    tokenSecret: 'naija-agro-jwt-secret-session-key-2026'
  };
  fs.writeFileSync(AUTH_STORE_PATH, JSON.stringify(defaultAuth, null, 2), 'utf-8');
  return defaultAuth;
}

function saveAuthCredentials(creds: AuthCredentials) {
  fs.writeFileSync(AUTH_STORE_PATH, JSON.stringify(creds, null, 2), 'utf-8');
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '15mb' }));

  // --- API Routes ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Get full CMS Data
  app.get('/api/cms/all', (req, res) => {
    const data = getCMSData();
    res.json(data);
  });

  // Auth: Login
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const creds = getAuthCredentials();
    const cmsData = getCMSData();

    if (
      email &&
      password &&
      email.trim().toLowerCase() === creds.email.toLowerCase() &&
      password === creds.passwordHash
    ) {
      const token = `token_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      return res.json({
        success: true,
        token,
        user: cmsData.adminUser || DEFAULT_CMS_DATA.adminUser
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid credentials. Default is admin@naijaglobalagro.com / AgroExport2026!'
    });
  });

  // Auth: Update Admin Account
  app.post('/api/auth/update-account', (req, res) => {
    const { name, email, newPassword, currentPassword, avatarUrl } = req.body;
    const creds = getAuthCredentials();
    const cmsData = getCMSData();

    if (currentPassword && currentPassword !== creds.passwordHash) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }

    if (newPassword && newPassword.trim().length >= 6) {
      creds.passwordHash = newPassword.trim();
    }
    if (email && email.trim()) {
      creds.email = email.trim();
    }
    saveAuthCredentials(creds);

    cmsData.adminUser = {
      ...cmsData.adminUser,
      name: name || cmsData.adminUser.name,
      email: creds.email,
      avatarUrl: avatarUrl || cmsData.adminUser.avatarUrl
    };
    saveCMSData(cmsData);

    res.json({ success: true, user: cmsData.adminUser });
  });

  // Update Homepage
  app.put('/api/cms/homepage', (req, res) => {
    const cmsData = getCMSData();
    cmsData.homepage = { ...cmsData.homepage, ...req.body };
    saveCMSData(cmsData);
    res.json({ success: true, homepage: cmsData.homepage });
  });

  // Update Site Settings
  app.put('/api/cms/site-settings', (req, res) => {
    const cmsData = getCMSData();
    cmsData.siteSettings = { ...cmsData.siteSettings, ...req.body };
    saveCMSData(cmsData);
    res.json({ success: true, siteSettings: cmsData.siteSettings });
  });

  // Update Contact Settings
  app.put('/api/cms/contact-settings', (req, res) => {
    const cmsData = getCMSData();
    cmsData.contactSettings = { ...cmsData.contactSettings, ...req.body };
    saveCMSData(cmsData);
    res.json({ success: true, contactSettings: cmsData.contactSettings });
  });

  // Update RFQ Settings
  app.put('/api/cms/rfq-settings', (req, res) => {
    const cmsData = getCMSData();
    cmsData.rfqSettings = { ...cmsData.rfqSettings, ...req.body };
    saveCMSData(cmsData);
    res.json({ success: true, rfqSettings: cmsData.rfqSettings });
  });

  // Products CRUD
  app.post('/api/cms/products', (req, res) => {
    const cmsData = getCMSData();
    const newProduct = req.body;
    if (!newProduct.id) {
      newProduct.id = newProduct.name ? newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `prod-${Date.now()}`;
    }
    cmsData.products = [newProduct, ...cmsData.products.filter(p => p.id !== newProduct.id)];
    saveCMSData(cmsData);
    res.json({ success: true, product: newProduct });
  });

  app.put('/api/cms/products/:id', (req, res) => {
    const { id } = req.params;
    const cmsData = getCMSData();
    const index = cmsData.products.findIndex(p => p.id === id);
    if (index !== -1) {
      cmsData.products[index] = { ...cmsData.products[index], ...req.body, id };
      saveCMSData(cmsData);
      res.json({ success: true, product: cmsData.products[index] });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  });

  app.delete('/api/cms/products/:id', (req, res) => {
    const { id } = req.params;
    const cmsData = getCMSData();
    cmsData.products = cmsData.products.filter(p => p.id !== id);
    saveCMSData(cmsData);
    res.json({ success: true });
  });

  // Categories CRUD
  app.put('/api/cms/categories', (req, res) => {
    const cmsData = getCMSData();
    cmsData.categories = req.body;
    saveCMSData(cmsData);
    res.json({ success: true, categories: cmsData.categories });
  });

  // Certifications CRUD
  app.put('/api/cms/certifications', (req, res) => {
    const cmsData = getCMSData();
    cmsData.certifications = req.body.certifications || cmsData.certifications;
    if (req.body.exportDocs) {
      cmsData.exportDocs = req.body.exportDocs;
    }
    saveCMSData(cmsData);
    res.json({ success: true, certifications: cmsData.certifications, exportDocs: cmsData.exportDocs });
  });

  // Supply Chain Steps & Transit Routes CRUD
  app.put('/api/cms/supply-chain', (req, res) => {
    const cmsData = getCMSData();
    if (req.body.supplyChainSteps) cmsData.supplyChainSteps = req.body.supplyChainSteps;
    if (req.body.transitRoutes) cmsData.transitRoutes = req.body.transitRoutes;
    saveCMSData(cmsData);
    res.json({ success: true, supplyChainSteps: cmsData.supplyChainSteps, transitRoutes: cmsData.transitRoutes });
  });

  // RFQ Submissions (Public Submit + Admin Management)
  app.post('/api/cms/rfqs', (req, res) => {
    const cmsData = getCMSData();
    const rfq: RFQRecord = {
      id: `rfq-${Date.now()}`,
      status: 'new',
      timestamp: Date.now(),
      ...req.body
    };
    cmsData.rfqs = [rfq, ...(cmsData.rfqs || [])];
    saveCMSData(cmsData);
    res.json({ success: true, rfq });
  });

  app.put('/api/cms/rfqs/:id', (req, res) => {
    const { id } = req.params;
    const cmsData = getCMSData();
    const index = cmsData.rfqs.findIndex(r => r.id === id || r.rfqId === id);
    if (index !== -1) {
      cmsData.rfqs[index] = { ...cmsData.rfqs[index], ...req.body, updatedAt: new Date().toISOString() };
      saveCMSData(cmsData);
      res.json({ success: true, rfq: cmsData.rfqs[index] });
    } else {
      res.status(404).json({ success: false, message: 'RFQ not found' });
    }
  });

  app.delete('/api/cms/rfqs/:id', (req, res) => {
    const { id } = req.params;
    const cmsData = getCMSData();
    cmsData.rfqs = cmsData.rfqs.filter(r => r.id !== id && r.rfqId !== id);
    saveCMSData(cmsData);
    res.json({ success: true });
  });

  // Media Library
  app.post('/api/cms/media', (req, res) => {
    const cmsData = getCMSData();
    const mediaItem = {
      id: `med-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      ...req.body
    };
    cmsData.media = [mediaItem, ...(cmsData.media || [])];
    saveCMSData(cmsData);
    res.json({ success: true, mediaItem });
  });

  app.delete('/api/cms/media/:id', (req, res) => {
    const { id } = req.params;
    const cmsData = getCMSData();
    cmsData.media = (cmsData.media || []).filter(m => m.id !== id);
    saveCMSData(cmsData);
    res.json({ success: true });
  });

  // Reset to Defaults
  app.post('/api/cms/reset-defaults', (req, res) => {
    saveCMSData(DEFAULT_CMS_DATA);
    const defaultAuth: AuthCredentials = {
      email: 'admin@naijaglobalagro.com',
      passwordHash: 'AgroExport2026!',
      tokenSecret: 'naija-agro-jwt-secret-session-key-2026'
    };
    saveAuthCredentials(defaultAuth);
    res.json({ success: true, message: 'Reset to default data completed', data: DEFAULT_CMS_DATA });
  });

  // --- Vite / Static Middleware ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NaijaGlobal Agro Server running on http://localhost:${PORT}`);
  });
}

startServer();
