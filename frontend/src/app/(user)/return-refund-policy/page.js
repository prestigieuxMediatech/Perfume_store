import LegalPage from "../components/LegalPage";
import { legalContact, refundContent } from "../legalContent";

export const metadata = {
  title: "Return & Refund Policy | 7EVEN",
  description: "Return and refund policy for 7EVEN orders.",
};

export default function ReturnRefundPolicyPage() {
  return <LegalPage {...refundContent} contact={legalContact} />;
}
