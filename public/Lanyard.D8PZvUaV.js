import { r as o } from "./index.BwVM5zsk.js";
import "./index.DTjmqu0B.js";
import { j as s } from "./jsx-runtime.DAjRlbsi.js";
o.createContext({ listeners: new Set(), stateMap: new Map() });
var b = { api: { hostname: "api.lanyard.rest", secure: !0 } },
  j = ((t) => (
    (t[(t.Event = 0)] = "Event"),
    (t[(t.Hello = 1)] = "Hello"),
    (t[(t.Initialize = 2)] = "Initialize"),
    (t[(t.Heartbeat = 3)] = "Heartbeat"),
    t
  ))(j || {}),
  y = ((t) => (
    (t.INIT_STATE = "INIT_STATE"), (t.PRESENCE_UPDATE = "PRESENCE_UPDATE"), t
  ))(y || {});
function N(t, r) {
  let e = { ...b, ...r },
    [a, l] = o.useState(),
    n = `${e.api.secure ? "wss" : "ws"}://${e.api.hostname}/socket`;
  return (
    o.useEffect(() => {
      if (typeof window > "u") return;
      if (!("WebSocket" in window || "MozWebSocket" in window))
        throw new Error("WebSocket connections not supported in this browser.");
      let f;
      f = { subscribe_to_id: t };
      let c, i;
      function d() {
        c && clearInterval(c),
          (i = new WebSocket(n)),
          i.addEventListener("open", () => {
            console.log("Lanyard: Socket connection opened");
          }),
          i.addEventListener("close", d),
          i.addEventListener("message", (m) => {
            let h = JSON.parse(m.data);
            switch (h.op) {
              case 1: {
                (c = setInterval(() => {
                  i.readyState === i.OPEN && i.send(JSON.stringify({ op: 3 }));
                }, h.d?.heartbeat_interval)),
                  i.readyState === i.OPEN &&
                    i.send(JSON.stringify({ op: 2, d: f }));
                break;
              }
              case 0: {
                switch (h.t) {
                  case "INIT_STATE":
                  case "PRESENCE_UPDATE": {
                    h.d && l(h.d);
                    break;
                  }
                }
                break;
              }
            }
          });
      }
      return (
        d(),
        () => {
          clearInterval(c), i.removeEventListener("close", d), i.close();
        }
      );
    }, [n]),
    a ?? e.initialData
  );
}
function g(t) {
  var r,
    e,
    a = "";
  if (typeof t == "string" || typeof t == "number") a += t;
  else if (typeof t == "object")
    if (Array.isArray(t))
      for (r = 0; r < t.length; r++)
        t[r] && (e = g(t[r])) && (a && (a += " "), (a += e));
    else for (r in t) t[r] && (a && (a += " "), (a += r));
  return a;
}
function w() {
  for (var t, r, e = 0, a = ""; e < arguments.length; )
    (t = arguments[e++]) && (r = g(t)) && (a && (a += " "), (a += r));
  return a;
}
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const k = (t) => t.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(),
  v = (...t) =>
    t
      .filter((r, e, a) => !!r && r.trim() !== "" && a.indexOf(r) === e)
      .join(" ")
      .trim();
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var E = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const _ = o.forwardRef(
  (
    {
      color: t = "currentColor",
      size: r = 24,
      strokeWidth: e = 2,
      absoluteStrokeWidth: a,
      className: l = "",
      children: n,
      iconNode: f,
      ...c
    },
    i
  ) =>
    o.createElement(
      "svg",
      {
        ref: i,
        ...E,
        width: r,
        height: r,
        stroke: t,
        strokeWidth: a ? (Number(e) * 24) / Number(r) : e,
        className: v("lucide", l),
        ...c,
      },
      [
        ...f.map(([d, m]) => o.createElement(d, m)),
        ...(Array.isArray(n) ? n : [n]),
      ]
    )
);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const S = (t, r) => {
  const e = o.forwardRef(({ className: a, ...l }, n) =>
    o.createElement(_, {
      ref: n,
      iconNode: r,
      className: v(`lucide-${k(t)}`, a),
      ...l,
    })
  );
  return (e.displayName = `${t}`), e;
};
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const x = S("ExternalLink", [
    ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
    ["path", { d: "M10 14 21 3", key: "gplh6r" }],
    [
      "path",
      {
        d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",
        key: "a6xqqp",
      },
    ],
  ]),
  C = "#5865F2",
  p = o.forwardRef(function (
    { title: r = "Discord", color: e = "currentColor", size: a = 24, ...l },
    n
  ) {
    return (
      e === "default" && (e = C),
      s.jsxs("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: a,
        height: a,
        fill: e,
        viewBox: "0 0 24 24",
        ref: n,
        ...l,
        children: [
          s.jsx("title", { children: r }),
          s.jsx("path", {
            d: "M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z",
          }),
        ],
      })
    );
  }),
  A = "#1DB954",
  u = o.forwardRef(function (
    { title: r = "Spotify", color: e = "currentColor", size: a = 24, ...l },
    n
  ) {
    return (
      e === "default" && (e = A),
      s.jsxs("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: a,
        height: a,
        fill: e,
        viewBox: "0 0 24 24",
        ref: n,
        ...l,
        children: [
          s.jsx("title", { children: r }),
          s.jsx("path", {
            d: "M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z",
          }),
        ],
      })
    );
  }),
  I = {
    online: "bg-green-400/10 text-green-400",
    idle: "bg-orange-400/10 text-orange-400 ",
    dnd: "bg-red-400/10 text-red-400",
    offline: "bg-white/5 text-gray-400",
  };
// Persistent cache outside the component (shared between renders)


const lanyardCache = {
  data: null,
  ws: null,
  heartbeat: null,
};

// Restore cached data if available
try {
  const cached = localStorage.getItem("lanyard_data");
  if (cached) lanyardCache.data = JSON.parse(cached);
} catch {}

function P({ hideStatus: t = false, hideLink: r = false }) {
  const [data, setData] = o.useState(lanyardCache.data);
  const [lastSeenHistory, setLastSeenHistory] = o.useState(() => {
    try {
      const history = localStorage.getItem("last_seen_history");
      return history ? JSON.parse(history) : {};
    } catch {
      return {};
    }
  });
  const [currentTime, setCurrentTime] = o.useState(Date.now());

  // Track previous status for comparison
  const previousStatusRef = o.useRef(data?.discord_status);

  o.useEffect(() => {
    let cancelled = false;

    // Initial fetch if no cache
    if (!lanyardCache.data) {
      fetch("https://api.lanyard.rest/v1/users/355915017381740544")
        .then((res) => res.json())
        .then((responseData) => {
          if (cancelled) return;
          if (responseData?.data) {
            lanyardCache.data = responseData.data;
            setData(responseData.data);
            try {
              localStorage.setItem("lanyard_data", JSON.stringify(responseData.data));
            } catch {}
          }
        })
        .catch(() => {});
    }

    // WebSocket connection
    if (!lanyardCache.ws) {
      const ws = new WebSocket("wss://api.lanyard.rest/socket");
      lanyardCache.ws = ws;

      ws.addEventListener("message", (msg) => {
        const { op, t: type, d } = JSON.parse(msg.data);

        if (op === 1) {
          // Heartbeat setup
          if (!lanyardCache.heartbeat) {
            lanyardCache.heartbeat = setInterval(() => {
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ op: 3 }));
              }
            }, d.heartbeat_interval);
          }
          
          // Subscribe to updates
          ws.send(JSON.stringify({ 
            op: 2, 
            d: { subscribe_to_id: "355915017381740544" } 
          }));
        }

        if (op === 0 && (type === "INIT_STATE" || type === "PRESENCE_UPDATE")) {
          const previousStatus = previousStatusRef.current;
          const currentStatus = d.discord_status;
          
          // SIMPLE AND RELIABLE: Update last seen when going offline/idle
          if ((currentStatus === "offline" || currentStatus === "idle") && 
              previousStatus && 
              (previousStatus === "online" || previousStatus === "dnd")) {
            
            console.log("🔄 Status transition detected:", {
              from: previousStatus,
              to: currentStatus,
              time: new Date().toLocaleTimeString()
            });
            
            // Update last seen history
            setLastSeenHistory(prev => {
              const newHistory = {
                ...prev,
                [d.discord_user.id]: {
                  timestamp: Date.now(),
                  isRealData: true,
                  fromStatus: previousStatus,
                  toStatus: currentStatus
                }
              };
              
              try {
                localStorage.setItem("last_seen_history", JSON.stringify(newHistory));
              } catch {}
              
              return newHistory;
            });
          }
          
          // Update data and previous status reference
          lanyardCache.data = d;
          setData(d);
          previousStatusRef.current = currentStatus;
          
          try {
            localStorage.setItem("lanyard_data", JSON.stringify(d));
          } catch {}
        }
      });

      ws.addEventListener("close", () => {
        clearInterval(lanyardCache.heartbeat);
        lanyardCache.heartbeat = null;
        lanyardCache.ws = null;
        
        if (!cancelled) {
          setTimeout(() => {
            P({ hideStatus: t, hideLink: r });
          }, 1000);
        }
      });
    }

    return () => {
      cancelled = true;
    };
  }, []);

  // Real-time updates for offline/idle status
  o.useEffect(() => {
    if (data && (data.discord_status === "offline" || data.discord_status === "idle")) {
      const interval = setInterval(() => {
        setCurrentTime(Date.now());
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [data?.discord_status]);

  // Calculate last seen text
  const getLastSeenText = () => {
    if (!data) return null;
    
    const userId = data.discord_user?.id;
    const lastSeenData = lastSeenHistory[userId];
    
    // Only show if we have real transition data
    if (!lastSeenData || !lastSeenData.isRealData) {
      return "Last seen unavailable";
    }
    
    const lastSeenTimestamp = lastSeenData.timestamp;
    const diffInSeconds = Math.floor((currentTime - lastSeenTimestamp) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    
    if (diffInSeconds < 60) return "Last seen just now";
    if (diffInMinutes === 1) return "Last seen 1 minute ago";
    if (diffInMinutes < 60) return `Last seen ${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours === 1) return "Last seen 1 hour ago";
    if (diffInHours < 24) return `Last seen ${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "Last seen 1 day ago";
    return `Last seen ${diffInDays} days ago`;
  };

  // Rest of your JSX rendering code remains the same...
  const renderLoading = (width = "w-28") => (
    s.jsxs("div", {
      className: `${width} animate-pulse`,
      children: [
        s.jsx("div", { className: "mt-1 h-4 w-full overflow-hidden rounded-md bg-white/10" }),
        s.jsx("div", { className: "mt-1 h-4 w-2/3 overflow-hidden rounded-md bg-white/10" }),
      ],
    })
  );

  return s.jsxs("div", {
    className: "flex h-full flex-col justify-stretch gap-5",
    children: [
      !t &&
        s.jsx("div", {
          className: w(
            "flex h-full items-center gap-3 overflow-hidden rounded-3xl border border-white/10 px-3",
            data?.discord_status ? I[data.discord_status] : "bg-white/5"
          ),
          children: data
            ? s.jsxs(s.Fragment, {
                children: [
                  s.jsx(p, { className: "h-8 w-8 shrink-0 fill-white" }),
                  s.jsxs("div", {
                    className: "flex flex-1 flex-col justify-center space-y-2",
                    children: [
                      s.jsxs("div", {
                        className: "flex items-baseline gap-2",
                        children: [
                          s.jsx("p", {
                            className: "text-lg font-semibold text-white",
                            children: ["@", data.discord_user.username],
                          }),
                          s.jsx("p", {
                            className: "text-sm text-gray-300",
                            children: data.discord_status,
                          }),
                        ],
                      }),
                      
                      data.activities?.find(a => a.type === 4)?.state && 
                        s.jsx("p", {
                          className: "text-sm text-gray-200 italic",
                          children: `"${data.activities.find(a => a.type === 4).state}"`,
                        }),
                      
                      data.discord_status === "online" && 
                      (data.active_on_discord_web ||
                       data.active_on_discord_desktop ||
                       data.active_on_discord_mobile ||
                       data.active_on_discord_embedded) &&
                        s.jsx("div", {
                          className: "flex items-center gap-1 pt-1",
                          children: [
                            s.jsx("span", {
                              className: "text-xs text-gray-400",
                              children: "Active on:",
                            }),
                            s.jsxs("span", {
                              className: "text-xs text-gray-300 font-medium",
                              children: [
                                [
                                  data.active_on_discord_web && "Web",
                                  data.active_on_discord_desktop && "Desktop", 
                                  data.active_on_discord_mobile && "Mobile",
                                  data.active_on_discord_embedded && "Embedded",
                                ]
                                  .filter(Boolean)
                                  .join(" • "),
                              ],
                            }),
                          ],
                        }),
                      
                      (data.discord_status === "offline" || data.discord_status === "idle") &&
                        getLastSeenText() &&
                        s.jsx("p", {
                          className: "text-xs text-gray-400 pt-1",
                          children: getLastSeenText(),
                        }),
                    ],
                  }),
                ],
              })
            : s.jsxs(s.Fragment, {
                children: [s.jsx(p, { className: "h-8 w-8 shrink-0" }), renderLoading()],
              }),
        }),

      // Spotify section remains the same...
      s.jsx("a", {
        href: data?.spotify?.track_id ? `https://open.spotify.com/track/${data.spotify.track_id}` : void 0,
        target: "_blank",
        className: w(
          "relative flex h-full items-center gap-3 overflow-hidden rounded-3xl border border-white/10 bg-white/5 px-3",
          data?.spotify?.track_id && "transition-transform active:scale-95"
        ),
        children: data
          ? data.listening_to_spotify && data.spotify
            ? s.jsxs(s.Fragment, {
                children: [
                  s.jsx(u, { className: "h-8 w-8 shrink-0" }),
                  s.jsxs("div", {
                    className: "w-[75%]",
                    children: [
                      s.jsx("p", { className: "text-md truncate font-bold", children: data.spotify.song }),
                      s.jsxs("p", { className: "text-grey-300 truncate text-sm", children: ["by ", data.spotify.artist] }),
                    ],
                  }),
                  !r && data.spotify.track_id && s.jsx(x, { className: "ml-auto mr-4 h-4 w-4 shrink-0" }),
                  data.spotify.album_art_url &&
                    s.jsx("img", {
                      src: data.spotify.album_art_url,
                      className:
                        "absolute left-0 top-0 -z-10 h-full w-full object-cover object-center blur-sm brightness-75 transition-all duration-100",
                    }),
                ],
              })
            : s.jsxs(s.Fragment, {
                children: [
                  s.jsx(u, { className: "h-8 w-8 shrink-0" }),
                  s.jsx("p", { className: "text-md font-bold leading-tight", children: "Nothing Playing" }),
                ],
              })
          : s.jsxs(s.Fragment, { children: [s.jsx(u, { className: "h-8 w-8 shrink-0" }), renderLoading()] }),
      }),
    ],
  });
}

export { P as default };
