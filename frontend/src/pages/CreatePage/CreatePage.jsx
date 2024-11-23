import React, {useState} from "react";
import styles from "./CreatePage.module.scss";
import {Button, DatePicker, InputNumber, Select} from "antd";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {addPass} from "../../slices/pass";

const CreatePage = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [param, setParam] = useState({
		sex: "Самец",
		breed: "Мясная особь",
		birth_date: null,
	});

	const handleChange = (key, value) => {
		setParam(prev => ({
			...prev,
			[key]: value,
		}));
	};

	const handleSumbit = () => {
		dispatch(addPass(param));
		navigate("/home");
	};

	const isFormValid = param.sex && param.breed && param.birth_date && param.id_individual && param.genetic_value;

	return (
		<div className={styles.page}>
			<div className={styles.title}>Новый паспорт</div>
			<div className={styles.block}>
				<div className={styles.text}>Введите параметры особи</div>
				<div className={styles.choseBlock}>
					<div className={styles.chooseText}>Пол особи:</div>
					<Select
						defaultValue='Самец'
						style={{width: "100%", textAlign: "start"}}
						onChange={value => handleChange("sex", value)}
						options={[
							{value: "Самец", label: "Самец"},
							{value: "Самка", label: "Самка"},
						]}
					/>
				</div>
				<div className={styles.choseBlock}>
					<div className={styles.chooseText}>Поррда особи:</div>
					<Select
						defaultValue='Мясная особь'
						style={{width: "100%", textAlign: "start"}}
						onChange={value => handleChange("breed", value)}
						options={[
							{value: "Мясная особь", label: "Мясная особь"},
							{value: "Молочная особь", label: "Молочная особь"},
						]}
					/>
				</div>
				<div className={styles.choseBlock}>
					<div className={styles.chooseText}>Дата рождения:</div>
					<DatePicker onChange={date => handleChange("birth_date", date)} />
				</div>
				<div className={styles.choseBlock}>
					<div className={styles.chooseText}>ID особи</div>
					<InputNumber placeholder='ID особи' style={{width: "100%", textAlign: "start"}} onChange={value => handleChange("id_individual", value)} />
				</div>
				<div className={styles.choseBlock}>
					<div className={styles.chooseText}>ID родителей особи</div>
					<div className={styles.inputs}>
						<InputNumber placeholder='ID отца' style={{width: "100%", textAlign: "start"}} onChange={value => handleChange("father_id", value)} />
						<InputNumber placeholder='ID матери' style={{width: "100%", textAlign: "start"}} onChange={value => handleChange("mother_id", value)} />
					</div>
				</div>
				<div className={styles.choseBlock}>
					<div className={styles.chooseText}>Значение удоя (литры)</div>
					<InputNumber placeholder='Литры' style={{width: "100%", textAlign: "start"}} onChange={value => handleChange("milk_yield_day", value)} />
				</div>
				<div className={styles.choseBlock}>
					<div className={styles.chooseText}>Значение упитанности (1-5)</div>
					<InputNumber placeholder='1-5' style={{width: "100%", textAlign: "start"}} onChange={value => handleChange("body_condition", value)} />
				</div>
				<div className={styles.choseBlock}>
					<div className={styles.chooseText}>Значение коэффициента инбридинга</div>
					<InputNumber placeholder='Коэффициент инбридинга' style={{width: "100%", textAlign: "start"}} onChange={value => handleChange("inbreeding_coefficient", value)} />
				</div>
				<div className={styles.choseBlock}>
					<div className={styles.chooseText}>Значение прироста веса (кг/день)</div>
					<InputNumber placeholder='Прирост веса' style={{width: "100%", textAlign: "start"}} onChange={value => handleChange("weight_gain_day", value)} />
				</div>
				<div className={styles.choseBlock}>
					<div className={styles.chooseText}>Значение здоровья (1-10)</div>
					<InputNumber placeholder='Здоровье' style={{width: "100%", textAlign: "start"}} onChange={value => handleChange("health_score", value)} />
				</div>
				<div className={styles.choseBlock}>
					<div className={styles.chooseText}>Значение фертильности (%)</div>
					<InputNumber placeholder='Фертильность' style={{width: "100%", textAlign: "start"}} onChange={value => handleChange("fertility_percentage", value)} />
				</div>
				<div className={styles.choseBlock}>
					<div className={styles.chooseText}>Значение генетической ценности (1-100)</div>
					<InputNumber placeholder='Генетическая ценность' style={{width: "100%", textAlign: "start"}} onChange={value => handleChange("genetic_value", value)} />
				</div>
			</div>
			<Button style={{width: "50%", margin: "0 auto"}} disabled={!isFormValid} onClick={handleSumbit}>
				Сохранить паспорт
			</Button>
		</div>
	);
};

export default React.memo(CreatePage);
