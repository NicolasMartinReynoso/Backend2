import express from "express"
import { __dirname } from "./utils.js"
import path from "path"
import userRouter from "./routes/user.routes.js"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import initializePassport from "./config/passport.config.js"
import mongoose from "mongoose"
import passport from "passport"
import { engine } from 'express-handlebars';
import session from "express-session";
import MongoStore from "connect-mongo"

const PORT = 8080
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/public', express.static(path.join(__dirname, 'public')))
mongoose.connect("")


app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main',
}));
app.set('view engine', 'hbs');
app.set('views',  path.resolve(__dirname, './views'))

app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl:'' })
}));

const server = app.listen(PORT, () => {
    console.log(`Servidor establecido en puerto ${PORT}`)
})

app.set('view engine', 'hbs');
app.set('views', './src/views');
app.use(cookieParser())
initializePassport()
app.use(passport.initialize())


app.use('/api/sessions', userRouter)
