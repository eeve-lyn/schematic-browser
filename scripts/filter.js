const filters = { text: "", desc: "", planet: 0};

const textFilter = (schem) => filters.text === "" || schem.name().toLowerCase().includes(filters.text.toLowerCase());
const descFilter = (schem) => filters.desc === "" || schem.description().toLowerCase().includes(filters.desc.toLowerCase());
const planetFilter = (schem) => {
    if (filters.planet == 0) return false;
}

module.exports = {
    filter: (schem) => textFilter(schem) && descFilter(schem) && planetFilter(schem),
    setFilter: (filter, value) => (filters[filter] = value),
    getFilter: (filter) => filters[filter]
};
