import { app, BrowserWindow, ipcMain } from "electron";
import { isDev } from "./utils.js";
import Store from "electron-store";
import path from "path";
import { driver } from "../types/driver.js";
import { truck } from "../types/truck.js";
import { tire } from "../types/switchTire.js";
import { oil } from "../types/oil.js";

const store = new Store();
let mainWindow: BrowserWindow;
app.on("ready", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        mainWindow = new BrowserWindow({
            width: 1024,
            height: 800,
            title: "truckflow",

            webPreferences: {
                nodeIntegration: true,
                contextIsolation: true,
                nodeIntegrationInWorker: true,

                preload: path.join(
                    app.getAppPath(),
                    "dist-electron",
                    "electron",
                    "preload.cjs"
                ),
            },
        });
        mainWindow.setMinimumSize(600, 400);
        if (isDev()) {
            mainWindow.loadURL("http://localhost:5123");
        } else {
            mainWindow.loadFile(
                path.join(app.getAppPath(), "dist", "index.html")
            );
        }
    }
});
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

if (!store.has("drivers")) {
    store.set("drivers", []);
}
if (!store.has("trucks")) {
    store.set("trucks", []);
}
if (!store.has("tires")) {
    store.set("tires", []);
}
if (!store.has("oil")) {
    store.set("oil", []);
}
if (!store.has("firstTimeDialog")) {
    store.set("firstTimeDialog", true);
}
if (!store.has("oilDays")) {
    store.set("oilDays", 0);
}
if (!store.has("driverCounter")) {
    store.set("driverCounter", 1);
}
if (!store.has("truckCounter")) {
    store.set("truckCounter", 1);
}
if (!store.has("tireCounter")) {
    store.set("tireCounter", 1);
}
if (!store.has("oilCounter")) {
    store.set("oilCounter", 1);
}
const generateId = (type: "driver" | "truck" | "tire" | "oil") => {
    const counterKey = `${type}Counter`;
    const currentId = store.get(counterKey) as number;
    store.set(counterKey, currentId + 1);
    return currentId;
};

/*-----------------Driver---------------- */
ipcMain.handle("getDrivers", () => {
    return store.get("drivers");
});

ipcMain.handle("addDriver", (_, driver: driver) => {
    const drivers = (store.get("drivers") as driver[]) || [];
    const newDriver = { ...driver, id: generateId("driver") };
    store.set("drivers", [...drivers, newDriver]);
});

ipcMain.handle("updateDriver", (_, newDriver: driver) => {
    const drivers = (store.get("drivers") as driver[]) || [];
    const driverIndex = drivers.findIndex((d) => d.id === Number(newDriver.id));

    if (driverIndex !== -1) {
        const updatedDriver = { ...drivers[driverIndex] };

        if (newDriver.phone) {
            updatedDriver.phone = newDriver.phone;
        }
        if (newDriver.name) {
            updatedDriver.name = newDriver.name;
        }

        drivers[driverIndex] = updatedDriver;
        store.set("drivers", drivers);
        return true;
    } else {
        return false;
    }
});
/*-----------------Driver---------------- */

/*-----------------Truck---------------- */

ipcMain.handle("getTrucks", () => {
    return store.get("trucks");
});

ipcMain.handle("addTruck", (_, truck: truck) => {
    const trucks = (store.get("trucks") as truck[]) || [];
    const newTruck = { ...truck, id: generateId("truck") };
    store.set("trucks", [...trucks, newTruck]);
});
ipcMain.handle(
    "updateTruck",
    (_, updatedTruck: truck, newDriverIds: number[]) => {
        const truckIndex = (store.get("trucks") as truck[]) || [];

        if (
            truckIndex.findIndex((t: truck) => t.id === updatedTruck.id) !== -1
        ) {
            updatedTruck.driver = newDriverIds;
            store.set("trucks", updatedTruck);
            return true;
        } else {
            return false;
        }
    }
);
/*-----------------Truck---------------- */

/*-----------------Tire---------------- */
ipcMain.handle("getTire", (_, truckId: number) => {
    const tires = (store.get("tires") as tire[]) || [];
    const filteredTires = tires.filter(
        (tire) => Number(tire.truckId) === Number(truckId)
    );
    return filteredTires;
});
ipcMain.handle("addTireData", (_, tire: tire) => {
    const tires = (store.get("tires") as tire[]) || [];
    const newTire = {
        ...tire,
        id: generateId("tire"),
    };
    store.set("tires", [...tires, newTire]);
    return tires;
});
ipcMain.handle("updateTire", (_, updateNewTire: tire, truckId: number) => {
    const tires = (store.get("tires") as tire[]) || [];
    const tireIndex = tires.findIndex(
        (t: tire) => t.truckId === Number(truckId)
    );
    if (tireIndex !== -1) {
        const updateTire = { ...tires[tireIndex] };
        if (updateNewTire.dateSwitched || updateNewTire.truckId) {
            updateTire.dateSwitched = updateNewTire.dateSwitched;
            updateTire.truckId = updateNewTire.truckId;
        }

        tires[tireIndex] = updateTire;
        store.set("tires", tires);
        return true;
    } else {
        return false;
    }
});
ipcMain.handle("getTiresMonthData", (_, month: number) => {
    const tires = (store.get("tires") as tire[]) || []; // Obter os dados armazenados

    // Filtrar os pneus trocados no mês especificado
    const filteredTires = tires.filter((tire) => {
        const tireDate = new Date(tire.dateSwitched);
        return tireDate.getMonth() + 1 === month; // Adiciona +1 porque getMonth() retorna de 0-11
    });

    return filteredTires; // Retorna apenas os pneus filtrados
});

/*-----------------Tire---------------- */
/*-----------------Oil---------------- */
ipcMain.handle("addOil", (_, oil: oil) => {
    const oils = (store.get("oil") as oil[]) || [];
    const newOil = {
        ...oil,
        id: generateId("oil"),
        truckId: Number(oil.truckId),
    };
    store.set("oil", [...oils, newOil]);
    return oils;
});
ipcMain.handle("getOil", (_, truckId: number) => {
    const oil = (store.get("oil") as oil[]) || [];
    const filteredOil = oil.filter(
        (oil) => Number(oil.truckId) === Number(truckId)
    );

    return filteredOil;
});
ipcMain.handle("getOils", () => {
    const oils = store.get("oil"); // Isso pode ser um banco de dados ou uma variável
    return oils || [];
});
// let dialogWindow: BrowserWindow | null;

// ipcMain.handle("openDialog", async () => {
//     if (dialogWindow) {
//         dialogWindow.focus(); // Se já estiver aberta, apenas traz a janela para frente
//         return;
//     }
//     if (!store.get("firstTimeDialog")) {
//         return;
//     } else {
//         dialogWindow = new BrowserWindow({
//             width: 500,
//             height: 400,
//             modal: true,
//             frame: false,
//             resizable: false,
//             parent: mainWindow,
//             webPreferences: {
//                 contextIsolation: true,
//                 preload: path.join(
//                     app.getAppPath(),
//                     "dist-electron",
//                     "electron",
//                     "preload.cjs"
//                 ),
//             },
//         });

//         dialogWindow.loadFile("src/ui/components/inputDialogOil.html");
//         dialogWindow.on("closed", () => {
//             dialogWindow = null;
//         });
//         return store.get("oilDays");
//     }
// });
// ipcMain.handle("dialogOilResponse", async (_, response) => {
//     if (!store.has("oilDays")) {
//         store.set("oilDays", Number(response));
//     }
// });
// ipcMain.handle("oilNextdays", () => {
//     return store.get("oilDays");
// });
// ipcMain.handle(
//     "getNextOilChange",
//     (_, lastOilChangeDate: string, oilId: number) => {
//         // Converte a data da última troca de óleo para um objeto Date
//         const lastChange = new Date(lastOilChangeDate);

//         // Calcula a próxima data de troca de óleo
//         const nextOilChangeDate = new Date(lastChange);
//         nextOilChangeDate.setDate(
//             lastChange.getDate() + Number(store.get("oilDays"))
//         );

//         const oils = (store.get("oil") as oil[]) || [];
//         const oilIndex = oils.findIndex((oil) => oil.id === oilId);
//         if (oilIndex !== -1) {
//             const updateOil = {
//                 ...oils[oilIndex],
//                 dateNext: nextOilChangeDate.toISOString().split("T")[0],
//             };

//             oils[oilIndex] = updateOil;

//             store.set("oil", oils);
//         } else {
//             return false;
//         }

//         // Retorna a data calculada no formato desejado (ex: "YYYY-MM-DD")
//         return nextOilChangeDate.toISOString().split("T")[0];
//     }
// );
ipcMain.handle("getOilsMonthandYearData", (_, month: number, year: number) => {
    const tires = (store.get("tires") as tire[]) || []; // Obter os dados armazenados
    console.log(month);
    // Filtrar os pneus trocados no mês especificado
    const filteredTires = tires.filter((tire) => {
        const tireDate = new Date(tire.dateSwitched);
        return tireDate.getMonth() + 1 === month; // Adiciona +1 porque getMonth() retorna de 0-11
    });

    return filteredTires; // Retorna apenas os pneus filtrados
});

/*-----------------Oil---------------- */
