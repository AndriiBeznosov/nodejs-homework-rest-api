const { HttpError } = require("../httpError");
const {
  getContactsService,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
} = require("../models/contacts");

async function getContacts(req, res, _) {
  const { limit, page } = req.query;
  if (Object.keys(req.query).includes("favorite")) {
    const contact = await getContactsService({
      limit,
      page,
      favorite: req.query.favorite,
    });
    return res.status(200).json(contact);
  }
  const contact = await getContactsService({ limit, page });
  return res.status(200).json(contact);
}

async function getContact(req, res, _) {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
  if (!contact) {
    throw new HttpError("Not found", 404);
  }
  return res.status(200).json(contact);
}

async function createContact(req, res, _) {
  const body = req.body;
  const contact = await addContact(body);
  return res.status(201).json(contact);
}

async function deleteContact(req, res, _) {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
  if (!contact) {
    throw new HttpError("Not found", 404);
  }
  await removeContact(contactId);
  return res.status(200).json({ message: "contact deleted" });
}

async function refreshContact(req, res, _) {
  const { contactId } = req.params;
  const contactItem = await getContactById(contactId);
  if (!contactItem) {
    throw new HttpError(
      `There is no contact with this '${contactId}' in the list`,
      400,
    );
  }
  const { name, email, phone } = req.body;
  const contact = await updateContact(contactId, { name, email, phone });

  if (!contact) {
    throw new HttpError("Not found", 404);
  }
  return res.status(200).json(contact);
}

async function refreshContactStatus(req, res, _) {
  const { contactId } = req.params;

  const contactItem = await getContactById(contactId);
  if (!contactItem) {
    throw new HttpError(
      `There is no contact with this '${contactId}' in the list`,
      400,
    );
  }
  const { favorite } = req.body;
  const contact = await updateStatusContact(contactId, { favorite });

  if (!contact) {
    throw new HttpError("Not found", 404);
  }
  return res.status(200).json(contact);
}

module.exports = {
  getContacts,
  getContact,
  createContact,
  deleteContact,
  refreshContact,
  refreshContactStatus,
};
