import passport from "passport";
import userModel from "../models/user.model.js";
import jwt from "passport-jwt"
import { passwordHash, passwordValidation } from "../utils.js";
import local from "passport-local"


const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt
const LocalStrategy = local.Strategy

const cookieExtractor = req => {
    let token = null 
    if (req && req.cookies) {
        token = req.cookies["currentUser"].authorization
    }
    return token
}

const initializePassport = () => {
    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            const user = await userModel.findOne({ email: username })
            if (!user) {
                console.log("El usuario no existe")
                return done(null, false)
                }
                if (!passwordValidation(user, password)) return done(null, false)
                return done(null, user)
                } catch (error) {
                    return done(error)
                    }
                    }))

    passport.use("jwt", new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: "secretkey"
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload)
        } catch (error) {
            return done(error)
        }
    }
    ))
    passport.use('register', new LocalStrategy({
        passReqToCallback: true, usernameField: 'email'
    }, async (req , username, password, done) => {
        const { firstName, lastName, email, age } = req.body
        try {
            let user = await userModel.findOne({ email: username })
            if (user) {
                console.log("Usuario no disponible")
                return done(null, false)
            }
            const newUser = {
                firstName,
                lastName,
                email,
                age,
                password: passwordHash(password)
            }
            let result = await userModel.create(newUser)
            return done(null, result)
        } catch (error) {
            return done("Error al obtener el usuario" + error)
        }
    }))
}



passport.serializeUser((user, done) => {
    done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
    let user = await userModel.findById(id)
    done(null, user)
})

export default initializePassport;