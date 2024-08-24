import { RegisterEvent } from '@ddev';
import { type CacheType, type Interaction, REST, Routes, codeBlock } from 'discord.js';
import buttonFunctions from './buttons';
import modalFunctions from './modals';
import selectFunctions from './select';

export interface InteractionFunctions<T> {
	[key: string]: (interaction: T) => Promise<void>;
}

function externalEvent(
	interaction: Interaction<CacheType>,
	functions: {
		[key: string]: (interaction: any) => Promise<void>;
	}
) {
	// @ts-expect-error
	const key = Object.keys(functions).find((k) => k === interaction.customId);
	if (!key) {
		// @ts-expect-error
		interaction.reply({
			ephemeral: true,
			content: codeBlock(
				// @ts-expect-error
				`No function is associated with '${interaction.customId}'.`
			),
		});
		return;
	}
	functions[key](interaction).catch((err) => {
		// @ts-expect-error
		interaction.reply({ ephemeral: true, content: codeBlock(err) });
	});
}

RegisterEvent({
	name: 'interactionCreate',
	async listener(interaction) {
		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);
			if (!command) {
				const rest = new REST().setToken(Bun.env.BOT_TOKEN);
				if (!interaction.guild) {
					await interaction.reply(
						codeBlock(
							`The command "${interaction.commandName}" wasn't found. (guildId null)`
						)
					);
					return;
				}
				await rest
					.delete(
						Routes.applicationGuildCommand(
							Bun.env.APPLICATION_ID.toString(),
							interaction.guild.id,
							interaction.commandId
						)
					)
					.catch((err) => {
						interaction.reply(
							codeBlock(`An error happened while removing the command:\n\n${err}`)
						);
						return;
					});
				await interaction.reply(
					codeBlock(
						`The command "${interaction.commandName}" wasn't found and was subsequently removed.`
					)
				);
				await interaction.command?.delete();
				return;
			}
			command.execute(interaction).catch((err) => {
				interaction.reply(codeBlock(err));
			});
		} else if (interaction.isButton()) {
			externalEvent(interaction, buttonFunctions);
		} else if (interaction.isModalSubmit()) {
			externalEvent(interaction, modalFunctions);
		} else if (interaction.isStringSelectMenu()) {
			externalEvent(interaction, selectFunctions);
		}
	},
});
