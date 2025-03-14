import mongoose, {Schema} from "mongoose"

const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"],	
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
    }
})

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
