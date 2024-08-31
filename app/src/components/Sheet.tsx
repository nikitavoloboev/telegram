import { useRef, useEffect } from "react"
interface BottomSheetProps {
	children: React.ReactNode
	isOpen: boolean
	onClose: () => void
}

const Sheet: React.FC<BottomSheetProps> = ({ children, isOpen, onClose }) => {
	const contentRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden"
		} else {
			document.body.style.overflow = ""
		}
		return () => {
			document.body.style.overflow = ""
		}
	}, [isOpen])

	if (!isOpen) return null

	const overlayClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			onClose()
		}
	}

	return (
		<div
			className="fixed w-screen bg-black/95 backdrop-blur-sm inset-0 z-[100] flex items-end justify-center"
			onClick={overlayClick}
		>
			<div
				ref={contentRef}
				className="w-screen h-full max-h-[82%] bg-neutral-900 relative overflow-x-hidden rounded-t-2xl animate-slide-up"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="overflow-y-auto">{children}</div>
			</div>
		</div>
	)
}

export default Sheet
