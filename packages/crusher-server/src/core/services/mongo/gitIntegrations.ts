import { Service } from "typedi";
import { GitIntegrations } from "../../../server/models/gitIntegrations";
import { iGithubIntegration } from "../../../../../crusher-shared/types/mongo/githubIntegration";

@Service()
export class GitIntegrationsService {
	async linkRepo(repoId: number, repoName: string, installationId: string, repoLink: string, projectId: number, userId: number) {
		console.log(repoId, repoName, repoLink, projectId, userId);
		return new GitIntegrations({
			repoId: repoId,
			repoName: repoName,
			repoLink: repoLink,
			projectId: projectId,
			userId: userId,
			installationId: installationId,
		}).save();
	}

	async getInstallationRepo(repoName: string, projectId: number): Promise<iGithubIntegration | null> {
		console.log("REPO NAME IS", repoName, projectId);
		return new Promise((resolve, reject) => {
			GitIntegrations.findOne({ projectId: { $eq: projectId }, repoName: { $eq: repoName } }, (err, doc) => {
				if (err || !doc) return resolve(null);

				const docsObject = { ...(doc.toObject() as any), _id: doc._id.toString() };
				resolve(docsObject);
			});
		});
	}

	getLinkedRepos(projectId: number): Promise<Array<iGithubIntegration>> {
		return new Promise((resolve, reject) => {
			GitIntegrations.find({ projectId: { $eq: projectId } })
				.sort({ createdAt: 1 })
				.exec((err, docs) => {
					if (err) return reject(err);
					const docsObjectArr = docs.map((doc) => ({
						...(doc.toObject() as any),
						_id: doc._id.toString(),
					}));
					resolve(docsObjectArr);
				});
		});
	}

	unlinkRepo(integrationId: string) {
		return GitIntegrations.findByIdAndRemove(integrationId);
	}
}
