import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useContext, useState } from "react";
import * as Yup from "yup";

import { UserContext } from "../../context/UserContext";
import { apiPost } from "../../utils/api.utils";
import AddSiret from "./AddSiret/AddSiret";

const etablissement = Yup.object({
  siret: Yup.string().required(),
  onisepNom: Yup.string().nullable(),
  enseigne: Yup.string().nullable(),
  entrepriseRaisonSociale: Yup.string().nullable(),
});

const validationSchema = Yup.object({
  etablissements: Yup.array().of(etablissement).min(1, "Ce champs est obligatoire"),
});

const getRemoteEtablissementsToCreate = async (siretList) => {
  const res = await fetch(
    `https://catalogue-apprentissage.intercariforef.org/api/v1/entity/etablissements?query={"siret": {"$in": ${JSON.stringify(
      siretList
    )}}}&page=1&limit=100`
  );
  const result = await res.json();
  return result.etablissements;
};

const AddSiretModal = ({ user, onClose, isOpen, setRefetchData }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setError] = useState(null);
  const [userContext] = useContext(UserContext);
  const toast = useToast();

  const formik = useFormik({
    initialValues: {
      etablissements: [],
    },
    validationSchema: validationSchema,
    onSubmit: async ({ etablissements }) => {
      setIsSubmitting(true);
      const etablissementsWitoutEmpty = etablissements.filter((obj) => Object.keys(obj).length !== 0);

      const filteredEtablissements = etablissementsWitoutEmpty.filter(
        (etablissement) => !user.etablissements.find((e) => e.siret === etablissement.siret)
      );

      const siretList = filteredEtablissements.map((etablissement) => etablissement.siret);

      const remoteEtablissementsToCreate = await getRemoteEtablissementsToCreate(siretList);

      const resultEtablissements = await apiPost("/etablissements", {
        body: remoteEtablissementsToCreate.map((etablissement) => {
          return {
            _id: etablissement._id,
            siret: etablissement.siret,
            userId: user.id,
          };
        }),
        headers: {
          Authorization: `Bearer ${userContext.token}`,
        },
      });

      if (resultEtablissements.length) {
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
            <Button size="lg" variant="solid" colorScheme="brand.blue" type="submit" isLoading={isSubmitting}>
              Ajouter
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default AddSiretModal;
