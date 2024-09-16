import {Router} from 'express'
import { getCell, postCell, putCell, deleteCell } from '../controllers/cellController.js'


const cellRouter=Router()

cellRouter.get('/',getCell)
cellRouter.get('/:cell_number',getCell)
cellRouter.get('/:status',getCell)
cellRouter.post('/',postCell)
cellRouter.put('/',putCell)
cellRouter.delete('/:id',deleteCell)


export default cellRouter

