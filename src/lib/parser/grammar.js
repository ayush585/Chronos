
export const SCHEDULES = ["daily", "weekly", "monthly"];

// Helpful aliases we map → canonical schedule
export const SCHEDULE_ALIASES = {
    day: "daily",
    everyday: "daily",
    daily: "daily",
    week: "weekly",
    weekly: "weekly",
    friday: "weekly", 
    month: "monthly",
    monthly: "monthly",
};

export const ADDRESS_RE = /0x[a-fA-F0-9]{40}/;
export const ENS_RE = /[a-z0-9-]+(?:\.[a-z0-9-]+)*\.eth/i;

// Core pattern (strict) without schedule words baked in.
// We did parse parts and then validate schedule with alias mapping. hehe!
export const CORE_PATTERN =
    /^Send\s+([\d][\d,]*(?:\.\d+)?)\s+([A-Za-z0-9]{2,10})\s+to\s+([A-Za-z0-9.\-]+)\s+every\s+([A-Za-z]+)\s+until\s+([A-Za-z0-9]{2,10})\s*>\s*([\d][\d,]*(?:\.\d+)?)\s*$/i;
