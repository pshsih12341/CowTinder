import React from "react";
import styles from "./ResPage.module.scss";
import {useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {Spin} from "antd";
import Card from "../../components/Card";
import Candidate from "../../components/Candidate";

const ResPage = () => {
	const {id} = useParams();
	const item = useSelector(s => s.pass.history.find(el => el.id === Number(id)));
	const loading = useSelector(s => s.pass?.loading);

	const s = useSelector(s => s.pass);
	console.log(s);

	return (
		<div className={styles.page}>
			<div className={styles.title}>Результат подбора</div>
			{loading ?
				<Spin className={styles.spin} />
			:	<>
					<Card id={item?.person?.id} sex={item?.person?.sex} birth_date={item?.person?.birth_date} id_individual={item?.person?.id_individual} father_id={item?.person?.father_id} mother_id={item?.person?.mother_id} createDate={item?.loadDate} flag />
					{item?.data.map((el, index) => (
						<Candidate number={index + 1} key={el.id_individual} id_individual={el.id_individual} sex={el.sex} birth_date={el.birth_date} compatibility={el.compatibility} id={id} />
					))}
				</>
			}
		</div>
	);
};

export default React.memo(ResPage);
