<script lang="ts" module>
	import type { SymbolName } from '../game/types';

	export type EmitterEventSymbolTransform = {
		type: 'symbolTransformShow';
		symbol: SymbolName;
		goldCount: number;
	};
</script>

<script lang="ts">
	import { Container, BitmapText, Graphics } from 'pixi-svelte';
	import { FadeContainer } from 'components-pixi';
	import { waitForTimeout } from 'utils-shared/wait';

	import BoardContainer from './BoardContainer.svelte';
	import { getContext } from '../game/context';
	import { SYMBOL_SIZE } from '../game/constants';
	import config from '../game/config';

	const context = getContext();

	// Symbol names mapping
	const symbolNames: Record<string, string> = {
		H4: 'Access Card',
		H3: 'Cyber-Doberman',
		H2: 'Encryption Core',
	};

	const POPUP_WIDTH = SYMBOL_SIZE * 3;
	const POPUP_HEIGHT = SYMBOL_SIZE * 1.5;

	const position = $derived({
		x: context.stateGameDerived.boardLayout().width / 2 - POPUP_WIDTH / 2,
		y: context.stateGameDerived.boardLayout().height / 2 - POPUP_HEIGHT / 2,
	});

	let show = $state(false);
	let transformedSymbol = $state<string>('');
	let goldCount = $state(0);

	context.eventEmitter.subscribeOnMount({
		symbolTransformShow: async (emitterEvent) => {
			transformedSymbol = emitterEvent.symbol;
			goldCount = emitterEvent.goldCount;
			show = true;

			// Auto-hide after 2 seconds
			await waitForTimeout(2000);
			show = false;
		},
	});

	// Draw popup background
	function drawBackground(g: any) {
		g.clear();
		g.roundRect(0, 0, POPUP_WIDTH, POPUP_HEIGHT, 12);
		g.fill({ color: 0x0a0a1a, alpha: 0.95 });
		g.stroke({ color: 0xffd700, width: 3 });
	}
</script>

<FadeContainer {show}>
	<BoardContainer>
		<Container {...position}>
			<!-- Background -->
			<Graphics draw={drawBackground} />

			<!-- Title -->
			<Container x={POPUP_WIDTH / 2} y={SYMBOL_SIZE * 0.3}>
				<BitmapText
					anchor={0.5}
					text="SYMBOL UPGRADE!"
					style={{
						fontFamily: 'gold',
						fontSize: SYMBOL_SIZE * 0.25,
						fill: 0xffd700,
					}}
				/>
			</Container>

			<!-- Symbol name -->
			<Container x={POPUP_WIDTH / 2} y={SYMBOL_SIZE * 0.7}>
				<BitmapText
					anchor={0.5}
					text={`${symbolNames[transformedSymbol] || transformedSymbol} → VAULT`}
					style={{
						fontFamily: 'gold',
						fontSize: SYMBOL_SIZE * 0.22,
						fill: 0xffffff,
					}}
				/>
			</Container>

			<!-- Gold count -->
			<Container x={POPUP_WIDTH / 2} y={SYMBOL_SIZE * 1.1}>
				<BitmapText
					anchor={0.5}
					text={`${goldCount} Gold Collected`}
					style={{
						fontFamily: 'gold',
						fontSize: SYMBOL_SIZE * 0.18,
						fill: 0xaaaaaa,
					}}
				/>
			</Container>
		</Container>
	</BoardContainer>
</FadeContainer>
