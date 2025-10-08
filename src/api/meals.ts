import api from "./client";
import { Meal } from "../types/meal";

interface MealsResponse {
  meals: Meal[];
}

export async function searchMealsByName(name: string): Promise<Meal[]> {
  const response = await api.get<MealsResponse>(`/search.php?s=${name}`);
  return response.data.meals || [];
}

export async function getMealById(id: string): Promise<Meal | null> {
  const response = await api.get<MealsResponse>(`/lookup.php?i=${id}`);
  return response.data.meals ? response.data.meals[0] : null;
}

export async function getAllMeals(): Promise<Meal[]> {
  const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');

  const promises = letters.map(letter =>
    api.get<MealsResponse>(`/search.php?f=${letter}`)
      .then(response => response.data.meals || [])
      .catch(() => [])
  );

  const results = await Promise.all(promises);
  return results.flat();
}

interface ListResponse {
  meals: Array<{ strArea?: string; strCategory?: string }>;
}

export async function getAreas(): Promise<string[]> {
  const response = await api.get<ListResponse>('/list.php?a=list');
  return response.data.meals?.map(m => m.strArea!).filter(Boolean) || [];
}

export async function getCategories(): Promise<string[]> {
  const response = await api.get<ListResponse>('/list.php?c=list');
  return response.data.meals?.map(m => m.strCategory!).filter(Boolean) || [];
}

export async function filterByArea(area: string): Promise<Meal[]> {
  const response = await api.get<MealsResponse>(`/filter.php?a=${area}`);
  return response.data.meals || [];
}

export async function filterByCategory(category: string): Promise<Meal[]> {
  const response = await api.get<MealsResponse>(`/filter.php?c=${category}`);
  return response.data.meals || [];
}

export async function getRandomMeal(): Promise<Meal | null> {
  const response = await api.get<MealsResponse>('/random.php');
  return response.data.meals ? response.data.meals[0] : null;
}