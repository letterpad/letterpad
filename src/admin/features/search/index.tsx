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
import React, { InputHTMLAttributes, useState } from "react";
import { WithNamespaces, translate } from "react-i18next";

import { Link } from "react-router-dom";
import ModalHoc from "../../components/modal";
import { QUERY_GLOBAL_SEARCH } from "../../../shared/queries/Queries";
import apolloClient from "../../../shared/apolloClient";
import config from "../../../config";

interface IProps extends WithNamespaces {
  onClose: () => void;
}

interface ISearchItemsProps {
  data: SearchResults[];
  label: string;
  getLink: (item: any) => string;
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
            />
            <SearchItems
              data={pages as SearchResults[]}
              getLink={item => "posts/" + item.id}
              label="Pages"
            />
            <SearchItems
              data={tags as SearchResults[]}
              getLink={item => "posts?tag=" + item.title}
              label="Tags"
            />
          </SearchBody>
        </div>
      </ModalHoc>
    </Container>
  );
};

export default translate("translations")(GlobalSearch);

const SearchBox: React.FC<InputHTMLAttributes<HTMLInputElement>> = props => {
  return (
    <SearchInputBox>
      <input
        type="text"
        placeholder="Enter a keyword and press enter"
        {...props}
      />
      <i className="fa fa-search" />
    </SearchInputBox>
  );
};

const SearchItems: React.FC<ISearchItemsProps> = ({ data, label, getLink }) => {
  if (data.length === 0) return null;
  return (
    <SearchItemGroup>
      <header>{label}</header>
      <div className="search-results">
        {data.map(item => (
          <Link
            to={config.BASE_NAME + getLink(item)}
            className="search-results-item"
          >
            {item.title}
          </Link>
        ))}
      </div>
    </SearchItemGroup>
  );
};
