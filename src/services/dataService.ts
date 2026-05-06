import { Product, Category, SectionContent, SiteSettings, ContactMessage, OperationType } from '../types';

const API_BASE = '/api';

export const dataService = {
  async getProducts(): Promise<Product[]> {
    try {
      const res = await fetch(`${API_BASE}/products`);
      if (!res.ok) throw new Error('Network response was not ok');
      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  async getOffers(): Promise<Product[]> {
    try {
      const products = await this.getProducts();
      return products.filter(p => p.isOffer);
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  async getMostNeeded(): Promise<Product[]> {
    try {
      const products = await this.getProducts();
      return products.filter(p => p.isMostNeeded);
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  async getCategories(): Promise<Category[]> {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      if (!res.ok) throw new Error('Network response was not ok');
      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  async getContent(id: string): Promise<SectionContent | null> {
    try {
      const res = await fetch(`${API_BASE}/content/${id}`);
      if (!res.ok) {
         if (res.status === 404) return null;
         throw new Error('Network response was not ok');
      }
      return await res.json();
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  async updateContent(id: string, data: Partial<SectionContent>) {
    try {
      const res = await fetch(`${API_BASE}/content/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to update content');
    } catch (e) {
      console.error(e);
      throw e; // Re-throw to allow component to handle it
    }
  },

  async getSettings(): Promise<SiteSettings | null> {
    try {
      const res = await fetch(`${API_BASE}/settings`);
      if (!res.ok) {
         if (res.status === 404) return null;
         throw new Error('Network response was not ok');
      }
      return await res.json();
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  async updateSettings(data: Partial<SiteSettings>) {
    try {
      const res = await fetch(`${API_BASE}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to update settings');
    } catch (e) {
      console.error(e);
      throw e;
    }
  },

  async sendMessage(msg: Omit<ContactMessage, 'id' | 'createdAt'>) {
    try {
      const res = await fetch(`${API_BASE}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msg)
      });
      if (!res.ok) throw new Error('Failed to send message');
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
};
