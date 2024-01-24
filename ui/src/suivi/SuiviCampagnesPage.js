import React, { useState, useContext } from "react";
import { Box } from "@chakra-ui/react";
import { DownloadIcon } from "@chakra-ui/icons";
import { _get } from "../utils/httpClient";
import { UserContext } from "../context/UserContext";
import Button from "../Components/Form/Button";

const SuiviCampagnesPage = () => {
  const [isLoadingDownload, setIsLoadingDownload] = useState(false);
  const [userContext] = useContext(UserContext);
  const handleDownload = async (e) => {
    e.stopPropagation();
    setIsLoadingDownload(true);

    const response = await _get(`/api/campagnes/export/xlsx/multi`, userContext.token);

    const base64Data = `data:application/application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${response.data}`;

    const a = document.createElement("a");
    a.href = base64Data;
    a.download = response.fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(base64Data);
    setIsLoadingDownload(false);
  };

  return (
    <Box display="flex" w="100%" mt="50px" justifyContent="center">
      <Button
        onClick={handleDownload}
        leftIcon={<DownloadIcon />}
        variant="filled"
        ml="15px"
        size="md"
        isLoading={isLoadingDownload}
        _hover={{
          backgroundColor: "brand.blue.700",
        }}
      >
        Télécharger les données de suivi des campagnes
      </Button>
    </Box>
  );
};

export default SuiviCampagnesPage;
