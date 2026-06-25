import {
  Body,
  Container,
  Head,
  Html,
  Hr,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export function EmailLayout({
  previewText,
  children,
}: {
  previewText: string;
  children: React.ReactNode;
}) {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>
              who<span style={{ color: "#fb7185" }}>bela</span>
            </Text>
          </Section>
          <Section style={body}>{children}</Section>
          <Hr style={hr} />
          <Section>
            <Text style={footer}>whobela &middot; this is an automated message</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#fff1f2",
  fontFamily: "Arial, Helvetica, sans-serif",
  padding: "24px 0",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  maxWidth: "480px",
  borderRadius: "16px",
  border: "1px solid #fecdd3",
  overflow: "hidden",
};

const header = {
  backgroundColor: "#fff1f2",
  padding: "24px 32px",
  borderBottom: "1px solid #fecdd3",
};

const logo = {
  fontSize: "20px",
  fontWeight: 700,
  color: "#171717",
  margin: 0,
};

const body = {
  padding: "32px",
};

const hr = {
  borderColor: "#fecdd3",
  margin: "0",
};

const footer = {
  fontSize: "12px",
  color: "#9ca3af",
  textAlign: "center" as const,
  padding: "16px 32px 24px",
  margin: 0,
};

export const codeBox = {
  fontSize: "32px",
  fontWeight: 700,
  letterSpacing: "8px",
  color: "#171717",
  backgroundColor: "#fff1f2",
  border: "1px solid #fecdd3",
  borderRadius: "12px",
  padding: "16px",
  textAlign: "center" as const,
  margin: "24px 0",
};

export const paragraph = {
  fontSize: "15px",
  lineHeight: "24px",
  color: "#171717",
};

export const muted = {
  fontSize: "13px",
  lineHeight: "20px",
  color: "#6b7280",
};

export const button = {
  backgroundColor: "#fb7185",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: 600,
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
};
