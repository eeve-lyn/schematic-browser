const filters = { text: "", desc: "", planet: 0};

const textFilter = (schem) => filters.text === "" || schem.name().toLowerCase().includes(filters.text.toLowerCase());
const descFilter = (schem) => filters.desc === "" || schem.description().toLowerCase().includes(filters.desc.toLowerCase());
const planetFilter = schem => {
    const [serpulo, erekir] = ["serpuloItems", "erekirItems"].map(itemList => schem.requirements().toSeq().anyMatch(i => Items[itemList].contains(i.item)));
    return filters.planet === 0 || (filters.planet === 1 ? serpulo && !erekir : filters.planet === 2 ? !serpulo && erekir : filters.planet === 3 ? serpulo && erekir : false);
};


module.exports = {
    filter: (schem) => textFilter(schem) && descFilter(schem) && planetFilter(schem),
    setFilter: (filter, value) => (filters[filter] = value),
    getFilter: (filter) => filters[filter]
};
