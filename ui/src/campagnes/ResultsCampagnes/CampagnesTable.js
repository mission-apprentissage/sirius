import React from "react";
import Tooltip from "react-simple-tooltip";
import { fr } from "@codegouvfr/react-dsfr";
import { Table } from "@codegouvfr/react-dsfr/Table";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { formatDate, isPlural } from "../utils";
import { buildEtablissementAddress } from "../../utils/etablissement";
import {
  TemoignagesCount,
  EtablissementLabelContainer,
} from "../Shared/CampagnesTable/campagnesTable.style";
import { HeaderItem, FormationContainer, ToolTipContainer } from "../styles/shared.style";
import { DIPLOME_TYPE_MATCHER, campagnesDisplayMode } from "../../constants";

const headers = [
  "",
  "Formation",
  <HeaderItem key="campagneName">Nom d'usage</HeaderItem>,
  <HeaderItem key="debut">
    <span className={fr.cx("fr-icon--sm fr-icon-calendar-event-fill")} aria-hidden={true} />
    Début
  </HeaderItem>,
  <HeaderItem key="fin">
    <span className={fr.cx("fr-icon--sm fr-icon-calendar-2-fill")} aria-hidden={true} />
    Fin
  </HeaderItem>,
  <HeaderItem key="apprenties">
    <span className={fr.cx("fr-icon--sm fr-icon-team-fill")} aria-hidden={true} />
    Apprenti·es
  </HeaderItem>,
  <HeaderItem key="interrogées">
    <span className={fr.cx("fr-icon--sm fr-icon-quote-fill")} aria-hidden={true} />
    Interrogé·es
  </HeaderItem>,
];

const data = (displayedCampagnes, selectedCampagnes, setSelectedCampagnes, displayMode) => {
  return displayedCampagnes.map((campagne) => {
    const etablissement = campagne.etablissement.data;
    const formation = campagne.formation.data;

    return [
      <Checkbox
        key={`${campagne._id}-id`}
        options={[
          {
            nativeInputProps: {
              name: `campagne-${campagne._id}`,
              checked: selectedCampagnes.includes(campagne._id),
              onChange: () => {
                setSelectedCampagnes((prevValue) =>
                  prevValue.includes(campagne._id)
                    ? prevValue.filter((id) => id !== campagne._id)
                    : [...prevValue, campagne._id]
                );
              },
            },
          },
        ]}
      />,
      <>
        <FormationContainer key={`${campagne._id}-formation`}>
          <p>
            <b>{formation.intitule_long}</b>
          </p>
          <div>
            <p>{formation.tags.join("-")} </p>
            {formation?.duree && parseInt(formation?.duree) && (
              <p>
                · En {formation.duree} an{isPlural(parseInt(formation.duree))}
              </p>
            )}
          </div>
        </FormationContainer>
        {displayMode === campagnesDisplayMode[0].value && (
          <EtablissementLabelContainer>
            <Tooltip
              background="var(--background-default-grey)"
              border="var(--border-default-grey)"
              color="var(--text-default-grey)"
              placement="right"
              content={
                <ToolTipContainer>
                  <p>{buildEtablissementAddress(etablissement)}</p>
                  <p>N° Siret: {etablissement.siret}</p>
                  {formation.etablissement_formateur_siret ===
                  formation.etablissement_gestionnaire_siret ? (
                    <p>
                      <span className={fr.cx("fr-icon-award-fill")} aria-hidden={true} /> Cet
                      établissement est gestionnaire et rattaché à votre compte Sirius
                    </p>
                  ) : (
                    <p>
                      <span className={fr.cx("fr-icon-award-line")} aria-hidden={true} /> Cet
                      établissement est formateur et dispense des formations pour un établissement
                      gestionnaire
                    </p>
                  )}
                </ToolTipContainer>
              }
            >
              <p>
                {formation.etablissement_formateur_entreprise_raison_sociale ||
                  formation.etablissement_formateur_enseigne}
              </p>
            </Tooltip>
          </EtablissementLabelContainer>
        )}
        {displayMode === campagnesDisplayMode[1].value && (
          <p>{DIPLOME_TYPE_MATCHER[formation.diplome] || formation.diplome}</p>
        )}
      </>,
      campagne.nomCampagne,
      formatDate(campagne.startDate),
      formatDate(campagne.endDate),
      campagne.seats === 0 ? "Illimité" : campagne.seats,
      <TemoignagesCount key={`${campagne._id}-temoignageCount`}>
        {campagne.seats > 0
          ? Math.round((campagne.temoignagesCount * 100) / campagne.seats) + "%"
          : campagne.temoignagesCount}
      </TemoignagesCount>,
    ];
  });
};

const CampagnesTable = ({
  displayedCampagnes = [],
  selectedCampagnes,
  setSelectedCampagnes,
  displayMode,
}) => {
  return (
    <Table
      headers={headers}
      data={data(displayedCampagnes, selectedCampagnes, setSelectedCampagnes, displayMode)}
    />
  );
};

export default CampagnesTable;
