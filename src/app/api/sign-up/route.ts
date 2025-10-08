import { connectionToFirebase } from "@/lib/dbConnect";
import { User } from "@/model/User";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request:Request){
    await connectionToFirebase()

    try {
        const {username, email, password}=await request.json()
        
    } catch (error) {
        console.error('Error registering user', error)
        return Response.json(
            {
                success:false,
                message:'Error while registering User'
            },
            {
                status:500
            }
        )
    }
}