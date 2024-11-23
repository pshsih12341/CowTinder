import React from "react";
import {NavLink} from "react-router-dom";
import styles from "./layout.module.scss";
import classnames from "classnames";

const Footer = () => {
	return (
		<div className={styles.footer}>
			<NavLink to='/home' className={({isActive}) => classnames(styles.btn, {[styles.active]: isActive})}>
				<div className={classnames(styles.icon, styles.home)} />
				База паспортов
			</NavLink>
			<NavLink to='/search' className={({isActive}) => classnames(styles.btn, {[styles.active]: isActive})}>
				<div className={classnames(styles.icon, styles.search)} />
				Подбор партнера
			</NavLink>
			<NavLink to='/history' className={({isActive}) => classnames(styles.btn, {[styles.active]: isActive})}>
				<div className={classnames(styles.icon, styles.history)} />
				История запросов
			</NavLink>
		</div>
	);
};

export default React.memo(Footer);
