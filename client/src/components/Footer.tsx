import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 ResumeAI. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" data-testid="link-privacy">
              <a className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </a>
            </Link>
            <Link href="/support" data-testid="link-support">
              <a className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Support
              </a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
