import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000; // Updated to 3000 for Dokploy

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // For image uploads

// ========================
// API ROUTES
// ========================

// --- PRODUCTS ---
app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const product = await prisma.product.create({
      data: req.body
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await prisma.product.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// --- CATEGORIES ---
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.post('/api/categories', async (req, res) => {
  try {
    const category = await prisma.category.create({
      data: req.body
    });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
});

app.put('/api/categories/:id', async (req, res) => {
  try {
    const category = await prisma.category.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update category' });
  }
});

app.delete('/api/categories/:id', async (req, res) => {
  try {
    await prisma.category.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// --- CONTENT ---
app.get('/api/content/:id', async (req, res) => {
  try {
    const content = await prisma.sectionContent.findUnique({
      where: { id: req.params.id }
    });
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

app.get('/api/content', async (req, res) => {
  try {
    const contents = await prisma.sectionContent.findMany();
    res.json(contents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contents' });
  }
});

app.put('/api/content/:id', async (req, res) => {
  try {
    const { title, description, imageUrl, features } = req.body;
    const content = await prisma.sectionContent.upsert({
      where: { id: req.params.id },
      update: { title, description, imageUrl, features: features ? JSON.parse(JSON.stringify(features)) : null },
      create: {
        id: req.params.id,
        title,
        description,
        imageUrl,
        features: features ? JSON.parse(JSON.stringify(features)) : null
      }
    });
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update content' });
  }
});

// --- SETTINGS ---
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: 'site' }
    });
    if (!settings) {
       return res.status(404).json({ error: 'Settings not found' });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

app.put('/api/settings', async (req, res) => {
  try {
    const settings = await prisma.siteSettings.upsert({
      where: { id: 'site' },
      update: req.body,
      create: {
        id: 'site',
        ...req.body
      }
    });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// --- MESSAGES ---
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const message = await prisma.contactMessage.create({
      data: req.body
    });
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create message' });
  }
});

// ========================
// SERVE STATIC FILES (PRODUCTION)
// ========================

const distPath = path.join(process.cwd(), 'dist');
app.use(express.static(distPath));

// Handle React Router - Send all other requests to index.html
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(distPath, 'index.html'));
  }
});

// START SERVER
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

