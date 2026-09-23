import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { RevenueGuaranteeOS } from "@/components/flow-os/RevenueGuaranteeOS";

export const Route = createFileRoute("/operator")({
  component: OperatorPage,
});

function OperatorPage() {
  return (
    <AppShell>
      <RevenueGuaranteeOS />
    </AppShell>
  );
}
