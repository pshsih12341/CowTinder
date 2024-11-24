import React from "react";
import styles from "./card.module.scss";
import {useDispatch} from "react-redux";
import {toggleActive} from "../slices/pass"; // Импортируем действие
import classNames from "classnames";
import {formatDate} from "../helpers/date";

const Card = ({id, sex, birth_date, id_individual, father_id, mother_id, createDate, active = false, flag = false}) => {
	const dispatch = useDispatch();

	const handleClick = () => {
		if (!flag) {
			dispatch(toggleActive(id));
		}
	};

	return (
		<div className={classNames(styles.card, active && styles.active)} onClick={handleClick}>
			{flag ?
				<div className={classNames(styles.text, styles.center)}>Подбор от : {formatDate(createDate)}</div>
			:	null}
			<div className={styles.div}>
				<div className={styles.text}>Пол особи:</div>
				<div className={styles.text}>{sex}</div>
			</div>
			<div className={styles.div}>
				<div className={styles.text}>Дата рождения:</div>
				<div className={styles.text}>{formatDate(birth_date)}</div>
			</div>
			<div className={styles.div}>
				<div className={styles.text}>ID особи</div>
				<div className={styles.text}>{id_individual}</div>
			</div>
			<div className={styles.div}>
				<div className={styles.text}>ID отца:</div>
				<div className={styles.text}>{father_id}</div>
			</div>
			<div className={styles.div}>
				<div className={styles.text}>ID матери:</div>
				<div className={styles.text}>{mother_id}</div>
			</div>
			{!flag ?
				<div className={classNames(styles.text, styles.center)}>Дата загрузки: {formatDate(createDate)}</div>
			:	null}
		</div>
	);
};

export default React.memo(Card);
