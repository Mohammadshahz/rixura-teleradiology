import axios from "axios";
import { contactUrl } from "../utils/urls";
import { errorHandler } from "../utils/error-handler";

export interface ContactFormPayload {
  fullname: string;
  email: string;
  phone_number: string;
  contactType: "CENTER" | "RADIOLOGIST";
  requestType: "DEMO" | "QUERY";
  message: string;
}

const submitContactForm = async (body: ContactFormPayload) => {
  return axios
    .post(contactUrl, body)
    .then((res) => res.data)
    .catch(errorHandler);
};

export const ContactService = {
  submitContactForm,
};
