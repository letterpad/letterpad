import { NextApiRequest, NextApiResponse } from 'next';
import { webAuthnRegister, webAuthnLogin } from './webauthnUtils';
import { parseWebAuthnRequest, validateWebAuthnRequest } from './webauthnMiddleware';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Middleware to parse and validate incoming WebAuthn requests
    const webAuthnRequest = await parseWebAuthnRequest(req);
    await validateWebAuthnRequest(webAuthnRequest);

    switch (req.method) {
      case 'POST':
        if (webAuthnRequest.action === 'register') {
          // Handle WebAuthn registration
          const registrationResponse = await webAuthnRegister(webAuthnRequest);
          res.status(200).json(registrationResponse);
        } else if (webAuthnRequest.action === 'login') {
          // Handle WebAuthn login
          const loginResponse = await webAuthnLogin(webAuthnRequest);
          res.status(200).json(loginResponse);
        } else {
          throw new Error('Invalid action');
        }
        break;
      default:
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
}
