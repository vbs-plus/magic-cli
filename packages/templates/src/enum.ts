
import path from 'path'
import dotenv from 'dotenv'

dotenv.config({
  path: path.resolve(__dirname, '../../../.env'),
})

export const MONGO_API_CONFIG = {
  API_KEY: process.env.API_KEY!,
  API_BASE_URL: process.env.API_BASE_URL!,
  DATASOURCE: process.env.DATASOURCE!,
  DATABASE: process.env.DATABASE!,
  COLLECTION: process.env.COLLECTION!,
}
