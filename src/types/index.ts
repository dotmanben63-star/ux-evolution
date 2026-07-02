export type Category = 'Electronics' | 'Lifestyle' | 'Home' | 'Reading' | 'Other';

export interface Item {
  id: string;
  name: string;
  category: Category;
  description: string;
  tags: string[];
  value: number;
  rating: number;
  image: string;
  createdAt: string;
}
