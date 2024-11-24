import React from "react";
import {Link} from "react-router-dom";
import styles from "./card.module.scss";
import classNames from "classnames";
import {formatDate} from "../helpers/date";

const Candidate = ({number, id_individual, sex, birth_date, compatibility, id}) => {
	return (
		<Link to={`/history/${id}/${number}`}>
			<div className={styles.card}>
				<div className={classNames(styles.text, styles.center)}>Кандидат №{number}</div>
				<div className={styles.div}>
					<div className={styles.text}>ID особи</div>
					<div className={styles.text}>{id_individual}</div>
				</div>
				<div className={styles.div}>
					<div className={styles.text}>Пол особи:</div>
					<div className={styles.text}>{sex}</div>
				</div>
				<div className={styles.div}>
					<div className={styles.text}>Дата рождения:</div>
					<div className={styles.text}>{formatDate(birth_date)}</div>
				</div>
				<div className={styles.div}>
					<div className={styles.text}>Удачность скрещивания</div>
					<div className={styles.text}>{compatibility?.toFixed(2)}%</div>
				</div>
			</div>
		</Link>
	);
};
export default React.memo(Candidate);
