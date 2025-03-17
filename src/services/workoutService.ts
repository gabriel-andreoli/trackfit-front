import axios from "axios";
import { Workout, PaginatedResponse } from "../types";
import Endpoints from "@/helpers/endpoints";
import BaseService from "./baseService";

class WorkoutService extends BaseService{
  private headers: Record<string, string> = {}; 

  constructor() {
    super();
    this.headers = this.createAuthHeaders(); 
  }

  async getWorkouts(): Promise<PaginatedResponse<Workout>> {
    try {
      const { data } = await axios.get(Endpoints.WORKOUT, { headers: this.headers });
      return data;
    } catch (error) {
      console.error('Erro ao buscar os treinos:', error);
      throw new Error('Não foi possível carregar os treinos.');
    }
  }

  async addWorkout(workout: Omit<Workout, "id" | "createdAt" | "updatedAt">) {
    try {
      const response = await axios.post<Workout>(Endpoints.WORKOUT, workout, { headers: this.headers });
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar o treino:', error);
      throw new Error('Não foi possível adicionar o treino.');
    }
  }

  async updateWorkout(id: string, workout: Partial<Omit<Workout, "id" | "createdAt" | "updatedAt">>) {
    try {
      const response = await axios.put<Workout>(`${Endpoints.WORKOUT}/${id}`, workout, { headers: this.headers });
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar o treino:', error);
      throw new Error('Não foi possível atualizar o treino.');
    }
  }

  async deleteWorkout(id: string) {
    try {
      await axios.delete(`${Endpoints.WORKOUT}/${id}`, { headers: this.headers });
    } catch (error) {
      console.error('Erro ao excluir o treino:', error);
      throw new Error('Não foi possível excluir o treino.');
    }
  }
}

export const workoutService = new WorkoutService();
