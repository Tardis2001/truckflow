import { contextBridge, ipcRenderer } from "electron";
import type { driver } from "../types/driver.js" with { "resolution-mode": "import" };
import type { truck } from "../types/truck.js" with { "resolution-mode": "import" };
import type { tire } from "../types/switchTire.js" with { "resolution-mode": "import" };
import type { oil } from "../types/oil.js" with { "resolution-mode": "import" };

export default process.once("loaded", () => {
    contextBridge.exposeInMainWorld("electronApp", {

        removeAll : () => ipcRenderer.invoke("removeAll"),

        getDrivers: () => ipcRenderer.invoke("getDrivers"),
        addDriver: (newDriver: driver) => ipcRenderer.invoke("addDriver", newDriver),
        updateDriver: (updateDriver: driver) => ipcRenderer.invoke("updateDriver",updateDriver),
        deleteDriver : (idDriver: number) => ipcRenderer.invoke("deleteDriver",idDriver),

        getTrucks: () => ipcRenderer.invoke("getTrucks"),
        addTruck: (newTruck: truck) => ipcRenderer.invoke("addTruck", newTruck),
        updateTruck: (updateTruck:truck,newDriverIds: number[]) => ipcRenderer.invoke("updateTruck",updateTruck,newDriverIds),
        deleteTruck : (idTruck: number) => ipcRenderer.invoke("deleteDriver",idTruck),
    
        getTire:(truckId:number)=> ipcRenderer.invoke("getTire",truckId),
        addTireData:(tire : tire) => ipcRenderer.invoke("addTireData",tire),
        updateTireData:(updateTire : tire) => ipcRenderer.invoke("updateTire",updateTire),
        removeTireData:(idTire : number) => ipcRenderer.invoke("removeTire",idTire),
        getTiresMonthData:(month:number) => ipcRenderer.invoke("getTiresMonthData",month),

        getOil:(truckId:number)=> ipcRenderer.invoke("getOil",truckId),
        getOils:()=> ipcRenderer.invoke("getOils"),
        addOil:(oil : oil) => ipcRenderer.invoke("addOil",oil),
        updateOildata:(updateOil : oil) => ipcRenderer.invoke("updateOildata",updateOil),
        removeOilData:(idOil : number) => ipcRenderer.invoke("removeOil",idOil),
        getOilsMonthandYearData:(month:number,year:number) => ipcRenderer.invoke("getOilsMonthData",month,year),
        
        // openDialog: () => ipcRenderer.invoke("openDialog"),
        // dialogOilResponse: (input : number) => ipcRenderer.invoke("dialogOilResponse",input),
        // oilNextdays: () => ipcRenderer.invoke("oilNextdays"),
        // getNextOilChange: (lastOilChangeDate:String,oilId : number) => ipcRenderer.invoke("getNextOilChange",lastOilChangeDate, oilId)
    });
    
});
