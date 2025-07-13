import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";

export const socket = io(SOCKET_URL, { autoConnect: false });
