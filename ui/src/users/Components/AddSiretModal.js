import React, { useContext, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  Text,
  useToast,
  Stack,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { _put, _post, _get } from "../../utils/httpClient";
import { UserContext } from "../../context/UserContext";
import AddSiret from "./AddSiret/AddSiret";

const etablissement = Yup.object({
  siret: Yup.string().required(),
  onisep_nom: Yup.string().nullable(),
  enseigne: Yup.string().nullable(),
  entreprise_raison_sociale: Yup.string().nullable(),
});

const validationSchema = Yup.object({
  etablissements: Yup.array().of(etablissement).min(1, "Ce champs est obligatoire"),
});

const getRemoteEtablissementsToCreate = async (siretList) => {
  const result = await _get(
    `https://catalogue-apprentissage.intercariforef.org/api/v1/entity/etablissements?query={"siret": {"$in": ${JSON.stringify(
      siretList
    )}}}&page=1&limit=100`
  );
  return result.etablissements;
};

const AddSiretModal = ({ user, onClose, isOpen, setRefetchData }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [userContext] = useContext(UserContext);
  const toast = useToast();

  const formik = useFormik({
    initialValues: {
      etablissements: [],
    },
    validationSchema: validationSchema,
    onSubmit: async ({ etablissements }) => {
      setIsSubmitting(true);
      const etablissementsWitoutEmpty = etablissements.filter(
        (obj) => Object.keys(obj).length !== 0
      );

      const filteredEtablissements = etablissementsWitoutEmpty.filter(
        (etablissement) => !user.etablissements.find((e) => e.siret === etablissement.siret)
      );

      const newEtablissementsPayload = filteredEtablissements.map((etablissement) => ({
        siret: etablissement.siret,
        onisep_nom: etablissement.onisep_nom,
        enseigne: etablissement.enseigne,
        entreprise_raison_sociale: etablissement.entreprise_raison_sociale,
      }));

      const previousEtablissementsWithoutEmpty = user.etablissements.filter(
        (obj) => Object.keys(obj).length !== 0
      );

      const resultUser = await _put(
        `/api/users/${user._id}`,
        {
          etablissements: [...previousEtablissementsWithoutEmpty, ...newEtablissementsPayload],
        },
        userContext.token
      );

      const siretList = filteredEtablissements.map((etablissement) => etablissement.siret);

      const remoteEtablissementsToCreate = await getRemoteEtablissementsToCreate(siretList);

      const resultEtablissements = await _post(
        `/api/etablissements/`,
        remoteEtablissementsToCreate.map((etablissement) => {
          return {
            data: etablissement,
            createdBy: user._id,
          };
        }),
        userContext.token
      );

      if (resultUser.modifiedCount === 1 && resultEtablissements) {
        toast({
          title: "SIRET ajouté",
          description: `Les nouveaux SIRET ont bien été ajouté. ${
            resultEtablissements?.length || 0
          } nouveau(x) établissement(s) ont été créé(s)`,
          status: "success",
          duration: 5000,
        });
      } else {
        toast({
          title: "Une erreur est survenue",
          status: "error",
          duration: 5000,
        });
      }

      setIsSubmitting(false);
      setRefetchData(true);
      onClose();
      formik.resetForm();
    },
  });

  if (!user) return null;

  const userSiret = user.etablissements?.map((etablissement) => etablissement.siret) || [];

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered size="xl">
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={formik.handleSubmit}>
          <ModalHeader textAlign="center">Ajout de SIRET</ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign="center" mt="15">
            <Text fontSize="sm" mb="15px" textAlign="left">
              Ces établissements seront ajoutés à l'utilisateur :{" "}
              <Text as="span" fontWeight="semibold">
                {user.firstName} {user.lastName}
              </Text>
            </Text>
            <Stack spacing="16px" mt="16px">
              <AddSiret formik={formik} setError={setError} userSiret={userSiret} />
            </Stack>
          </ModalBody>
          <ModalFooter alignItems="center" justifyContent="center" mt="15">
            <Button
              size="lg"
              variant="solid"
              colorScheme="brand.blue"
              type="submit"
              isLoading={isSubmitting}
            >
              Ajouter
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default AddSiretModal;
