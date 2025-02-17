import connectDb from "@/lib/connectDb";
import UserModel from "../../../../model/Users";
import bcrypt from "bcryptjs";


export async function POST(request: Request) {
    await connectDb();
    try {
        const {name, email, password} = await request.json();
        const exisingUser = await UserModel.findOne({email});
        if (exisingUser) {
            return new Response("User already exists", {status: 400});
        }
      0
        const user = await UserModel.create({name, email, password});
        return Response.json({
            success: true,
            message: "User Registered Successfully"
        }, {status: 201})
    } catch (error) {
        
    }
}