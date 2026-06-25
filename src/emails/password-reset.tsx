import { Text } from "@react-email/components";
import { EmailLayout, codeBox, paragraph, muted } from "./components/layout";

export function PasswordResetEmail({ code }: { code: string }) {
  return (
    <EmailLayout previewText={`${code} is your whobela password reset code`}>
      <Text style={paragraph}>Your password reset code is:</Text>
      <Text style={codeBox}>{code}</Text>
      <Text style={muted}>
        This code expires in 15 minutes. If you didn&apos;t request this, you can ignore this email.
      </Text>
    </EmailLayout>
  );
}

PasswordResetEmail.PreviewProps = {
  code: "738204",
};

export default PasswordResetEmail;
