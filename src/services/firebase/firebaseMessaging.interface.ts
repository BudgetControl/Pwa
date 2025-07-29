// Interfaccia comune per entrambe le implementazioni
interface IFirebaseMessagingService {
  initialize(): Promise<void>;
  getToken(): string | null;
  cleanup(): Promise<void>;
  subscribeToTopic(topic: string): Promise<void>;
  unsubscribeFromTopic(topic: string): Promise<void>;
}

export default IFirebaseMessagingService;