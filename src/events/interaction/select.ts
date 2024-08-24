import { PinoLogger } from '@ddev';
import { Embed, EmbedBuilder, type StringSelectMenuInteraction, codeBlock } from 'discord.js';
import type { InteractionFunctions } from './interactionCreate.evt';

const HUMAN_ROLE_ID = '1184925847078055958';

const selectFunctions: InteractionFunctions<StringSelectMenuInteraction> = {
	// biome-ignore lint: snake_case because discord ID
	async onboarding_roles(interaction) {
		const member = await interaction.guild?.members.fetch(interaction.user);
		if (!member) {
			interaction.reply({
				content: codeBlock("Couldn't access the members object. Report this to the staff."),
				ephemeral: true,
			});
			return;
		}

		const resEmbed = new EmbedBuilder()
			.setTitle('Welcome to the server!')
			.setDescription(
				'You can now browse all the channels freely! We hope you have fun at Communivents :3'
			)
			.setColor('Green');
		// Check if the user has chosen some roles
		const isSomethingSelected = !interaction.values.includes('nothing');
		if (isSomethingSelected) {
			const roleIds = interaction.values.map((id) => id.replace('obrole_', '').trim());
			for (const id of roleIds) {
				await member.roles.add(id);
			}
			// Delete role selection
			// await interaction.deleteReply(interaction.message.id);
			await interaction.reply({
				content: `The ${roleIds.map((r) => `<@&${r}>`).join(', ')} role(s) have been given to you.`,
				ephemeral: true,
			});
			if (!member.roles.cache.has(HUMAN_ROLE_ID)) {
				interaction.followUp({ embeds: [resEmbed], ephemeral: true });
			}
		} else {
			interaction.reply({
				embeds: [resEmbed],
				ephemeral: true,
			});
		}
		await member.roles.add(HUMAN_ROLE_ID);
	},
};

export default selectFunctions;
