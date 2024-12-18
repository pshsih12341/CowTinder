import {createBrowserRouter, Navigate} from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage";
import Layout from "../pages/Layout/Layout";
import HistoryPage from "../pages/HistoryPage/HistoryPage";
import SearchPage from "../pages/SearchPage/SearchPage";
import CreatePage from "../pages/CreatePage/CreatePage";
import ResPage from "../pages/ResPage/ResPage";
import CandidatePage from "../pages/CandidatePage/CandidatePage";

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
				path: "home/createPass",
				element: <CreatePage />,
			},
			{
				path: "history/:id",
				element: <ResPage />,
			},
			{
				path: "history/:id/:personId",
				element: <CandidatePage />,
			},
			{
				path: "*", // Обработка несуществующих маршрутов
				element: <Navigate to='home' replace />, // Перенаправление на главную
			},
		],
	},
]);

export default router;
