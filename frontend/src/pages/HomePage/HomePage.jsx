import React from "react";

import styles from "./homePage.module.scss";
import Card from "../../components/Card";
import {useSelector} from "react-redux";
import {Button} from "antd";
import {useNavigate} from "react-router-dom";
import {setActive} from "../../slices/search";

const HomePage = () => {
	const files = useSelector(s => s.pass);
	const navigate = useNavigate();

	const onClick = () => {
		setActive(files.activeElem);
		navigate("/search");
	};

	return (
		<div className={styles.page}>
			<div className={styles.title}>База паспортов</div>
			{files.data?.length && files.data.map(el => <Card file={el.file} date={el.date} key={el.id} id={el.id} active={files.activeElem?.id === el.id} />)}
			<div className={styles.block}>
				Загрузить новый паспорт:
				<Button className={styles.btnup}>Загрузить</Button>
			</div>
			{files.activeElem && (
				<Button className={styles.btn} onClick={onClick}>
					Подобрать партнера
				</Button>
			)}
		</div>
	);
};

export default React.memo(HomePage);
