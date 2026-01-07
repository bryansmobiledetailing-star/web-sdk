<script lang="ts" module>
	export type EmitterEventCollectorBar =
		| { type: 'collectorBarShow' }
		| { type: 'collectorBarHide' }
		| { type: 'collectorBarReset' }
		| { type: 'collectorBarUpdate'; count: number; collectorsThisSpin: number };
</script>

<script lang="ts">
	import { Tween } from 'svelte/motion';
	import { Container, Graphics, BitmapText } from 'pixi-svelte';
	import { FadeContainer } from 'components-pixi';

	import BoardContainer from './BoardContainer.svelte';
	import { getContext } from '../game/context';
	import { SYMBOL_SIZE } from '../game/constants';
	import config from '../game/config';

	const context = getContext();

	// Layout calculations
	const BAR_WIDTH = SYMBOL_SIZE * 3;
	const BAR_HEIGHT = SYMBOL_SIZE * 0.4;
	const scale = $derived(context.stateLayoutDerived.isStacked() ? 1.2 : 1);
	const desktopPosition = $derived({
		x: context.stateGameDerived.boardLayout().width / 2 - BAR_WIDTH / 2,
		y: -SYMBOL_SIZE * 0.7,
	});
	const portraitPosition = $derived({
		x: context.stateGameDerived.boardLayout().width / 2 - BAR_WIDTH / 2,
		y: -SYMBOL_SIZE * 0.9,
	});
	const position = $derived(
		context.stateLayoutDerived.isStacked() ? portraitPosition : desktopPosition,
	);

	// Transformation thresholds from config
	const thresholds = config.transformThresholds || { H4: 4, H3: 7, H2: 13 };
	const maxThreshold = Math.max(...Object.values(thresholds));

	let show = $state(false);
	let collectorCount = new Tween(0);

	// Calculate progress percentage for the bar fill
	const progressPercent = $derived(Math.min(collectorCount.current / maxThreshold, 1));

	context.eventEmitter.subscribeOnMount({
		collectorBarShow: () => (show = true),
		collectorBarHide: () => (show = false),
		collectorBarReset: () => collectorCount.set(0, { duration: 0 }),
		collectorBarUpdate: async (emitterEvent) => {
			if (emitterEvent.collectorsThisSpin > 0) {
				// Use scatter_win sound for gold collection
				context.eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_scatter_win' });
			}
			collectorCount.set(emitterEvent.count, { duration: 300 });
		},
	});

	// Draw the bar background
	function drawBarBackground(g: any) {
		g.clear();
		g.roundRect(0, 0, BAR_WIDTH, BAR_HEIGHT, 8);
		g.fill({ color: 0x1a1a2e });
		g.stroke({ color: 0x4a4a6a, width: 2 });
	}

	// Draw the bar fill based on progress
	function drawBarFill(g: any) {
		g.clear();
		if (progressPercent > 0) {
			const fillWidth = (BAR_WIDTH - 4) * progressPercent;
			g.roundRect(2, 2, fillWidth, BAR_HEIGHT - 4, 6);
			g.fill({ color: 0xffd700 }); // Gold color
		}
	}

	// Draw threshold markers
	function drawThresholdMarkers(g: any) {
		g.clear();
		Object.entries(thresholds).forEach(([symbol, threshold]) => {
			const x = (threshold / maxThreshold) * BAR_WIDTH;
			g.moveTo(x, 0);
			g.lineTo(x, BAR_HEIGHT);
			g.stroke({ color: 0x8b4513, width: 2, alpha: 0.7 });
		});
	}
</script>

<FadeContainer {show}>
	<BoardContainer>
		<Container {...position} {scale}>
			<!-- Bar background -->
			<Graphics draw={drawBarBackground} />

			<!-- Bar fill (gold collected) -->
			<Graphics draw={drawBarFill} />

			<!-- Threshold markers -->
			<Graphics draw={drawThresholdMarkers} />

			<!-- Counter text -->
			<Container x={BAR_WIDTH / 2} y={BAR_HEIGHT / 2}>
				<BitmapText
					anchor={0.5}
					text={`${Math.round(collectorCount.current)} / ${maxThreshold}`}
					style={{
						fontFamily: 'gold',
						fontSize: SYMBOL_SIZE * 0.3,
						fill: 0xffffff,
					}}
				/>
			</Container>

			<!-- Label -->
			<Container x={BAR_WIDTH / 2} y={-SYMBOL_SIZE * 0.2}>
				<BitmapText
					anchor={0.5}
					text="GOLD COLLECTED"
					style={{
						fontFamily: 'gold',
						fontSize: SYMBOL_SIZE * 0.18,
						fill: 0xffd700,
					}}
				/>
			</Container>
		</Container>
	</BoardContainer>
</FadeContainer>
