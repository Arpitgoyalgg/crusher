import { Page } from "playwright";
import { iAction } from "@crusher-shared/types/action";
import { iSelectorInfo } from "@crusher-shared/types/selectorInfo";
import { toCrusherSelectorsFormat } from '../utils/helper';
import { waitForSelectors } from '../functions';

export default async function hover(action: iAction, page: Page) {
	return new Promise(async (success, error) => {
		try {
			const selectors = action.payload.selectors as iSelectorInfo[];

			const output = await waitForSelectors(page, selectors);
			await page.hover(output ? output.value : toCrusherSelectorsFormat(selectors));

			return success({
				message: `Hovered on the element ${selectors[0].value}`,
			});
		} catch(err){
			console.error(err);
			return error("Some issue occurred while hovering on element");
		}
	});
}
