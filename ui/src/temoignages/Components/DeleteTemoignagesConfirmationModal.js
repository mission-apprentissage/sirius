import { fr } from "@codegouvfr/react-dsfr";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { useQueryClient } from "@tanstack/react-query";

import { isPlural } from "../../campagnes/utils";
import useDeleteTemoignages from "../../hooks/useDeleteTemoignages";

const DeleteTemoignagesConfirmationModal = ({ modal, selectedTemoignagesIds, setSelectedTemoignagesIds }) => {
  const queryClient = useQueryClient();

  const { mutate: deleteTemoignages, isPending, isError } = useDeleteTemoignages();

  const handleOnClick = () => {
    deleteTemoignages(selectedTemoignagesIds, {
      onSuccess: () => {
        setSelectedTemoignagesIds([]);
        queryClient.invalidateQueries(["uncompliantTemoignages"]);
        modal.close();
      },
    });
  };

  return (
    <modal.Component
      title={
        <>
          <span className={fr.cx("fr-icon-arrow-right-line")} />
          Supprimer des témoignages
        </>
      }
      size="medium"
      buttons={[
        {
          doClosesModal: true,
          children: "Annuler",
          disabled: isPending,
        },
        {
          doClosesModal: false,
          children: "Supprimer",
          type: "button",
          onClick: handleOnClick,
          disabled: isPending,
        },
      ]}
    >
      <p>
        Vous vous apprêtez à supprimer{" "}
        <b>
          {selectedTemoignagesIds.length} temoignage
          {isPlural(selectedTemoignagesIds.length)}
        </b>
        .
      </p>
      <p>Êtes-vous certain·e de vouloir {selectedTemoignagesIds.length > 1 ? "les" : "le"} supprimer ?</p>
      {isError && <Alert closable description={isError.message || "Une erreur est survenue."} severity="error" />}
    </modal.Component>
  );
};

export default DeleteTemoignagesConfirmationModal;
