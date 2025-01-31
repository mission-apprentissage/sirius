import { Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import useFetchUsers from "../hooks/useFetchUsers";
import useSetAndTrackPageTitle from "../hooks/useSetAndTrackPageTitle";
import UsersTable from "./Components/UsersTable/UsersTable";

const Managing = () => {
  const [refetchData, setRefetchData] = useState(false);
  const [users, usersLoading, usersError] = useFetchUsers(refetchData);

  const helmet = useSetAndTrackPageTitle({ title: `Gérer les utilisateurs - Sirius` });

  useEffect(() => {
    if (refetchData) {
      setRefetchData(false);
    }
  }, [refetchData]);

  if (usersLoading || usersError) return <Spinner />;

  return (
    <>
      {helmet}
      <Flex direction="column" w="100%" m="auto">
        <Flex direction="column" w="100%" m="auto">
          {users.length > 0 && <UsersTable users={users} setRefetchData={setRefetchData} />}
        </Flex>
      </Flex>
    </>
  );
};

export default Managing;
