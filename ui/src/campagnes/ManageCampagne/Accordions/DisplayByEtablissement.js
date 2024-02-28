import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import ManageCampagneTable from "../ManageCampagnesTable/ManageCampagneTable";
import {
  getUniqueEtablissementFromCampagne,
  orderCampagnesByEtablissement,
  orderFormationsByEtablissement,
  isPlural,
} from "../../utils";
import { etablissementLabelGetter, buildEtablissementAddress } from "../../../utils/etablissement";
import { StyledAccordion, AccordionLabelByEtablissementContainer } from "./accordions.style";

const DisplayByEtablissement = ({
  displayedCampagnes,
  formations,
  selectedCampagnes,
  setSelectedCampagnes,
  userContext,
}) => {
  const uniqueEtablissementFromCampagne = getUniqueEtablissementFromCampagne(displayedCampagnes);

  const orderedCampagnesByEtablissement = orderCampagnesByEtablissement(displayedCampagnes);
  const orderedFormationsByEtablissement = formations?.length
    ? orderFormationsByEtablissement(formations)
    : [];

  return uniqueEtablissementFromCampagne.map((siret) => {
    const campagnesByEtablissement = orderedCampagnesByEtablissement[siret];
    const formationsByEtablissement = orderedFormationsByEtablissement[siret];

    const isCampagnesPlural = isPlural(campagnesByEtablissement.length);

    const isEveryCampagnesSelected = formationsByEtablissement.every((campagne) =>
      selectedCampagnes.includes(campagne._id)
    );

    return (
      <StyledAccordion
        key={siret}
        label={
          <>
            <Checkbox
              small
              options={[
                {
                  nativeInputProps: {
                    name: `selectAll${siret}`,
                    checked: isEveryCampagnesSelected,
                    onChange: (e) => {
                      setSelectedCampagnes((prevValues) => {
                        if (e.target.checked) {
                          return [
                            ...new Set([
                              ...prevValues,
                              ...campagnesByEtablissement.map((campagne) => campagne._id),
                            ]),
                          ];
                        } else {
                          return prevValues.filter(
                            (selectedCampagne) =>
                              !campagnesByEtablissement
                                .map((campagne) => campagne._id)
                                .includes(selectedCampagne)
                          );
                        }
                      });
                    },
                  },
                },
              ]}
            />
            <AccordionLabelByEtablissementContainer>
              <h5>{etablissementLabelGetter(campagnesByEtablissement[0].etablissement.data)}</h5>
              <p>{buildEtablissementAddress(campagnesByEtablissement[0].etablissement.data)}</p>
              <p>N° SIRET : {campagnesByEtablissement[0].etablissement.data.siret}</p>
              <p>
                {campagnesByEtablissement.length}
                {formationsByEtablissement?.length
                  ? `/${formationsByEtablissement?.length}`
                  : ""}{" "}
                campagne
                {isCampagnesPlural} créée{isCampagnesPlural}
              </p>
            </AccordionLabelByEtablissementContainer>
          </>
        }
      >
        <ManageCampagneTable
          key={siret}
          displayedCampagnes={campagnesByEtablissement}
          selectedCampagnes={selectedCampagnes}
          setSelectedCampagnes={setSelectedCampagnes}
          userContext={userContext}
        />
      </StyledAccordion>
    );
  });
};

export default DisplayByEtablissement;
