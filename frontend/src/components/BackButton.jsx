import {Button} from "antd";
import React from "react";
import {useNavigate} from "react-router-dom";

const BackButton = ({backurl = false}) => {
	const navigate = useNavigate();

	const goBack = () => {
		if (backurl) {
			navigate(backurl);
		} else {
			navigate(-1);
		}
	};

	return <Button onClick={goBack}>Назад</Button>;
};

export default React.memo(BackButton);
