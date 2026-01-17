import {App, Editor, MarkdownView, Modal, Notice, Plugin, TFolder} from 'obsidian';
import {DEFAULT_SETTINGS, MealPlannerSettings, MealPlannerSettingTab} from "./settings";

export default class MealPlannerPlugin extends Plugin {
	settings: MealPlannerSettings;

	async onload() {
		await this.loadSettings();
		await this.buildFiles();

		// This creates an icon in the left ribbon.
		this.addRibbonIcon('utensils', 'Meal Planner', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('Meal Planner Plugin Loaded!');
		});

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Meal Planner active');

		// Add command to create a new recipe file
		this.addCommand({
			id: 'create-new-recipe',
			name: 'Create New Recipe',
			callback: () => {
				new NewRecipeModal(this.app, this.settings).open();
			}
		});

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-modal-simple',
			name: 'Open modal (simple)',
			callback: () => {
				new SampleModal(this.app).open();
			}
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'replace-selected',
			name: 'Replace selected content',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				editor.replaceSelection('Sample editor command');
			}
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-modal-complex',
			name: 'Open modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
				return false;
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new MealPlannerSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			new Notice("Click");
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));

	}

	onunload() {
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<MealPlannerSettings>);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async buildFiles() {
		const topDir = this.settings.directoryName;
		const plannerDir = topDir + '/' + 'Planners';
		const recipesDir = topDir + '/' + 'Recipes';

		await this.createFolder(topDir);
		await this.createFolder(plannerDir);
		await this.createFolder(recipesDir);
	}

	private doesFolderExist(dirPath: string): boolean {
		const fullPath = this.app.vault.getRoot().path + '/' + dirPath;

		return this.app.vault.getFolderByPath(fullPath) instanceof TFolder;
	}

	private async createFolder(dirPath: string): Promise<void> {
		if (!dirPath) return;

		if (!this.doesFolderExist(dirPath)) {
			try {
				await this.app.vault.createFolder(this.app.vault.getRoot().path + '/' + dirPath);
			} catch (e) {
				console.error(`Error creating folder at ${dirPath}:`, e);
			}
		}
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		let {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class NewRecipeModal extends Modal {
	settings: MealPlannerSettings;
	
	constructor(app: App, settings: MealPlannerSettings) {
		super(app);
		this.settings = settings;
	}

	onOpen() {
		let {contentEl} = this;
		contentEl.setText('Enter New Recipe Name:');

		// Add input field and buttons here
		contentEl.createEl('input', { type: 'text', placeholder: 'Recipe Name', title: 'Recipe Name', attr: { id: 'recipe-name-input' } });
		contentEl.createEl('button', { text: 'Create' }, (btn) => {
			btn.onclick = async () => {
				const inputEl = contentEl.querySelector('#recipe-name-input') as HTMLInputElement;
				const recipeName = inputEl.value.trim();
				if (recipeName) {
					await this.createRecipeFile(recipeName);
					this.close();
				} else {
					new Notice('Please enter a valid recipe name.');
				}
			};
		});
		contentEl.createEl('button', { text: 'Cancel' }, (btn) => {
			btn.onclick = () => this.close();
		});
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}

	private async createRecipeFile(recipeName: string): Promise<void> {
		const recipesDir = `${this.app.vault.getRoot().path}/${this.settings.directoryName}/Recipes`;
		try {
			if (!this.app.vault.getFolderByPath(recipesDir)) {
				await this.app.vault.createFolder(recipesDir);
			}
		} catch (e) {}

		const recipeFilePath = `${recipesDir}/${recipeName}.md`;
		const recipeFile = this.app.vault.getFileByPath(recipeFilePath);
		if (recipeFile) {
			new Notice(`Recipe "${recipeName}" already exists.`);

			// open existing file
			this.app.workspace.getLeaf(true).openFile(recipeFile);
			return;
		}

		const fileContent = `# ${recipeName} Ingredients

| Name | Quantity | [Units] | [Substitutes] | Notes |
|------|----------|---------|----------------|-------|
|      |          |         |                |       |

# ${recipeName} Instructions

1. 
`;
		await this.app.vault.create(recipeFilePath, fileContent);
		new Notice(`Recipe "${recipeName}" created successfully!`);
	}
}
