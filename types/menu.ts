export type MenuItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  imageUrl: string;
  available: boolean;
};

export type MenuCategory = {
  name: string;
  items: MenuItem[];
};

export type MenuData = {
  items: MenuItem[];
  categories: MenuCategory[];
};
