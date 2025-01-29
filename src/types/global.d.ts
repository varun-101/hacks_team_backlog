interface Window {
  gapi: {
    load: (api: string, callback: () => void) => void;
    client: {
      init: (config: { discoveryDocs: string[] }) => Promise<void>;
      setToken: (token: { access_token: string | null }) => void;
    };
  }
} 