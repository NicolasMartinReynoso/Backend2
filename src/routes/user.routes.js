import { Router } from "express";
import passport from "passport";

import jwt from "jsonwebtoken"

const userRouter = Router()



//perfil de usuario
userRouter.get('/profile', passport.authenticate("jwt",{session:false}), async (req, res) => {
    res.render("current",user)
})


//logueo de usuario
userRouter.get('/login', async (req, res) => {
    res.render("login")
})


userRouter.post('/login', passport.authenticate("login", { failureRedirect: "failregister" }), async (req, res) => {
    const { email, password } = req.body
    if (!req.user) return res.status(400).send({ status: "error", error: "Credenciales invalidas" })

        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
        };        
    let token = jwt.sign({ email, password }, "secretkey", { expiresIn: "12h" })
    res.cookie("currentUser", token, {
        httpOnly: true
    }).redirect("profile")

})





//registro de usuario
userRouter.get("/register", async (req, res) => {
    res.render("register")
})

userRouter.post('/register', passport.authenticate('register', { failureRedirect: 'failregister' }), async (req, res) => {
    res.send({ status: "success", message: "usuario registrado" })
});

userRouter.get('/failregister', async (req, res) => {
    res.send({ error: "Failed" })
})

export default userRouter;