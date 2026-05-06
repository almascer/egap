export interface SectionContent {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  features?: AboutFeature[];
}

export interface AboutFeature {
  id: string;
  icon: string; // lucide icon name
  title: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  isMostNeeded: boolean;
  isOffer: boolean;
  category: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
  slug: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: any;
}

export interface SiteSettings {
  phone: string;
  email: string;
  address: string;
  facebook: string;
  instagram: string;
  twitter: string;
  mapUrl: string;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}
