import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightOpenAPI, { openAPISidebarGroups } from "starlight-openapi";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: "API Docs",
			social: {
				github: "https://github.com/withastro/starlight"
			},
			plugins: [
				starlightOpenAPI([
					{
						base: "api",
						label: "APIs",
						schema: "./openapi.json"
					}
				])
			],
			sidebar: [
				...openAPISidebarGroups
			]
		}),
		react()
	]
});
