import {NextResponse, NextRequest} from 'next/server';


export async function POST(request: Request){

    if (!global.io){
        return NextResponse.json({error: "Custom Server for notification (Socket.io) is not initialized"}, {status: 500});
    }

    const {userId} = await request.json();

    if (!userId){
        return NextResponse.json({error: "userId is required"}, {status: 400});
    }

    setTimeout(() =>{
        global.io?.to(userId).emit("notification to one user") // 
        global.io?.emit("notification to all user")
    }, 3000)
    
    return NextResponse.json({message: "Notification sent"});
}