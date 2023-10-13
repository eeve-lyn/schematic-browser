const filters = { text: "", desc: "", planet: 0};

const textFilter = (schem) => filters.text === "" || schem.name().toLowerCase().includes(filters.text.toLowerCase());
const descFilter = (schem) => filters.desc === "" || schem.description().toLowerCase().includes(filters.desc.toLowerCase());
const planetFilter = (schem) => {
    const req = s.requirements().toSeq().toArray();
    const serpulo = r.some(i => Items.serpuloItems.contains(i.item));
    const eerekir = r.some(i => Items.erekirItems.contains(i.item));
    return [1, serpulo && !eerekir, !serpulo && eerekir, serpulo && eerekir][filters.planet] || false;
};


module.exports = {
    filter: (schem) => textFilter(schem) && descFilter(schem) && planetFilter(schem),
    setFilter: (filter, value) => (filters[filter] = value),
    getFilter: (filter) => filters[filter]
};
