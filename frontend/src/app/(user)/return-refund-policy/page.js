import LegalPage from "../components/LegalPage";
import { legalContact, refundContent } from "../legalContent";

export const metadata = {
  title: "Return & Refund Policy |SEVENEVEN",
  description: "Return and refund policy forSEVENEVEN orders.",
};

export default function ReturnRefundPolicyPage() {
  return <LegalPage {...refundContent} contact={legalContact} />;
}
