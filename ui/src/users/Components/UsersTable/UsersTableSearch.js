import { SearchIcon } from "@chakra-ui/icons";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";

const UsersTableSearch = ({ users, setDisplayedUsers, search, setSearch }) => {
  const handleSearch = (event) => {
    const search = event.target.value.toLowerCase();
    setSearch(event.target.value);
    if (!search) {
      setDisplayedUsers(users);
      return;
    }
    const filteredUsers = users.filter((user) => {
      return (
        user.firstName?.toLowerCase().includes(search) ||
        user.lastName?.toLowerCase().includes(search) ||
        user.email?.toLowerCase().includes(search)
      );
    });
    setDisplayedUsers(filteredUsers);
  };

  return (
    <InputGroup w="325px">
      <Input
        id="search"
        name="search"
        type="text"
        placeholder="Rechercher un utilisateur"
        onChange={handleSearch}
        value={search}
        size="lg"
        color="brand.black.500"
        _placeholder={{ color: "brand.black.500", fontSize: "16px" }}
        borderColor="brand.blue.400"
        fontSize="16px"
      />
      <InputRightElement h="100%">
        <SearchIcon color="brand.black.500" />
      </InputRightElement>
    </InputGroup>
  );
};

export default UsersTableSearch;
