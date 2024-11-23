import React, {useState} from "react";
import styles from "./SearchPage.module.scss";
import {useSelector, useDispatch} from "react-redux";
import {Button, Input, InputNumber, Select, Steps} from "antd";
import {setField} from "../../slices/search"; // Импортируем setFile
import classNames from "classnames";

const SearchPage = () => {
	const activeElem = useSelector(state => state.search?.activeElem);
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
			dispatch(setField({field: "file", value: file})); // Диспатчим файл в стейт
		}
	};
	return (
		<div className={styles.page}>
			<div>
				<div className={styles.title}>Подбор партнера</div>
				<Steps current={step} items={steps} progressDot direction='horizontal' responsive={false} size='small' />
			</div>
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
					<Button onClick={() => setStep(1)} className={styles.brnas} disabled={!activeElem?.file}>
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
							defaultValue='Чистопородное разведение'
							style={{width: "100%", textAlign: "start"}}
							className={styles.Select}
							onChange={value => dispatch(setField({field: "type", value}))}
							options={[
								{value: "Чистопородное разведение", label: "Чистопородное разведение"},
								{value: "Инбридинг", label: "Инбридинг"},
								{value: "Разведение по линиям и семействам", label: "Разведение по линиям и семействам"},
								{value: "Скрещивание пород", label: "Скрещивание пород"},
							]}
						/>
						<div className={styles.choose}>Цель разведения:</div>
						<Select
							defaultValue='Удойная особь'
							style={{width: "100%", textAlign: "start"}}
							className={styles.Select}
							onChange={value => dispatch(setField({field: "goal", value}))}
							options={[
								{value: "Удойная особь", label: "Удойная особь"},
								{value: "Мясная особь", label: "Мясная особь"},
								{value: "Удойная или мясная особь", label: "Удойная или мясная особь"},
							]}
						/>
					</div>
					<Button onClick={() => setStep(2)} className={styles.brnas} disabled={!activeElem?.file}>
						Перейти к следующему шагу
					</Button>
				</>
			)}
			{step === 2 && (
				<>
					<div className={classNames(styles.block, styles.chooseBlock)}>
						<div className={styles.textBlock}>
							<div className={styles.subttitle}>Выберите параметры для подбора</div>
							<div className={styles.description}>Можно оставить пустыми для подбора лучших кандидатов или выбрать опеределенные параметры</div>
						</div>
						<div className={styles.selectBlock}>
							<div className={styles.choose}>Введите значение минимального удоя в день (литры)</div>
							<Input placeholder='Значения удоя' onChange={e => dispatch(setField({field: "milk", value: e.target.value}))} />
						</div>
						<div className={styles.selectBlock}>
							<div className={styles.choose}>Введите минимальное и максимальное значения коэффициента инбридинга (0,00 - 1,00)</div>
							<div className={styles.inputs}>
								<InputNumber placeholder='Кооэфициент' style={{width: "100%"}} onChange={value => dispatch(setField({field: "minInb", value}))} min={0} max={1} precision={2} />
								<InputNumber placeholder='Кооэфициент' style={{width: "100%"}} onChange={value => dispatch(setField({field: "maxInb", value}))} min={0} max={1} precision={2} />
							</div>
						</div>
						<div className={styles.selectBlock}>
							<div className={styles.choose}>Введите минимальное и максимальное значения упитанности (1-5)</div>
							<div className={styles.inputs}>
								<InputNumber placeholder='Упитанность' style={{width: "100%"}} onChange={value => dispatch(setField({field: "minPlot", value}))} min={1} max={5} />
								<InputNumber placeholder='Упитанность' style={{width: "100%"}} onChange={value => dispatch(setField({field: "maxPlot", value}))} min={1} max={5} />
							</div>
						</div>
						<div className={styles.selectBlock}>
							<div className={styles.choose}>Введите минимальное и максимальное значения баллов здоровья (1-10)</div>
							<div className={styles.inputs}>
								<InputNumber placeholder='Здоровье' style={{width: "100%"}} onChange={value => dispatch(setField({field: "minHealth", value}))} min={1} max={10} />
								<InputNumber placeholder='Здоровье' style={{width: "100%"}} onChange={value => dispatch(setField({field: "maxHealth", value}))} min={1} max={10} />
							</div>
						</div>
						<div className={styles.selectBlock}>
							<div className={styles.choose}>Введите минимальное и максимальное значения баллов здоровья (1-10)</div>
							<div className={styles.inputs}>
								<InputNumber placeholder='Здоровье' style={{width: "100%"}} onChange={value => dispatch(setField({field: "minHealth", value}))} min={1} max={10} />
								<InputNumber placeholder='Здоровье' style={{width: "100%"}} onChange={value => dispatch(setField({field: "maxHealth", value}))} min={1} max={10} />
							</div>
						</div>
						<div className={styles.selectBlock}>
							<div className={styles.choose}>Введите минимальное и максимальное значения процента фертильности (1-100)</div>
							<div className={styles.inputs}>
								<InputNumber placeholder='Здоровье' style={{width: "100%"}} onChange={value => dispatch(setField({field: "minHealth", value}))} min={1} max={100} />
								<InputNumber placeholder='Здоровье' style={{width: "100%"}} onChange={value => dispatch(setField({field: "maxHealth", value}))} min={1} max={100} />
							</div>
						</div>
						<div className={styles.selectBlock}>
							<div className={styles.choose}>Введите минимальное и максимальное значения генетической ценности (1-100)</div>
							<div className={styles.inputs}>
								<InputNumber placeholder='Здоровье' style={{width: "100%"}} onChange={value => dispatch(setField({field: "minHealth", value}))} min={1} max={100} />
								<InputNumber placeholder='Здоровье' style={{width: "100%"}} onChange={value => dispatch(setField({field: "maxHealth", value}))} min={1} max={100} />
							</div>
						</div>
					</div>
					<Button>Подобрать кандидатов</Button>
				</>
			)}
		</div>
	);
};

export default React.memo(SearchPage);
