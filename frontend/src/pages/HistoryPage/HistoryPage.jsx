import React, {useState} from "react";
import {useSelector} from "react-redux";
import styles from "./historyPage.module.scss";
import Card from "../../components/Card";
import {Link} from "react-router-dom";
import {Input} from "antd";
import {SearchOutlined} from "@ant-design/icons";

const HistoryPage = () => {
	const history = useSelector(s => s.pass.history); // Получение данных из Redux
	const [searchValue, setSearchValue] = useState(""); // Локальное состояние для поиска

	// Обработчик изменения в поле поиска
	const handleSearchChange = e => {
		setSearchValue(e.target.value);
	};

	// Фильтрация данных на основе ввода
	const filteredHistory = history?.filter(item => String(item?.person?.id_individual).includes(searchValue));

	return (
		<div className={styles.page}>
			<div className={styles.title}>История запросов</div>

			{/* Поле поиска */}
			<Input placeholder='Поиск по id особи' style={{height: 40}} value={searchValue} onChange={handleSearchChange} suffix={<SearchOutlined />} />

			{/* Отображение результатов */}
			{filteredHistory?.length ?
				<>
					{filteredHistory.map(item => (
						<Link key={item?.person?.id + item?.loadDate} to={`/history/${item?.id}`}>
							<Card id={item?.person?.id} sex={item?.person?.sex} birth_date={item?.person?.birth_date} id_individual={item?.person?.id_individual} father_id={item?.person?.father_id} mother_id={item?.person?.mother_id} createDate={item?.loadDate} flag />
						</Link>
					))}
				</>
			:	<div>Вы еще не отправляли ни одного запроса на подбор или выбранный id не найден</div>}
		</div>
	);
};

export default React.memo(HistoryPage);
