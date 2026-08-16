import { createFileRoute, Link } from "@tanstack/react-router";
import { NamiSendLogo } from "@/components/ui/namis-end-logo";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/unsubscribed")({
  component: UnsubscribedPage,
});

function UnsubscribedPage() {
  return (
    <div className="min-h-screen bg-[#f4f4f5] flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-sm border max-w-md w-full p-10 text-center space-y-6">
        <div className="flex justify-center">
          <NamiSendLogo size={48} showWordmark={false} />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">You're unsubscribed</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            You've been removed from this mailing list and won't receive any further emails from this campaign.
          </p>
        </div>

        <Button asChild variant="outline" size="sm">
          <Link to="/">Go to NamiSend</Link>
        </Button>
      </div>
    </div>
  );
}
