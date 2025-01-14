import { DEFAULT_THEME, FIGMA_REM_COEFFICIENT, SUPPORTED_THEME } from "@constants/style";
import { setCookie } from "nookies";
import { iMetaInfoNextReq } from "@utils/cookies";
import { NextPageContext } from "next";

function getThemeFromString(themeName: string) {
	return SUPPORTED_THEME.includes(themeName) ? themeName : DEFAULT_THEME;
}

export const getThemeFromCookieOrReq = (ctx: NextPageContext, meta: iMetaInfoNextReq) => {
	const { cookies } = meta;

	let theme = null;

	if (ctx.query.theme) {
		theme = getThemeFromString(ctx.query.theme as string);

		setCookie(ctx, "theme", theme, {
			maxAge: 30 * 24 * 60 * 60,
			path: "/",
		});
	} else {
		theme = getThemeFromString(cookies.theme);
	}

	return theme;
};

export const getStyleFromObject = (styleObject, theme) => {
	const [dark, light] = styleObject;
	if (theme === "dark") return dark;
	return light;
};

// Used to convert values in figma to rem, which are adjusted to screen size.
export const getRelativeSize = (sizeInPx: number): number => sizeInPx / FIGMA_REM_COEFFICIENT;
