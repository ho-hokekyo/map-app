
import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";
import options from "@/lib/options";


export const CheckSession = async () => {
    try{
        const session = await getSession();
        return session;
    }catch(e){
        console.log(e);
        return "fail";
    }
}