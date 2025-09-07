import { useEffect, useRef, useState } from "react";

type Msg = { user: string; text: string };

export default function App() {
  const [user, setUser] = useState("");
  const [room, setRoom] = useState("");
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const wsRef = useRef<WebSocket | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => () => wsRef.current?.close(), []);

  useEffect(() => {
    if (listRef.current)
      listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  function join() {
    if (!user.trim() || !room.trim()) return;
    const scheme = location.protocol === "https:" ? "wss" : "ws";
    const host = location.hostname || "localhost";
    const url = `${scheme}://${host}:8080/ws/${encodeURIComponent(room)}`;
    const ws = new WebSocket(url);
    ws.onopen = () => setConnected(true);
    ws.onmessage = (e) => {
      try {
        const m = JSON.parse(e.data) as Msg;
        setMessages((s) => [...s, m]);
      } catch {
        // ignore
      }
    };
    ws.onclose = () => setConnected(false);
    wsRef.current = ws;
  }

  function send() {
    const s = text.trim();
    if (!s || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN)
      return;
    const m: Msg = { user, text: s };
    wsRef.current.send(JSON.stringify(m));
    setText("");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <header className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            LiveChat
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Simple room-based chat — no database
          </p>
        </header>

        <main className="p-6">
          {!connected ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                join();
              }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3"
            >
              <label className="sr-only">Username</label>
              <input
                className="col-span-1 sm:col-span-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                placeholder="Your name"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                required
              />

              <label className="sr-only">Room</label>
              <input
                className="col-span-1 sm:col-span-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                placeholder="Room code"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                required
              />

              <div className="col-span-1 sm:col-span-1 flex items-end">
                <button
                  type="submit"
                  className="w-full h-12 bg-gray-900 text-white rounded-lg hover:bg-gray-800 active:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
                >
                  Join Room
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    Room: {room}
                  </h2>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    You are:{" "}
                    <strong className="text-gray-800 dark:text-gray-200">
                      {user}
                    </strong>
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => {
                      wsRef.current?.close();
                      setConnected(false);
                      setMessages([]);
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium"
                  >
                    Leave
                  </button>
                </div>
              </div>

              <div
                ref={listRef}
                className="h-80 overflow-auto p-4 border border-gray-200 dark:border-gray-600 rounded-lg mb-4 scroll-shadow bg-gray-50 dark:bg-gray-900"
              >
                {messages.length === 0 ? (
                  <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  messages.map((m, i) => (
                    <div
                      key={i}
                      className="py-2 border-b border-gray-100 dark:border-gray-800 last:border-b-0"
                    >
                      <span className="font-semibold text-gray-800 dark:text-gray-200">
                        {m.user}:
                      </span>{" "}
                      <span className="text-gray-700 dark:text-gray-300">
                        {m.text}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div className="flex gap-3">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      send();
                    }
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                  placeholder="Type a message and press Enter"
                />
                <button
                  onClick={send}
                  className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium"
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
