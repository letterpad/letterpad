// Selectors for WebAuthn authentication state

export const selectIsWebAuthnRegistered = (state) => state.auth.webauthn.isRegistered;

export const selectIsWebAuthnSupported = (state) => state.auth.webauthn.isWebAuthnSupported;
