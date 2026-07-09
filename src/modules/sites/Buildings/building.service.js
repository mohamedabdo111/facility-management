import BuildingModel from "./building.modal.js";

export const createBuilding = async (req, res) => {
    const { name, description, code } = req.body;
    console.log(req.params.siteId , "siteIdssssssss");
    const building = await BuildingModel.create({
        name,
        description,
        code,
        tenantId: req.user.tenantId,
        siteId: req.params.siteId,
    });
    return res.status(201).json({
        success: true,
        message: "Building created successfully",
        data: building,
    });
}

export const getBuildings = async (req, res) => {
    console.log(req.params , "siteIdssssssss");
    const buildings = await BuildingModel.find({
        tenantId: req.user.tenantId,
        siteId: req.params.siteId,
    });
    res.status(200).json({
        message: "Buildings fetched successfully",
        success: true,
        data: buildings,
    });
};


export const getBuildingById = async (req, res) => {
    const building = await BuildingModel.findOne({
        _id: req.params.id,
        tenantId: req.user.tenantId,
        siteId: req.params.siteId,
    });
    res.status(200).json({
        message: "Building fetched successfully",
        success: true,
        data: building,
    });
};

export const updateBuilding = async (req, res) => {
    const building = await BuildingModel.findOneAndUpdate({
        _id: req.params.id,
        tenantId: req.user.tenantId,
        siteId: req.params.siteId,
    }, {
        name,
        description,
        code,
    }, { new: true , runValidators: true });
    res.status(200).json({
        message: "Building updated successfully",
        success: true,
        data: building,
    });

};

export const deleteBuilding = async (req, res) => {
    const building = await BuildingModel.findOneAndUpdate({
        _id: req.params.id,
        tenantId: req.user.tenantId,
        siteId: req.params.siteId,
    }, { isDeleted: true , deletedAt: new Date() });
    res.status(200).json({
        message: "Building deleted successfully",
        success: true,
        data: building,
    });
};