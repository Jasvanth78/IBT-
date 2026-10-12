/**
 * Hook: useSocketSiteSettings
 * Manages site settings including real-time updates via Socket.IO
 *
 * Usage:
 * const { settings, connected, loading, error } = useSocketSiteSettings();
 */

import { useEffect, useState, useRef, useCallback } from 'react';
import {
  SiteSettingsRealtimePayload,
  SocketState,
} from '@/src/types/socket';
import { subscribeSiteSettings, getSocketClient } from '@/src/api/socketClient';
import { fetchSiteSettings } from '@/src/api/settings';

const INITIAL_SETTINGS: SiteSettingsRealtimePayload = {
  maintenanceMode: false,
  maintenanceMessage: null,
  maintenanceEndTime: null,
  whatsappNumber: null,
  homeVideoUrl: null,
  homeVideoEnabled: false,
  homeServicesTitle: null,
  homeServicesBadge: null,
  homeRecentWorkTitle: null,
  homeRecentWorkBadge: null,
  homeRecentWorkItems: null,

  // Products Page
  productsHeroTitle: null,
  productsHeroHighlight: null,
  productsHeroDescription: null,
  productsHeroImageUrl: null,
  productsHeroProjectsDelivered: null,
  productsHeroClientSatisfaction: null,
  productsMicroAppsTitle: null,
  productsMicroAppsSubtitle: null,
  productsMicroAppsLeftIntro: null,
  productsMicroAppsLeftHeading: null,
  productsMicroAppsLeftText: null,
  productsMicroAppsLeftBullets: null,
  productsMicroAppsRightTextTop: null,
  productsMicroAppsRightHeading: null,
  productsMicroAppsRightBullets: null,
  productsMicroAppsRightTextBottom: null,

  labs_initiatives: null,
  labs_rigor_title: null,
  labs_rigor_description: null,
  labs_rigor_points: null,
  labs_rigor_image: null,
  labs_mentorship_title: null,
  labs_mentorship_description: null,
  labs_mentorship_image: null,
  labs_mentorship_quote: null,
  labs_mentorship_quote_author: null,
  labs_mentorship_quote_role: null,
  labs_mentorship_quote_avatar: null,
  updatedAt: new Date().toISOString(),
};

export const useSocketSiteSettings = (
  initialSettings: SiteSettingsRealtimePayload = INITIAL_SETTINGS,
) => {
  const [settings, setSettings] = useState<SiteSettingsRealtimePayload>(initialSettings);
  const [socketState, setSocketState] = useState<SocketState>({
    connected: false,
    connecting: false,
    isReady: false,
    error: null,
    lastUpdate: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Update socket connection state
  const updateSocketState = useCallback((updates: Partial<SocketState>) => {
    setSocketState((prev: SocketState) => ({ ...prev, ...updates }));
  }, []);

  // Handle settings update from socket
  const handleSettingsUpdate = useCallback((payload: SiteSettingsRealtimePayload) => {
    console.log('[useSocketSiteSettings] Received update:', payload);
    setSettings(payload);
    updateSocketState({ lastUpdate: new Date().toISOString() });
  }, [updateSocketState]);

  // Initialize socket connection and fetch initial settings
  useEffect(() => {
    let active = true;
    let socketListenersRegistered = false;
    let socket: any = null;
    let unsubscribe: (() => void) | null = null;

    const handleConnect = () => {
      if (!active) return;
      console.log('[useSocketSiteSettings] Socket connected');
      updateSocketState({ connected: true, connecting: false, error: null });
    };

    const handleDisconnect = (reason: string) => {
      if (!active) return;
      console.log('[useSocketSiteSettings] Socket disconnected:', reason);
      updateSocketState({ connected: false, error: reason });
    };

    const handleError = (err: Error | string | Record<string, unknown>) => {
      if (!active) return;
      console.warn('[useSocketSiteSettings] Socket error:', err);
      const message = typeof err === 'string' ? err : (err as Record<string, unknown>)?.message || 'Socket error';
      updateSocketState({ error: String(message) });
    };

    const initialize = async () => {
      try {
        setLoading(true);
        updateSocketState({ connecting: true });

        // Fetch initial settings
        const initialSettingsData = await fetchSiteSettings();
        if (!active) return;

        console.log('[useSocketSiteSettings] Fetched initial settings:', initialSettingsData);
        setSettings(initialSettingsData);
        setError(null);

        // Get socket client
        socket = getSocketClient();

        // Subscribe to real-time updates
        unsubscribe = subscribeSiteSettings((payload) => {
          if (active) {
            handleSettingsUpdate(payload);
          }
        });

        // Watch socket connection state
        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);
        socket.on('error', handleError);
        socketListenersRegistered = true;

        // Set initial connected state
        updateSocketState({
          connected: socket.connected,
          isReady: true,
          connecting: false,
        });

        setLoading(false);
      } catch (err) {
        if (!active) return;
        const msg = err instanceof Error ? err.message : 'Failed to initialize settings';
        console.warn('[useSocketSiteSettings] Initialization error:', msg);
        setError(msg);
        updateSocketState({ error: msg, connecting: false });
        setLoading(false);
      }
    };

    initialize();

    // Cleanup on unmount
    return () => {
      active = false;
      if (unsubscribe) {
        unsubscribe();
      }
      if (socket && socketListenersRegistered) {
        socket.off('connect', handleConnect);
        socket.off('disconnect', handleDisconnect);
        socket.off('error', handleError);
      }
    };
  }, [handleSettingsUpdate, updateSocketState]);

  return {
    // Settings data
    settings,
    maintenanceMode: settings.maintenanceMode,
    maintenanceMessage: settings.maintenanceMessage,
    maintenanceEndTime: settings.maintenanceEndTime,
    whatsappNumber: settings.whatsappNumber,
    homeVideoUrl: settings.homeVideoUrl,
    homeVideoEnabled: settings.homeVideoEnabled,

    // Socket connection state
    connected: socketState.connected,
    connecting: socketState.connecting,
    isReady: socketState.isReady,

    // Loading and error states
    loading,
    error: error || socketState.error,

    // Debugging info
    lastUpdate: socketState.lastUpdate,
  };
};
