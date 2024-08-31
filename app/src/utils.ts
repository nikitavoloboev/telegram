export const onClickWithoutBubblingToTheParentOnClicks = (
	event: React.MouseEvent<HTMLDivElement>
) => {
	event.stopPropagation()
}
