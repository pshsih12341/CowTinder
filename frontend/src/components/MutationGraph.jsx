import React from "react";
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from "recharts";

const MutationGraph = ({data, type}) => {
	// Определяем отображаемые данные и подпись в зависимости от типа
	const chartKey = type === "udoi" ? "udoi" : "upitonost";
	const chartName = type === "udoi" ? "Средний удой" : "Средняя упитанность";
	const chartColor = type === "udoi" ? "#82ca9d" : "#8884d8";

	// Подготовка данных для графика
	const chartData = data.map((item, index) => ({
		name: item.name || `№${index + 1}`, // Имя или порядковый номер
		value: item[chartKey], // Данные для отображения (udoi или upitonost)
	}));

	return (
		<div style={{width: "100%", height: 400}}>
			<div>График: {chartName}</div>
			<BarChart
				width={340}
				height={400}
				data={chartData}
				margin={{
					top: 20,
					bottom: 20,
				}}>
				<CartesianGrid strokeDasharray='3 3' />
				<XAxis dataKey='name' />
				<YAxis />
				<Tooltip />
				<Legend />
				<Bar dataKey='value' fill={chartColor} name={chartName} />
			</BarChart>
		</div>
	);
};

export default MutationGraph;
