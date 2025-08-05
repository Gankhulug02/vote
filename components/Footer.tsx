export function Footer() {
  return (
    <footer className="bg-white mt-auto py-8 border-t border-primary/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold mr-2">
            Y
          </div>
          <span className="text-lg font-medium">YoutubeChamp</span>
        </div>

        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} YoutubeChamp. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
