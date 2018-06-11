import React, { Component } from "react";

const qs = handle => document.querySelector(handle);

export default function SyncScroll(ClassComponent) {
    return class extends Component {
        constructor(props) {
            super(props);
            this.manageScroll = this.manageScroll.bind(this);
        }
        manageScroll() {
            setTimeout(() => {
                var $divs = [
                    qs(".article-holder .CodeFlask__textarea"),
                    qs(".preview .post-content")
                ];
                document.addEventListener(
                    "scroll",
                    e => {
                        $divs.forEach(div => {
                            if (e.target === div) {
                                this.adjustScroll(e);
                            }
                        });
                    },
                    true
                );
            }, 1000);
        }

        adjustScroll(event) {
            const $divs = [
                qs(".article-holder .CodeFlask__textarea"),
                qs(".preview .post-content")
            ];
            let $allowed = $divs;
            const sync = e => {
                const $this = e.target;
                if ($allowed.indexOf($this) >= 0) {
                    var other = $divs.filter(div => div !== $this)[0],
                        percentage =
                            $this.scrollTop /
                            ($this.scrollHeight - $this.offsetHeight);

                    other.scrollTop = Math.round(
                        percentage * (other.scrollHeight - other.offsetHeight)
                    );

                    $allowed = e.target;
                } else {
                    $allowed = $divs;
                }

                return false;
            };
            sync(event);
        }
        render() {
            return (
                <ClassComponent
                    {...this.props}
                    manageScroll={this.manageScroll}
                />
            );
        }
    };
}
