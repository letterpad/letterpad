import mailJet from "node-mailjet";
let client: mailJet.Email.Client;

if (process.env.MJ_APIKEY_PUBLIC && process.env.MJ_APIKEY_PRIVATE) {
  client = mailJet.connect(
    process.env.MJ_APIKEY_PUBLIC,
    process.env.MJ_APIKEY_PRIVATE,
  );
}

export const getMailClient = () => {
  return client;
};
