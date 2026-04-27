import LegalPage from "../components/LegalPage";
import { legalContact, termsContent } from "../legalContent";

export const metadata = {
  title: "Terms & Conditions |SEVENEVEN",
  description: "Terms and conditions for shopping withSEVENEVEN.",
};

export default function TermsAndConditionsPage() {
  return <LegalPage {...termsContent} contact={legalContact} />;
}
