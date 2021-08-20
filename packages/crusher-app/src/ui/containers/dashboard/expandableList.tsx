import React from "react";
import { css } from "@emotion/react";
import { Conditional } from "dyson/src/components/layouts";
import { CompleteStatusIconSVG } from "@svg/dashboard";

interface IExpandableListItemProps {
	index?: number;
	title: string;
	children: React.ReactNode;
	completed: boolean;
	changeSelected?: any;
	isActive?: boolean;
}

const ExpandableListItem = (props: IExpandableListItemProps) => {
	const { index, title, isActive, children, completed, changeSelected } = props;

	return (
		<div css={itemContainerStyle(!!isActive)} onClick={changeSelected.bind(null, index)}>
			<div className={"flex flex-row items-center"} css={itemHeadingStyle(!!isActive)}>
				<span css={itemIndexStyle}>{index! + 1}.)</span>
				<span className={"font-cera"}>{title}</span>
				<div className={"ml-auto"}>
					<CompleteStatusIconSVG isCompleted={completed} />
				</div>
			</div>
			<Conditional showIf={!!isActive}>
				<>{children}</>
			</Conditional>
		</div>
	);
};

const itemContainerStyle = (isActive: boolean) => css`
	background: ${isActive ? "#101215" : "#0A0B0E"};
	border-bottom: 1px solid ${isActive ? "inherit" : "#171C24"};
	padding: 21rem 26rem 20rem;
	:first-child {
		border-top-left-radius: 12rem;
		border-top-right-radius: 12rem;
	}
	:last-child {
		border-bottom-left-radius: 12rem;
		border-bottom-right-radius: 12rem;
		border-bottom-width: 0;
	}
`;
const itemHeadingStyle = (isActive: boolean) => css`
	color: #fff !important;
	font-size: ${isActive ? "15.5rem" : "14rem"};
	font-weight: ${isActive ? "600" : "400"};
`;
const itemIndexStyle = css`
	color: #d0d0d0 !important;
	font-size: 12rem;
	margin-right: 23rem;
`;

interface IExpandableListProps {
	currentSelected: number;
	children: Array<React.ReactElement<IExpandableListItemProps>>;
	changeSelected?: any;
	css?: any;
}

function ExpandableList(props: IExpandableListProps) {
	const { children, currentSelected, changeSelected, ...otherProps } = props;

	const childrenArr = children.map((child, index) =>
		React.cloneElement(child, {
			changeSelected: changeSelected,
			completed: index < currentSelected,
			index,
			isActive: currentSelected === index,
			key: index,
		}),
	);

	return (
		<div {...otherProps} css={listContainerStyle}>
			{childrenArr}
		</div>
	);
}

const listContainerStyle = css``;

export { ExpandableList, ExpandableListItem };