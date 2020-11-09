import { backendRequest } from "@utils/backendRequest";
import { RequestMethod } from "@interfaces/RequestOptions";

export const getVisualDiffsJob = (jobId, headers = null) => {
	return backendRequest(`/job/getVisualDiffsWithFirstJob/${jobId}`, {
		method: RequestMethod.GET,
		headers: headers,
	});
};

export const getAllJobsOfProject = (projectId, page, headers = null) => {
	return backendRequest(`/job/getProjectsJob/${projectId}`, {
		method: RequestMethod.GET,
		headers: headers,
		payload: { page: page ? page : 1 },
	});
};

export const getAllProjectLogs = (projectId, headers = null) => {
	return backendRequest(`/job/getLogsOfProject/${projectId}`, {
		method: RequestMethod.GET,
		headers: headers,
	});
};

export const getJob = (jobId, platform, headers = null) => {
	return backendRequest(`/job/get/${jobId}`, {
		method: RequestMethod.GET,
		headers: headers,
		payload: { platform: platform },
	});
};