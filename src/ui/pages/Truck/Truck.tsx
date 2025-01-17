import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { truck } from "../../../types/truck";
import styles from "./Truck.module.css";
import StarBorder from "../../components/StarBorder/Starborder";
import { motion } from "motion/react";
import {
  LucideDelete,
  LucideEdit,
  LucideMenu,
  LucideSave,
  LucideX,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/shadcn/form";
import { Button } from "../../components/shadcn/button";
import { Card, CardContent, CardFooter } from "../../components/shadcn/card";
import { DayPickerProvider } from "react-day-picker";
// import { driver } from "../../../types/driver";
import { Input } from "../../components/shadcn/input";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  MultiSelect,
  MultiSelectTrigger,
  MultiSelectValue,
  MultiSelectContent,
  MultiSelectList,
  MultiSelectItem,
} from "../../components/shadcn/multiselect";
import {
  Pagination,
  PaginationPrevious,
  PaginationContent,
  PaginationNext,
} from "../../components/shadcn/pagination";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
} from "../../components/shadcn/dropdown-menu";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "../../components/shadcn/table";
import { Label } from "../../components/shadcn/label";
import { driver } from "../../../types/driver";

const formSchema = z.object({
  plate: z.string().nonempty("Nome é obrigatório"),
  model: z.string().nonempty("Modelo é obrigatório"),
  year: z
    .number({ invalid_type_error: "Ano deve ser um número" })
    .positive("Ano deve ser positivo")
    .int("Ano deve ser um número inteiro"),
  driverId: z.array(z.number()).nonempty("Motorista é obrigatório"),
});
function Truck() {
  const [trucks, setTrucks] = useState<truck[]>([]);
  const [editRow, setEditRow] = useState<number | null>(null);
  const [editedValue, setEditedValue] = useState<truck>({
    id: undefined,
    plate: "",
    model: "",
    year: undefined,
    driver: [],
  });

  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [drivers, setDrivers] = useState<driver[]>([]);
  const [selectedDrivers, setSelectedDrivers] = useState<driver[]>([]);
  const [filter, setFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("plate");
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // Cálculo dos itens exibidos e total de páginas usando useMemo
  const filteredTrucks = useMemo(() => {
    if (!Array.isArray(trucks)) {
      console.error("trucks não é um array:", trucks);
      return []; // Caso não seja um array, retorne um array vazio
    }
    return trucks.filter((truck) => {
      if (typeFilter === "plate")
        return truck.plate.toLowerCase().includes(filter.toLowerCase());
      if (typeFilter === "model")
        return truck.model.toLowerCase().includes(filter.toLowerCase());
      if (typeFilter === "year") return truck.year?.toString().includes(filter);
      return true;
    });
  }, [trucks, filter, typeFilter]);
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTrucks.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTrucks, currentPage]);

  const totalPages = useMemo(
    () => Math.ceil(filteredTrucks.length / itemsPerPage),
    [filteredTrucks]
  );
  const loadTable = () => {
    window.electronApp.getDrivers().then((data: driver[]) => {
      setDrivers(data || []);
    });
    console.log(drivers);
    window.electronApp.getTrucks().then((data: truck[]) => {
      setTrucks(data || []);
    });
  };

  useEffect(() => {
    if (!Array.isArray(trucks)) {
      console.error("trucks não é um array:", trucks);
      return []; // Caso não seja um array, retorne um array vazio
    }
    loadTable();
    const filteredTrucks = trucks.filter((truck) => {
      if (typeFilter === "plate") {
        return truck.plate.toLowerCase().includes(filter.toLowerCase());
      } else if (typeFilter === "model") {
        return truck.model.toLowerCase().includes(filter.toLowerCase());
      } else if (typeFilter === "year") {
        return truck.year?.toString().includes(filter.toLowerCase());
      }
      return true;
    });

    const currentItems = filteredTrucks.slice(
      indexOfFirstItem,
      indexOfLastItem
    );
    const totalPages = Math.ceil(filteredTrucks.length / itemsPerPage);
  }, []);

  const saveEdit = () => {
    window.electronApp.updateTruck(editedValue);
    loadTable();
    setEditRow(-1);
  };

  const handleDelete = (id: number) => {
    window.electronApp.deleteTruck(id);
    loadTable();
  };
  const getDriverNames = (selectedIds: number[] = []) => {
    return selectedIds
      .map((id) => drivers.find((driver) => driver.id === id)?.name)
      .filter(Boolean)
      .join(", ");
  };
  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    form.reset();

    try {
      window.electronApp.addTruck(data);
      toast("Caminhão adicionado com sucesso");
    } catch (error) {
      toast.error("Falha ao adicionar caminhão");
    }
    loadTable();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const showEditRow = (index: number, truck: truck) => {
    setEditRow(index);
    setEditedValue({ ...editedValue, ...truck });
    loadTable();
  };
  return (
    <>
      {/* <Card
        className="place-self-center my-auto mx-auto"
        style={{ width: "98%", height: "90%" }}
      > */}
      <div className="flex flex-row h-full w-full px-20 items-center justify-center">
        <DayPickerProvider
          initialProps={{
            mode: "single", // ou 'multiple', 'range'
            selected: new Date(), // data inicial selecionada
            fromMonth: new Date(2023, 0), // início do calendário
            toMonth: new Date(2025, 11), // fim do calendário
          }}
        >
          <div className="my-10 mx-auto text-left flex justify-center">
            <Form {...form}>
              <Card className="w-full">
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-8"
                >
                  <CardContent className="flex flex-col m-5 gap-5">
                    <FormField
                      control={form.control}
                      name="plate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Placa*</FormLabel>
                          <FormControl>
                            <Input
                              className="bg-slate-100 outline-none border-none dark:bg-neutral-800"
                              style={{
                                fontFamily: "Hanken Grotesk",
                                boxShadow:
                                  "inset 0px 5px 3px 0px rgba(0,0,0,0.75)",
                              }}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="model"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Modelo*</FormLabel>
                          <FormControl>
                            <Input
                              className="bg-slate-100 outline-none border-none dark:bg-neutral-800"
                              style={{
                                fontFamily: "Hanken Grotesk",
                                boxShadow:
                                  "inset 0px 5px 3px 0px rgba(0,0,0,0.75)",
                              }}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ano*</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              className="bg-slate-100 outline-none border-none dark:bg-neutral-800"
                              style={{
                                fontFamily: "Hanken Grotesk",
                                boxShadow:
                                  "inset 0px 5px 3px 0px rgba(0,0,0,0.75)",
                              }}
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(
                                  value ? Number(value) : undefined
                                );
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="driver"
                      render={({ field }) => (
                        <FormItem className="w-96">
                          <MultiSelect
                            value={
                              field.value?.map((id) => id.toString()) || []
                            } // Converte os IDs para strings
                            onValueChange={(selectedValues) => {
                              // Converte os valores de volta para números antes de armazená-los
                              field.onChange(
                                selectedValues.map((id) => Number(id))
                              );
                            }}
                          >
                            <FormControl>
                              <MultiSelectTrigger>
                                {/* Aqui você pode exibir os nomes dos motoristas selecionados */}
                                {field.value && field.value.length > 0 ? (
                                  <MultiSelectValue>
                                    {field.value
                                      .map((id) => {
                                        const driver = drivers.find(
                                          (d) => d.id === id
                                        ); // Encontra o motorista pelo ID
                                        return driver ? driver.name : null; // Retorna o nome ou null se não encontrado
                                      })
                                      .filter(Boolean) // Remove valores nulos ou indefinidos
                                      .join(", ")}{" "}
                                    {/* Junta os nomes com vírgula */}
                                  </MultiSelectValue>
                                ) : (
                                  "Selecione os motoristas"
                                )}
                              </MultiSelectTrigger>
                            </FormControl>
                            <MultiSelectContent className="h-48">
                              <MultiSelectList>
                                {Array.isArray(drivers) &&
                                  drivers.map((driver) => (
                                    <MultiSelectItem
                                      key={driver.id}
                                      value={driver.id.toString()}
                                    >
                                      {driver.name}
                                    </MultiSelectItem>
                                  ))}
                              </MultiSelectList>
                            </MultiSelectContent>
                          </MultiSelect>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <StarBorder className="min-w-96">Enviar</StarBorder>
                  </CardFooter>
                </form>
              </Card>
            </Form>
          </div>
        </DayPickerProvider>
        <div className="w-full h-full flex flex-col items-center justify-center mx-12">
          <div className="w-full flex justify-between align-middle items-center">
            <div>
              <Label className="text-2xl font-semibold">Filtrar </Label>
              <Input
                className="w-56 bg-slate-100 outline-none border-none rounded-lg dark:bg-neutral-800 mb-7"
                style={{
                  fontFamily: "Hanken Grotesk",
                  boxShadow: "inset 0px 5px 3px 0px rgba(0,0,0,0.75)",
                }}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFilter(e.target.value)
                }
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <LucideMenu />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Tipos de pesquisas</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={typeFilter}
                  onValueChange={setTypeFilter}
                >
                  <DropdownMenuRadioItem value="plate">
                    Placa
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="model">
                    Modelo
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="year">
                    Ano
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Card className="w-full">
            <Table className="h-auto w-full mx-auto">
              <TableHeader className="w-full">
                <TableRow>
                  <TableHead className="text-left px-4 py-2 font-semibold">
                    ID
                  </TableHead>
                  <TableHead className="text-left px-4 py-2 font-semibold">
                    Placa
                  </TableHead>
                  <TableHead className="text-left px-4 py-2 font-semibold">
                    Modelo
                  </TableHead>
                  <TableHead className="text-left px-4 py-2 font-semibold">
                    Ano
                  </TableHead>
                  <TableHead className="text-left px-4 py-2 font-semibold">
                    Motoristas
                  </TableHead>
                  <TableHead className="text-center px-4 py-2 font-semibold">
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.map((truck, index) => (
                  <TableRow
                    className="w-full even:bg-slate-100 odd:bg-white dark:even:bg-neutral-800 dark:odd:bg-zinc-950"
                    onClick={() => showEditRow(index, truck)}
                    key={index}
                  >
                    <TableCell className="w-16">{truck.id}</TableCell>

                    <TableCell className="w-96">
                      {editRow === index ? (
                        <input
                          type="text"
                          className="w-full font-mono bg-transparent border-none"
                          value={editedValue.plate}
                          onChange={(e) =>
                            setEditedValue({
                              ...editedValue,
                              plate: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <div className="w-full font-mono bg-transparent border-none">
                          {truck.plate}
                        </div>
                      )}
                    </TableCell>

                    <TableCell className="w-96">
                      {editRow === index ? (
                        <input
                          type="text"
                          value={editedValue.model}
                          onChange={(e) =>
                            setEditedValue({
                              ...editedValue,
                              model: e.target.value,
                            })
                          }
                          className="w-full font-mono bg-transparent border-none"
                        />
                      ) : (
                        <div className="w-full font-mono bg-transparent border-none">
                          {truck.model}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="w-96">
                      {editRow === index ? (
                        <input
                          type="text"
                          value={editedValue.year}
                          onChange={(e) =>
                            setEditedValue({
                              ...editedValue,
                              year: e.target.value,
                            })
                          }
                          className="w-full font-mono bg-transparent border-none"
                        />
                      ) : (
                        <div className="w-full font-mono bg-transparent border-none">
                          {truck.year}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="w-96">
                      {drivers
                        .filter((driver) => truck.driver?.includes(driver.id))
                        .map((driver) => (
                          <div key={driver.id}>{driver.name}</div>
                        ))}
                    </TableCell>
                    <TableCell className="p-0 w-96 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <LucideMenu />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => {
                              saveEdit();
                            }}
                          >
                            Salvar edição
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => {
                              handleDelete(truck.id);
                            }}
                          >
                            Deletar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
          <Pagination className="flex justify-center items-center gap-5 mt-10 mb-20">
            {currentPage > 1 && (
              <PaginationPrevious
                href="#"
                aria-disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              />
            )}
            <PaginationContent>{currentPage}</PaginationContent>
            {currentPage < totalPages && (
              <PaginationNext
                href="#"
                onClick={() => handlePageChange(currentPage + 1)}
                aria-disabled={currentPage === totalPages}
              />
            )}
          </Pagination>
        </div>
      </div>
      {/* </Card> */}
    </>
  );
}
export default Truck;
