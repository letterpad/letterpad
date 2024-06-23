// Types for WebAuthn authentication actions and state

export enum WebAuthnActionTypes {
  REGISTRATION_REQUEST = 'WEB_AUTHN_REGISTRATION_REQUEST',
  REGISTRATION_SUCCESS = 'WEB_AUTHN_REGISTRATION_SUCCESS',
  REGISTRATION_FAILURE = 'WEB_AUTHN_REGISTRATION_FAILURE',
  LOGIN_REQUEST = 'WEB_AUTHN_LOGIN_REQUEST',
  LOGIN_SUCCESS = 'WEB_AUTHN_LOGIN_SUCCESS',
  LOGIN_FAILURE = 'WEB_AUTHN_LOGIN_FAILURE',
}

export interface WebAuthnRegistrationRequestAction {
  type: typeof WebAuthnActionTypes.REGISTRATION_REQUEST;
}

export interface WebAuthnRegistrationSuccessAction {
  type: typeof WebAuthnActionTypes.REGISTRATION_SUCCESS;
  payload: { user: any }; // Specify a more detailed type for user
}

export interface WebAuthnRegistrationFailureAction {
  type: typeof WebAuthnActionTypes.REGISTRATION_FAILURE;
  payload: { error: string };
}

export interface WebAuthnLoginRequestAction {
  type: typeof WebAuthnActionTypes.LOGIN_REQUEST;
}

export interface WebAuthnLoginSuccessAction {
  type: typeof WebAuthnActionTypes.LOGIN_SUCCESS;
  payload: { user: any }; // Specify a more detailed type for user
}

export interface WebAuthnLoginFailureAction {
  type: typeof WebAuthnActionTypes.LOGIN_FAILURE;
  payload: { error: string };
}

export type WebAuthnActions =
  | WebAuthnRegistrationRequestAction
  | WebAuthnRegistrationSuccessAction
  | WebAuthnRegistrationFailureAction
  | WebAuthnLoginRequestAction
  | WebAuthnLoginSuccessAction
  | WebAuthnLoginFailureAction;

export interface WebAuthnState {
  isRegistered: boolean;
  isWebAuthnSupported: boolean;
}
