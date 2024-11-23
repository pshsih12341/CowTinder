import {createBrowserRouter, Navigate} from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage";
import Layout from "../pages/Layout/Layout";
import HistoryPage from "../pages/HistoryPage/HistoryPage";
import SearchPage from "../pages/SearchPage/SearchPage";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		children: [
			{
				index: true,
				element: <HomePage />,
			},
			{
				path: "home",
				element: <HomePage />,
			},
			{
				path: "history",
				element: <HistoryPage />,
			},
			{
				path: "search",
				element: <SearchPage />,
			},
			{
				path: "*", // Обработка несуществующих маршрутов
				element: <Navigate to='home' replace />, // Перенаправление на главную
			},
		],
	},
]);

export default router;
