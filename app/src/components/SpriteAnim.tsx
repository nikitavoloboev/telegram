import { useEffect, useState, useRef, useCallback } from "react"

const LOCAL_STORAGE_KEY = "frogCoins"

export default function SpriteAnim(props: {
	count: number
	onCountSync: (count: number) => void
}) {
	const [coins, setCoins] = useState(() => {
		const storedCoins = localStorage.getItem(LOCAL_STORAGE_KEY)
		return storedCoins
			? Math.max(parseInt(storedCoins, 10), props.count)
			: props.count
	})
	const [pepeEatFrame, setPepeEatFrame] = useState(1)
	const redDotRef = useRef<HTMLDivElement>(null)
	const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null)
	const lastActivityTimeRef = useRef(Date.now())

	const handleFlyEaten = useCallback(() => {
		setCoins((prevCoins) => {
			const newCount = prevCoins + 1
			localStorage.setItem(LOCAL_STORAGE_KEY, newCount.toString())
			lastActivityTimeRef.current = Date.now()

			// Clear existing timeout
			if (syncTimeoutRef.current) {
				clearTimeout(syncTimeoutRef.current)
			}

			// Set new timeout
			// @ts-ignore
			syncTimeoutRef.current = setTimeout(() => {
				const currentTime = Date.now()
				if (currentTime - lastActivityTimeRef.current >= 3000) {
					props.onCountSync(newCount)
				}
			}, 3000)

			return newCount
		})
	}, [props])

	useEffect(() => {
		// Sync with server on component mount if local storage count is different
		const storedCoins = localStorage.getItem(LOCAL_STORAGE_KEY)
		if (storedCoins && parseInt(storedCoins, 10) !== props.count) {
			props.onCountSync(parseInt(storedCoins, 10))
		}

		// Cleanup function
		return () => {
			if (syncTimeoutRef.current) {
				clearTimeout(syncTimeoutRef.current)
			}
			// Sync one last time before unmounting
			props.onCountSync(coins)
		}
	}, [props.onCountSync, props.count, coins])

	useEffect(() => {
		if (props.count > coins) {
			setCoins(props.count)
			localStorage.setItem(LOCAL_STORAGE_KEY, props.count.toString())
		}
	}, [props.count, coins])

	return (
		<div className="w-full">
			<div className="flex items-center justify-center text-[24px] font-bold">
				{coins}
			</div>
			<div className="relative z-10 overflow-hidden">
				<FlyLineAnim
					redDotRef={redDotRef}
					onFlyEaten={handleFlyEaten}
					pepeEatFrame={pepeEatFrame}
				/>
				<PepeEatAnim
					redDotRef={redDotRef}
					pepeEatFrame={pepeEatFrame}
					setPepeEatFrame={setPepeEatFrame}
				/>
			</div>
		</div>
	)
}

function FlyLineAnim({
	redDotRef,
	onFlyEaten,
	pepeEatFrame,
}: {
	redDotRef: React.RefObject<HTMLDivElement>
	onFlyEaten: () => void
	pepeEatFrame: number
}) {
	const [flies, setFlies] = useState([
		{ id: 0, x: 600, isEaten: false },
		{ id: 1, x: 700, isEaten: false },
		{ id: 2, x: 800, isEaten: false },
		{ id: 3, x: 900, isEaten: false },
		{ id: 4, x: 1000, isEaten: false },
		{ id: 5, x: 1100, isEaten: false },
		{ id: 6, x: 1200, isEaten: false },
	])
	const lastUpdateTimeRef = useRef(Date.now())
	const animationFrameRef = useRef<number | null>(null)
	const isVisibleRef = useRef(true)

	const updateFlies = useCallback(() => {
		const currentTime = Date.now()
		if (!isVisibleRef.current) return

		let deltaTime = currentTime - lastUpdateTimeRef.current
		lastUpdateTimeRef.current = currentTime

		// Limit delta time to prevent large jumps
		deltaTime = Math.min(deltaTime, 100)

		setFlies((prevFlies) => {
			let newFlies = prevFlies.map((fly) => ({
				...fly,
				x: fly.x - 0.2 * deltaTime,
			}))

			newFlies = newFlies.filter((fly) => fly.x > -100 || fly.isEaten)

			newFlies = newFlies.map((fly) =>
				fly.isEaten && fly.x <= -100 ? { ...fly, x: 600, isEaten: false } : fly
			)

			while (newFlies.length < 7) {
				newFlies.push({ id: Date.now(), x: 600, isEaten: false })
			}

			return newFlies
		})

		animationFrameRef.current = requestAnimationFrame(updateFlies)
	}, [])

	useEffect(() => {
		const handleVisibilityChange = () => {
			isVisibleRef.current = !document.hidden
			if (isVisibleRef.current) {
				lastUpdateTimeRef.current = Date.now()
				animationFrameRef.current = requestAnimationFrame(updateFlies)
			} else if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current)
			}
		}

		document.addEventListener("visibilitychange", handleVisibilityChange)
		animationFrameRef.current = requestAnimationFrame(updateFlies)

		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange)
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current)
			}
		}
	}, [updateFlies])

	const setFliesWrapper = useCallback(
		// @ts-ignore
		(updater: (flies: typeof flies) => typeof flies) => {
			setFlies(updater)
		},
		[]
	)

	return (
		<>
			{flies.map((fly) => (
				<FlyAnim
					key={fly.id}
					id={fly.id}
					x={fly.x}
					isEaten={fly.isEaten}
					redDotRef={redDotRef}
					onFlyEaten={onFlyEaten}
					pepeEatFrame={pepeEatFrame}
					setFlies={setFliesWrapper}
				/>
			))}
		</>
	)
}

function FlyAnim({
	id,
	x,
	isEaten,
	redDotRef,
	onFlyEaten,
	pepeEatFrame,
	setFlies,
}: {
	id: number
	x: number
	isEaten: boolean
	redDotRef: React.RefObject<HTMLDivElement>
	onFlyEaten: () => void
	pepeEatFrame: number
	setFlies: (
		updater: (
			flies: Array<{ id: number; x: number; isEaten: boolean }>
		) => Array<{ id: number; x: number; isEaten: boolean }>
	) => void
}) {
	const [flyFrame, setFlyFrame] = useState(1)
	const [isInRedBox, setIsInRedBox] = useState(false)
	const [isAnimatingEaten, setIsAnimatingEaten] = useState(false)
	const flyRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const interval = setInterval(() => {
			setFlyFrame((prevFrame) => (prevFrame >= 11 ? 1 : prevFrame + 1))
		}, 120)
		return () => clearInterval(interval)
	}, [])

	useEffect(() => {
		if (redDotRef.current && flyRef.current) {
			const redDotRect = redDotRef.current.getBoundingClientRect()
			const flyRect = flyRef.current.getBoundingClientRect()

			const newIsInRedBox =
				flyRect.left < redDotRect.right &&
				flyRect.right > redDotRect.left &&
				flyRect.top < redDotRect.bottom &&
				flyRect.bottom > redDotRect.top

			// @ts-ignore
			setIsInRedBox(newIsInRedBox)

			if (
				newIsInRedBox &&
				(pepeEatFrame === 7 || pepeEatFrame === 8) &&
				!isEaten
			) {
				setFlies((prevFlies) =>
					prevFlies.map((fly) =>
						fly.id === id ? { ...fly, isEaten: true } : fly
					)
				)
				onFlyEaten()
				setIsAnimatingEaten(true)
				setTimeout(() => setIsAnimatingEaten(false), 1000)
			}
		}
	}, [x, redDotRef, isEaten, pepeEatFrame, onFlyEaten, id, setFlies])

	if (isEaten && !isAnimatingEaten) {
		return null
	}

	return (
		<div
			ref={flyRef}
			className="absolute top-0 z-[100]"
			style={{
				transform: `translateX(${x}px)`,
				transition: "transform 0.008s linear",
				opacity: isAnimatingEaten ? 0 : 1,
				...(isAnimatingEaten && {
					transform: `translateX(${x}px) translateY(200px)`,
					transition: "transform 1s, opacity 1s",
				}),
			}}
		>
			<img src={`/fly/flyFrame${flyFrame}.png`} alt="" className="w-[80px]" />
		</div>
	)
}

function PepeEatAnim({
	redDotRef,
	pepeEatFrame,
	setPepeEatFrame,
}: {
	redDotRef: React.RefObject<HTMLDivElement>
	pepeEatFrame: number
	setPepeEatFrame: React.Dispatch<React.SetStateAction<number>>
}) {
	const [isAnimating, setIsAnimating] = useState(false)

	useEffect(() => {
		let interval: NodeJS.Timeout | null = null

		if (isAnimating) {
			// @ts-ignore
			interval = setInterval(() => {
				setPepeEatFrame((prevFrame) => {
					if (prevFrame >= 14) {
						setIsAnimating(false)
						return 1
					} else {
						return prevFrame + 1
					}
				})
			}, 30)
		}

		return () => {
			if (interval) clearInterval(interval)
		}
	}, [isAnimating, setPepeEatFrame])

	return (
		<div
			onClick={() => {
				if (!isAnimating) {
					setPepeEatFrame(1)
					setIsAnimating(true)
				}
			}}
			className="z-10 w-full flex items-center justify-center"
		>
			<div
				ref={redDotRef}
				className="bg-red-500/0 absolute top-[48px] z-[20] left-[55%] translate-x-[-50%] h-[24px] w-[24px]"
			></div>
			<img
				src={`/pepe/pepeEat${pepeEatFrame}.png`}
				className="w-[200px] transition-all active:scale-[0.98] z-[40] cursor-pointer"
				alt=""
			/>
		</div>
	)
}
