export interface WebhookMessage {
  text: string;
  delay?: number;
}

export type ChatUi =
  | ChatUiFormCard;

export interface ChatUiFormCardOption {
  value: string;
  label: string;
}

export interface ChatUiFormCardField {
  name: string;
  label: string;
  type: "single_select";
  required?: boolean;
  options: ChatUiFormCardOption[];
  helperText?: string;
}

export interface ChatUiFormCard {
  type: "form_card";
  id: string;
  title: string;
  description?: string;
  submitLabel?: string;
  fields: ChatUiFormCardField[];
}

export interface WebhookResponse {
  messages?: WebhookMessage[];
  ui?: ChatUi;
  text?: string;
  message?: string;
  output?: string;
  response?: string;
}

export type TriageFormValues = Record<string, string>;


