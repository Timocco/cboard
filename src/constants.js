import { isCordova } from './cordova-util';

let host = window.location.host || '';
host = host.startsWith('www.') ? host.slice(4) : host;
const DEV_API_URL = process.env.REACT_APP_DEV_API_URL || null;
export const ARASAAC_BASE_PATH_API = 'https://api.arasaac.org/api/';
export const GLOBALSYMBOLS_BASE_PATH_API = 'https://globalsymbols.com/api/v1/';
export const API_URL = isCordova()
  ? 'https://api.app.cboard.io/'
  : DEV_API_URL || `${window.location.protocol}//api.${host}`;
export const AZURE_INST_KEY =
  process.env.REACT_APP_AZURE_INST_KEY ||
  '874487ac-304c-4160-b8f3-a221541eab61';
export const AZURE_SPEECH_SUBSCR_KEY =
  process.env.REACT_APP_AZURE_SPEECH_KEY || '910a3256e6aa4b4daf631cd0f550c995';
export const AZURE_SPEECH_SERVICE_REGION =
  process.env.REACT_APP_AZURE_SPEECH_SERVICE_REGION || 'eastus';
export const AZURE_VOICES_BASE_PATH_API =
  'https://' +
  AZURE_SPEECH_SERVICE_REGION +
  '.tts.speech.microsoft.com/cognitiveservices/voices/';
export const GOOGLE_AUTH_ENABLED = false;
export const FACEBOOK_AUTH_ENABLED = false;
