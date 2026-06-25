import { Text } from "@react-email/components";
import { EmailLayout, codeBox, paragraph, muted } from "./components/layout";

export function VerificationCodeEmail({ code, firstName }: { code: string; firstName: string }) {
  return (
    <EmailLayout previewText={`${code} is your whobela verification code`}>
      <Text style={paragraph}>Hi {firstName},</Text>
      <Text style={paragraph}>Your verification code is:</Text>
      <Text style={codeBox}>{code}</Text>
      <Text style={muted}>This code expires in 15 minutes.</Text>
    </EmailLayout>
  );
}

VerificationCodeEmail.PreviewProps = {
  code: "482913",
  firstName: "Jordan",
};

export default VerificationCodeEmail;
