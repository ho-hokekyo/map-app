import { getServerSession } from 'next-auth';
import { NextResponse, NextRequest } from 'next/server';
import options from '@/lib/options';

export async function POST(request: Request) {
    if (!global.io) {
        return NextResponse.json(
            { error: 'Custom Server for notification (Socket.io) is not initialized' },
            { status: 500 },
        );
    }
    try {
        const session = await getServerSession();

        setTimeout(() => {
            console.log('session', session?.user.id);
            global.io!.to(session!.user.id!).emit('success notification'); //
            global.io!.emit('notification to all user');
        }, 1000);

        return NextResponse.json({ message: 'Notification sent' });
    } catch (error) {
        global.io!.emit('notification to all user');
        if (error instanceof Error) {
            console.error(error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            console.error('An unknown error occurred');
            return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
        }
    }
}
