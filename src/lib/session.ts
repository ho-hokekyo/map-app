
import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";


export const CheckSession = async () => {
    try{

        const session = await getSession();
        return session;
    }catch(e){
        console.log(e);
        return "fail";
    }
}