import axios from "axios";
import { Exercise, PaginatedResponse } from "../types";
import Endpoints from "@/helpers/endpoints";
import BaseService from "./baseService";
import { ExerciseResult } from "@/types/DTOs";

class ExerciseService extends BaseService {
  private headers: Record<string, string> = {}; 

  constructor() {
    super();
    this.headers = this.createAuthHeaders(); 
  }

  async getExercises(): Promise<PaginatedResponse<ExerciseResult>> {
    try {
      const { data } = await axios.get(Endpoints.EXERCISE, { headers: this.headers });
      return data;
    } catch (error) {
      console.error('Erro ao buscar os exercícios:', error);
      throw new Error('Não foi possível carregar os exercícios.');
    }
  }

  async addExercise(exercise: Omit<Exercise, "id" | "createdAt" | "updatedAt">) {
    try {
      const response = await axios.post<Exercise>(Endpoints.EXERCISE, exercise, { headers: this.headers });
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar o exercício:', error);
      throw new Error('Não foi possível adicionar o exercício.');
    }
  }

  async updateExercise(id: string, exercise: Partial<Omit<Exercise, "id" | "createdAt" | "updatedAt">>) {
    try {
      const response = await axios.put<Exercise>(`${Endpoints.EXERCISE}/${id}`, exercise, { headers: this.headers });
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar o exercício:', error);
      throw new Error('Não foi possível atualizar o exercício.');
    }
  }

  async deleteExercise(id: string) {
    try {
      await axios.delete(Endpoints.EXERCISE + id, { headers: this.headers });
    } catch (error) {
      console.error('Erro ao excluir o exercício:', error);
      throw new Error('Não foi possível excluir o exercício.');
    }
  }
}

export const exerciseService = new ExerciseService();