import { PinoLogger, RegisterSlashCommand } from '@ddev';
import dedent from 'dedent-js';
import {
	type APIApplicationCommandOptionChoice,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	PermissionFlagsBits,
	SlashCommandBuilder,
	type StringSelectMenuBuilder,
	type TextInputBuilder,
	blockQuote,
} from 'discord.js';

const presets: {
	[key: string]: {
		embeds?: EmbedBuilder[];
		rows?: ActionRowBuilder<ButtonBuilder | StringSelectMenuBuilder | TextInputBuilder>[];
		content?: string;
	};
} = {
	onboarding: {
		embeds: [
			new EmbedBuilder()
				.setImage(
					'https://cdn.discordapp.com/attachments/1270878425011191858/1273410382177898508/welcome.png?ex=66be8355&is=66bd31d5&hm=eace44c9b60338b78f55ebaed88cb63e12fb4aade539d2d6a9dfaf5a08245752&'
				)
				.setColor('#6246be'),
			new EmbedBuilder()
				.setTitle('Welcome to Communivents!')
				.setDescription(
					'__Communivents__ is a Minecraft events server, made by and for the community. Before joining, we suggest you quickly go through the configuration of your pings, roles, etc.\n\nClick on the button below to get started.'
				)
				.setColor('#6246be'),
		],
		rows: [
			new ActionRowBuilder<ButtonBuilder>().addComponents(
				new ButtonBuilder()
					.setStyle(ButtonStyle.Primary)
					.setCustomId('onboarding')
					.setEmoji('<:communivents:1273048274575687681>')
					.setLabel('Commencer')
			),
		],
	},
	rules: {
		embeds: [
			new EmbedBuilder()
				.setImage(
					'https://cdn.discordapp.com/attachments/1270878425011191858/1273415037884829747/rules.png?ex=66be87ab&is=66bd362b&hm=b8864704361aab8eb9ac6b32a2fb9b0fad1d8ccad5fb24645ae93a161c42957a&'
				)
				.setColor('#6246be'),
			new EmbedBuilder()
				.setTitle('Please respect these rules so everyone can be happy :p')
				.setDescription(dedent`
					<:icons_colorserververified:1274056862437998655>   1. You have the right to make people smile :)
					<:icons_dyellow:1274056601065492511>   2. No insults and threats. (except for jokes)
					<:icons_ban:1274056903068094689>   3. No NSFW content on this server.
					<:icons_dyellow:1274056601065492511>   4. No spam.
					<:icons_Wrong:1274056876144721962>   5. No ads or scam links (<:icons_ban:859424400968646676>).
					<:icons_dyellow:1274056601065492511>   6. No politics.
					<:icons_dgreen:1274057371626377266>   7. Communicate only in the language of the channel.
					<:icons_Wrong:1274056876144721962>   8. You can not look for and use loopholes in the rules of the server.
					<:icons_dyellow:1274056601065492511>   9. Follow the TOS discord.
					<:icons_dyellow:1274056601065492511>   10. Do not post suspicious links and/or files.
					<:icons_ban:1274056903068094689>   11. It is forbidden to circumvent punishment in any way.

					<:icons_dgreen:1274057371626377266>   **We will ask you to stop**
					<:icons_dyellow:1274056601065492511>   **You will get a warn**
					<:icons_Wrong:1274056876144721962>   **You will be banned from the server for 1 week**
					<:icons_ban:1274056903068094689>   **Permanent Ban**

					After all, be nice <:m_Hug:1274056918284894313>`)
				.setColor('#6246be'),
		],
	},
};

const presetChoices: APIApplicationCommandOptionChoice<string>[] = [];
for (const key of Object.keys(presets)) {
	presetChoices.push({ name: key, value: key });
}

RegisterSlashCommand({
	data: new SlashCommandBuilder()
		.setName('embed')
		.setDescription('Sends an embed by preset or json')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('json')
				.setDescription('Send an embed from JSON')
				.addStringOption((option) =>
					option.setName('embed').setRequired(true).setDescription('JSON of the embed')
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('preset')
				.setDescription('Send an embed from a preset')
				.addStringOption((option) =>
					option
						.setName('embed')
						.setDescription('Preset embed to send')
						.setRequired(true)
						.addChoices(...presetChoices)
				)
		),
	async execute(interaction) {
		const embedData = interaction.options.getString('embed');
		if (!embedData) {
			interaction.reply(blockQuote("Couldnt find the 'embed' string option."));
			return;
		}
		switch (interaction.options.getSubcommand()) {
			case 'json': {
				const reply = await interaction.channel?.send({
					embeds: [JSON.parse(embedData)],
				});
				interaction.reply({ content: reply?.url, ephemeral: true });
				break;
			}
			case 'preset': {
				const presetKey = Object.keys(presets).find(
					(p) => p.toLowerCase().trim() === embedData.toLowerCase().trim()
				);
				if (!presetKey) {
					interaction.reply({
						ephemeral: true,
						embeds: [
							new EmbedBuilder()
								.setTitle('Error while sending embed')
								.setDescription(
									`No embed preset exists with the name "${embedData.trim().toLowerCase()}". Available presets:\n${Object.entries(presets).map((key) => `\`${key}\`\n`)}`
								),
						],
					});
					return;
				}

				const preset = presets[presetKey];
				await interaction.channel?.send({
					embeds: preset.embeds || [],
					// @ts-expect-error
					components: preset.rows || [],
					content: preset.content || '',
				});
				interaction.reply({ content: 'Sent.', ephemeral: true });
			}
		}
	},
});
