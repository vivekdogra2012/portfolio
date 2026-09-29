export type DeltaOperationName = "append" | "replace" | "add" | "patch" | "remove";

export type DeltaEvent = {
  p?: string;
  o?: DeltaOperationName;
  v?: unknown;
  type?: string;
};

export type DeltaCursor = {
  p: string;
  o: DeltaOperationName;
};

const BLOCKED_KEYS = new Set(["__proto__", "prototype", "constructor"]);

export function decodePointer(pointer: string): string[] {
  if (pointer === "" || pointer === "/") return [];
  if (!pointer.startsWith("/")) {
    throw new Error(`Invalid JSON pointer: ${pointer}`);
  }
  return pointer
    .slice(1)
    .split("/")
    .map((token) => token.replace(/~1/g, "/").replace(/~0/g, "~"));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function blocked(tokens: string[]): boolean {
  return tokens.some((token) => BLOCKED_KEYS.has(token));
}

/**
 * Apply one ChatGPT delta-encoding v1 operation.
 * When `p` or `o` is omitted, the previous cursor is reused so later
 * tokens can be sent as `{"v":"..."}` only.
 */
export function applyDelta(
  root: Record<string, unknown>,
  event: DeltaEvent,
  cursor: DeltaCursor | null,
): DeltaCursor | null {
  if (event.type && event.o === undefined && event.v === undefined) return cursor;

  const o = event.o ?? cursor?.o;
  const p = event.p ?? cursor?.p;
  if (!o || p === undefined || event.v === undefined) return cursor;

  if ((p === "" || p === "/") && (o === "add" || o === "replace" || o === "patch")) {
    if (isRecord(event.v)) {
      if (o === "replace") {
        for (const key of Object.keys(root)) delete root[key];
      }
      Object.assign(root, event.v);
    }
    return { p, o };
  }

  let tokens: string[];
  try {
    tokens = decodePointer(p);
  } catch {
    return cursor;
  }
  if (tokens.length === 0 || blocked(tokens)) return { p, o };

  let parent: unknown = root;
  for (let index = 0; index < tokens.length - 1; index += 1) {
    const key = tokens[index];
    const nextKey = tokens[index + 1];
    const nextIsIndex = /^\d+$/.test(nextKey) || nextKey === "-";
    if (Array.isArray(parent)) {
      const childIndex = Number(key);
      if (!Number.isInteger(childIndex) || childIndex < 0) return { p, o };
      if (parent[childIndex] == null || typeof parent[childIndex] !== "object") {
        parent[childIndex] = nextIsIndex ? [] : {};
      }
      parent = parent[childIndex];
      continue;
    }
    if (!isRecord(parent)) return { p, o };
    if (BLOCKED_KEYS.has(key)) return { p, o };
    if (parent[key] == null || typeof parent[key] !== "object") {
      parent[key] = nextIsIndex ? [] : {};
    }
    parent = parent[key];
  }

  writeValue(parent, tokens[tokens.length - 1], o, event.v);
  return { p, o };
}

function writeValue(parent: unknown, key: string, operation: DeltaOperationName, value: unknown) {
  if (BLOCKED_KEYS.has(key)) return;

  if (Array.isArray(parent)) {
    if (key === "-" || operation === "add") {
      if (key === "-") {
        parent.push(value);
        return;
      }
    }
    const index = Number(key);
    if (!Number.isInteger(index) || index < 0) return;

    if (operation === "append") {
      const current = parent[index];
      if (typeof current === "string") parent[index] = current + String(value ?? "");
      else if (Array.isArray(current)) current.push(value);
      else if (current == null) parent[index] = value;
      else parent.push(value);
      return;
    }
    if (operation === "remove") {
      if (index < parent.length) parent.splice(index, 1);
      return;
    }
    if (operation === "patch" && isRecord(parent[index]) && isRecord(value)) {
      Object.assign(parent[index], value);
      return;
    }
    parent[index] = value;
    return;
  }

  if (!isRecord(parent)) return;

  if (operation === "append") {
    const current = parent[key];
    if (typeof current === "string") parent[key] = current + String(value ?? "");
    else if (Array.isArray(current)) current.push(value);
    else if (current == null) parent[key] = value;
    else parent[key] = String(current) + String(value ?? "");
    return;
  }

  if (operation === "remove") {
    delete parent[key];
    return;
  }

  if (operation === "patch" && isRecord(parent[key]) && isRecord(value)) {
    Object.assign(parent[key], value);
    return;
  }

  parent[key] = value;
}
