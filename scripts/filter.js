let filters = {
    text: "",
    desc: ""
}

let textFilter = (schem) => {
    if (filters["text"] == "") return true;
    return schem.name().toLowerCase().includes(filters["text"])
}

let descFilter = (schem) => {
    if (filters["desc"] == "") return true;
    return schem.description().toLowerCase().includes(filters["desc"])
}

module.exports = {
    filter: (schem) => {
        return textFilter(schem) && descFilter(schem);
    },
    setFilter: (filter, value) => {
        filters[filter] = value;
    },
    getFilter: (filter) => {
        return filters[filter];
    }
}
