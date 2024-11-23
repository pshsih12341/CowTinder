import React from "react";
import Footer from "./Footer";
import {Outlet} from "react-router-dom"; // Импортируем Outlet
import Header from "./Header";

const Layout = () => {
	return (
		<>
			<Header />
			<Outlet /> {/* Это место, где будут отображаться дочерние маршруты */}
			<Footer />
		</>
	);
};

export default React.memo(Layout);
