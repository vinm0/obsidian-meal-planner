import {App, PluginSettingTab, Setting} from "obsidian";
import MealPlannerPlugin from "./main";

export interface MealPlannerSettings {
	mySetting: string;
}

export const DEFAULT_SETTINGS: MealPlannerSettings = {
	mySetting: 'default'
}

export class MealPlannerSettingTab extends PluginSettingTab {
	plugin: MealPlannerPlugin;

	constructor(app: App, plugin: MealPlannerPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Settings #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
