import React from "react";
import {useSelector} from "react-redux";

import styles from "./historyPage.module.scss";
import Card from "../../components/Card";
import {Link} from "react-router-dom";

const HistoryPage = () => {
	const history = useSelector(s => s.pass.history);
	return (
		<div className={styles.page}>
			<div className={styles.title}>История запросов</div>
			{history?.length ?
				<>
					{history?.map(item => (
						<Link to={`/history/${item?.id}`}>
							<Card key={item?.person?.id} id={item?.person?.id} sex={item?.person?.sex} birth_date={item?.person?.birth_date} id_individual={item?.person?.id_individual} father_id={item?.person?.father_id} mother_id={item?.person?.mother_id} createDate={item?.loadDate} flag />
						</Link>
					))}
				</>
			:	<div>Вы еще не отправляли ни одного запроса на подбор</div>}
		</div>
	);
};

export default React.memo(HistoryPage);
