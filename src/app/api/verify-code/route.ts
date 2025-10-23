import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();
    //decodeURIComponent(username) use this, if you are using query from search url, as it add %20
    // const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username:username});
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 403 }
      );
    }
    const isCodeValid = user.verifyCode === code
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

    if(isCodeNotExpired && isCodeValid){
        user.isVerified = true
        await user.save()

        return Response.json({
            success:true,
            message:"Account Verified successfully"
        },{status:200})
    }else if(!isCodeNotExpired){
        return Response.json({
            success:false,
            message:"Verification Code is Expired, please sign-up again to verify again"
        },{status:400})
    }else {
        return Response.json({
            success:false,
            message:"Verification Code that you have sent is incorrect"
        },{status:401})
    }
  } catch (error) {
    console.error("Error while verifing code :", error);
    return Response.json(
      { success: false, message: "Error while verifing code" },
      { status: 500 }
    );
  }
}
