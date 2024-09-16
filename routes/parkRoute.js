import { Router } from "express";
import {park} from '../controllers/cellController.js'


const parkRouter = Router()

parkRouter.post('/',park)

export default  parkRouter