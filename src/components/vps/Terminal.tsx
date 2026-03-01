"use client";

import { useEffect, useRef, useState } from "react";
import { Terminal as XTerm } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";

interface TerminalProps {
  containerId: string;
  onClose?: () => void;
}

export default function Terminal({ containerId, onClose }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState("connecting");
  
  useEffect(() => {
    if (!terminalRef.current) return;
    
    // Initialize xterm
    const xterm = new XTerm({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
      theme: {
        background: "#0d1117",
        foreground: "#c9d1d9",
        cursor: "#58a6ff",
        black: "#0d1117",
        red: "#ff7b72",
        green: "#3fb950",
        yellow: "#d29922",
        blue: "#58a6ff",
        magenta: "#bc8cff",
        cyan: "#39c5cf",
        white: "#b1bac4",
        brightBlack: "#6e7681",
        brightRed: "#ffa198",
        brightGreen: "#56d364",
        brightYellow: "#e3b341",
        brightBlue: "#79c0ff",
        brightMagenta: "#d2a8ff",
        brightCyan: "#56d4dd",
        brightWhite: "#f0f6fc",
      },
    });
    
    const fitAddon = new FitAddon();
    xterm.loadAddon(fitAddon);
    
    xterm.open(terminalRef.current);
    fitAddon.fit();
    
    xtermRef.current = xterm;
    
    // Display connection message (demo mode)
    xterm.writeln("\x1b[36m╔════════════════════════════════════════════════════════╗\x1b[0m");
    xterm.writeln("\x1b[36m║        Illusionhost VPS Console (Demo Mode)           ║\x1b[0m");
    xterm.writeln("\x1b[36m╚════════════════════════════════════════════════════════╝\x1b[0m");
    xterm.writeln("");
    xterm.writeln(`\x1b[33mContainer ID:\x1b[0m ${containerId}`);
    xterm.writeln(`\x1b[33mConnection:\x1b[0m SSH to container console`);
    xterm.writeln("");
    xterm.writeln("\x1b[32m✓ Connected successfully!\x1b[0m");
    xterm.writeln("");
    xterm.writeln("\x1b[90mIn production, this would connect to a real WebSocket\x1b[0m");
    xterm.writeln("\x1b[90mserver that proxies SSH connections to the container.\x1b[0m");
    xterm.writeln("");
    xterm.writeln("\x1b[90mSuggested implementations:\x1b[0m");
    xterm.writeln("  \x1b[90m• xterm.js + ws + ssh2 (Node.js)\x1b[0m");
    xterm.writeln("  \x1b[90m• GateOne (Python)\x1b[0m");
    xterm.writeln("  \x1b[90m• Webmin Terminal Module\x1b[0m");
    xterm.writeln("  \x1b[90m• Proxmox noVNC integration\x1b[0m");
    xterm.writeln("");
    xterm.writeln("\x1b[90mPress Ctrl+C or type 'exit' to close this demo...\x1b[0m");
    xterm.writeln("");
    
    // Handle resize
    const handleResize = () => {
      fitAddon.fit();
    };
    
    window.addEventListener("resize", handleResize);
    
    // Handle user input (echo only in demo)
    xterm.onData((data) => {
      // In demo mode, just echo back
      if (data === "\r") {
        xterm.writeln("");
      } else if (data === "\x03") { // Ctrl+C
        xterm.writeln("^C");
        xterm.writeln("\x1b[33mDemo: Ctrl+C received - connection would close\x1b[0m");
      } else {
        xterm.write(data);
      }
    });
    
    return () => {
      window.removeEventListener("resize", handleResize);
      xterm.dispose();
    };
  }, [containerId]);
  
  return (
    <div style={{ 
      width: "100%", 
      height: "100%", 
      display: "flex", 
      flexDirection: "column",
      background: "#0d1117",
      borderRadius: "0.5rem",
      overflow: "hidden",
    }}>
      {/* Terminal Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.75rem 1rem",
        background: "#161b22",
        borderBottom: "1px solid #30363d",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: status === "connected" ? "#3fb950" : "#d29922",
          }} />
          <span style={{ color: "#c9d1d9", fontSize: "0.875rem", fontWeight: 500 }}>
            {status === "connected" ? "Connected" : "Connecting..."}
          </span>
          <span style={{ color: "#8b949e", fontSize: "0.75rem" }}>
            {containerId}
          </span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            color: "#8b949e",
            cursor: "pointer",
            padding: "0.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "0.25rem",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#21262d";
            e.currentTarget.style.color = "#c9d1d9";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#8b949e";
          }}
        >
          ✕
        </button>
      </div>
      
      {/* Terminal Content */}
      <div 
        ref={terminalRef} 
        style={{ 
          flex: 1, 
          padding: "0.5rem",
          overflow: "hidden",
        }} 
      />
    </div>
  );
}
