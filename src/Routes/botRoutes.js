import express from 'express'
const router = express.Router()

import controllers from './controllers/botControllers'

const dialogflow = process.env.ROUTE_DIALOGFLOW

router.get(dialogflow, controllers.readAll)

router.post(dialogflow, controllers.webHook)

export default router