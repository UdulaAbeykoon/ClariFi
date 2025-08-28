import { CheckCircle, Loader2, AlertCircle } from "lucide-react";

interface SaveStatusProps {
  status: "saved" | "saving" | "error";
  lastSaved?: Date | null;
}

const SaveStatus = ({ status, lastSaved }: SaveStatusProps) => {
  if (status === "saving") {
    return (
      <div className="flex items-center space-x-1 text-muted-foreground text-sm">
        <Loader2 className="h-3 w-3 animate-spin" />
        <span>Saving...</span>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex items-center space-x-1 text-destructive text-sm">
        <AlertCircle className="h-3 w-3" />
        <span>Error saving</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-1 text-success text-sm">
      <CheckCircle className="h-3 w-3" />
      <span>
        {lastSaved 
          ? `Saved at ${lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
          : "Saved"
        }
      </span>
    </div>
  );
};

export default SaveStatus;