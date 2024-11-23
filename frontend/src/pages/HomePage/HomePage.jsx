import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button, Upload} from "antd";
import {useNavigate} from "react-router-dom";
import {addFile} from "../../slices/pass";
import {setActive} from "../../slices/search";
import {UploadOutlined} from "@ant-design/icons";
import Card from "../../components/Card";
import styles from "./homePage.module.scss";

const HomePage = () => {
	const files = useSelector(state => state.pass);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const onUpload = file => {
		if (file) {
			dispatch(addFile(file)); // Добавляем файл в Redux
		}
	};

	const onClick = () => {
		dispatch(setActive(files.activeElem));
		navigate("/search");
	};

	return (
		<div className={styles.page}>
			<div className={styles.title}>База паспортов</div>
			<div className={styles.block}>
				Загрузить новый паспорт:
				<Upload action={file => onUpload(file)} showUploadList={false}>
					<Button icon={<UploadOutlined />}>Загрузить</Button>
				</Upload>
			</div>
			{files.data?.length && files.data.map(el => <Card file={el.file.name} date={el.date} key={el.id} id={el.id} active={files.activeElem?.id === el.id} />)}
			{files.activeElem && (
				<Button className={styles.btn} onClick={onClick}>
					Подобрать партнера
				</Button>
			)}
		</div>
	);
};

export default React.memo(HomePage);
