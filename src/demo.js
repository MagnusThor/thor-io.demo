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
            this.rtcClient.OnContextConnected = () => {
            };
            this.rtcClient.OnContextDisconnected = () => {
            };
            this.rtcClient.OnContextCreated = (ctx) => {
                console.log("im at this context/room", ctx);
            };
            this.rtcClient.OnRemoteTrack = (track, conn) => {
                // conn.id 
                let ms = new MediaStream([track]);
                this.addVideo(ms, "#remote-videos");
                console.log("remote conn", conn);
            };
            navigator.getUserMedia({ video: true, audio: false }, (ms) => {
                this.addVideo(ms, "#local-video");
                this.rtcClient.AddLocalStream(ms);
                this.rtcClient.ChangeContext("foobar");
                console.log(ms);
            }, (err) => {
                console.error(err);
            });
            broker.Connect();
        };
    }
    addVideo(ms, parent) {
        let video = document.createElement("video");
        video.srcObject = ms;
        video.autoplay = true;
        video.width = 320;
        video.muted = true;
        document.querySelector(parent).append(video);
    }
    static getInstance() {
        return new Demo();
    }
}
exports.Demo = Demo;
document.addEventListener("DOMContentLoaded", () => {
    Demo.getInstance();
});
