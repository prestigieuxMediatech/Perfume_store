import LegalPage from "../components/LegalPage";
import { legalContact, privacyContent } from "../legalContent";

export const metadata = {
  title: "Privacy Policy |SEVENEVEN",
  description: "Privacy policy forSEVENEVEN customers and website visitors.",
};

export default function PrivacyPolicyPage() {
  return <LegalPage {...privacyContent} contact={legalContact} />;
}
