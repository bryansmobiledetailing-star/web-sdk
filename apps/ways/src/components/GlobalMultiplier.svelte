<script lang="ts" module>
	export type EmitterEventGlobalMultiplier =
		| { type: 'globalMultiplierShow' }
		| { type: 'globalMultiplierHide' }
		| { type: 'globalMultiplierUpdate'; multiplier: number };
</script>

<script lang="ts">
	import { Tween } from 'svelte/motion';
	import { Container, BitmapText, Graphics } from 'pixi-svelte';
	import { FadeContainer } from 'components-pixi';

	import BoardContainer from './BoardContainer.svelte';
	import { getContext } from '../game/context';
	import { SYMBOL_SIZE } from '../game/constants';

	const context = getContext();

	const PANEL_WIDTH = SYMBOL_SIZE * 0.8;
	const scale = $derived(context.stateLayoutDerived.isStacked() ? 1.28 : 1);
	const desktopPosition = $derived({
		x: context.stateGameDerived.boardLayout().width - PANEL_WIDTH * 1.3,
		y: -SYMBOL_SIZE * 0.5,
	});
	const portraitPosition = $derived({
		x: context.stateGameDerived.boardLayout().width - PANEL_WIDTH * 1.5,
		y: -SYMBOL_SIZE * 0.6,
	});
	const position = $derived(
		context.stateLayoutDerived.isStacked() ? portraitPosition : desktopPosition,
	);

	let show = $state(false);
	let multiplier = $state(1);
	let previousMultiplier = new Tween(1);

	context.eventEmitter.subscribeOnMount({
		globalMultiplierShow: () => (show = true),
		globalMultiplierHide: () => (show = false),
		globalMultiplierUpdate: async (emitterEvent) => {
			if (emitterEvent.multiplier > multiplier) {
				context.eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_multiplier_update' });
			}
			multiplier = emitterEvent.multiplier;
			previousMultiplier.set(multiplier, { duration: 300 });
		},
	});

	// Draw multiplier background
	function drawBackground(g: any) {
		g.clear();
		g.roundRect(0, 0, PANEL_WIDTH, PANEL_WIDTH * 0.6, 8);
		g.fill({ color: 0x1a1a2e, alpha: 0.9 });
		g.stroke({ color: 0xffd700, width: 2 });
	}
</script>

<FadeContainer {show}>
	<BoardContainer>
		<Container {...position} {scale}>
			<!-- Background panel -->
			<Graphics draw={drawBackground} />

			<!-- Multiplier text -->
			<Container x={PANEL_WIDTH / 2} y={PANEL_WIDTH * 0.3}>
				<BitmapText
					anchor={0.5}
					text={`${Math.round(previousMultiplier.current)}×`}
					style={{
						fontFamily: 'gold',
						fontSize: SYMBOL_SIZE * 0.5,
						fill: 0xffd700,
					}}
				/>
			</Container>
		</Container>
	</BoardContainer>
</FadeContainer>
