export default function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © 2024 Questa Lite. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-sm">
            <span>Built by: <strong>[Prerana Borkar]</strong></span>
            <a 
              href="https://github.com/preranaborkar" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              GitHub
            </a>
            <a 
              href="https://www.linkedin.com/in/preranaborkar27/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}