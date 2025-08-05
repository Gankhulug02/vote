import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-white mt-auto py-8 border-t border-primary/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <Image
            src="https://yt3.googleusercontent.com/tYdDhmfeNIGVord8jkzY1t8sUKas3mvQWybEyPuW8nFZSv2VTkvupkKXhFSj54Db61y_q118=s160-c-k-c0x00ffffff-no-rj"
            alt="logo"
            width={28}
            height={28}
            className="rounded-full"
          />
          <span className="text-lg font-medium">YoutubeChamp</span>
        </div>

        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} YoutubeChamp. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
