import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
  Body,
  Container,
  Hr,
  Img,
} from '@react-email/components';

interface VerificationEmailProps {
  username: string;
  verifyCode: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://yourapp.com';

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
          fontWeight={700}
          fontStyle="normal"
        />
      </Head>

      {/* Preview text shown in email client inbox */}
      <Preview>Your verification code is {verifyCode} — valid for 10 minutes.</Preview>

      <Body style={bodyStyle}>
        <Container style={containerStyle}>

          {/* ── Header ── */}
          <Section style={headerStyle}>
            <Row>
              <Heading style={logoStyle}>⚡ YourApp</Heading>
            </Row>
          </Section>

          {/* ── Main card ── */}
          <Section style={cardStyle}>

            <Row>
              <Heading as="h2" style={titleStyle}>
                Verify your email address
              </Heading>
            </Row>

            <Row>
              <Text style={bodyTextStyle}>
                Hi <strong>{username}</strong>,
              </Text>
            </Row>

            <Row>
              <Text style={bodyTextStyle}>
                Thanks for signing up! Please confirm your email address by
                entering the one-time code below. This code expires in{' '}
                <strong>10 minutes</strong>.
              </Text>
            </Row>

            {/* ── OTP box ── */}
            <Row>
              <Section style={otpWrapperStyle}>
                <Text style={otpLabelStyle}>YOUR VERIFICATION CODE</Text>
                <Text style={otpStyle}>{verifyCode}</Text>
              </Section>
            </Row>

            {/* ── CTA button ── */}
            <Row>
              <Section style={{ textAlign: 'center', marginTop: '8px' }}>
                <Button
                  href={`${baseUrl}/verify?otp=${verifyCode}`}
                  style={buttonStyle}
                >
                  Verify My Email
                </Button>
              </Section>
            </Row>

            <Hr style={dividerStyle} />

            {/* ── Security note ── */}
            <Row>
              <Text style={noteStyle}>
                🔒 If you didn't create an account, you can safely ignore this
                email. Someone may have typed your email address by mistake.
              </Text>
            </Row>
          </Section>

          {/* ── Footer ── */}
          <Section style={footerStyle}>
            <Row>
              <Text style={footerTextStyle}>
                © {new Date().getFullYear()} YourApp, Inc. · All rights reserved
              </Text>
            </Row>
            <Row>
              <Text style={footerLinkStyle}>
                <a href={`${baseUrl}/unsubscribe`} style={linkStyle}>
                  Unsubscribe
                </a>{' '}
                ·{' '}
                <a href={`${baseUrl}/privacy`} style={linkStyle}>
                  Privacy Policy
                </a>{' '}
                ·{' '}
                <a href={`${baseUrl}/terms`} style={linkStyle}>
                  Terms of Service
                </a>
              </Text>
            </Row>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────

const bodyStyle: React.CSSProperties = {
  backgroundColor: '#f0f2f5',
  fontFamily: 'Inter, Arial, sans-serif',
  margin: 0,
  padding: '40px 0',
};

const containerStyle: React.CSSProperties = {
  maxWidth: '520px',
  margin: '0 auto',
};

const headerStyle: React.CSSProperties = {
  backgroundColor: '#0f172a',
  borderRadius: '12px 12px 0 0',
  padding: '20px 32px',
};

const logoStyle: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '20px',
  fontWeight: 700,
  margin: 0,
  letterSpacing: '-0.3px',
};

const cardStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  padding: '36px 40px',
  borderRadius: '0 0 12px 12px',
  boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
};

const titleStyle: React.CSSProperties = {
  color: '#0f172a',
  fontSize: '22px',
  fontWeight: 700,
  margin: '0 0 20px 0',
  lineHeight: '1.3',
};

const bodyTextStyle: React.CSSProperties = {
  color: '#475569',
  fontSize: '15px',
  lineHeight: '1.65',
  margin: '0 0 16px 0',
};

const otpWrapperStyle: React.CSSProperties = {
  backgroundColor: '#f8fafc',
  border: '1.5px dashed #cbd5e1',
  borderRadius: '10px',
  padding: '20px',
  textAlign: 'center',
  margin: '8px 0 24px 0',
};

const otpLabelStyle: React.CSSProperties = {
  color: '#94a3b8',
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '1.2px',
  margin: '0 0 8px 0',
  textTransform: 'uppercase',
};

const otpStyle: React.CSSProperties = {
  color: '#0f172a',
  fontSize: '40px',
  fontWeight: 700,
  letterSpacing: '10px',
  margin: 0,
  fontVariantNumeric: 'tabular-nums',
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: '#6366f1',
  borderRadius: '8px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '15px',
  fontWeight: 600,
  padding: '13px 32px',
  textDecoration: 'none',
  letterSpacing: '0.2px',
};

const dividerStyle: React.CSSProperties = {
  borderColor: '#e2e8f0',
  margin: '28px 0',
};

const noteStyle: React.CSSProperties = {
  backgroundColor: '#fffbeb',
  border: '1px solid #fde68a',
  borderRadius: '8px',
  color: '#78350f',
  fontSize: '13px',
  lineHeight: '1.6',
  margin: 0,
  padding: '12px 16px',
};

const footerStyle: React.CSSProperties = {
  padding: '24px 0 0 0',
  textAlign: 'center',
};

const footerTextStyle: React.CSSProperties = {
  color: '#94a3b8',
  fontSize: '12px',
  margin: '0 0 6px 0',
};

const footerLinkStyle: React.CSSProperties = {
  color: '#94a3b8',
  fontSize: '12px',
  margin: 0,
};

const linkStyle: React.CSSProperties = {
  color: '#6366f1',
  textDecoration: 'none',
};