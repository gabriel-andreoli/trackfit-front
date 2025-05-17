
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Workout, Exercise, WorkoutExercise, WorkoutSet, EMuscleGroupType } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Plus, X, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ptBR } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { useData } from "@/context/DataContext";

const workoutFormSchema = z.object({
  date: z.date({
    required_error: "Por favor, selecione uma data.",
  }),
});

interface WorkoutFormProps {
  initialData?: Partial<Workout>;
  onSubmit: (data: Workout) => void;
  onCancel: () => void;
}

export function WorkoutForm({ initialData, onSubmit, onCancel }: WorkoutFormProps) {
  const { exercises } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>(
    initialData?.exercises || []
  );
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>("");

  const form = useForm<z.infer<typeof workoutFormSchema>>({
    resolver: zodResolver(workoutFormSchema),
    defaultValues: {
      date: initialData?.date || new Date(),
    },
  });

  const handleSubmit = async (values: z.infer<typeof workoutFormSchema>) => {
    if (workoutExercises.length === 0) {
      form.setError("root", {
        message: "Adicione pelo menos um exercício ao treino.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate a network request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const workoutData: Workout = {
        id: initialData?.id || "",
        date: values.date,
        exercises: workoutExercises,
        createdAt: initialData?.createdAt || new Date(),
        updatedAt: new Date(),
      };
      
      onSubmit(workoutData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addExercise = () => {
    if (!selectedExerciseId) return;

    const exerciseToAdd = exercises.find(ex => ex.id === selectedExerciseId);
    if (!exerciseToAdd) return;

    // Check if exercise already exists in the workout
    if (workoutExercises.some(we => we.exerciseId === selectedExerciseId)) {
      return;
    }

    const newWorkoutExercise: WorkoutExercise = {
      exerciseId: exerciseToAdd.id,
      exerciseName: exerciseToAdd.name,
      muscleGroupType: exerciseToAdd.muscleGroupType,
      muscleGroupTypeDescription: exerciseToAdd.muscleGroupTypeDescription,
      sets: [{ weight: null, reps: null }] // Start with one empty set
    };

    setWorkoutExercises([...workoutExercises, newWorkoutExercise]);
    setSelectedExerciseId("");
  };

  const removeExercise = (exerciseId: string) => {
    setWorkoutExercises(workoutExercises.filter(we => we.exerciseId !== exerciseId));
  };

  const addSet = (exerciseId: string) => {
    setWorkoutExercises(workoutExercises.map(we => {
      if (we.exerciseId === exerciseId) {
        return {
          ...we,
          sets: [...we.sets, { weight: null, reps: null }]
        };
      }
      return we;
    }));
  };

  const removeSet = (exerciseId: string, setIndex: number) => {
    setWorkoutExercises(workoutExercises.map(we => {
      if (we.exerciseId === exerciseId) {
        return {
          ...we,
          sets: we.sets.filter((_, index) => index !== setIndex)
        };
      }
      return we;
    }));
  };

  const updateSet = (exerciseId: string, setIndex: number, field: keyof WorkoutSet, value: number) => {
    setWorkoutExercises(workoutExercises.map(we => {
      if (we.exerciseId === exerciseId) {
        return {
          ...we,
          sets: we.sets.map((set, index) => {
            if (index === setIndex) {
              return { ...set, [field]: value };
            }
            return set;
          })
        };
      }
      return we;
    }));
  };

  return (
    <div className="w-full px-4 py-6 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="glass-card p-6"
      >
        <h2 className="text-xl font-semibold mb-6">
          {initialData?.id ? "Editar Treino" : "Novo Treino"}
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data do Treino</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: ptBR })
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Exercícios</h3>

              <div className="flex gap-2">
                <Select
                  value={selectedExerciseId}
                  onValueChange={setSelectedExerciseId}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Selecione um exercício" />
                  </SelectTrigger>
                  <SelectContent>
                    {exercises
                      .filter(ex => !workoutExercises.some(we => we.exerciseId === ex.id))
                      .map(exercise => (
                        <SelectItem key={exercise.id} value={exercise.id}>
                          {exercise.name} ({exercise.muscleGroupTypeDescription})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button 
                  type="button" 
                  onClick={addExercise} 
                  disabled={!selectedExerciseId}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar
                </Button>
              </div>

              {form.formState.errors.root && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.root.message}
                </p>
              )}

              <div className="space-y-4 mt-4">
                {workoutExercises.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    Nenhum exercício adicionado ainda.
                  </p>
                ) : (
                  workoutExercises.map((workoutExercise, exerciseIndex) => (
                    <Card key={workoutExercise.exerciseId} className="overflow-hidden">
                      <div className="bg-muted px-4 py-3 flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{workoutExercise.exerciseName}</h4>
                          <p className="text-xs text-muted-foreground">
                            {workoutExercise.muscleGroupTypeDescription}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeExercise(workoutExercise.exerciseId)}
                        >
                          <X className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                      
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {workoutExercise.sets.map((set, setIndex) => (
                            <motion.div
                              key={setIndex}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="flex items-center gap-3"
                            >
                              <p className="text-sm text-muted-foreground w-10">
                                Set {setIndex + 1}
                              </p>
                              <div className="flex-1 flex gap-2">
                                <div className="flex-1">
                                  {/* <p className="text-sm text-muted-foreground">Peso (kg)</p> */}
                                  <Input
                                    type="number"
                                    placeholder="Peso (kg)"
                                    value={set.weight}
                                    onChange={(e) => {
                                      const val = parseFloat(e.target.value);
                                      updateSet(
                                        workoutExercise.exerciseId,
                                        setIndex,
                                        "weight",
                                        val
                                      );
                                    }}
                                    className="text-sm"
                                    min="0"
                                  />
                                </div>
                                <div className="flex-1">
                                {/* <p className="text-sm text-muted-foreground">Reps</p> */}
                                  <Input
                                    type="number"
                                    placeholder="Reps"
                                    value={set.reps}
                                    onChange={(e) => {
                                      const val = parseInt(e.target.value);
                                      updateSet(
                                        workoutExercise.exerciseId,
                                        setIndex,
                                        "reps",
                                        val
                                      );
                                    }}
                                    className="text-sm"
                                    min="0"
                                  />
                                </div>
                              </div>
                              {workoutExercise.sets.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeSet(workoutExercise.exerciseId, setIndex)}
                                  className="h-8 w-8"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              )}
                            </motion.div>
                          ))}
                          
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addSet(workoutExercise.exerciseId)}
                            className="w-full mt-2"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Adicionar Set
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : initialData?.id ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}
