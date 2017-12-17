import React, { Component } from "react";
import { gql, graphql } from "react-apollo";
import MediaItem from "../components/MediaItem";
import { Link } from "react-router";

const Paginate = ({ count, page }) => {
    const limit = 3;
    const pages = Array.from(Array(Math.ceil(count / 3)));

    return (
        <ul className="pagination">
            {pages.map((_, i) => {
                let num = i + 1;
                return (
                    <li>
                        <Link to={"/admin/posts/" + num}>{num}</Link>
                    </li>
                );
            })}
        </ul>
    );
};

class Media extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1
        };
    }

    render() {
        if (this.props.loading && !this.props.posts) {
            return <div>hello</div>;
        }
        let rows = this.props.media.rows.map((media, i) => {
            return <MediaItem key={i} media={media} />;
        });

        return (
            <div className="wrapper">
                <section className="module-xs">
                    <div className="container-fluid">
                        <div className="module-title">Media</div>
                        <div className="module-subtitle">
                            Find all your uploaded media here
                        </div>
                        <table className="table table-hover media-table">
                            <thead>
                                <tr>
                                    <th width="5%" className="col-check">
                                        <label className="control control--checkbox">
                                            <input type="checkbox" />
                                            <div className="control__indicator" />
                                        </label>
                                    </th>
                                    <th width="10%" className="col-text">
                                        Title
                                    </th>
                                    <th width="60%" className="col-text">
                                        URL
                                    </th>
                                    <th width="10%" className="col-text">
                                        Created At
                                    </th>
                                    <th width="10%" className="col-text">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>{rows}</tbody>
                        </table>
                        <Paginate
                            count={this.props.media.count}
                            page={this.state.page}
                        />
                    </div>
                </section>
            </div>
        );
    }
}

const mediaQuery = gql`
    query getMedia($author_id: Int!, $offset: Int, $limit: Int) {
        media(author_id: $author_id, offset: $offset, limit: $limit) {
            count
            rows {
                id
                url
                created_at
            }
        }
    }
`;

const ContainerWithData = graphql(mediaQuery, {
    options: props => ({
        variables: {
            author_id: "1",
            offset: (parseInt(props.params.page) - 1) * 3,
            limit: 3
        }
    }),
    props: ({ data: { loading, media } }) => ({
        media,
        loading
    })
});

export default ContainerWithData(Media);
