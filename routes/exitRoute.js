import { Router } from "express";
import {exit} from '../controllers/cellController.js'


const exitRouter = Router()

exitRouter.post('/',exit)

export default exitRouter