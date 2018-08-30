import styled from "styled-components";

export default styled.div`
    .rstcustom__rowContents {
        display: flex;
        align-items: center;
        justify-content: space-between;
        max-width: 400px;
        min-width: 400px;
        background: var(--bg-sections);
        border: 1px solid var(--color-border);
        box-shadow: none;
        padding: 0 10px;

        .rstcustom__rowToolbar {
            display: flex;
            justify-content: space-between;

            .category {
                background: #bbe5c1;
                color: #1f680e;
                border: 1px solid #83c083;
                text-shadow: 1px 1px 3px #b6e3c7;
            }
            .page {
                background: #daeaff;
                color: #0b70bc;
                border: 1px solid #75b0ef;
                text-shadow: 1px 1px 3px #f5f9ff;
            }
            .folder {
                border: 1px solid #474747;
            }
            .rstcustom__toolbarButton {
                margin-left: 18px;

                .item-type {
                    font-size: 12px;
                    padding: 2px 6px;
                    border-radius: 3px;
                    padding-bottom: 4px;
                }
                i {
                    cursor: pointer;
                    &:hover {
                        color: #000;
                    }
                }
            }
        }
    }
    .menu-title-wrapper {
        span {
            font-weight: 400;
        }
    }
`;
