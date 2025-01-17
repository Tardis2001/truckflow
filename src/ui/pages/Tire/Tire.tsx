import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { truck } from "../../../types/truck";
import { tire } from "../../../types/switchTire";
import styles from "./Tire.module.css";
import { Card, CardContent, CardFooter } from "../../components/shadcn/card";
import { DayPickerProvider } from "react-day-picker";
import { Calendar } from "../../components/shadcn/calendar";
import { Button } from "../../components/shadcn/button";
import {
  FormField,
  FormItem,
  Form,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "../../components/shadcn/form";
import { Input } from "../../components/shadcn/input";
import StarBorder from "../../components/StarBorder/Starborder";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/shadcn/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "../../util/cn";
import { Select } from "../../components/shadcn/select";
const formSchema = z.object({
  name: z.string().nonempty("Nome é obrigatório"),
  dateSwitched: z.string().nonempty("Data é obrigatória"),
  brand: z.string().nonempty("Marca é obrigatória"),
  model: z.string().nonempty("Modelo é obrigatório"),
  truckId: z
    .number()
    .positive("Id do caminhão é obrigatório")
    .int("Id do caminhão deve ser um número inteiro"),
});
function Tire() {
  const [trucks, setTrucks] = useState<truck[]>([]);
  const [tires, setTires] = useState<tire[]>([]);
  const [tire, setTire] = useState<tire>({
    id: undefined,
    dateSwitched: "",
    model: "",
    brand: "",
    truckId: undefined,
  });
  const [tireUpdate, setTireUpdate] = useState<tire>({
    id: undefined,
    dateSwitched: "",
    model: "",
    brand: "",
    truckId: undefined,
  });
  const [selectedTruckId, setselectedTruckId] = useState<string>("");

  const [tireRemove, settireRemove] = useState<number>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  let indexOfLastItem = currentPage * itemsPerPage;
  let indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const [filterName, setFilterName] = useState(""); // Estado para o filtro de nome

  let currentItems = tires
    .filter((tire) =>
      tire.name.toLowerCase().includes(filterName.toLowerCase())
    ) // Filtra motoristas pelo nome
    .slice(indexOfFirstItem, indexOfLastItem);
  let totalPages = Math.ceil(
    tires.filter((tire) =>
      tire.name.toLowerCase().includes(filterName.toLowerCase())
    ).length / itemsPerPage
  );
  useEffect(() => {
    loadTires();
  }, []);
  const loadTires = async () => {
    const tires = await window.electronApp.getTires();
    setTires(tires);
    indexOfLastItem = currentPage * itemsPerPage;
    indexOfFirstItem = indexOfLastItem - itemsPerPage;
    currentItems = currentItems = tires.filter((tire) =>
      tire.name.toLowerCase().includes(filterName.toLowerCase())
    );
    totalPages = Math.ceil(
      tires.filter((tire) =>
        tire.name.toLowerCase().includes(filterName.toLowerCase())
      ).length / itemsPerPage
    );
  };
  useEffect(() => {
    loadSelect();
  }, []);
  useEffect(() => {
    if (selectedTruckId !== "") {
      const fetchTires = async () => {
        const tireData = await window.electronApp.getTire(
          Number(selectedTruckId)
        );
        setTires(tireData);
        setTire({ ...tire, truckId: Number(selectedTruckId) });
      };
      fetchTires();
    } else {
      setTires([]);
    }
  }, [selectedTruckId]);
  const selectTruck = (e: ChangeEvent<HTMLSelectElement>) => {
    setselectedTruckId(e.target.value);
  };
  const loadSelect = () => {
    window.electronApp.getTrucks().then((data: truck[]) => setTrucks(data));
  };
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Remove qualquer caractere que não seja número
    value = value.replace(/\D/g, "");

    // Aplica a máscara DD/MM/YYYY
    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }
    if (value.length > 5) {
      value = value.slice(0, 5) + "/" + value.slice(5);
    }

    // Limita o tamanho a 10 caracteres (DD/MM/YYYY)
    if (value.length > 10) {
      value = value.slice(0, 10);
    }

    setTire({ ...tire, dateSwitched: value });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTire({ ...tire, [name]: value });
  };
  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    try {
      window.electronApp.addTire(data);
      toast("Troca de pneu adicionada com sucesso!");
    } catch (error) {
      toast.error("Falha ao adicionar troca de pneu");
    }
    form.reset();

    loadTires();
  };

  const handleDeleteChange = (e: ChangeEvent<HTMLInputElement>) => {
    settireRemove(Number(e.target.value.replace(/\D/g, "")));
  };
  const handleDeleteSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!tireRemove) {
      alert("selecione um id de oleo para remover");
      return;
    }
    window.electronApp.removeTire(tireRemove);
    loadSelect();
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  return (
    <>
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
                    name="dateSwitched"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Data de Troca</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-[240px] pl-3 flex justify-center text-left font-normal",
                                  !field.value && "text-neutral-400"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Escolha uma data</span>
                                )}
                                <CalendarIcon className="ml-auto w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
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
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marca*</FormLabel>
                        <FormControl>
                          <Input
                            className="bg-slate-100 outline-none border-none dark:bg-neutral-800"
                            style={{
                              fontFamily: "Hanken Grotesk",
                              boxShadow:
                                "inset 0px 5px 3px 0px rgba(0,0,0,0.75)",
                            }}
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value ? Number(value) : undefined);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="truckId"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select></Select>
                        </FormControl>
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
      {/* <h3 className={styles.title}>Troca de Pneu</h3>
            <div className={styles.content}>
                {" "}
                <div className={styles.select_box_tire}>
                    <select onChange={selectTruck}>
                        <option value="">Escolha um caminhão</option>
                        {trucks.map((truck) => (
                            <option key={truck.id} value={truck.id}>
                                Id: {truck.id} / Placa: {truck.plate}
                            </option>
                        ))}
                    </select>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Data de troca</th>
                            <th>Marca</th>
                            <th>Modelo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tires.map((tire) => (
                            <tr key={tire.id}>
                                <td>
                                    <strong>{tire.id}</strong>
                                </td>
                                <td>{tire.dateSwitched}</td>
                                <td>{tire.brand}</td>
                                <td>{tire.model}</td>
                                {/* <td>{tire.truckId} </td> 
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className={styles.box}>
                    <h2>Adicionar Troca de Pneu</h2>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.model_box}>
                            <input
                                type="text"
                                name="dateSwitched"
                                value={tire.dateSwitched}
                                onChange={handleDateChange}
                                maxLength={10}
                                placeholder=" "
                                required
                            />
                            <label>Data de Troca</label>
                        </div>
                        <div className={styles.model_box}>
                            <input
                                type="text"
                                name="brand"
                                value={tire.brand}
                                onChange={handleChange}
                                placeholder=" "
                                required
                            />
                            <label>Marca</label>
                        </div>
                        <div className={styles.model_box}>
                            <input
                                type="text"
                                name="model"
                                value={tire.model}
                                onChange={handleChange}
                                placeholder=" "
                                required
                            />
                            <label>Modelo</label>
                        </div>

                        <button className={styles.submit} type="submit">
                            Adicionar
                        </button>
                    </form>
                </div>
                <div className={styles.box}>
                    <h2>Atualizar Troca de Pneu</h2>
                    <form onSubmit={handleUpdateSubmit}>
                        <div className={styles.model_box}>
                            <input
                                type="text"
                                name="id"
                                value={tireUpdate.id}
                                onChange={handleUpdateChange}
                                maxLength={10}
                                placeholder=" "
                                required
                            />
                            <label>Id</label>
                        </div>
                        <div className={styles.model_box}>
                            <input
                                type="text"
                                name="dateSwitched"
                                value={tireUpdate.dateSwitched}
                                onChange={handleUpdateDateChange}
                                maxLength={10}
                                placeholder=" "
                                required
                            />
                            <label>Data de Troca</label>
                        </div>
                        <div className={styles.model_box}>
                            <input
                                type="text"
                                name="model"
                                value={tireUpdate.model}
                                onChange={handleUpdateChange}
                                placeholder=" "
                                required
                            />
                            <label>Modelo</label>
                        </div>
                        <div className={styles.model_box}>
                            <input
                                type="text"
                                name="brand"
                                value={tireUpdate.brand}
                                onChange={handleUpdateChange}
                                placeholder=" "
                                required
                            />
                            <label>Marca</label>
                        </div>

                        <button className={styles.submit} type="submit">
                            Atualizar
                        </button>
                    </form>
                </div>
                <div className={styles.box}>
                    <h2>Remover Troca de Pneu</h2>
                    <form onSubmit={handleDeleteSubmit}>
                        <div className={styles.model_box}>
                            <input
                                type="number"
                                name="oilIdRemove"
                                value={tireRemove}
                                onChange={handleDeleteChange}
                                maxLength={10}
                                placeholder=" "
                                required
                            />
                            <label>Id</label>
                        </div>
                        <button className={styles.submit} type="submit">
                            Remover
                        </button>
                    </form>
                </div>
            </div> */}
    </>
  );
}
export default Tire;
