import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button} from "antd";
import {Link, useNavigate} from "react-router-dom";
import {setActive} from "../../slices/search";
import {PlusOutlined, UploadOutlined} from "@ant-design/icons";
import styles from "./homePage.module.scss";
import CardsFolder from "../../components/CardsFolder";

const HomePage = () => {
	const data = useSelector(state => state.pass?.data);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const activeel = useSelector(s => s.pass.activeElem);

	const onClick = () => {
		dispatch(setActive(data.activeElem));
		navigate("/search");
	};

	return (
		<div className={styles.page}>
			<div className={styles.title}>База паспортов</div>
			<div className={styles.block}>
				Загрузите или создайте новый паспорт:
				<div className={styles.btns}>
					<Button icon={<UploadOutlined />}>Загрузить</Button>
					<Link to={"/home/createPass"}>
						<Button icon={<PlusOutlined />}>Создать</Button>
					</Link>
				</div>
			</div>
			<CardsFolder />
			{activeel && (
				<Button className={styles.btn} onClick={onClick}>
					Подобрать партнера
				</Button>
			)}
		</div>
	);
};

export default React.memo(HomePage);
