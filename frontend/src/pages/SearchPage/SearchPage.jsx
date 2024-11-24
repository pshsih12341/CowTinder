import React, {useState} from "react";
import styles from "./SearchPage.module.scss";
import {useSelector, useDispatch} from "react-redux";
import {Button, Select, Steps} from "antd";
import CardsFolder from "../../components/CardsFolder";
import {sendPassData, setSend, toggleActive} from "../../slices/pass";
import {useNavigate} from "react-router-dom";

const SearchPage = () => {
	const activeElem = useSelector(state => state.pass?.activeElem);
	const length = useSelector(s => s.pass?.history);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [type, setType] = useState("Чистопородное разведение");
	const [direction, setDirection] = useState("Удойная особь");

	const [step, setStep] = useState(0);
	const steps = [
		{
			title: "Шаг 1",
			subTitle: "Загрузить электронный паспорт",
		},
		{
			title: "Шаг 2",
			subTitle: "Выбрать тип и цель разведения",
		},
	];

	const handleSumbit = () => {
		dispatch(setSend({type, direction}));
		dispatch(sendPassData());
		dispatch(toggleActive(null));
		navigate(`/history/${length.length + 1}`);
	};
	return (
		<div className={styles.page}>
			<div>
				<div className={styles.title}>Подбор партнера</div>
				<Steps current={step} items={steps} progressDot direction='horizontal' responsive={false} size='small' />
			</div>
			{step === 0 && (
				<>
					<CardsFolder />
					<Button onClick={() => setStep(1)} className={styles.centerBtn} disabled={!activeElem}>
						Перейти к следующему шагу
					</Button>
				</>
			)}
			{step === 1 && (
				<>
					<div className={styles.block}>
						<div className={styles.subttitle}>Выберите тип и цель разведения</div>
						<div className={styles.choose}>Тип разведения:</div>
						<Select
							defaultValue={type}
							style={{width: "100%", textAlign: "start"}}
							className={styles.Select}
							onChange={value => setType(value)}
							options={[
								{value: "Чистопородное разведение", label: "Чистопородное разведение"},
								{value: "Инбридинг", label: "Инбридинг"},
								{value: "Разведение по линиям и семействам", label: "Разведение по линиям и семействам"},
								{value: "Скрещивание пород", label: "Скрещивание пород"},
							]}
						/>
						<div className={styles.choose}>Цель разведения:</div>
						<Select
							defaultValue={direction}
							style={{width: "100%", textAlign: "start"}}
							className={styles.Select}
							onChange={value => setDirection(value)}
							options={[
								{value: "Удойная особь", label: "Удойная особь"},
								{value: "Мясная особь", label: "Мясная особь"},
								{value: "Удойная или мясная особь", label: "Удойная или мясная особь"},
							]}
						/>
					</div>
					<Button onClick={handleSumbit} className={styles.brnas}>
						Подобрать кандидатов
					</Button>
				</>
			)}
		</div>
	);
};

export default React.memo(SearchPage);
