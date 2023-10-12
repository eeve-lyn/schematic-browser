const filters = { text: "", desc: "" };

const textFilter = (schem) => filters.text === "" || schem.name().toLowerCase().includes(filters.text.toLowerCase());
const descFilter = (schem) => filters.desc === "" || schem.description().toLowerCase().includes(filters.desc.toLowerCase());

module.exports = {
    filter: (schem) => textFilter(schem) && descFilter(schem),
    setFilter: (filter, value) => (filters[filter] = value),
    getFilter: (filter) => filters[filter]
};
