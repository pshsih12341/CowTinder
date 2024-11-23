import React from "react";
import styles from "./card.module.scss";
import {useDispatch} from "react-redux";
import {toggleActive} from "../slices/pass"; // Импортируем действие
import classNames from "classnames";

const Card = ({file, date, active, id, history = false}) => {
	const dispatch = useDispatch();

	const handleClick = () => {
		dispatch(toggleActive(id));
	};

	return (
		<div className={classNames(styles.card, active && styles.active)} onClick={handleClick}>
			<div>Электронный паспорт:</div>
			<div className={styles.pass}>{file}</div>
			<div>{history ? `Подбор от ${date}` : `Дата загрузки ${date}`}</div>
		</div>
	);
};

export default React.memo(Card);
