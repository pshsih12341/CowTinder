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

	const onClick = () => {
		dispatch(setActive(data.activeElem));
		navigate("/search");
	};

	const file = {
		id_individual: 37,
		sex: "Самка",
		breed: "Швицкая",
		birth_date: "2021-09-24",
		father_id: 6020,
		mother_id: 8710,
		milk_yield_day: 38.0299677501387,
		body_condition: 3,
		inbreeding_coefficient: 0.13,
		weight_gain_day: 0.96,
		health_score: 6,
		fertility_percentage: 95,
		genetic_value: 84,
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
