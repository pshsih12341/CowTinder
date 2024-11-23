import React from "react";
import {useSelector} from "react-redux";

import styles from "./historyPage.module.scss";
import Card from "../../components/Card";

const HistoryPage = () => {
	const history = useSelector(s => s.history.data);
	return (
		<div className={styles.page}>
			<div className={styles.title}>История запросов</div>
			{history?.length ?
				<div></div>
			:	<div>Вы еще не отправляли ни одного запроса на подбор</div>}
		</div>
	);
};

export default React.memo(HistoryPage);
