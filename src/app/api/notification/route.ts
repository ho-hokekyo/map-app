import { getServerSession } from 'next-auth';
import {NextResponse, NextRequest} from 'next/server';
import options  from "@/lib/options"

export async function POST(request: Request){

    if (!global.io){
        return NextResponse.json({error: "Custom Server for notification (Socket.io) is not initialized"}, {status: 500});
    }
    const session = await getServerSession(options);

    setTimeout(() =>{
        console.log("session", session?.user.id);
        global.io?.to(session?.user?.id!).emit("success notification") // 
        global.io?.emit("notification to all user")
    }, 1000)
    
    return NextResponse.json({message: "Notification sent"});
}