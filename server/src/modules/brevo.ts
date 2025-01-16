import * as Brevo from "@getbrevo/brevo";
import type { IncomingMessage } from "http";

import config from "../config";

export interface Recipient {
  email: string;
  name?: string;
}

export interface SendBrevoEmailOptions {
  templateId: number;
  recipients: Recipient[];
  params?: Record<string, unknown>;
}

export const sendBrevoEmail = async (options: SendBrevoEmailOptions): Promise<{ response: IncomingMessage }> => {
  const BREVO_API_KEY = config.smtp.apiKey || "";
  const { templateId, recipients, params } = options;

  try {
    const apiInstance = new Brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, BREVO_API_KEY);

    const sendSmtpEmail = new Brevo.SendSmtpEmail();

    sendSmtpEmail.to = recipients;
    sendSmtpEmail.templateId = templateId;
    sendSmtpEmail.params = params;

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Email sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
