import { create } from "zustand";
import { socket } from "../lib/socket";

const createPeerConnection = () => new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
});

export const useCallStore = create((set, get) => ({

    incomingCall: null,        // { from, offer, callerInfo }
    activeCall: null,          // { userId, name, profilePic }
    localStream: null,
    remoteStream: null,
    isMuted: false,
    callStatus: null,          // "calling" | "active" | null
    peerConnection: null,
    iceCandidateBuffer: [],    // candidates that arrived before remote description was set

    // Drain buffered ICE candidates once peerConnection + remoteDescription are both ready
    _flushIceCandidates: async () => {
        const { peerConnection, iceCandidateBuffer } = get();
        if (!peerConnection || iceCandidateBuffer.length === 0) return;
        set({ iceCandidateBuffer: [] });
        for (const candidate of iceCandidateBuffer) {
            try {
                await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (e) {
                console.error("ICE flush error:", e);
            }
        }
    },

    // ── Caller: initiate call
    startCall: async (user, authUser) => {
        if (get().callStatus !== null) {
            console.log("BLOCKED duplicate call");
            return;
        }
        set({ callStatus: "calling" }); // lock immediately before anything async
        console.log("creating peer connection — this should appear only ONCE");
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert("Microphone access not available.");
            return;
        }

        console.log("startCall triggered");
        console.log("calling user:", user._id);
        console.log("authUser:", authUser._id);

        const pc = createPeerConnection();
        const localStream = await navigator.mediaDevices.getUserMedia({ audio: true });

        localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

        pc.ontrack = (e) => {
            const stream = e.streams?.[0];
            if (stream) {
                set({ remoteStream: stream });
            } else {
                const existing = get().remoteStream || new MediaStream();
                existing.addTrack(e.track);
                set({ remoteStream: existing });
            }
        };

        pc.onicecandidate = (e) => {
            if (e.candidate) {
                console.log("caller sending ICE to:", user._id);
                socket.emit("iceCandidate", {
                    to: user._id,
                    candidate: e.candidate,
                });
            }
        };

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        socket.emit("callUser", {
            to: user._id,
            offer,
            callerInfo: {
                userId: authUser._id, // real userId, not socket.id
                name: authUser.fullName,
                profilePic: authUser.profilePic,
            },
        });

        set({
            peerConnection: pc,
            localStream,
            activeCall: {
                userId: user._id,
                name: user.fullName,
                profilePic: user.profilePic,
            },
            callStatus: "calling",
        });
    },

    // ── Callee: accept incoming call
    acceptCall: async () => {
        const { incomingCall } = get();
        if (!incomingCall) return;

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert("Microphone access not available.");
            return;
        }

        const pc = createPeerConnection();
        const localStream = await navigator.mediaDevices.getUserMedia({ audio: true });

        localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

        pc.ontrack = (e) => {
            const stream = e.streams?.[0];
            if (stream) {
                set({ remoteStream: stream });
            } else {
                const existing = get().remoteStream || new MediaStream();
                existing.addTrack(e.track);
                set({ remoteStream: existing });
            }
        };

        pc.onicecandidate = (e) => {
            if (e.candidate) {
                socket.emit("iceCandidate", {
                    to: incomingCall.from, // incomingCall.from is now real userId
                    candidate: e.candidate,
                });
            }
        };

        await pc.setRemoteDescription(new RTCSessionDescription(incomingCall.offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit("answerCall", {
            to: incomingCall.from, // real userId
            answer,
        });

        set({
            peerConnection: pc,
            localStream,
            incomingCall: null,
            activeCall: {
                userId: incomingCall.from,
                name: incomingCall.callerInfo.name,
                profilePic: incomingCall.callerInfo.profilePic,
            },
            callStatus: "active",
        });

        // Flush any caller ICE candidates that arrived before we had a peerConnection
        await get()._flushIceCandidates();
    },

    // ── Callee: reject incoming call
    rejectCall: () => {
        const { incomingCall } = get();
        if (!incomingCall) return;
        socket.emit("rejectCall", { to: incomingCall.from });
        set({ incomingCall: null });
    },

    // ── Either side: end active call
    endCall: () => {
        const { peerConnection, localStream, activeCall } = get();

        if (activeCall) {
            socket.emit("endCall", { to: activeCall.userId });
        }

        localStream?.getTracks().forEach((t) => t.stop());
        peerConnection?.close();

        set({
            peerConnection: null,
            localStream: null,
            remoteStream: null,
            activeCall: null,
            incomingCall: null,
            callStatus: null,
            isMuted: false,
            iceCandidateBuffer: [],
        });
    },

    // ── Toggle mute
    toggleMute: () => {
        const { localStream, isMuted } = get();
        localStream?.getAudioTracks().forEach((t) => (t.enabled = isMuted));
        set({ isMuted: !isMuted });
    },

    // ── Socket event handlers — registered once in HomePage
    initializeCallSocket: () => {

        const handleIncomingCall = ({ from, offer, callerInfo }) => {
            set({ incomingCall: { from, offer, callerInfo } });
        };

        const handleCallAnswered = async ({ answer }) => {
            console.log("callAnswered received");
            const { peerConnection } = get();
            console.log("peerConnection exists:", !!peerConnection);
            await peerConnection?.setRemoteDescription(new RTCSessionDescription(answer));
            console.log("remote description set, signalingState:", peerConnection?.signalingState);
            set({ callStatus: "active" });
            // Flush any callee ICE candidates that arrived before the answer was processed
            await get()._flushIceCandidates();
        };

        const handleCallRejected = () => {
            get().endCall();
        };

        const handleIceCandidate = async ({ candidate }) => {
            const { peerConnection } = get();
            // Buffer if peerConnection isn't ready or remote description isn't set yet
            if (!peerConnection || !peerConnection.remoteDescription) {
                set({ iceCandidateBuffer: [...get().iceCandidateBuffer, candidate] });
                return;
            }
            try {
                await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (e) {
                console.error("ICE candidate error:", e);
            }
        };

        const handleCallEnded = () => {
            get().endCall();
        };

        socket.on("incomingCall",  handleIncomingCall);
        socket.on("callAnswered",  handleCallAnswered);
        socket.on("callRejected",  handleCallRejected);
        socket.on("iceCandidate",  handleIceCandidate);
        socket.on("callEnded",     handleCallEnded);

        return () => {
            socket.off("incomingCall",  handleIncomingCall);
            socket.off("callAnswered",  handleCallAnswered);
            socket.off("callRejected",  handleCallRejected);
            socket.off("iceCandidate",  handleIceCandidate);
            socket.off("callEnded",     handleCallEnded);
        };
    },

}));