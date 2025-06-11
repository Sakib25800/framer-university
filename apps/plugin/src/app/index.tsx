import { Button } from "@framer-university/ui";
import { $api } from "@framer-university/api";
import logger, { trackEvent, withRequestId } from "@framer-university/logger";

function App() {
  const { mutate: healthCheck } = $api.useMutation("get", "/");

  const handleOpenPluginClick = async () => {
    const { requestId, logEvent, endEvent } = trackEvent("open_plugin_click");

    logEvent("Open Plugin button clicked", {
      button_id: "open-plugin",
      page: "plugin-home"
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex flex-col gap-3">
          <h1 className="font-semibold text-white">Framer University</h1>
          <p className="text-primary-950 max-w-[308px] text-base font-medium">
            Plugin
          </p>
        </div>
        <div className="flex gap-2.5">
          <Button intent="primary" size="sm" onClick={handleOpenPluginClick}>
            Open Plugin
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;
