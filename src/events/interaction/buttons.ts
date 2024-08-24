import {
	ActionRowBuilder,
	AttachmentBuilder,
	ButtonBuilder,
	type ButtonInteraction,
	ButtonStyle,
	type CacheType,
	Collection,
	EmbedBuilder,
	ModalBuilder,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
	TextInputBuilder,
	TextInputStyle,
	codeBlock,
} from 'discord.js';

import CaptchaBackground from '../../assets/captcha_background.png';

import { CaptchaGenerator } from 'captcha-canvas';
import type { InteractionFunctions } from './interactionCreate.evt';

export const generatedCaptchas: Collection<
	string,
	{ buffer: Buffer; created: number; code: string }
> = new Collection();

const buttonFunctions: InteractionFunctions<ButtonInteraction> = {
	async onboarding(interaction) {
		interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor('#6246be')
					.setDescription(
						'Before proceeding, make sure you have read the rules in <#1273414512942387262> :)'
					),
			],
			components: [
				new ActionRowBuilder<ButtonBuilder>().addComponents(
					new ButtonBuilder()
						.setCustomId('onboarding_continue')
						.setLabel('I have read the rules')
						.setStyle(ButtonStyle.Success)
						.setEmoji('<:icons_colorserververified:1274056862437998655>')
				),
			],
			ephemeral: true,
		});
	},
	// biome-ignore lint: snake_case because discord ID
	async onboarding_continue(interaction) {
		const userData = generatedCaptchas.get(interaction.user.id);
		let buffer: Buffer | null = userData?.buffer || null;
		// If no captcha has been generated or the user's captcha is older than 10 minutes, we regenerate
		if (!buffer || (userData ? userData.created > Date.now() + 600000 : false)) {
			const bgBuffer = Buffer.from(await Bun.file(CaptchaBackground).arrayBuffer());
			const captcha = new CaptchaGenerator()
				.setBackground(bgBuffer)
				.setDimension(720, 1280)
				.setCaptcha({ color: '#6445BE', size: 80 })
				.setDecoy({ opacity: 0.5, size: 50 })
				.setTrace({ color: '#6445BE' });
			buffer = await captcha.generate();
			if (!captcha.text) {
				interaction.reply({
					content: codeBlock(
						"An error happened while getting the captcha's text. Please report this to the Staff team."
					),
					ephemeral: true,
				});
				return;
			}
			generatedCaptchas.set(interaction.user.id, {
				created: Date.now(),
				code: captcha.text,
				buffer,
			});
		}

		Bun.write('./test.png', buffer);

		const captchaAttachment = new AttachmentBuilder(buffer)
			.setName('the_rock_pancakes.png')
			.setDescription('yummers');

		interaction.update({
			embeds: [
				new EmbedBuilder()
					.setTitle('Please resolve this captcha to proceed')
					.setDescription(
						'You will be able to continue to the next steps once you answered correctly. If you have a problem solving the captcha, please contact one of the Staff members.'
					)
					.setImage(`attachment://${captchaAttachment.name}`)
					.setColor('#6445BE')
					.setTimestamp(),
			],
			components: [
				new ActionRowBuilder<ButtonBuilder>().addComponents(
					new ButtonBuilder()
						.setLabel('Answer')
						.setStyle(ButtonStyle.Primary)
						.setCustomId('onboarding_captcha')
				),
			],
			files: [captchaAttachment],
		});
	},

	// biome-ignore lint: snake_case because discord ID
	async onboarding_captcha(interaction) {
		const captchaModal = new ModalBuilder()
			.setCustomId('onboarding_captcha_res')
			.setTitle('Input the code of the captcha')
			.setComponents(
				new ActionRowBuilder<TextInputBuilder>().addComponents(
					new TextInputBuilder()
						.setCustomId('onboarding_modal_code')
						.setLabel('Captcha code')
						.setMaxLength(6)
						.setMinLength(6)
						.setPlaceholder('ex: aBc123')
						.setRequired(true)
						.setStyle(TextInputStyle.Short)
				)
			);

		interaction.showModal(captchaModal);
	},
};

export default buttonFunctions;
