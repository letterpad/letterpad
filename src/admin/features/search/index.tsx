import {
  Container,
  SearchBody,
  SearchInputBox,
  SearchItemGroup,
} from "./Search.css";
import {
  GlobalSearchQuery,
  GlobalSearchQueryVariables,
  SearchData,
  SearchResults,
} from "../../../__generated__/gqlTypes";
import React, { InputHTMLAttributes, useEffect, useRef, useState } from "react";
import { WithNamespaces, translate } from "react-i18next";

import { Link } from "react-router-dom";
import ModalHoc from "../../components/modal";
import { QUERY_GLOBAL_SEARCH } from "../../../shared/queries/Queries";
import apolloClient from "../../../shared/apolloClient";

interface IProps extends WithNamespaces {
  onClose: () => void;
}

const GlobalSearch: React.FC<IProps> = ({ t, onClose }) => {
  const [state, setState] = useState<SearchData>({
    posts: [],
    pages: [],
    tags: [],
  });

  const actionSearch = async (keyword: string) => {
    const results = await apolloClient(true).query<
      GlobalSearchQuery,
      GlobalSearchQueryVariables
    >({
      query: QUERY_GLOBAL_SEARCH,
      variables: {
        keyword,
      },
    });

    if (!results.data.globalSearch?.data) return;

    setState(results.data.globalSearch.data);
  };

  const { posts, pages, tags } = state;

  return (
    <Container>
      <ModalHoc confirm title="Global Search" onClose={onClose}>
        <div className="modal-body">
          <SearchBox onChange={e => actionSearch(e.target.value)} />
          <SearchBody>
            <SearchItems
              data={posts as SearchResults[]}
              getLink={item => "pages/" + item.id}
              label="Posts"
              onClick={onClose}
            />
            <SearchItems
              data={pages as SearchResults[]}
              getLink={item => "posts/" + item.id}
              label="Pages"
              onClick={onClose}
            />
            <SearchItems
              data={tags as SearchResults[]}
              getLink={item => "tags/" + item.title}
              label="Tags"
              onClick={onClose}
            />
          </SearchBody>
        </div>
      </ModalHoc>
    </Container>
  );
};

export default translate("translations")(GlobalSearch);

const SearchBox: React.FC<InputHTMLAttributes<HTMLInputElement>> = props => {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });
  return (
    <SearchInputBox>
      <input
        ref={inputRef}
        type="text"
        placeholder="Enter a keyword and press enter"
        {...props}
      />
      <i className="fa fa-search" />
    </SearchInputBox>
  );
};

interface ISearchItemsProps {
  data: SearchResults[];
  label: string;
  getLink: (item: any) => string;
  onClick: () => void;
}

const SearchItems: React.FC<ISearchItemsProps> = ({
  data,
  label,
  getLink,
  onClick,
}) => {
  if (data.length === 0) return null;
  return (
    <SearchItemGroup>
      <header>{label}</header>
      <div className="search-results">
        {data.map(item => (
          <Link
            onClick={onClick}
            key={item.id + "-" + item.title}
            to={"/admin/" + getLink(item)}
            className="search-results-item"
          >
            {item.title}
          </Link>
        ))}
      </div>
    </SearchItemGroup>
  );
};
