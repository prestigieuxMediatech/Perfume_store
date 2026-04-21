import LegalPage from "../components/LegalPage";
import { legalContact, privacyContent } from "../legalContent";

export const metadata = {
  title: "Privacy Policy | 7EVEN",
  description: "Privacy policy for 7EVEN customers and website visitors.",
};

export default function PrivacyPolicyPage() {
  return <LegalPage {...privacyContent} contact={legalContact} />;
}
