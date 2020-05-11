"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const thor_io_client_vnext_1 = require("thor-io.client-vnext");
class Demo {
    constructor() {
        this.rtcConfig = {
            "sdpSemantics": 'plan-b',
            "iceTransports": 'all',
            "rtcpMuxPolicy": "require",
            "bundlePolicy": "max-bundle",
            "iceServers": [
                {
                    "urls": "stun:stun.l.google.com:19302"
                }
            ]
        };
        this.peers = new Map();
        this.factory = new thor_io_client_vnext_1.Factory("wss://kollokvium.herokuapp.com", ["broker"]);
        this.factory.OnOpen = (broker) => {
            console.log("connected to broker");
            this.rtcClient = new thor_io_client_vnext_1.WebRTC(broker, this.rtcConfig);
            this.rtcClient.OnContextChanged = (ctx) => {
                console.log("im changed to context/room", ctx);
                this.rtcClient.ConnectContext();
            };
            this.rtcClient.OnLocalStream = () => {
            };
            this.rtcClient.OnContextConnected = (peer) => {
                console.log("connected", peer);
                // this.peers.set(peer.id,{
                //     video: null,
                //     audio:null,
                // });
            };
            this.rtcClient.OnContextDisconnected = (peer) => {
                console.log("disconnected", peer);
                this.peers.delete(peer.id);
                document.querySelector(`.audio-peerId-${peer.id}`).remove();
                document.querySelector(`.video-peerId-${peer.id}`).remove();
            };
            this.rtcClient.OnContextCreated = (ctx) => {
                console.log("im at this context/room", ctx);
            };
            this.rtcClient.OnRemoteTrack = (track, peer) => {
                //slet p = this.peers.get(peer.id);
                // conn.id 
                let ms = new MediaStream([track]);
                if (track.kind == "video") {
                    //    p.video =  track;
                    this.addVideo(peer.id, ms, "#remote-videos", false);
                }
                else {
                    //  p.audio = track;
                    this.addAudio(peer.id, ms);
                }
                console.log("remote conn", peer);
            };
            let constrains = {
                video: {
                    width: { min: 640, ideal: 1280, max: 1920 },
                    height: { min: 400, ideal: 720, max: 1080 }
                },
                audio: true
            };
            navigator.getUserMedia(constrains, (ms) => {
                this.addVideo("local-stream", ms, "#local-video", true);
                this.rtcClient.AddLocalStream(ms);
                this.rtcClient.ChangeContext(location.hash);
                console.log(ms);
            }, (err) => {
                console.error(err);
            });
            broker.Connect();
        };
    }
    addVideo(peerId, ms, parent, isMuted) {
        let video = document.createElement("video");
        video.srcObject = ms;
        video.autoplay = true;
        video.width = 320;
        video.muted = isMuted;
        video.classList.add(`video-peerId-${peerId}`);
        document.querySelector(parent).append(video);
    }
    addAudio(peerId, ms) {
        let audio = document.createElement("audio");
        audio.srcObject = ms;
        audio.autoplay = true;
        audio.classList.add(`audio-peerId-${peerId}`);
        document.querySelector("#remote-videos").append(audio);
    }
    static getInstance() {
        return new Demo();
    }
}
exports.Demo = Demo;
document.addEventListener("DOMContentLoaded", () => {
    Demo.getInstance();
});
