export default function prefetchComponentData(dispatch, components, params) {
    const needs = components.reduce((prev, current) => {
        return (current.prefetchData || []).concat(prev);
    }, []);
    const promises = needs.map(need => dispatch(need(params)));
    return Promise.all(promises);
}