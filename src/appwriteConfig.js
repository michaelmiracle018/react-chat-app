import { Account, Client, Databases } from "appwrite";
export const PROJECT_ID = "649b026c271d06f3ba3d";
export const DATABASE_ID = "649b03913f0e0499557f";
export const COLLECTION_ID_MESSAGES = "649b03a95c3c2c9381cd";

const client = new Client();

client
	.setEndpoint("https://cloud.appwrite.io/v1")
	.setProject("649b026c271d06f3ba3d");

export const databases = new Databases(client);
export const account = new Account(client);

export default client;
