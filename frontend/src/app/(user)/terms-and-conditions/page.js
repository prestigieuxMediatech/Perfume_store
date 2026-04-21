import LegalPage from "../components/LegalPage";
import { legalContact, termsContent } from "../legalContent";

export const metadata = {
  title: "Terms & Conditions | 7EVEN",
  description: "Terms and conditions for shopping with 7EVEN.",
};

export default function TermsAndConditionsPage() {
  return <LegalPage {...termsContent} contact={legalContact} />;
}
