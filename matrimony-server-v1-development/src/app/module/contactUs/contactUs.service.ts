import { IContact } from "./contactUs.interface";
import { Contact } from "./contactUs.model";


const createContact = async (payload: Partial<IContact>) => {
  const contact = await Contact.create(payload);
  return contact;
};

export const ContactService = {
  createContact,
};
