
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import PageTransition from "@/components/ui/page-transition";
import { EmptyState } from "@/components/empty-state";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Activity, Dumbbell, CalendarDays, TrendingUp, Users } from "lucide-react";
import Header from "@/components/header";

const Dashboard = () => {
  const { user } = useAuth();
  const { workouts, exercises } = useData();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  const totalWorkouts = workouts.length;
  const totalExercises = exercises.length;
  
  const totalSets = workouts.reduce((total, workout) => {
    return total + workout.exercises.reduce((exerciseTotal, exercise) => {
      return exerciseTotal + exercise.sets.length;
    }, 0);
  }, 0);

  const lastWorkoutDate = workouts.length > 0
    ? workouts.sort((a, b) => b.date.getTime() - a.date.getTime())[0].date
    : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-5xl px-4 pt-24 pb-16">
        <PageTransition>
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Olá, {user.username}</h1>
            <p className="text-muted-foreground">
              Bem-vindo à sua jornada fitness. Acompanhe seu progresso e mantenha-se motivado.
            </p>
          </div>

          {workouts.length === 0 && exercises.length === 0 ? (
            <EmptyState
              icon={Activity}
              title="Comece sua jornada fitness"
              description="Adicione exercícios e registre seus treinos para acompanhar seu progresso."
              actionLabel="Adicionar primeiro exercício"
              onAction={() => navigate("/exercises")}
            />
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="glass-card">
                  <CardHeader className="pb-2">
                    <CardDescription>Total de Treinos</CardDescription>
                    <CardTitle className="text-2xl">{totalWorkouts}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-muted-foreground flex items-center space-x-2">
                      <CalendarDays className="h-4 w-4" />
                      <span className="text-sm">
                        {lastWorkoutDate 
                          ? `Último: ${format(lastWorkoutDate, "dd 'de' MMMM", { locale: ptBR })}`
                          : "Nenhum treino registrado"}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader className="pb-2">
                    <CardDescription>Exercícios Cadastrados</CardDescription>
                    <CardTitle className="text-2xl">{totalExercises}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-muted-foreground flex items-center space-x-2">
                      <Dumbbell className="h-4 w-4" />
                      <span className="text-sm">
                        {totalExercises > 0 
                          ? `${totalExercises} exercícios disponíveis`
                          : "Adicione exercícios"}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader className="pb-2">
                    <CardDescription>Sets Completados</CardDescription>
                    <CardTitle className="text-2xl">{totalSets}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-muted-foreground flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm">
                        {totalSets > 0 
                          ? `${totalSets} sets no total`
                          : "Registre seus treinos"}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader className="pb-2">
                    <CardDescription>Média por Treino</CardDescription>
                    <CardTitle className="text-2xl">
                      {totalWorkouts > 0 
                        ? (totalSets / totalWorkouts).toFixed(1)
                        : 0}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-muted-foreground flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">
                        {totalWorkouts > 0 
                          ? `Sets por treino em média`
                          : "Sem dados suficientes"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Exercícios Recentes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {exercises.length > 0 ? (
                      <ul className="space-y-2">
                        {exercises.slice(0, 5).map((exercise) => (
                          <li key={exercise.id} className="flex justify-between items-center p-2 hover:bg-muted/50 rounded-md">
                            <div>
                              <p className="font-medium">{exercise.name}</p>
                              <p className="text-xs text-muted-foreground">{exercise.muscleGroupType}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground text-sm mb-3">Nenhum exercício cadastrado</p>
                        <Button 
                          variant="outline" 
                          onClick={() => navigate("/exercises")}
                          size="sm"
                        >
                          Adicionar exercícios
                        </Button>
                      </div>
                    )}
                    {exercises.length > 0 && (
                      <div className="mt-4">
                        <Button 
                          variant="outline" 
                          onClick={() => navigate("/exercises")}
                          className="w-full"
                          size="sm"
                        >
                          Ver todos os exercícios
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Treinos Recentes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {workouts.length > 0 ? (
                      <ul className="space-y-2">
                        {workouts
                          .sort((a, b) => b.date.getTime() - a.date.getTime())
                          .slice(0, 5)
                          .map((workout) => (
                            <li key={workout.id} className="flex justify-between items-center p-2 hover:bg-muted/50 rounded-md">
                              <div>
                                <p className="font-medium">
                                  {format(workout.date, "dd 'de' MMMM", { locale: ptBR })}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {workout.exercises.length} exercícios, {
                                    workout.exercises.reduce((total, ex) => total + ex.sets.length, 0)
                                  } sets
                                </p>
                              </div>
                            </li>
                          ))}
                      </ul>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground text-sm mb-3">Nenhum treino registrado</p>
                        <Button 
                          variant="outline" 
                          onClick={() => navigate("/workouts")}
                          size="sm"
                        >
                          Registrar um treino
                        </Button>
                      </div>
                    )}
                    {workouts.length > 0 && (
                      <div className="mt-4">
                        <Button 
                          variant="outline" 
                          onClick={() => navigate("/workouts")}
                          className="w-full"
                          size="sm"
                        >
                          Ver todos os treinos
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </PageTransition>
      </main>
    </div>
  );
};

export default Dashboard;
