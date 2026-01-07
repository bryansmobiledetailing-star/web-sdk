export default {
	providerName: 'stake_engine',
	gameName: 'Meta Vault',
	gameID: 'meta_vault',
	rtp: 0.97,
	numReels: 5,
	numRows: [4, 4, 4, 4, 4], // 5x4 grid = 1024 ways
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
	// Transformation thresholds (Gold collected → Symbol transforms to H1)
	transformThresholds: {
		H4: 4, // Access Card → H1 at 4 collectors
		H3: 7, // Cyber-Doberman → H1 at 7 collectors
		H2: 13, // Encryption Core → H1 at 13 collectors
	},
	symbols: {
		// Wild symbol
		W: {
			paytable: null,
			special_properties: ['wild'],
		},
		// Scatter symbol
		S: {
			paytable: null,
			special_properties: ['scatter'],
		},
		// H1 - The Architect/Vault (pays from 2-of-a-kind!)
		H1: {
			paytable: [
				{ '5': 2.43 },
				{ '4': 1.16 },
				{ '3': 0.59 },
				{ '2': 0.15 },
			],
		},
		// H2 - Encryption Core
		H2: {
			paytable: [
				{ '5': 1.47 },
				{ '4': 0.69 },
				{ '3': 0.38 },
			],
		},
		// H3 - Cyber-Doberman
		H3: {
			paytable: [
				{ '5': 1.16 },
				{ '4': 0.59 },
				{ '3': 0.29 },
			],
		},
		// H4 - Access Card
		H4: {
			paytable: [
				{ '5': 0.69 },
				{ '4': 0.29 },
				{ '3': 0.14 },
			],
		},
		// Low symbols
		L1: {
			paytable: [
				{ '5': 0.29 },
				{ '4': 0.11 },
				{ '3': 0.06 },
			],
		},
		L2: {
			paytable: [
				{ '5': 0.23 },
				{ '4': 0.07 },
				{ '3': 0.03 },
			],
		},
		L3: {
			paytable: [
				{ '5': 0.23 },
				{ '4': 0.07 },
				{ '3': 0.03 },
			],
		},
		L4: {
			paytable: [
				{ '5': 0.14 },
				{ '4': 0.05 },
				{ '3': 0.02 },
			],
		},
	},
	paddingReels: {
		basegame: '',
		freegame: '',
	},
};
