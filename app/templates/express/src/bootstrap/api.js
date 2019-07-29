import { createLogger } from '../services/logger'
import { Router } from 'express'
import { debugRequestMiddleware } from '../middleware/debugRequest'
import { sendSuccessMiddleware } from '../middleware/sendSuccess'
import { sendErrorMiddleware } from '../middleware/sendError'
import deveryRoutes from '../api/devery.routes'

const logger = createLogger('Bootstrap')

export function API() {
  const api = Router()

  api.use(debugRequestMiddleware)
  api.use(sendSuccessMiddleware)
  api.use(sendErrorMiddleware)

  api.use('/devery', deveryRoutes)

  return api
}

export default function(app) {
  app.use(process.env.API_PREFIX ? process.env.API_PREFIX : '', API())
  /***/ logger.info('API attached')
}
