import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Body,
  Container,
  Hr,
} from '@react-email/components';

interface VerificationEmailProps {
  username: string;
  verifyCode: string;
}

export default function VerificationEmail({
  username = '',
  verifyCode = '',
}: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff2',
            format: 'woff2',
          }}
          fontWeight={600}
          fontStyle="normal"
        />
      </Head>

      <Preview>Your verification code is {verifyCode}</Preview>

      <Body style={bodyStyle}>
        <Container style={containerStyle}>

          {/* ── Wordmark ── */}
          <Section style={{ padding: '0 8px 32px 8px' }}>
            <Text style={logoStyle}>OpenFeedback</Text>
          </Section>

          {/* ── Card ── */}
          <Section style={cardStyle}>
            <Row>
              <Heading as="h1" style={titleStyle}>
                Verify your email
              </Heading>
            </Row>

            <Row>
              <Text style={bodyTextStyle}>
                Hi {username}, use the code below to verify your email
                address. This code is valid for 10 minutes.
              </Text>
            </Row>

            <Row>
              <Section style={otpWrapperStyle}>
                <Text style={otpStyle}>{verifyCode}</Text>
              </Section>
            </Row>

            <Row>
              <Text style={bodyTextStyle}>
                If you didn&apos;t request this code, you can safely ignore
                this email.
              </Text>
            </Row>
          </Section>

          <Hr style={dividerStyle} />

          {/* ── Footer ── */}
          <Section>
            <Row>
              <Text style={footerTextStyle}>
                © {new Date().getFullYear()} OpenFeedback
              </Text>
            </Row>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}

// ─────────────────────────────────────────────
// Styles — minimal, single accent color, generous whitespace
// (inspired by Stripe / Linear / Vercel transactional emails)
// ─────────────────────────────────────────────

const bodyStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  fontFamily:
    'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  margin: 0,
  padding: '48px 16px',
};

const containerStyle: React.CSSProperties = {
  maxWidth: '480px',
  margin: '0 auto',
};

const logoStyle: React.CSSProperties = {
  color: '#0a0a0a',
  fontSize: '15px',
  fontWeight: 600,
  margin: 0,
  letterSpacing: '-0.2px',
};

const cardStyle: React.CSSProperties = {
  border: '1px solid #e5e5e5',
  borderRadius: '8px',
  padding: '32px',
};

const titleStyle: React.CSSProperties = {
  color: '#0a0a0a',
  fontSize: '18px',
  fontWeight: 600,
  margin: '0 0 12px 0',
  lineHeight: '1.4',
};

const bodyTextStyle: React.CSSProperties = {
  color: '#525252',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0 0 20px 0',
};

const otpWrapperStyle: React.CSSProperties = {
  backgroundColor: '#fafafa',
  borderRadius: '6px',
  padding: '16px',
  textAlign: 'center',
  margin: '4px 0 20px 0',
};

const otpStyle: React.CSSProperties = {
  color: '#0a0a0a',
  fontSize: '28px',
  fontWeight: 600,
  letterSpacing: '6px',
  margin: 0,
  fontFamily: '"SF Mono", "Courier New", monospace',
};

const dividerStyle: React.CSSProperties = {
  borderColor: '#e5e5e5',
  margin: '32px 0 24px 0',
};

const footerTextStyle: React.CSSProperties = {
  color: '#a3a3a3',
  fontSize: '12px',
  margin: 0,
};