import { Suspense } from "react";
import QuizAttempt from "@/components/QuizAttempt";

export default function PhishingAttempt() {
  return (
    <>
      <div className="pl-4 flex gap-4 flex-col md:flex-row mr-3 lg:mr-0 md:mr-0">
        {/* LEFT */}
        <div className="w-full lg:w-2/3">
          <Suspense fallback={<div>Loading quiz...</div>}>
            <QuizAttempt />
          </Suspense>
        </div>
      </div>
    </>
  );
}

export async function generateStaticParams() {
  return [];
}

