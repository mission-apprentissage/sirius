import React, { useState, useEffect } from "react";
import { Flex, Spinner } from "@chakra-ui/react";
import useFetchUsers from "../hooks/useFetchUsers";
import UsersTable from "./Components/UsersTable";

const Managing = () => {
  const [refetchData, setRefetchData] = useState(false);
  const [users, usersLoading, usersError] = useFetchUsers(refetchData);

  useEffect(() => {
    if (refetchData) {
      setRefetchData(false);
    }
  }, [refetchData]);

  if (usersLoading || usersError) return <Spinner />;

  return (
    <Flex direction="column" w="100%" m="auto">
      <Flex direction="column" w="100%" m="auto">
        {users.length > 0 && <UsersTable users={users} setRefetchData={setRefetchData} />}
      </Flex>
    </Flex>
  );
};

export default Managing;
