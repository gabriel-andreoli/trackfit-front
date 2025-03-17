
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Exercise, EMuscleGroupType } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { exerciseService } from "@/services/exerciseService";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "O nome deve ter pelo menos 3 caracteres.",
  }),
  muscleGroup: z.nativeEnum(EMuscleGroupType, {
    required_error: "Por favor selecione um grupo muscular.",
  }),
});

interface ExerciseFormProps {
  initialData?: Partial<Exercise>;
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  onCancel: () => void;
}

export function ExerciseForm({ initialData, onSubmit, onCancel }: ExerciseFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      muscleGroup: initialData?.muscleGroupType || undefined,
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      let exerciseForm = form.getValues();
      let exercise: Exercise = {
        name: exerciseForm.name,
        muscleGroupType: exerciseForm.muscleGroup
      };
      await exerciseService.addExercise(exercise);
      onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md p-6 mx-auto rounded-xl glass-card"
    >
      <h2 className="text-xl font-semibold mb-6">
        {initialData?.id ? "Editar Exercício" : "Novo Exercício"}
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Exercício</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Supino Reto" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="muscleGroup"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grupo Muscular</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um grupo muscular" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.keys(EMuscleGroupType)
                      .filter((key) => isNaN(Number(key))) 
                      .map((key) => (
                        <SelectItem
                          key={key}
                          value={EMuscleGroupType[key as keyof typeof EMuscleGroupType]}
                        >
                          {key}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

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
  );
}
