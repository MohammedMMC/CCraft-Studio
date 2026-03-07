export function generateId(): string {
  return crypto.randomUUID();
}

export function generateElementName(type: string, existingNames: string[]): string {
  let counter = 1;
  let name = `${type}${counter}`;
  while (existingNames.includes(name)) {
    counter++;
    name = `${type}${counter}`;
  }
  return name;
}
