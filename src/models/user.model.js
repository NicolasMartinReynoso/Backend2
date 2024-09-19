import mongoose from "mongoose"


const usersCollection = "Usuarios"

const userSchema = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, unique: true },
    age: { type: Number },
    password: { type: String },
    // cart: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
    role: { type: String, default: "user" }
})

const userModel = mongoose.model(usersCollection, userSchema)

export default userModel;