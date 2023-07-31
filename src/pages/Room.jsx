import React, { useState, useEffect } from "react";
import client, {
	databases,
	PROJECT_ID,
	DATABASE_ID,
	COLLECTION_ID_MESSAGES,
} from "../appwriteConfig";
import { ID, Query, Role, Permission } from "appwrite";
import { Trash2 } from "react-feather";
import Header from "../components/Header";
import { useAuth } from "../utils/AuthContext";
import moment from "moment";
// require("dotenv").config();

const Room = () => {
	const { user } = useAuth();
	const [messages, setMessages] = useState([]);
	const [messageBody, setMessageBody] = useState("");

	// const PROJECT_ID = process.env.PROJECT_ID;
	// const DATABASE_ID = process.env.DATABASE_ID;
	// const COLLECTION_ID_MESSAGES = process.env.COLLECTION_ID_MESSAGES;

	const getMessages = async () => {
		const response = await databases.listDocuments(
			DATABASE_ID,
			COLLECTION_ID_MESSAGES,
			[Query.orderDesc("$createdAt"), Query.limit(20)],
		);
		setMessages(response.documents);
	};

	const deleteMessages = async (message_id) => {
		databases.deleteDocument(DATABASE_ID, COLLECTION_ID_MESSAGES, message_id);

		setMessages((preState) =>
			messages.filter((message) => message.$id !== message_id),
		);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const payload = {
			user_id: user?.$id,
			username: user?.name,
			body: messageBody,
		};
		let permissions = [Permission.write(Role.user(user.$id))];
		let response = await databases.createDocument(
			DATABASE_ID,
			COLLECTION_ID_MESSAGES,
			ID.unique(),
			payload,
			permissions,
		);
		setMessages((preState) => [response, ...messages]);
		setMessageBody("");
	};

	useEffect(() => {
		getMessages();
		const unsubscribe = client.subscribe(
			`databases.${DATABASE_ID}.collections.${COLLECTION_ID_MESSAGES}.documents`,
			(response) => {
				if (
					response.events.includes(
						"databases.*.collections.*.documents.*.create",
					)
				) {
					// console.log("A MESSAGE WAS CREATED");
					setMessages((prevState) => [response.payload, ...prevState]);
				}

				if (
					response.events.includes(
						"databases.*.collections.*.documents.*.delete",
					)
				) {
					// console.log("A MESSAGE WAS DELETED!!!");
					setMessages((prevState) =>
						prevState.filter((message) => message.$id !== response.payload.$id),
					);
				}
			},
		);

		return () => unsubscribe();
	}, []);

	return (
		<main className="container">
			<Header />
			<div className="room--container">
				<form id="message--form" onSubmit={handleSubmit}>
					<div>
						<textarea
							required
							maxLength="1000"
							placeholder="Say something..."
							onChange={(e) => {
								setMessageBody(e.target.value);
							}}
							value={messageBody}
						></textarea>
					</div>
					<div className="send-btn--wrapper">
						<input type="submit" value="Send" className="btn btn--secondary" />
					</div>
				</form>

				{messages.map((message) => (
					<div key={message.$id} className="message--wrapper">
						<div className="message--header">
							<p>
								{message?.username ? (
									<span>{message?.username}</span>
								) : (
									<span>Anonymous user</span>
								)}
								<small className="message-timestamp">
									{/*new Date(message.$createdAt).toLocaleString()*/}
									{moment(message.$createdAt).format("dddd Do, YYYY")}
								</small>
							</p>
							{message.$permissions.includes(
								`delete(\"user:${user.$id}\")`,
							) && (
								<Trash2
									className="delete--btn"
									onClick={() => deleteMessages(message.$id)}
								/>
							)}
						</div>
						<div
							className={
								"message--body" +
								(message.user_id === user.$id ? " message--body--owner" : "")
							}
						>
							<span>{message.body}</span>
						</div>
					</div>
				))}
			</div>
		</main>
	);
};

export default Room;
