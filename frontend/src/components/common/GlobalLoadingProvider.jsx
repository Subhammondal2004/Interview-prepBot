import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { LoadingOverlay } from "@/components/ui/loading-skeleton";

function GlobalLoadingProvider({ children }) {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  
  // Show overlay when there are active queries or mutations
  const isLoading = isFetching > 0 || isMutating > 0;

  return (
    <>
      {children}
      <AnimatePresence>
        {isLoading && (
          <LoadingOverlay 
            message={isMutating > 0 ? "Saving changes..." : "Fetching data..."} 
          />
        )}
      </AnimatePresence>
    </>
  );
}

export { GlobalLoadingProvider };
