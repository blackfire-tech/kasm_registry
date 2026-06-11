export default function Footer() {
    return (
        <footer className="relative flex justify-center items-center p-5 bg-ink-900 border-t border-white/10 text-white/60 text-sm">
            <div className="absolute inset-x-0 top-0 h-px fire-gradient opacity-60" />
            This registry is intended to work in conjuction with Kasm Workspaces.&nbsp;<a className="underline decoration-fire-orange/60 underline-offset-2 hover:text-white transition" href="https://kasmweb.com">Click here to find out about Kasm Workspaces</a>
        </footer>
    )
}