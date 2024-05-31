import { AuthAction, AuthState } from './authTypes';

export const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  webauthn: {
    isRegistered: false,
    isWebAuthnSupported: false,
  },
};

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    case 'WEB_AUTHN_SUPPORT':
      return {
        ...state,
        webauthn: {
          ...state.webauthn,
          isWebAuthnSupported: action.payload.isSupported,
        },
      };
    case 'WEB_AUTHN_REGISTER':
      return {
        ...state,
        webauthn: {
          ...state.webauthn,
          isRegistered: action.payload.isRegistered,
        },
      };
    default:
      return state;
  }
}
