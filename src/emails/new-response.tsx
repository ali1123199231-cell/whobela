import { Button, Section, Text } from "@react-email/components";
import { EmailLayout, paragraph, button } from "./components/layout";

export function NewResponseEmail({
  recipientName,
  datePageName,
  inboxUrl,
}: {
  recipientName: string;
  datePageName: string;
  inboxUrl: string;
}) {
  return (
    <EmailLayout previewText={`${recipientName} said yes! ❤️`}>
      <Text style={paragraph}>
        <strong>{recipientName}</strong> said yes on &quot;{datePageName}&quot;!
      </Text>
      <Text style={paragraph}>Open your whobela Inbox to see the details.</Text>
      <Section style={{ textAlign: "center", margin: "24px 0" }}>
        <Button href={inboxUrl} style={button}>
          View in Inbox
        </Button>
      </Section>
    </EmailLayout>
  );
}

NewResponseEmail.PreviewProps = {
  recipientName: "Taylor",
  datePageName: "Saturday Picnic",
  inboxUrl: "https://whobela.com/dashboard/inbox",
};

export default NewResponseEmail;
