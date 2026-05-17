/**
 * storage.ts - Unified storage abstraction layer
 * Routes storage calls between Supabase and Midnight based on user preference
 */

import { supabase } from './supabase';
import { isWalletConnected } from '../midnight/lib/wallet';
import {
    storePersonMemory as midnightStorePersonMemory,
    storeObjectMemory as midnightStoreObjectMemory,
    storeSpeechEvent as midnightStoreSpeechEvent,
    retrieveMemories as midnightRetrieveMemories,
} from '../midnight/lib/contract';
import {
    mockStorePersonMemory,
    mockStoreObjectMemory,
    mockStoreSpeechEvent,
    mockRetrieveMemories,
} from './mockMidnight';
import type { PersonMemoryData, ObjectMemoryData, SpeechMemoryData } from '../midnight/types';

/**
 * Store person memory - routes to Midnight or Supabase
 */
export async function storePersonMemory(
    data: PersonMemoryData,
    useMidnight: boolean,
    onProgress?: (message: string) => void
): Promise<string> {
    if (useMidnight) {
        if (isWalletConnected()) {
            // Use real Midnight blockchain
            return await midnightStorePersonMemory(
                data.name,
                data.relationship,
                data.face_descriptor || [],
                data.image_url || '',
                onProgress
            );
        } else {
            // Fallback to mock mode
            console.log('[Storage] Wallet not connected, using mock mode');
            return await mockStorePersonMemory(
                data.name,
                data.relationship,
                data.face_descriptor || [],
                data.image_url || '',
                onProgress
            );
        }
    } else {
        // Use Supabase
        const { data: result, error } = await supabase
            .from('people')
            .insert({
                name: data.name,
                relationship: data.relationship,
                note: data.note,
                image_url: data.image_url,
                face_descriptor: data.face_descriptor,
            })
            .select()
            .single();

        if (error) throw error;
        return result.id;
    }
}

/**
 * Store object memory - routes to Midnight or Supabase
 */
export async function storeObjectMemory(
    data: ObjectMemoryData,
    useMidnight: boolean,
    onProgress?: (message: string) => void
): Promise<string> {
    if (useMidnight) {
        if (isWalletConnected()) {
            return await midnightStoreObjectMemory(
                data.coco_class,
                data.custom_label,
                data.location || { x: 0, y: 0 },
                onProgress
            );
        } else {
            console.log('[Storage] Wallet not connected, using mock mode');
            return await mockStoreObjectMemory(
                data.coco_class,
                data.custom_label,
                data.location || { x: 0, y: 0 },
                onProgress
            );
        }
    } else {
        // Use Supabase
        const { data: result, error } = await supabase
            .from('objects')
            .insert({
                coco_class: data.coco_class,
                custom_label: data.custom_label,
                location: data.location,
            })
            .select()
            .single();

        if (error) throw error;
        return result.id;
    }
}

/**
 * Store speech memory - routes to Midnight or Supabase
 */
export async function storeSpeechMemory(
    data: SpeechMemoryData,
    useMidnight: boolean,
    onProgress?: (message: string) => void
): Promise<string> {
    if (useMidnight) {
        if (isWalletConnected()) {
            return await midnightStoreSpeechEvent(
                data.transcript,
                data.extracted_names,
                data.timestamp || Date.now(),
                onProgress
            );
        } else {
            console.log('[Storage] Wallet not connected, using mock mode');
            return await mockStoreSpeechEvent(
                data.transcript,
                data.extracted_names,
                data.timestamp || Date.now(),
                onProgress
            );
        }
    } else {
        // Use Supabase
        const { data: result, error } = await supabase
            .from('speech_events')
            .insert({
                transcript: data.transcript,
                extracted_names: data.extracted_names,
                timestamp: data.timestamp || Date.now(),
            })
            .select()
            .single();

        if (error) throw error;
        return result.id;
    }
}

/**
 * Retrieve memories - routes to Midnight or Supabase
 */
export async function retrieveMemories(
    type: 'face' | 'object' | 'speech' | 'location',
    useMidnight: boolean,
    filters?: { start?: Date; end?: Date }
): Promise<any[]> {
    if (useMidnight) {
        if (isWalletConnected()) {
            return await midnightRetrieveMemories(type, filters);
        } else {
            console.log('[Storage] Wallet not connected, using mock mode');
            return await mockRetrieveMemories(type, filters);
        }
    } else {
        // Use Supabase
        let query;
        switch (type) {
            case 'face':
                query = supabase.from('people').select('*');
                break;
            case 'object':
                query = supabase.from('objects').select('*');
                break;
            case 'speech':
                query = supabase.from('speech_events').select('*');
                break;
            default:
                return [];
        }

        if (filters?.start) {
            query = query.gte('created_at', filters.start.toISOString());
        }
        if (filters?.end) {
            query = query.lte('created_at', filters.end.toISOString());
        }

        const { data, error } = await query;
        if (error) throw error;
        return data || [];
    }
}
