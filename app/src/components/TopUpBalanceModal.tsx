import { useState, useRef, useEffect } from "react"
interface TopUpBalanceModalProps {
	onClose: () => void
	autoFocus?: boolean
}

const TopUpBalanceModal: React.FC<TopUpBalanceModalProps> = ({
	onClose,
	autoFocus,
}) => {
	const inputRef = useRef<HTMLInputElement>(null)
	const [inputValue, setInputValue] = useState("")
	const currentBalance = 500

	useEffect(() => {
		if (autoFocus && inputRef.current) {
			inputRef.current.focus()
		}
	}, [autoFocus])

	const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/^0+|[^0-9]/g, "")
		setInputValue(value)
	}

	return (
		<div className="fixed inset-0 bg-black/80 text-white flex items-center justify-center z-50">
			<div className="bg-black border border-white/30 p-6 rounded-2xl w-80 relative transform -translate-y-1/2">
				<button onClick={onClose} className="absolute text-xl top-4 right-4">
					✕
				</button>
				<h1
					style={{
						fontFamily: "Dela Gothic One",
					}}
					className="text-2xl mb-1"
				>
					Balance:
				</h1>
				<h2
					style={{
						fontFamily: "Dela Gothic One",
					}}
					className="text-xl font-normal opacity-70 mb-6"
				>
					${currentBalance}
				</h2>
				<div className="relative">
					<span className="absolute left-3 top-1/3 text-lg transform -translate-y-1/2">
						$
					</span>
					<input
						type="number"
						pattern="[0-9]*"
						inputMode="numeric"
						ref={inputRef}
						value={inputValue}
						onChange={inputChange}
						placeholder="100"
						className="w-full p-3 pl-7 placeholder:opacity-75 bg-neutral-900 border-none rounded-md text-lg mb-6 focus:outline-none focus:ring-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
					/>
				</div>

				{/* TODO: add logic here */}
				<div className="flex justify-center">
					<button
						className={`w-full py-4 rounded-full text-lg font-semibold transition-colors bg-[#23C463] duration-300 ${
							inputValue
								? " active:bg-[#1fa755]"
								: "opacity-20 cursor-not-allowed"
						}`}
						disabled={!inputValue}
					>
						Action
					</button>
				</div>
			</div>
		</div>
	)
}

export default TopUpBalanceModal
