import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button, Upload} from "antd";
import {Link, useNavigate} from "react-router-dom";
import {setActive} from "../../slices/search";
import {PlusOutlined, UploadOutlined} from "@ant-design/icons";
import styles from "./homePage.module.scss";
import CardsFolder from "../../components/CardsFolder";
import {addPass} from "../../slices/pass";

const HomePage = () => {
	const data = useSelector(state => state.pass?.data);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const activeel = useSelector(s => s.pass.activeElem);

	const onClick = () => {
		dispatch(setActive(data.activeElem));
		navigate("/search");
	};

	const file = {
		sex: "Самка",
		birth_date: "2021-11-13",
		id_individual: 104,
		father_id: 6486,
		mother_id: 7008,
		milk_yield_day: 34.1710724383971,
		inbreeding_coefficient: 0.14,
		genetic_value: 92,
		health_score: 8,
		weight_gain_day: 0.81,
		breed: "Голштинская",
		fertility_percentage: 85,
		body_condition: 3,
	};

	return (
		<div className={styles.page}>
			<div className={styles.title}>База паспортов</div>
			<div className={styles.block}>
				Загрузите или создайте новый паспорт:
				<div className={styles.btns}>
					<Upload accept='.csv, .xls, .xlsx' showUploadList={false} beforeUpload={() => dispatch(addPass(file))}>
						<Button icon={<UploadOutlined />}>Загрузить</Button>
					</Upload>
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
