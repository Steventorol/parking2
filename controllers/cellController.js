import Cell  from '../models/cell.js' //Importar modelo
import crypto from 'crypto'

function encryptPin(cellNumber, vehiclePlate) {
    return crypto.createHash('md5').update(`${cellNumber}${vehiclePlate}`).digest('hex'); //Función para encriptar y concatenar
  }
  
  function calculatePayment(entryDate, exitDate) {
    const hours = Math.ceil((exitDate - entryDate) / (1000 * 60 * 60));
    return Math.max(1, hours) * 5000; //Función para calcular el valor total a pagar según la diferencia de horas
  }
  
//Método Get
export async function getCell(req, res) {
    try {
        const { cell_number, status } = req.query; 

        if (cell_number) {
            // Si se proporciona un cell_number, busca esa celda específica
            const cell = await Cell.findOne({ cell_number: parseInt(cell_number, 10) });
            
            if (!cell) {
                return res.status(404).json({ message: "Cell not found" });
            }
            
            return res.json(cell);
        } 
        else if (status === 'Available') {
            // Si se proporciona status='Available', busca todas las celdas disponibles
            const availableCells = await Cell.find({ status: 'Available' });
            
            if (availableCells.length === 0) {
                return res.status(404).json({ message: "No available cells found" });
            }
            
            return res.json(availableCells);
        }
        else {
            // Si no se proporciona cell_number ni status, obtiene todas las celdas
            const cells = await Cell.find();
            return res.json(cells);
        }
    } catch (error) {
        console.error("Error while fetching cell(s)", error);
        res.status(500).json({ message: "Error fetching cell(s)", error: error.message });
    }
}



//Método Post
export async function postCell(req, res) {
    try {
        
        const count = await Cell.countDocuments();
        if (count >= 10) {
          return res.status(400).json({ message: 'Maximum number of cells reached' });
        }
        const cell = new Cell({ status: 'Available' });
        await cell.save();
        res.status(201).json(cell);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
}

//Método put

export async function putCell(req,res){
    const {cell_number,status,vehicle_plate,entry_date,exit_date,pin}=req.body
    let msg='Cell updated'
    try{
        await Cell.findOneAndUpdate({cell_number:cell_number},{status:status,vehicle_plate:vehicle_plate,entry_date:entry_date,exit_date:exit_date,pin:pin})
        
        
} catch(error){
 msg=error
}
res.json({msg:msg})
}


//Método delete
export async function deleteCell(req,res){
    let msg='Cell deleted'
    const id=req.params.id
    try{
        await Cell.findByIdAndDelete({_id:id})
    } catch (error) {
        msg='There was a problem while deleting'

    }
    res.json({msg:msg})
}
export async function park(req, res) {
    try {
        const { vehicle_plate } = req.body;
        const cell = await Cell.findOne({ status: 'Available' });
        if (!cell) return res.status(400).json({ message: 'No available cells' });
        
        cell.vehicle_plate = vehicle_plate;
        cell.status = 'Occupied';
        cell.entry_date = new Date();
        cell.pin = encryptPin(cell.cell_number, vehicle_plate);
        await cell.save();
        
        res.json(cell);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
  }

export async function exit(req,res){
    try {
        const { cell_number } = req.body;
        const cell = await Cell.findOne({ cell_number });
        if (!cell || cell.status === 'Available') {
          return res.status(400).json({ message: 'Cell doesnt have a car' });
        }
        
        const exitDate = new Date();
        const payment = calculatePayment(cell.entry_date, exitDate);
        
        cell.status = 'Available';
        cell.vehicle_plate = null;
        cell.entry_date = null;
        cell.exit_date = null;
        cell.pin = null;
        await cell.save();
        
        res.json({ message: 'Vehicle exited', payment });
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
}




