/*
websocketの通信に使うイベントの種類
emit: socket.emit("event-type", )
on: socket.on("event-type", fucntion())
*/
export type websocketEventType = "notification to all user" | "normal notification" | "error notification" | "success notification" | "new post was created" | "new comment was created" | "new like was created" | "new follow was created" | "new message was created" | "new friend request was created" | "new friend request accepted" | "new friend request rejected" | "new friend request cancelled" | "new friend request ignored" | "new friend request blocked" | "new friend request unblocked" | "new friend request unignored" | "new friend request unaccepted" | "new friend request unrejected";

// handle new post was created arg
// export type newPostCreatedArg 