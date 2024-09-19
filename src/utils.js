import { fileURLToPath } from 'url'
import { dirname } from 'path'
import bcrypt from "bcrypt"

const __fileName = fileURLToPath(import.meta.url)

export const __dirname = dirname(__fileName)


export const passwordHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const passwordValidation = (user,password)=>bcrypt.compareSync(password,user.password)