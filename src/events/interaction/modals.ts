import {
	ActionRowBuilder,
	EmbedBuilder,
	type ModalSubmitInteraction,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
	codeBlock,
} from 'discord.js';
import { generatedCaptchas } from './buttons';
import type { InteractionFunctions } from './interactionCreate.evt';

const modalFunctions: InteractionFunctions<ModalSubmitInteraction> = {
	// biome-ignore lint: snake_case because discord ID
	async onboarding_captcha_res(interaction) {
		const code = interaction.fields.getTextInputValue('onboarding_modal_code');
		if (!code) {
			interaction.reply({
				content: codeBlock(
					'An error happened while getting the inputed code. Please report this to the Staff team.'
				),
				ephemeral: true,
			});
			return;
		}
		const userCaptchaData = generatedCaptchas.get(interaction.user.id);
		if (!userCaptchaData) {
			interaction.reply({
				content: codeBlock(
					'An error happened while getting the captcha user data. This probably mean your captcha has expired. Try to generate a new one.'
				),
				ephemeral: true,
			});
			return;
		}
		if (code.toLowerCase() === userCaptchaData.code.toLowerCase()) {
			interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor('#6246be')
						.setTitle('Choose your roles')
						.setDescription(
							`You can choose for which roles you want to be pinged from the dropdown below.
							If you don't want any roles, select the \`🚫 Nothing\` option.`
						),
				],
				components: [
					new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
						new StringSelectMenuBuilder()
							.setCustomId('onboarding_roles')
							.setPlaceholder('Choose your roles')
							.setMaxValues(3)
							.setOptions(
								new StringSelectMenuOptionBuilder()
									.setLabel('Events Announcements')
									.setDescription('You will be pinged for all events')
									.setEmoji('📣')
									.setValue('obrole_1275524451122806905'),
								new StringSelectMenuOptionBuilder()
									.setLabel('DMs messages')
									.setDescription(
										'A message will be sent to you in DMs when a new event is announced.'
									)
									.setEmoji('🫵')
									.setValue('obrole_1275524541203873883'),
								new StringSelectMenuOptionBuilder()
									.setLabel('Updates')
									.setDescription(
										'Get pinged when there is an update for the Discord/Minecraft server.'
									)
									.setEmoji('🌟')
									.setValue('obrole_1275524589694357585'),
								new StringSelectMenuOptionBuilder()
									.setLabel('Nothing')
									.setDescription('You will be given no roles.')
									.setEmoji('🚫')
									.setValue('nothing')
							)
					),
				],
				ephemeral: true,
			});
		} else {
			const message = await interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor('Red')
						.setTitle('Invalid code')
						.setDescription(
							"The code you provided doesn't match the one inscribed on the captcha. Please try again. (Note: You can get a new captcha 10mins after your first one)"
						),
				],
				ephemeral: true,
			});
			setTimeout(() => {
				message.delete();
			}, 8_000);
		}
	},
};

export default modalFunctions;
