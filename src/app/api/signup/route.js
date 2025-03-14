import connectDb from "@/lib/dbConnect";
import User from "@/models/User.model";	
import bcrypt from "bcryptjs";

export async function POST(req) {
    await connectDb();
    try {
        const {username, email, password} = await req.json();
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return  Response.json({
                success: false,
                message: "User already exists"	
            }, {
                status: 400
            }
        )
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            email, username, password: hashedPassword
        })
        if (!user) {
            return Response.json({
                success: false,
                message: "User creation failed"
            }, {
                status: 400
            })
        }
        return Response.json({
            success: true,
            message: "User created successfully"
        }, {
            status: 201
        })
    } catch (error) {
        return Response.json({
            success: false,
            message: error.message
        }, {
            status: 500
        })
    }
}