import { useParams } from "react-router-dom";

const FormationsIframePage = () => {
  const { intituleFormation } = useParams();

  return (
    <div>
      <h1>Formations</h1>
      <p>{intituleFormation}</p>
    </div>
  );
};

export default FormationsIframePage;
