export default {
	providerName: 'stake_engine',
	gameName: 'meta_vault',
	gameID: 'meta_vault',
	rtp: 0.97,
	numReels: 5,
	numRows: [4, 4, 4, 4, 4],
	betModes: {
		base: {
			cost: 1.0,
			feature: true,
			buyBonus: false,
			rtp: 0.97,
			max_win: 50000,
		},
		bonus: {
			cost: 100.0,
			feature: false,
			buyBonus: true,
			rtp: 0.97,
			max_win: 50000,
		},
	},
	symbols: {
		W: {
			paytable: null,
			special_properties: ['wild'],
		},
		S: {
			paytable: null,
			special_properties: ['scatter'],
		},
		// H1 - The Architect (Main Jackpot Symbol - pays 2-of-a-kind!)
		H1: {
			paytable: [
				{
					'5': 2.43,
				},
				{
					'4': 1.16,
				},
				{
					'3': 0.59,
				},
				{
					'2': 0.15,
				},
			],
		},
		// H2 - Encryption Core
		H2: {
			paytable: [
				{
					'5': 1.47,
				},
				{
					'4': 0.69,
				},
				{
					'3': 0.38,
				},
			],
		},
		// H3 - Cyber-Doberman
		H3: {
			paytable: [
				{
					'5': 1.16,
				},
				{
					'4': 0.59,
				},
				{
					'3': 0.29,
				},
			],
		},
		// H4 - Access Card
		H4: {
			paytable: [
				{
					'5': 0.69,
				},
				{
					'4': 0.29,
				},
				{
					'3': 0.14,
				},
			],
		},
		// Low Symbols
		L1: {
			paytable: [
				{
					'5': 0.29,
				},
				{
					'4': 0.11,
				},
				{
					'3': 0.06,
				},
			],
		},
		L2: {
			paytable: [
				{
					'5': 0.23,
				},
				{
					'4': 0.07,
				},
				{
					'3': 0.03,
				},
			],
		},
		L3: {
			paytable: [
				{
					'5': 0.23,
				},
				{
					'4': 0.07,
				},
				{
					'3': 0.03,
				},
			],
		},
		L4: {
			paytable: [
				{
					'5': 0.14,
				},
				{
					'4': 0.05,
				},
				{
					'3': 0.02,
				},
			],
		},
		L5: {
			paytable: [
				{
					'5': 0.14,
				},
				{
					'4': 0.05,
				},
				{
					'3': 0.02,
				},
			],
		},
		L6: {
			paytable: [
				{
					'5': 0.11,
				},
				{
					'4': 0.03,
				},
				{
					'3': 0.01,
				},
			],
		},
	},
	paddingReels: {
		basegame: '',
		freegame: '',
		superspingame: '',
	},
};
