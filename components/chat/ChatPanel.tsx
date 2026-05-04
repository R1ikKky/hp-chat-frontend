export function ChatPanel() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-4 bg-[#080d08] text-center px-8">
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0d1410] border border-[#1e2e1e] text-[#1e3520]">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <line x1="9" y1="10" x2="15" y2="10" />
          <line x1="9" y1="14" x2="13" y2="14" />
        </svg>
      </div>
      <div>
        <p className="text-[#4a6e4a] font-medium text-sm">select a chat to start</p>
        <p className="text-[#2a4a2a] text-xs mt-1">your messages will appear here</p>
      </div>
    </div>
  );
}
