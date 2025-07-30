// Interfaccia comune per entrambe le implementazioni
export interface IFirebaseMessagingService {
  initialize(): Promise<void>;
  getToken(): Promise<string | null>;
  cleanup(): Promise<void>;
  subscribeToTopic(topic: string): Promise<void>;
  unsubscribeFromTopic(topic: string): Promise<void>;
  getState(): IAppState;
}

export interface IAppState {
  deferredPrompt: any;
  showInstallMessage: boolean;
  selectedLanguage: string;
  languages: {
    [key: string]: string;
  };
  notificationState: {
    isEnabled: boolean;
    token: string;
    error: string | null;
  };
}