const fs = require("fs");
const https = require("https");
const express = require("express");
const socketIo = require("socket.io");

// Load SSL certificates (for HTTPS)
const options = {
    key: fs.readFileSync("key.pem"),
    cert: fs.readFileSync("cert.pem"),
};

const app = express();
const server = https.createServer(options, app);
const io = socketIo(server);

app.use(express.static("public")); // Serve static files (frontend)

const port = 3000;

io.on("connection", (socket) => {
    console.log("✅ New client connected:", socket.id);

    // Handle WebRTC offer
    socket.on("offer", (offer) => {
        console.log("📡 Received OFFER from", socket.id);
        socket.broadcast.emit("offer", offer); // Send offer to all other clients
    });

    // Handle WebRTC answer
    socket.on("answer", (answer) => {
        console.log("📡 Received ANSWER from", socket.id);
        socket.broadcast.emit("answer", answer); // Send answer to all other clients
    });

    // Handle ICE Candidate exchange
    socket.on("ice-candidate", (candidate) => {
        console.log("❄️ Received ICE Candidate from", socket.id);
        socket.broadcast.emit("ice-candidate", candidate);
    });

    // Handle client disconnection
    socket.on("disconnect", () => {
        console.log("❌ Client disconnected:", socket.id);
    });
});

// Start the HTTPS server
server.listen(port, () => {
    console.log(`🚀 Secure WebRTC server running at https://192.168.x.x:${port}`);
});
