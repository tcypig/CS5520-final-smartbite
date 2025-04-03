import { Timestamp } from "firebase/firestore";

export interface RecipeData {
  id?: string;
  name: string;
  ingredients: string[];
  instructions: string;
  photoUrl?: string;
  createdAt?: any;
  isFavorite?: boolean;

}

export interface Meal {
  date: Timestamp;
  type: string;
  image?: string;
  ingredients: string[];
  analyzed: boolean;
}

export interface mealsFromDB {
  id: string;
  date: Timestamp;
  type: string;
  image?: string;
  ingredients: string[];
  analyzed: boolean;
  nutrition?: Nutrition;
}

export interface Nutrition {
  calories: number;
  totalNutrients: {
    [key: string]: {
      label: string;
      quantity: number;
      unit: string;
    };
  };
  totalDaily: {
    [key: string]: {
      label: string;
      quantity: number;
      unit: string;
    };
  };

}

export interface Geo {
  lat?: string;
  lng?: string;
}

export interface Address {
  street?: string;
  suite?: string;
  city?: string;
  zipcode?: string;
  geo?: Geo;
}

export interface User {
  id?: number;
  nickname?: string;
  photoUrl?: string;
  email?: string;
  address?: Address;
}
