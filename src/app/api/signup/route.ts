import connectDb from "@/lib/connectDb";
import UserModel from "../../../../model/Users";




export async function POST(request: Request) {
    await connectDb();
    try {
        const {name, email, password} = await request.json();
        const exisingUser = await UserModel.findOne({email});
        if (exisingUser) {
            return new Response("User already exists", {status: 400});
        }
        const user = await UserModel.create({name, email, password});
        return Response.json({
            success: true,
            message: "User Registered Successfully"
        }, {status: 201})
    } catch (error) {
        console.log(error);
        return Response.json({
            success: false,
            message: "Internal Server Error"
        }, {status: 500
        })
    }
}