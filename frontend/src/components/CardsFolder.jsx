import React from "react";
import {useSelector} from "react-redux";
import Card from "./Card";

const CardsFolder = ({data}) => {
	const activeel = useSelector(s => s.pass.activeElem);

	return <>{data.length ? data.map(el => <Card sex={el.sex} birth_date={el.birth_date} id_individual={el.id_individual} father_id={el.father_id} mother_id={el.mother_id} createDate={el.createDate} key={el.id} id={el.id} active={activeel?.id === el.id} />) : null}</>;
};

export default React.memo(CardsFolder);
