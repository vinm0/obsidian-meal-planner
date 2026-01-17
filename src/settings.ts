import {App, PluginSettingTab, Setting} from "obsidian";
import MealPlannerPlugin from "./main";
import { DAYS_OF_WEEK } from "lib/constants";

export interface MealPlannerSettings {
	weekStart: keyof typeof DAYS_OF_WEEK;
	directoryName: string;
}

export const DEFAULT_SETTINGS: MealPlannerSettings = {
	weekStart: DAYS_OF_WEEK.sunday.key,
	directoryName: 'MealPlannerData'
}

export class MealPlannerSettingTab extends PluginSettingTab {
	plugin: MealPlannerPlugin;

	constructor(app: App, plugin: MealPlannerPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Start of the Week')
			.setDesc('Select the start day of the week')
			.addDropdown(dropdown => {
				dropdown.addOption(DAYS_OF_WEEK.sunday.key, `${DAYS_OF_WEEK.sunday.label} (Default)`);
				dropdown.addOption(DAYS_OF_WEEK.monday.key, DAYS_OF_WEEK.monday.label);
				dropdown.addOption(DAYS_OF_WEEK.tuesday.key, DAYS_OF_WEEK.tuesday.label);
				dropdown.addOption(DAYS_OF_WEEK.wednesday.key, DAYS_OF_WEEK.wednesday.label);
				dropdown.addOption(DAYS_OF_WEEK.thursday.key, DAYS_OF_WEEK.thursday.label);
				dropdown.addOption(DAYS_OF_WEEK.friday.key, DAYS_OF_WEEK.friday.label);
				dropdown.addOption(DAYS_OF_WEEK.saturday.key, DAYS_OF_WEEK.saturday.label);
				dropdown.setValue(this.plugin.settings.weekStart);
				dropdown.onChange(async (value) => {
					this.plugin.settings.weekStart = value as keyof typeof DAYS_OF_WEEK;
					await this.plugin.saveSettings();
				});
			});
		new Setting(containerEl)
			.setName('Folder Name')
			.setDesc('Name of the folder to store meal planner data')
			.addText(text => text
				.setPlaceholder('Enter folder name')
				.setValue(this.plugin.settings.directoryName)
				.onChange(async (value) => {
					this.plugin.settings.directoryName = value;
					await this.plugin.saveSettings();
				}));
	}
}
