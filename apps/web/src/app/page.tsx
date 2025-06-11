"use client";

import { Button } from "@framer-university/ui";
import { $api } from "@framer-university/api";
import logger, { trackEvent, withRequestId } from "@framer-university/logger";

export default function Home() {
  const { mutate: healthCheck } = $api.useMutation("get", "/");

  const handleLearnMoreClick = async () => {
    const { requestId, logEvent, endEvent } = trackEvent("learn_more_click");

    logEvent("Learn More button clicked", {
      button_id: "learn-more",
      page: "home"
    });

    try {
      await withRequestId(requestId, () => healthCheck({}));

      logEvent("Health check completed successfully");
    } catch (error) {
      logger.error("Health check failed", {
        error: error instanceof Error ? error.message : "Unknown error"
      });
    } finally {
      endEvent();
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex flex-col gap-3">
          <p className="text-primary-950 text-base font-medium">Coming soon</p>
          <h1 className="font-semibold text-white">Framer University</h1>
          <p className="text-primary-950 max-w-[308px] text-base font-medium">
            The world&apos;s first learning platform dedicated to teaching
            Framer in a fun & efficient way
          </p>
        </div>
        <div className="flex gap-2.5">
          <Button
            intent="secondary"
            size="sm"
            href="https://framer.university/waitlist"
          >
            Join Waitlist
          </Button>
          <Button intent="primary" size="sm" onClick={handleLearnMoreClick}>
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
}
