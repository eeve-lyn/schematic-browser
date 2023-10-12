const dialogConfig = {
    dialogTitle: "[[" + Core.bundle.get("schematic") + "] schem.name()",
    closeButtonEnabled: true,
    schematicInfoText: Core.bundle.format("schematic.info", schem.width, schem.height, schem.tiles.size),
    schematicImageMaxSize: 800,
    imageRowItems: 4,
    padding: {
        left: 2,
        right: 4,
        image: Vars.iconMed,
    },
    textColor: Color.lightGray,
};

module.exports = dialogConfig;
