import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { Exercise, EMuscleGroupType } from "@/types";
import PageTransition from "@/components/ui/page-transition";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Card,
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { ExerciseForm } from "@/components/exercise-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  Dumbbell, 
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash,
  Filter
} from "lucide-react";
import Header from "@/components/header";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ExerciseResult } from "@/types/DTOs";
import { exerciseService } from "@/services/exerciseService";

const Exercises = () => {
  const { user } = useAuth();
  const { exercises, addExercise, updateExercise, deleteExercise } = useData();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);


  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMuscleGroup, setFilterMuscleGroup] = useState<number>(0);
  const [filteredExercises, setFilteredExercises] = useState<ExerciseResult[]>(exercises);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {

    const fetchExercises = async () => {
      let result = await getAllExercises();

      if (searchTerm) {
        result = result.filter(exercise =>
          exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (filterMuscleGroup) {
        result = result.filter(exercise =>
          exercise.muscleGroupType === filterMuscleGroup
        );
      }

      setFilteredExercises(result);
    };

    fetchExercises();
  }, [searchTerm, filterMuscleGroup, refresh]);

  const getAllExercises = async () => {
    const response = await exerciseService.getExercises();
    return response.items;
  };

  const handleAddExercise = (data: { name: string; muscleGroupType: EMuscleGroupType }) => {
    if (!editingExercise) {
      addExercise(data);
      setIsAddDialogOpen(false);
      setRefresh(!refresh);
    }
  };

  const handleEditExercise = (data: { name: string; muscleGroupType: EMuscleGroupType }) => {
    if (editingExercise) {
      updateExercise(editingExercise.id, data);
      setEditingExercise(null);
      setRefresh(!refresh);
    }
  };

  const handleDeleteExercise = (id: string) => {
    deleteExercise(id);
    setRefresh(!refresh);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setFilterMuscleGroup(0);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-5xl px-4 pt-24 pb-16">
        <PageTransition>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Exercícios</h1>
              <p className="text-muted-foreground">
                Gerencie seus exercícios de academia
              </p>
            </div>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Exercício
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Exercício</DialogTitle>
                  <DialogDescription>
                    Preencha as informações abaixo para adicionar um novo exercício.
                  </DialogDescription>
                </DialogHeader>
                <ExerciseForm
                  onSubmit={handleAddExercise}
                  onCancel={() => setIsAddDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Edit exercise dialog */}
          <Dialog
            open={editingExercise !== null}
            onOpenChange={(open) => !open && setEditingExercise(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Exercício</DialogTitle>
                <DialogDescription>
                  Modifique as informações do exercício abaixo.
                </DialogDescription>
              </DialogHeader>
              {editingExercise && (
                <ExerciseForm
                  initialData={editingExercise}
                  onSubmit={handleEditExercise}
                  onCancel={() => setEditingExercise(null)}
                  id={editingExercise.id}
                />
              )}
            </DialogContent>
          </Dialog>

          {exercises.length === 0 ? (
            <EmptyState
              icon={Dumbbell}
              title="Nenhum exercício cadastrado"
              description="Adicione exercícios para começar a registrar seus treinos."
              actionLabel="Adicionar Exercício"
              onAction={() => setIsAddDialogOpen(true)}
            />
          ) : (
            <Card className="glass-card overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle>Seus Exercícios</CardTitle>

                <div className="mt-4 flex flex-col gap-4 sm:flex-row">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar exercícios..."
                      className="pl-9"
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </div>

                  <Select
                    value={filterMuscleGroup}
                    onValueChange={setFilterMuscleGroup}
                  >
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <div className="flex items-center">
                        <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                        <SelectValue placeholder="Filtrar grupo" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value={0}>Todos os grupos</SelectItem>
                        {Object.values(EMuscleGroupType)
                          .filter(value => typeof value === 'number')
                          .map((group) => (
                            <SelectItem key={group} value={group}>
                              {EMuscleGroupType[group]}
                            </SelectItem>
                          ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  {(searchTerm || filterMuscleGroup) && (
                    <Button
                      variant="ghost"
                      onClick={resetFilters}
                      className="sm:w-auto"
                    >
                      Limpar filtros
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="rounded-md border-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Grupo Muscular</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredExercises.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                            Nenhum exercício encontrado com os filtros aplicados.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredExercises.map((exercise) => (
                          <TableRow key={exercise.id}>
                            <TableCell className="font-medium">{exercise.name}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{exercise.muscleGroupTypeDescription}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => setEditingExercise(exercise)}>
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
                                          Tem certeza que deseja excluir o exercício "{exercise.name}"? 
                                          Esta ação não pode ser desfeita.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDeleteExercise(exercise.id)}
                                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                          Excluir
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </PageTransition>
      </main>
    </div>
  );
};

export default Exercises;