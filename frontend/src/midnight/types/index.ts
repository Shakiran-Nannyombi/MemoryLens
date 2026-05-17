/**
 * index.ts - Midnight integration type definitions
 * Shared types for the Midnight blockchain integration
 */

export interface MemoryEvent {
    eventId: string;
    eventType: 'face' | 'object' | 'speech' | 'location';
    encryptedData: string;
    timestamp: number;
    isVerified: boolean;
    decryptedData?: any;
}

export interface PersonMemoryData {
    name: string;
    relationship: string;
    note: string;
    image_url?: string;
    face_descriptor?: number[];
}

export interface ObjectMemoryData {
    coco_class: string;
    custom_label: string;
    location?: { x: number; y: number };
}

export interface SpeechMemoryData {
    transcript: string;
    extracted_names: string[];
    timestamp?: number;
}

export interface CaregiverAuth {
    caregiverId: string;
    accessLevel: 'full' | 'medical' | 'emergency' | 'readonly';
    authorizedAt: number;
    expiresAt: number;
}

export interface AuditEntry {
    caregiverId: string;
    eventId: string;
    accessedAt: number;
    action: string;
}

export interface ContractStats {
    totalEvents: number;
    totalCaregivers: number;
    lastUpdated: Date;
}

export interface WalletState {
    connected: boolean;
    address: string | null;
}

export interface NetworkInfo {
    network: string;
    proofServer: string;
    contractAddress: string;
}

export type AccessLevel = 'full' | 'medical' | 'emergency' | 'readonly';
export type EventType = 'face' | 'object' | 'speech' | 'location';
