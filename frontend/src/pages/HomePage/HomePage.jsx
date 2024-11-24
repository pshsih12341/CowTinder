import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button, Input, Upload} from "antd";
import {Link, useNavigate} from "react-router-dom";
import {setActive} from "../../slices/search";
import {PlusOutlined, SearchOutlined, UploadOutlined} from "@ant-design/icons";
import styles from "./homePage.module.scss";
import CardsFolder from "../../components/CardsFolder";
import {addPass} from "../../slices/pass";

const HomePage = () => {
	const data = useSelector(state => state.pass?.data); // Данные из Redux
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const activeel = useSelector(s => s.pass.activeElem);

	// Локальное состояние для поиска
	const [searchValue, setSearchValue] = useState("");

	// Обработчик изменения в поле поиска
	const handleSearchChange = e => {
		setSearchValue(e.target.value);
	};

	// Фильтрация данных на основе поиска
	const filteredData = data?.filter(item => String(item.id_individual).includes(searchValue));

	console.log(filteredData);
	const onClick = () => {
		dispatch(setActive(data.activeElem));
		navigate("/search");
	};

	const file = {
		id_individual: 2,
		sex: "Самец",
		breed: "Швицкая",
		birth_date: "2023-07-14T19:28:05.556Z",
		father_id: 9107,
		mother_id: 1784,
		milk_yield_day: 21.730201934831,
		body_condition: 3,
		inbreeding_coefficient: 0.07,
		weight_gain_day: 0,
		health_score: 5,
		fertility_percentage: 0,
		genetic_value: 70,
	};

	return (
		<div className={styles.page}>
			<div className={styles.title}>База паспортов</div>

			{/* Поле поиска */}
			<Input placeholder='Поиск по id особи' style={{height: 40}} value={searchValue} onChange={e => handleSearchChange(e)} suffix={<SearchOutlined />} />

			{/* Отображение отфильтрованных данных */}
			<CardsFolder data={filteredData} />
			<div className={styles.block}>
				<div className={styles.text}>Заполнить новый паспорт:</div>
				<Link to={"/home/createPass"}>
					<Button icon={<PlusOutlined />} style={{height: 40}}>
						Заполнить
					</Button>
				</Link>
				<div className={styles.textBlock}>
					<div className={styles.text}>Или загрузить файл</div>
					<div className={styles.descr}>(Поддерживаемые форматы: xls, xlsx, tsv или vcf)</div>
				</div>
				<Upload accept='.csv, .xls, .xlsx' showUploadList={false} beforeUpload={() => dispatch(addPass(file))}>
					<Button icon={<UploadOutlined />} style={{height: 40}}>
						Загрузить
					</Button>
				</Upload>
			</div>

			{activeel && (
				<Button className={styles.btn} onClick={onClick}>
					Подобрать партнера
				</Button>
			)}
		</div>
	);
};

export default React.memo(HomePage);
