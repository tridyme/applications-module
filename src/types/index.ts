export interface TridymeApplicationState {
  data: Record<string, any>;
}

export interface TridymeModel {
  _id?: string;
  projectId?: string;
  name: string;
  application: string;
  data: TridymeApplicationState;
  user: string;
}

export interface TridymeRouteParams {
  projectId?: string;
  applicationId: string;
  modelId?: string;
}

export interface TridymeApplicationConfig {
  apiUrl?: string;
  applicationName?: string;
  applicationId?: string;
  fullDomain?: string;
}

export interface UseApplicationOptions {
  initialState: TridymeApplicationState;
  match: {
    params: TridymeRouteParams;
  };
  config?: TridymeApplicationConfig;
  navigate?: (to: string) => void;
}

export interface UseApplicationReturn {
  state: TridymeApplicationState;
  setState: (state: TridymeApplicationState) => void;
  loading: boolean;
  currentUrl: string | null;
  handleAnalysis: () => Promise<void>;
  handleSave: () => Promise<void>;
  snackbar: {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  };
  closeSnackbar: () => void;
}
