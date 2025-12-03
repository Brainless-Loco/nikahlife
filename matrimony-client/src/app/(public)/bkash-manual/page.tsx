import { DotsLoader } from "@/components/common/Loader";
import BkashManualPayment from "@/components/features/public/Payment/ManualPayment/ManualPayment";
import React, { Suspense } from "react";

const BkashManual = () => {
  return (
    <Suspense
      fallback={
        <div>
          <DotsLoader />
        </div>
      }
    >
      <BkashManualPayment />
    </Suspense>
  );
};

export default BkashManual;
