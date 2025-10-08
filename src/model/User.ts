import { z } from "zod";

export const MessageSchema = z.object({
  content: z
    .string()
    .min(1, "Message content cannot be empty.")
    .describe("Message text sent by user."),
  createdAt: z
    .date()
    .default(() => new Date())
    .describe("Timestamp when the message was created."),
});

export const UserSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long.")
    .max(30, "Username cannot exceed 30 characters.")
    .describe("Unique username for the user."),

  email: z
    .string()
    .email("Invalid email address format.")
    .describe("User email used for authentication."),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .describe("User password (should be hashed before saving)."),

  verifyCode: z
    .string()
    .min(1, "Verification code is required.")
    .describe("Code used for account verification."),

  verifyCodeExpiry: z
    .date()
    .describe("Date when verification code expires."),

  isVerified: z
    .boolean()
    .default(false)
    .describe("Indicates whether the user is verified."),

  isAcceptingMessage: z
    .boolean()
    .default(true)
    .describe("Whether the user accepts messages or not."),

  messages: z
    .array(MessageSchema)
    .default([])
    .describe("List of messages associated with the user."),
});

export type Message = z.infer<typeof MessageSchema>;
export type User = z.infer<typeof UserSchema>;



// import mongoose, {Schema, Document} from 'mongoose';

// export interface Message extends Document {
//     content:string; // Typescript mein small s
//     createdAt:Date;
// }
// const MessageSchema:Schema<Message> = new Schema({
//     content:{
//         type:String, // Mongoose mein capital s
//         required:true,
//     },
//     createdAt:{
//         type:Date,
//         required:true,
//         default:Date.now
//     }
// })

// export interface User extends Document {
//     username:string;
//     email:string;
//     password:string;
//     verifyCode:string;
//     verifyCodeExpiry:Date;
//     isVerified:boolean,
//     isAcceptingMessage:boolean;
//     messages:Message[];
// }

// const UserSchema:Schema<User> = new Schema({
//     username:{
//         type:String,
//         required:[true,"Username is required."],
//         trim:true,
//         unique:true,
//     },
//     email:{
//         type:String,
//         required:[true, "Email is required"],
//         unique:true,
//     },
//     password:{
//         type:String,
//         required:[true, "password is required"],
//     },
//     verifyCode:{
//         type:String,
//         required:[true, "verify code is required"],
//     },
//     verifyCodeExpiry:{
//         type:Date,
//         required:[true, "verify code expiry is required"],
//     },
//     isAcceptingMessage:{
//         type:Boolean,
//         required:true,
//         default:true,
//     },
//     isVerified:{
//         type:Boolean,
//         default:false,
//     },
//     messages:[MessageSchema],
// })


// const UserModel = (mongoose.models.User as mongoose.Model<User>)||(mongoose.model<User>("User",UserSchema))
//                  // existing                                         // new creating

// export default UserModel;