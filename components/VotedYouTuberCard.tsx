import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";

interface YouTuber {
  id: string;
  name: string;
  image_url: string;
  channel_url: string;
  description?: string;
  vote_count: number;
}

export function VotedYouTuberCard({ youtuber }: { youtuber: YouTuber }) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="aspect-video relative">
        <Image
          src={
            youtuber.image_url ||
            "https://via.placeholder.com/640x360?text=No+Image"
          }
          alt={youtuber.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover"
          loading="lazy"
        />
      </div>

      <CardHeader className="pb-2">
        <h3 className="text-lg font-semibold">{youtuber.name}</h3>
        <a
          href={youtuber.channel_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary/90 text-sm inline-block"
        >
          View Channel
        </a>
      </CardHeader>

      {youtuber.description && (
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {youtuber.description}
          </p>
        </CardContent>
      )}

      <CardFooter className="flex items-center justify-between mt-2 pt-4 border-t">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground mr-1"
          >
            <path d="M7 10v12"></path>
            <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"></path>
          </svg>
          <span className="font-medium">{youtuber.vote_count}</span>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
          Voted
        </span>
      </CardFooter>
    </Card>
  );
}
