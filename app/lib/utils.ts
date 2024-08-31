// don't trigger parent onClicks
export const onClickWithoutBubblingToTheParentOnClicks = (
	event: React.MouseEvent<HTMLDivElement>
) => {
	event.stopPropagation()
}
