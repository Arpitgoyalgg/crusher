import { ActionStatusEnum } from "@crusher-shared/lib/runnerLog/interface";
import { IActionResultItemWithIndex, ISavedActionResultItemWithIndex } from "@crusher-shared/types/common/general";
import { KeysToCamelCase } from "@modules/common/typescript/interface";
import { DBManager } from "@modules/db";
import { CamelizeResponse } from "@modules/decorators/camelizeResponse";
import { Inject, Service } from "typedi";
import { IAddTestIntanceScreenshotPayload, IBuildTestInstanceResultsTable, ITestInstanceScreenshotsTable } from "./interface";

@Service()
class BuildTestInstanceScreenshotService {
	@Inject()
	private dbManager: DBManager;

	private async insertScreenshot(payload: IAddTestIntanceScreenshotPayload): Promise<{ insertId: number }> {
		return this.dbManager.insert("INSERT INTO test_instance_screenshots SET instance_id = ?, name = ?, url = ?, action_index = ?", [
			payload.instanceId,
			payload.name,
			payload.url,
			payload.actionIndex,
		]);
	}

	async saveScreenshots(screenshotActionsResult: Array<IActionResultItemWithIndex>, instanceId: number): Promise<Array<ISavedActionResultItemWithIndex>> {
		const insertPromises = screenshotActionsResult
			.filter((result) => result.status === ActionStatusEnum.COMPLETED)
			.map((screenshotActionResult) => {
				// For an scresnhot-type action, there will be only one output
				const outputImage = screenshotActionResult.meta.outputs[0];

				return this.insertScreenshot({
					instanceId: instanceId,
					name: outputImage.name,
					url: outputImage.value,
					actionIndex: screenshotActionResult.actionIndex,
				}).then((insertRecord) => {
					return {
						...screenshotActionResult,
						recordId: insertRecord.insertId,
					};
				});
			});

		return Promise.all(insertPromises);
	}

	@CamelizeResponse()
	async getScreenshots(instanceId: number): Promise<Array<KeysToCamelCase<ITestInstanceScreenshotsTable>>> {
		return this.dbManager.fetchAllRows("SELECT * FROM test_instance_screenshots WHERE instance_id = ?", [instanceId]);
	}

	@CamelizeResponse()
	async getScreenshotResultWithActionIndex(
		resultSetId: number,
	): Promise<Array<KeysToCamelCase<IBuildTestInstanceResultsTable> & { actionIndex: number; targetScreenshotUrl: string }>> {
		return this.dbManager.fetchAllRows(
			"SELECT test_instance_results.*, current_screenshot.action_index action_index, target_screenshot.url target_screenshot_url FROM test_instance_results LEFT JOIN (SELECT test_instance_screenshots.action_index, test_instance_screenshots.id FROM test_instance_screenshots) current_screenshot ON current_screenshot.id = test_instance_results.screenshot_id LEFT JOIN (SELECT test_instance_screenshots.id, test_instance_screenshots.url FROM test_instance_screenshots) target_screenshot ON target_screenshot.id = test_instance_results.target_screenshot_id, test_instance_screenshots WHERE test_instance_results.instance_result_set_id = ? AND test_instance_screenshots.id = test_instance_results.screenshot_id",
			[resultSetId],
		);
	}
}

export { BuildTestInstanceScreenshotService };