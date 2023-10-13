const filters = { text: "", desc: "", planet: 0};

const textFilter = (schem) => filters.text === "" || schem.name().toLowerCase().includes(filters.text.toLowerCase());
const descFilter = (schem) => filters.desc === "" || schem.description().toLowerCase().includes(filters.desc.toLowerCase());
const planetFilter = (schem) => {
    let serpulo = schem.requirements().toSeq().contains(boolf(i => Items.serpuloItems.contains(i.item) && !Items.erekirItems.contains(i.item)));
    let erekir = schem.requirements().toSeq().contains(boolf(i => Items.erekirItems.contains(i.item) && !Items.serpuloItems.contains(i.item)));
    return [1, serpulo && !erekir, !serpulo && erekir, serpulo && erekir][filters.planet] || false;
};


module.exports = {
    filter: (schem) => textFilter(schem) && descFilter(schem) && planetFilter(schem),
    setFilter: (filter, value) => (filters[filter] = value),
    getFilter: (filter) => filters[filter]
};
