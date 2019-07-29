import { Router } from 'express'
import { getApps, getAppByAddress } from '../controllers/devery.controller'

const router = new Router()

router.route('/').get(getApps)

router.route('/:address').get(getAppByAddress)

export default router
