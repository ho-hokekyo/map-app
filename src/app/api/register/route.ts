// user register for NextAuth.js
// Next.js 15
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import {NextRequest, NextResponse} from "next/server";

export async function POST(req: NextRequest) {
    // console.log("register")
    try{
        if (req.method !== "POST") {
            console.log("Bad request");
            return NextResponse.json({message: "Bad request"}, {status: 400});
        }

        const {name, email, password} = await req.json();

        const existUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        console.log(existUser);

        if (existUser) {
            console.log("User already exist");
            return NextResponse.json({message: "User already exist"}, {status: 400});
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                email:email,
                name: name, 
                hashedpassword: hashedPassword,

            },
        })

        return NextResponse.json({user}, {status: 200});
    }
    catch (error) {
        console.error("An unexpected error happened:", error);
        return NextResponse.json({message: "An unexpected error happened"}, {status: 500});

    }


}

