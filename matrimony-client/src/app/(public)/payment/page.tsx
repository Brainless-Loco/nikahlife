import { DotsLoader } from "@/components/common/Loader";
import PaymentPage from "@/components/features/public/Payment/PaymentPage";
import { Suspense } from "react";

function PaymentPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <DotsLoader />
        </div>
      }
    >
      <PaymentPage />
    </Suspense>
  );
}

export default PaymentPageWrapper;
