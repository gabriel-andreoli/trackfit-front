
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { Workout } from "@/types";
import PageTransition from "@/components/ui/page-transition";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { WorkoutForm } from "@/components/workout-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  CalendarDays, 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash, 
  ChevronDown, 
  ChevronUp,
  Dumbbell,
  BarChart 
} from "lucide-react";
import Header from "@/components/header";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const Workouts = () => {
  const { user } = useAuth();
  const { workouts, addWorkout, updateWorkout, deleteWorkout } = useData();
  const navigate = useNavigate();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleAddWorkout = (data: Workout) => {
    addWorkout(data);
    setIsAddDialogOpen(false);
  };

  const handleEditWorkout = (data: Workout) => {
    if (editingWorkout) {
      updateWorkout(editingWorkout.id, data);
      setEditingWorkout(null);
    }
  };

  const handleDeleteWorkout = (id: string) => {
    deleteWorkout(id);
  };

  // Sort workouts by date (most recent first)
  const sortedWorkouts = [...workouts].sort((a, b) => 
    b.date.getTime() - a.date.getTime()
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-5xl px-4 pt-24 pb-16">
        <PageTransition>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Treinos</h1>
              <p className="text-muted-foreground">
                Registre e acompanhe seus treinos
              </p>
            </div>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Treino
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                  <DialogTitle>Registrar Treino</DialogTitle>
                </DialogHeader>
                <WorkoutForm
                  onSubmit={handleAddWorkout}
                  onCancel={() => setIsAddDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Edit workout dialog */}
          <Dialog
            open={editingWorkout !== null}
            onOpenChange={(open) => !open && setEditingWorkout(null)}
          >
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Editar Treino</DialogTitle>
              </DialogHeader>
              {editingWorkout && (
                <WorkoutForm
                  initialData={editingWorkout}
                  onSubmit={handleEditWorkout}
                  onCancel={() => setEditingWorkout(null)}
                />
              )}
            </DialogContent>
          </Dialog>

          {workouts.length === 0 ? (
            <EmptyState
              icon={BarChart}
              title="Nenhum treino registrado"
              description="Registre seus treinos para acompanhar seu progresso."
              actionLabel="Registrar Treino"
              onAction={() => setIsAddDialogOpen(true)}
            />
          ) : (
            <div className="space-y-6">
              {sortedWorkouts.map((workout) => (
                <Card key={workout.id} className="glass-card overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-5 w-5 text-primary" />
                          <CardTitle>
                            {format(workout.date, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                          </CardTitle>
                        </div>
                        <p className="text-muted-foreground text-sm mt-1">
                          {workout.exercises.length} exercícios, {
                            workout.exercises.reduce((total, ex) => total + ex.sets.length, 0)
                          } sets
                        </p>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingWorkout(workout)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash className="h-4 w-4 mr-2" />
                                Excluir
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir o treino de {
                                    format(workout.date, "dd/MM/yyyy")
                                  }? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteWorkout(workout.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Accordion type="single" collapsible className="w-full">
                      {workout.exercises.map((exercise, index) => (
                        <AccordionItem key={`${workout.id}-${exercise.exerciseId}`} value={`exercise-${index}`}>
                          <AccordionTrigger className="px-6 py-3 hover:bg-muted/30">
                            <div className="flex items-center gap-3 text-left">
                              <Dumbbell className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="font-medium">{exercise.exerciseName}</p>
                                <div className="flex items-center mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {exercise.muscleGroup}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground ml-2">
                                    {exercise.sets.length} sets
                                  </span>
                                </div>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="px-6 pb-4">
                              <ScrollArea className="h-auto max-h-72">
                                <table className="w-full">
                                  <thead>
                                    <tr className="border-b text-left">
                                      <th className="pb-2 w-20 text-muted-foreground text-sm font-medium">Set</th>
                                      <th className="pb-2 text-muted-foreground text-sm font-medium">Peso (kg)</th>
                                      <th className="pb-2 text-muted-foreground text-sm font-medium">Repetições</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {exercise.sets.map((set, setIndex) => (
                                      <tr key={setIndex} className="border-b border-border/30 last:border-0">
                                        <td className="py-3 text-muted-foreground text-sm">{setIndex + 1}</td>
                                        <td className="py-3 font-medium">{set.weight}</td>
                                        <td className="py-3 font-medium">{set.reps}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </ScrollArea>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </PageTransition>
      </main>
    </div>
  );
};

export default Workouts;
