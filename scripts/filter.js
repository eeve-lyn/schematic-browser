const filters = { text: "", desc: "", planet: 0};

const textFilter = (schem) => filters.text === "" || schem.name().toLowerCase().includes(filters.text.toLowerCase());
const descFilter = (schem) => filters.desc === "" || schem.description().toLowerCase().includes(filters.desc.toLowerCase());
const planetFilter = (schem) => {
    const items = schem.requirements().toSeq().toArray().map(i => [Items.serpuloItems.contains(i.item), Items.erekirItems.contains(i.item)]);
    return [true, [1, 0], [0, 1], [1, 1]][filters.planet].every((val, i) => val ? items.every(arr => arr[i]) : true);
}


module.exports = {
    filter: (schem) => textFilter(schem) && descFilter(schem) && planetFilter(schem),
    setFilter: (filter, value) => (filters[filter] = value),
    getFilter: (filter) => filters[filter]
};
