'use client';

export default function SupportButton() {
    return (
        <a
            href="https://buymeacoffee.com/perunbro"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 md:w-auto md:h-auto md:px-4 md:py-2.5 rounded-full
                       bg-yellow-500/10 hover:bg-yellow-500/20 backdrop-blur-md
                       border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.2em]
                       transition-all active:scale-95 shrink-0
                       flex items-center justify-center gap-2"
            aria-label="Support the Galaxy"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
            <span className="hidden md:inline">Support</span>
        </a>
    );
}
