import React, {useState} from "react";
import styles from "./SearchPage.module.scss";
import {useSelector, useDispatch} from "react-redux";
import {Button, Steps} from "antd";
import {setFile} from "../../slices/search"; // Импортируем setFile

const SearchPage = () => {
	const activeElem = useSelector(state => state.search?.activeElem);
	console.log(activeElem);
	const dispatch = useDispatch();

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
		{
			title: "Шаг 3",
			subTitle: "Настроить параметры подбора",
		},
	];

	const handleFileChange = e => {
		const file = e.target.files[0];
		if (file) {
			dispatch(setFile(file)); // Диспатчим файл в стейт
		}
	};

	return (
		<div className={styles.page}>
			<div className={styles.title}>Подбор партнера</div>
			<Steps current={step} items={steps} progressDot direction='horizontal' responsive={false} size='small' />
			{step === 0 && (
				<>
					<div className={styles.block}>
						<div className={styles.text}>
							<div>Загрузите электронный паспорт животного</div>
							<div className={styles.subTitle}>(поддерживаемые форматы: xls, xlsx, tsv или vcf)</div>
						</div>
						<div className={styles.uploadWrapper}>
							<input type='file' accept='.xls,.xlsx,.tsv,.vcf' onChange={handleFileChange} id='file-upload' className={styles.uploadInput} />
							<label htmlFor='file-upload' className={styles.uploadLabel}>
								{activeElem?.file?.name || "Выберите файл"}
							</label>
						</div>
					</div>
					<Button onClick={() => setStep(1)}>Перейти к следующему шагу</Button>
				</>
			)}
		</div>
	);
};

export default React.memo(SearchPage);
