const io = require('socket.io')(process.env.PORT || 3000);
const arrUserInfo = [];

io.on('connection', socket => {
    socket.on('sign_up', user => {
        const isexits = arrUserInfo.some(x => x.ten === user.ten);
        socket.peerid = user.peerid;
        if (isexits) {
            return socket.emit('sign_up_fail');
        }
        arrUserInfo.push(user);
        socket.emit('online', arrUserInfo);
        socket.broadcast.emit('newuser', user);
    });

    socket.on('disconnect', () => {
        const index = arrUserInfo.findIndex(user => user.peerid === socket.peerid);
        arrUserInfo.splice(index, 1);
        io.emit('disconuser', socket.peerid);
    });
});
