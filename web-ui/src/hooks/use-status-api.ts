import { useCallback } from "react";
import { buildStatusPath, buildUrl } from "../lib/url";

export function useStatusApi() {
  const disconnectClient = useCallback(async (clientId: string) => {
    const response = await fetch(buildUrl(buildStatusPath("/api/disconnect")), {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ client_id: clientId }).toString(),
    });
    const data = await response.json().catch(() => undefined);
    if (!response.ok) {
      throw new Error(data?.error ?? `Request failed with status ${response.status}`);
    }
  }, []);

  const setLogLevel = useCallback(async (level: string) => {
    const response = await fetch(buildUrl(buildStatusPath("/api/log-level")), {
      method: "PUT",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ level }).toString(),
    });
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
  }, []);

  const clearLogs = useCallback(async () => {
    const response = await fetch(buildUrl(buildStatusPath("/api/clear-logs")), {
      method: "POST",
    });
    const data = await response.json().catch(() => undefined);
    if (!response.ok) {
      throw new Error(data?.error ?? `Request failed with status ${response.status}`);
    }
  }, []);

  const reloadConfig = useCallback(async () => {
    const response = await fetch(buildUrl(buildStatusPath("/api/reload-config")), {
      method: "POST",
    });
    const data = await response.json().catch(() => undefined);
    if (!response.ok) {
      throw new Error(data?.error ?? `Request failed with status ${response.status}`);
    }
  }, []);

  const restartWorkers = useCallback(async () => {
    const response = await fetch(buildUrl(buildStatusPath("/api/restart-workers")), {
      method: "POST",
    });
    const data = await response.json().catch(() => undefined);
    if (!response.ok) {
      throw new Error(data?.error ?? `Request failed with status ${response.status}`);
    }
  }, []);

  const openPlaylist = useCallback(() => {
    const playlistUrl = buildUrl("/playlist.m3u");
    window.open(playlistUrl, "_blank");
  }, []);

  const copyPlaylistUrl = useCallback(async () => {
    const playlistUrl = buildUrl("/playlist.m3u");
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(playlistUrl);
        return true;
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = playlistUrl;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        return success;
      }
    } catch (error) {
      console.error("Failed to copy playlist URL:", error);
      return false;
    }
  }, []);

  return {
    disconnectClient,
    setLogLevel,
    clearLogs,
    reloadConfig,
    restartWorkers,
    openPlaylist,
    copyPlaylistUrl,
  };
}
