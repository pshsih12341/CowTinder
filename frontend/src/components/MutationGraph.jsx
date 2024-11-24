import React from "react";
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from "recharts";

const MutationGraph = ({data, id_individual}) => {
	// Находим животное по id_individual
	const individualData = data.find(item => item.id_individual === id_individual);

	// Если не нашли животное с таким id, возвращаем null или отображаем сообщение
	if (!individualData) {
		return <div>Животное с таким ID не найдено</div>;
	}

	// Подготовка данных для графика
	const chartData = [
		{
			name: "Показатели",
			udoi: individualData.udoi || 0,
			upitonost: individualData.upitonost || 0,
			healthy: individualData.healthy || 0,
			inbreedings: individualData.inbreedings || 0,
			fertl: individualData.fertl || 0,
			genballs: individualData.genballs || 0,
			prirost: individualData.prirost || 0,
		},
	];

	return (
		<div style={{width: "100%", height: 350}}>
			<div>График для ожидаемого потомка с ID: {id_individual}</div>
			<BarChart
				width={370}
				height={350}
				data={chartData}
				margin={{
					top: 20,
					right: 30,
					bottom: 20,
				}}
				barCategoryGap={15} // Увеличивает промежутки между группами столбцов
			>
				<CartesianGrid strokeDasharray='3 3' />
				<XAxis dataKey='name' />
				<YAxis />
				<Tooltip />
				<Legend />
				<Bar dataKey='udoi' fill='#82ca9d' name='Удой' />
				<Bar dataKey='upitonost' fill='#8884d8' name='Упитанность' />
				<Bar dataKey='healthy' fill='#ff7300' name='Здоровье' />
				<Bar dataKey='inbreedings' fill='#d0ed57' name='Инбридинг' />
				<Bar dataKey='fertl' fill='#ffc658' name='Фертильность' />
				<Bar dataKey='genballs' fill='#a4de6c' name='Ген.баллы' />
				<Bar dataKey='prirost' fill='#82ca9d' name='Прирост' />
			</BarChart>
		</div>
	);
};

export default MutationGraph;
