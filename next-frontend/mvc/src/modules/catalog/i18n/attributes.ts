/* clés techniques stables, à utiliser dans le code métier, jamais dans les fichiers de traduction :
- les clés techniques stables (ex: "violin", "medium", "ball")
- les libellés traduits (ex: "Violon", "Moyenne", "Boule")
*/
export const attributes = {
  brand: 'brand',
  model: 'model',
  instrument: 'instrument',
  string: 'string',
  size: 'size',
  tension: 'tension',
  end: 'end',
  core: 'core',
  winding: 'winding',
} as const; // "as const" pour que les valeurs soient des littéraux de type string, pas juste string

export type AttributeKey = keyof typeof attributes; // AttributeKey est un type qui peut être "brand" | "model" | "instrument" | "string" | "size" | "tension" | "end" | "core" | "winding"
