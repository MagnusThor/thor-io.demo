import { Factory, WebRTC } from 'thor-io.client-vnext'
import { Controller } from 'thor-io.client-vnext/src/Controller';

export class Demo {
    addVideo(ms: MediaStream,parent:string) {       
        let video = document.createElement("video");
        video.srcObject = ms;
        video.autoplay = true;
        video.width = 320;
        video.muted = true;

        document.querySelector(parent).append(video);       
    }

    factory: Factory;
    rtcClient: WebRTC;


    static getInstance(): Demo {
        return new Demo();
    }


    rtcConfig = {
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

    constructor() {


        this.factory = new Factory("wss://kollokvium.herokuapp.com", ["broker"]);


        this.factory.OnOpen = (broker: Controller) => {

            console.log("connected to broker");


            this.rtcClient = new WebRTC(broker, this.rtcConfig);

            this.rtcClient.OnContextChanged = (ctx: any) => {
                console.log("im changed to context/room", ctx);
                this.rtcClient.ConnectContext()
            };

            this.rtcClient.OnLocalStream  = () => {

            };

            this.rtcClient.OnContextConnected = () => {

            };

            this.rtcClient.OnContextDisconnected = () => {

            };


        




            this.rtcClient.OnContextCreated = (ctx: any) => {

                console.log("im at this context/room", ctx);

           

            };


            this.rtcClient.OnRemoteTrack = (track:MediaStreamTrack,conn:any) => {



                // conn.id 
                let ms = new MediaStream([track]);

                this.addVideo(ms,"#remote-videos");


                console.log("remote conn",conn);

            };

            navigator.getUserMedia({video:true,audio:false},(ms:MediaStream) => {

                this.addVideo(ms,"#local-video");

                this.rtcClient.AddLocalStream(ms);
                

                this.rtcClient.ChangeContext("foobar");
                console.log(ms);

            },(err) => {
                console.error(err);
            });


            broker.Connect();


        };





    }


}


document.addEventListener("DOMContentLoaded", () => {

    Demo.getInstance()

});