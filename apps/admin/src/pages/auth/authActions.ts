// Define actions for WebAuthn authentication

export enum AuthActionTypes {
  WEB_AUTHN_REGISTRATION_REQUEST = 'WEB_AUTHN_REGISTRATION_REQUEST',
  WEB_AUTHN_REGISTRATION_SUCCESS = 'WEB_AUTHN_REGISTRATION_SUCCESS',
  WEB_AUTHN_REGISTRATION_FAILURE = 'WEB_AUTHN_REGISTRATION_FAILURE',
  WEB_AUTHN_LOGIN_REQUEST = 'WEB_AUTHN_LOGIN_REQUEST',
  WEB_AUTHN_LOGIN_SUCCESS = 'WEB_AUTHN_LOGIN_SUCCESS',
  WEB_AUTHN_LOGIN_FAILURE = 'WEB_AUTHN_LOGIN_FAILURE',
}

export const webAuthnRegistrationRequest = () => ({
  type: AuthActionTypes.WEB_AUTHN_REGISTRATION_REQUEST,
});

export const webAuthnRegistrationSuccess = (user) => ({
  type: AuthActionTypes.WEB_AUTHN_REGISTRATION_SUCCESS,
  payload: { user },
});

export const webAuthnRegistrationFailure = (error) => ({
  type: AuthActionTypes.WEB_AUTHN_REGISTRATION_FAILURE,
  payload: { error },
});

export const webAuthnLoginRequest = () => ({
  type: AuthActionTypes.WEB_AUTHN_LOGIN_REQUEST,
});

export const webAuthnLoginSuccess = (user) => ({
  type: AuthActionTypes.WEB_AUTHN_LOGIN_SUCCESS,
  payload: { user },
});

export const webAuthnLoginFailure = (error) => ({
  type: AuthActionTypes.WEB_AUTHN_LOGIN_FAILURE,
  payload: { error },
});
