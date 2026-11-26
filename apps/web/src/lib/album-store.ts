"use client";

import { useSyncExternalStore } from "react";

/**
 * "Mi álbum": an ordered list of place slugs, local-first (localStorage).
 * Costs zero server CPU; syncs to the account later (favorites table).
 */
const KEY = "monigo:album:v1";
const EVENT = "monigo:album";
const EMPTY: readonly string[] = [];

let cache: readonly string[] | null = null;

function read(): readonly string[] {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    cache = Array.isArray(parsed) ? parsed.filter((s) => typeof s === "string") : [];
  } catch {
    cache = [];
  }
  return cache!;
}

function write(next: readonly string[]) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage full or blocked: keep in memory for this session */
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      cb();
    }
  };
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function useAlbum() {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export const album = {
  has: (slug: string) => read().includes(slug),
  add: (slug: string) => {
    if (!read().includes(slug)) write([...read(), slug]);
  },
  remove: (slug: string) => write(read().filter((s) => s !== slug)),
  toggle: (slug: string) => (read().includes(slug) ? album.remove(slug) : album.add(slug)),
  move: (slug: string, dir: -1 | 1) => {
    const list = [...read()];
    const i = list.indexOf(slug);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j]!, list[i]!];
    write(list);
  },
  replace: (slugs: string[]) => write(Array.from(new Set(slugs))),
  clear: () => write([]),
};
