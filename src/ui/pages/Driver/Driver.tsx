import { ChangeEvent, useEffect, useState } from "react";
import { driver } from "../../../types/driver";
// import styles from "./Driver.module.css";
import { motion } from "motion/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import StarBorder from "../../components/StarBorder/Starborder";
import { LucideDelete, LucideEdit, LucideMenu, LucideSave } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { DayPickerProvider } from "react-day-picker";
import { Card, CardContent, CardFooter } from "../../components/shadcn/card";
import {
  Form,
  FormMessage,
  FormLabel,
  FormItem,
  FormField,
  FormControl,
} from "../../components/shadcn/form";
import { Button } from "../../components/shadcn/button";
import { Input } from "../../components/shadcn/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/shadcn/table";
import {
  Pagination,
  PaginationContent,
  PaginationNext,
  PaginationPrevious,
} from "../../components/shadcn/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/shadcn/dropdown-menu";
import { isValidPhoneNumber } from "react-phone-number-input";
import { PhoneInput } from "../../components/shadcn/phone-input";
import { Label } from "../../components/shadcn/label";

const formSchema = z.object({
  name: z.string().nonempty("Nome é obrigatório"),
  phone: z
    .string()
    .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
});

function Driver() {
  const [driver, setDriver] = useState<driver>({
    id: undefined,
    name: "",
    phone: "",
  });
  const [editRow, setEditRow] = useState<number>(null);
  const [editedValue, setEditedValue] = useState<driver>({
    id: 0,
    name: "",
    phone: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [drivers, setDrivers] = useState<driver[]>([]);
  let indexOfLastItem = currentPage * itemsPerPage;
  let indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const [filterName, setFilterName] = useState(""); // Estado para o filtro de nome

  let currentItems = drivers
    .filter((driver) =>
      driver.name.toLowerCase().includes(filterName.toLowerCase())
    ) // Filtra motoristas pelo nome
    .slice(indexOfFirstItem, indexOfLastItem);
  let totalPages = Math.ceil(
    drivers.filter((driver) =>
      driver.name.toLowerCase().includes(filterName.toLowerCase())
    ).length / itemsPerPage
  );
  useEffect(() => {
    loadDrivers();
  }, []);
  useEffect(() => {
    console.log(drivers);
  }, [drivers]);
  const loadDrivers = async () => {
    const drivers = await window.electronApp.getDrivers();
    setDrivers(drivers);
    indexOfLastItem = currentPage * itemsPerPage;
    indexOfFirstItem = indexOfLastItem - itemsPerPage;
    currentItems = currentItems = drivers.filter((driver) =>
      driver.name.toLowerCase().includes(filterName.toLowerCase())
    );
    totalPages = Math.ceil(
      drivers.filter((driver) =>
        driver.name.toLowerCase().includes(filterName.toLowerCase())
      ).length / itemsPerPage
    );
  };

  const saveEdit = () => {
    const updatedDriver = {
      ...editedValue,
      name: editedValue.name,
      phone: editedValue.phone,
    };

    window.electronApp.updateDriver(updatedDriver);
    loadDrivers();
    setEditRow(-1);
  };
  const handleDelete = (id: number) => {
    window.electronApp.deleteDriver(id);
    loadDrivers();
  };

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    form.reset();
    try {
      window.electronApp.addDriver(data);
      toast("Motorista adicionado com sucesso");
    } catch (error) {
      toast.error("Falha ao adicionar motorista");
    }
    loadDrivers();
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const showEditRow = (index: number, driver: driver) => {
    setEditRow(index);
    setEditedValue({ ...editedValue, ...driver });
    loadDrivers();
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  return (
    <>
      {" "}
      {/* <div className=" h-full w-full flex flex-col items-center justify-center my-auto"> */}
      {/* <Card className="" style={{ width: "100%", height: "100%" }}> */}
      <div className="flex flex-row justify-center h-full items-center">
        <DayPickerProvider
          initialProps={{
            mode: "single", // ou 'multiple', 'range'
            selected: new Date(), // data inicial selecionada
            fromMonth: new Date(2023, 0), // início do calendário
            toMonth: new Date(2025, 11), // fim do calendário
          }}
        >
          <div className=" mx-24 w-[40%] flex justify-center align-middle h-1/2">
            <Form {...form}>
              <Card className="w-full h-full my-auto place-self-center">
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-8 h-full"
                >
                  <CardContent className="m-5 flex flex-col gap-12 place-self-center place-content-center w-full h-72">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome*</FormLabel>
                          <FormControl>
                            <Input
                              className=" w-full bg-slate-100 outline-none border-none rounded-lg dark:bg-neutral-800"
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
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <PhoneInput
                              className="w-60 bg-slate-100 outline-none border-none rounded-lg dark:bg-neutral-800"
                              style={{
                                fontFamily: "Hanken Grotesk",
                                boxShadow:
                                  "inset 0px 5px 3px 0px rgba(0,0,0,0.75)",
                              }}
                              defaultCountry="BR"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter>
                    {/* <Button variant="outline" type="submit">
                      Enviar
                    </Button> */}
                    <StarBorder className="min-w-96">Enviar</StarBorder>
                  </CardFooter>
                </form>
              </Card>
            </Form>
          </div>
        </DayPickerProvider>
        <div className="w-full h-full mx-5 flex flex-col items-center justify-center">
          <div className="w-full flex justify-left flex-col items-left">
            <Label className="text-2xl font-semibold">Filtrar por Nome</Label>
            <Input
              className="w-56 bg-slate-100 outline-none border-none rounded-lg dark:bg-neutral-800 mb-7"
              style={{
                fontFamily: "Hanken Grotesk",
                boxShadow: "inset 0px 5px 3px 0px rgba(0,0,0,0.75)",
              }}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFilterName(e.target.value)
              }
            />
          </div>
          <Card className="rounded-lg">
            <Table className="h-auto rounded-lg mx-auto">
              <TableHeader className="w-full">
                <TableRow>
                  <TableHead className="text-left px-4 py-2 font-semibold">
                    {" "}
                    ID
                  </TableHead>
                  <TableHead className="text-left px-4 py-2 font-semibold">
                    Nome
                  </TableHead>
                  <TableHead className="text-left px-4 py-2 font-semibold">
                    Telefone
                  </TableHead>
                  <TableHead className="text-center px-4 py-2 font-semibold">
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="rounded-lg">
                {currentItems.map((driver, index) => (
                  <TableRow
                    className={`w-full even:bg-slate-100 odd:bg-white dark:even:bg-neutral-800 dark:odd:bg-zinc-950 ${
                      index === currentItems.length - 1
                        ? "rounded-b-lg rounded-r-lg"
                        : ""
                    }`}
                    onClick={() => showEditRow(index, driver)}
                    key={index}
                  >
                    <TableCell className="w-16">{driver.id}</TableCell>

                    <TableCell className="w-96">
                      {editRow === index ? (
                        <input
                          type="text"
                          className="w-full font-mono bg-transparent border-none"
                          value={editedValue.name}
                          onChange={(e) =>
                            setEditedValue({
                              ...editedValue,
                              name: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <div className="w-full font-mono bg-transparent border-none">
                          {driver.name}
                        </div>
                      )}
                    </TableCell>

                    <TableCell className="w-96">
                      {editRow === index ? (
                        <input
                          type="text"
                          value={editedValue.phone}
                          onChange={(e) => {
                            setEditedValue({
                              ...editedValue,
                              phone: editedValue.phone,
                            });
                          }}
                          className="w-full font-mono bg-transparent border-none"
                        />
                      ) : (
                        <div className="w-full font-mono bg-transparent border-none">
                          {driver.phone}
                        </div>
                      )}
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
                          {/* <DropdownMenuItem
                      onClick={() => {
                        handleEdit(index);
                      }}
                    >
                      Editar
                    </DropdownMenuItem> */}
                          <DropdownMenuItem
                            onClick={() => {
                              handleDelete(driver.id);
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
                // disabled={currentPage === 1}
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
      {/* </div> */}
    </>
  );
}

export default Driver;
