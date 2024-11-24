import React from "react";
import {useParams} from "react-router-dom";
import styles from "./CandidatePage.module.scss";
import {useSelector} from "react-redux";
import BackButton from "../../components/BackButton";

const CandidatePage = () => {
	const {personId, id} = useParams();

	const person = useSelector(s => s.pass?.history?.find(el => el.id === Number(id))?.data?.find(item => item.id_individual === Number(personId)));
	return (
		<div className={styles.page}>
			<div className={styles.flex}>
				<BackButton />
				<div className={styles.title}>Особь №{personId}</div>
			</div>
			<div className={styles.block}>
				<div className={styles.div}>
					<div className={styles.text}>Пол особи:</div>
					<div className={styles.text}>{person?.sex}</div>
				</div>
				<div className={styles.div}>
					<div className={styles.text}>Порода особи:</div>
					<div className={styles.text}>{person?.breed}</div>
				</div>
				<div className={styles.div}>
					<div className={styles.text}>Дата рождения:</div>
					<div className={styles.text}>{person?.birth_date}</div>
				</div>
				<div className={styles.div}>
					<div className={styles.text}>ID отца:</div>
					<div className={styles.text}>{person?.father_id}</div>
				</div>
				<div className={styles.div}>
					<div className={styles.text}>ID матери:</div>
					<div className={styles.text}>{person?.mother_id}</div>
				</div>
				{person?.weight_gain_day > 0 ?
					<div className={styles.div}>
						<div className={styles.text}>Значение упитанности:</div>
						<div className={styles.text}>{person?.weight_gain_day}</div>
					</div>
				:	null}
				<div className={styles.div}>
					<div className={styles.text}>Инбридинг:</div>
					<div className={styles.text}>{person?.inbreeding_coefficient}</div>
				</div>
				{person?.health_score ?
					<div className={styles.div}>
						<div className={styles.text}>Здоровье:</div>
						<div className={styles.text}>{person?.health_score}</div>
					</div>
				:	null}
				{person?.fertility_percentage ?
					<div className={styles.div}>
						<div className={styles.text}>Фертильность:</div>
						<div className={styles.text}>{person?.fertility_percentage}%</div>
					</div>
				:	null}
				<div className={styles.div}>
					<div className={styles.text}>Генетическая ценность::</div>
					<div className={styles.text}>{person?.genetic_value}</div>
				</div>
				<div className={styles.div}>
					<div className={styles.text}>Удачность скрещивания::</div>
					<div className={styles.text}>{person?.compatibility.toFixed(2)}%</div>
				</div>
			</div>
		</div>
	);
};

export default React.memo(CandidatePage);
