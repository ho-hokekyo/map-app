import {createServer} from "node:http";
import {Server} from "socket.io";
import {parse} from "node:url";
import next from "next";


declare global {
    var io: Server | undefined;
}


const dev = process.env.NODE_ENV !== "production";
const app = next({dev, turbo:true});
const handle = app.getRequestHandler();

// Next.jsの準備が整ってからサーバー起動する
app.prepare().then(() => {
    // HTTPサーバーを作成
    const server = createServer((req, res) => {
        if (!req.url) return;
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    });

    const io = new Server(server, {
        cors:{
            origin: "*", // デプロイする際にはオリジンを設定するべき
            methods: ["GET", "POST"]
        }
    })

    global.io = io;


    // 接続時の処理:
    io.on("connection", (socket) => {
        console.log("connected");

        // ユーザーごとに個別のルームに入る
        socket.on("joinRoom", (userId: string) =>{
            socket.join(userId);
            console.log(`User ${userId} joined`);
            console.log(`Rooms: ${io.sockets.adapter.rooms}`);
        })

        // 切断時の処理
        socket.on("disconnect", () => {
            console.log("disconnected");
        })
    })

    server.listen(3000, () => {
        console.log('listening on 3000');
    })
    
})