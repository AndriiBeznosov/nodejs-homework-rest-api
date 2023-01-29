const express = require("express");
const { tryCatchWrapper } = require("../helpers/index");

const {
  getContacts,
  getContact,
  createContact,
  deleteContact,
  refreshContact,
  refreshContactStatus,
} = require("../controllers/contacts.controller");
const { validateBody, validateQuery, auth } = require("../middlewares");
const {
  addContactsSchema,
  updateContactsSchema,
  validationSchemaStatus,
} = require("../schemas");

const contactRouter = express.Router();

contactRouter.get(
  "/",
  auth,
  validateQuery(validationSchemaStatus),
  tryCatchWrapper(getContacts),
);

contactRouter.get("/:contactId", auth, tryCatchWrapper(getContact));

contactRouter.post(
  "/",
  auth,
  validateBody(addContactsSchema),
  tryCatchWrapper(createContact),
);

contactRouter.delete("/:contactId", auth, tryCatchWrapper(deleteContact));

contactRouter.put(
  "/:contactId",
  auth,
  validateBody(updateContactsSchema),
  tryCatchWrapper(refreshContact),
);
contactRouter.patch(
  "/:contactId/favorite",
  auth,
  validateBody(validationSchemaStatus),
  tryCatchWrapper(refreshContactStatus),
);

module.exports = contactRouter;
