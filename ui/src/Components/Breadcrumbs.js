import React from "react";
import { Link } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import routes from "../routes";

export const getCrumbs = (props) =>
  routes
    .filter(({ path }) => props.match.path.includes(path))
    .map(({ path, ...rest }) => ({
      path: Object.keys(props.match.params).length
        ? Object.keys(props.match.params).reduce(
            (path, param) => path.replace(`:${param}`, props.match.params[param]),
            path
          )
        : path,
      ...rest,
    }));

const Breadcrumbs = ({ crumbs }) => {
  return (
    <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />}>
      {crumbs.map(({ name, path }, key) =>
        key + 1 === crumbs.length ? (
          <BreadcrumbItem key={key} isCurrentPage>
            <BreadcrumbLink>{name}</BreadcrumbLink>
          </BreadcrumbItem>
        ) : (
          <BreadcrumbItem key={key}>
            <BreadcrumbLink as={Link} to={path}>
              {name}
            </BreadcrumbLink>
          </BreadcrumbItem>
        )
      )}
    </Breadcrumb>
  );
};

export default Breadcrumbs;
