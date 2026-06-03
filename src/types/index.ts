export interface Component {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  specs: string[];
  incompatibleWith: string[];
  image?: string;
}

export interface CartItem {
  component: Component;
  addedAt: number;
}

export interface BuildState {
  selectedIds: Record<string, string>; // category -> component id
}

export type Theme = "light" | "dark";
