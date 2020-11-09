import { appendParamsToURI, getAbsoluteURIIfRelative } from "./url";
import { IncomingHttpHeaders } from "http";
import { RequestMethod, RequestOptions } from "@interfaces/RequestOptions";

const _fetch = require("node-fetch");

function prepareFetchPayload(uri: string, options: RequestOptions) {
	let method = options.method ? options.method : RequestMethod.GET;
	let headers = options.headers ? options.headers : {};
	let payload = options.payload ? options.payload : {};

	uri = getAbsoluteURIIfRelative(uri);

	switch (method.toUpperCase()) {
		case RequestMethod.GET:
			uri = appendParamsToURI(uri, payload);
			break;
		case RequestMethod.POST:
			headers = {
				...headers,
				Accept: "application/json, text/plain, */*",
				"Content-Type": "application/json",
			};
			break;
		default:
			throw new Error("Invalid post-method passed, only GET and POST supported");
			break;
	}

	return { uri, method, headers: headers };
}

export function backendRequest(_uri, options?: RequestOptions) {
	const { payload } = options;
	let { uri, method, headers } = prepareFetchPayload(_uri, options);

	return _fetch(uri, {
		headers,
		method,
		credentials: "include",
		body: method !== RequestMethod.GET ? JSON.stringify(payload) : null,
	})
		.then((requestResponse) => {
			return requestResponse.json();
		})
		.catch((err) => {
			console.error(err);
		});
}

export function cleanHeaders(headers: IncomingHttpHeaders) {
	if (headers) {
		delete headers["content-length"];
		delete headers["host"];
		delete headers["origin"];
	}
}