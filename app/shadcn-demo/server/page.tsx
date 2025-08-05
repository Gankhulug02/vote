import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ShadcnServerPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">
        Shadcn UI Server Components Demo
      </h1>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Server Component Example</CardTitle>
          <CardDescription>
            This page demonstrates using shadcn/ui components in a server
            component.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Not all components can be used directly in server components.
            Components that use React hooks or client-side interactions need the
            "use client" directive.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <a href="/shadcn-demo">Back to Demo</a>
          </Button>
          <Button asChild>
            <a href="https://ui.shadcn.com/docs" target="_blank">
              Documentation
            </a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
