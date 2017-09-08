$(document).ready(function(){

const socket = io('http://localhost:3000');
// const socket = io('https://web-rtc-peerjs.herokuapp.com/');

$('#chat-area1').hide();
$('#chat-area2').hide();
$('#chat-area3').hide();

$.ajax ({
    url: "https://global.xirsys.net/_turn/webrtc/",
    type: "PUT",
    async: false,
    headers: {
      "Authorization": "Basic " + btoa("htcvtc59:b8e70e18-94c0-11e7-8707-f7a6f0356108")
    },
    success: function (res){
      console.log("ICE List: "+res.v.iceServers);
    }
});


socket.on('online', arrUserInfo => {
    $('#chat-area1').show();
    $('#chat-area2').show();
    $('#chat-area3').show();
    $('#signup-area').hide();

    arrUserInfo.forEach(user => {
        const { ten, peerid } = user;
        $('#listUser').append(`<li class="mdc-list-item" id=${peerid}>${ten}</li>`);
    });

    socket.on('newuser', user => {
        const { ten, peerid } = user;
        $('#listUser').append(`<li class="mdc-list-item" id=${peerid}>${ten}</li>`);
    });

    socket.on('disconuser', peerid => {
        $(`#${peerid}`).remove();

    });


});

socket.on('sign_up_fail', () => {
    const MDCSnackbar = mdc.snackbar.MDCSnackbar;
    const MDCSnackbarFoundation = mdc.snackbar.MDCSnackbarFoundation;
    const snackbar = new MDCSnackbar(document.querySelector('.mdc-snackbar'));
    const dataObj = {
        message: 'User exists',
        actionText: 'Exit'
    };
    snackbar.show(dataObj);
});

function openStream() {
    const config = { audio: false, video: true };
    return navigator.mediaDevices.getUserMedia(config);
}
function playStream(idVideoTag, stream) {
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
}
openStream().then(stream => playStream('localStream', stream));
// const peer = new Peer({ key: 'peerjs', host: 'peerjser.herokuapp.com', secure: true, port: 443 });
const peer = new Peer({ key: 'aon01v0f5i5dn29'});
peer.on('open', id => {
    $('#my-peer').append(id);
    $('#btnsignup').click(() => {
        const username = $('#txtUser').val();
        socket.emit('sign_up', { ten: username, peerid: id });
    });
});

//Caller
$('#btnCall').click(() => {
    const id = $('#remoteId').val();
    openStream().then(stream => {
        playStream('localStream', stream);
        const call = peer.call(id, stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });

});
//Answer
peer.on('call', call => {
    openStream().then(stream => {
        call.answer(stream);
        playStream('localStream', stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));

    });
});
$('#listUser').on('click', 'li', function () {
    const id = $(this).attr('id');
    openStream().then(stream => {
        playStream('localStream', stream);
        const call = peer.call(id, stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});


});