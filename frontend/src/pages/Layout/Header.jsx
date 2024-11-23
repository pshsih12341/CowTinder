import React from "react";

import styles from "./layout.module.scss";

const Header = () => {
	return (
		<div className={styles.header}>
			<div className={styles.logo} />
			<div>DairyMatch</div>
		</div>
	);
};

export default React.memo(Header);
