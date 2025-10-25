export function createSafeSearchParams(searchParams: {
  [key: string]: string | string[] | undefined;
}) {
  const safeParams: Record<string, string> = {};

  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === "string") safeParams[key] = value;
    else if (Array.isArray(value) && value.length > 0)
      safeParams[key] = value[0];
  }

  return safeParams;
}
